//jshint esversion:6
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

// for jwt prorttection
const jwt = require('jsonwebtoken');

// function to generate a jsonwebtoken
function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET);
}

// custom middleware for jwt authentication

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
  
      if (err) return res.sendStatus(403)
  
      req.user = user
  
      next()
    })
}

function authenticateToken1(req, res, next) {
    const token = req.body.tokenH
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
  
      if (err) return res.sendStatus(403)
  
      if(user !== req.body.id) return res.sendStatus(403)
  
      next()
    })
}

// for oauth
var cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const _ = require('lodash');
const { strictEqual } = require('assert');


require('https').globalAgent.options.rejectUnauthorized = false;

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use(session({
    secret:"longstring",
    resave:false,
    saveUninitialized:false,
}));

app.use(passport.initialize());
app.use(passport.session());

  
const saltRounds = 10;

mongoose.connect("mongodb://127.0.0.1:27017/GredditDB");

const omit = (obj, ...keys) => Object.fromEntries(
    Object.entries(obj)
    .filter(([key]) => !keys.includes(key))
);

const statSchema = new mongoose.Schema({
    Date:String,
    User:Number,
})

const commentSchema = new mongoose.Schema({
    text:String,
    user:String,
})

const reportSchema = new mongoose.Schema({
    reporter:String,
    reportee:String,
    concern:String,
    post_text:String,
    post_id:mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    ignored: { type: Boolean, default: false},
});

reportSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 });

const postSchema = new mongoose.Schema({
    text:String,
    creator:String,
    reports:[reportSchema],
    upvotes:Number,
    downvotes:Number,
    comments:[commentSchema],
    liked:[String],
    disliked:[String],
    subgreddit:String,
    owner:String,
    blocked: { type: Boolean, default: false},
});

const subGredditSchema = new mongoose.Schema({
    moderator:String,
    name:String,
    joined:[String],
    requests:[String],
    blocked:[String],
    banned:[String],
    description: String,
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
    tags:[String],
    traitors:[String],
    stats:{
        GrowthSG:[statSchema],
        DP:[statSchema],
        DV:[statSchema],
        RP:{type:Number, default:0},
        DRP:{type: Number, default: 0}
    }
},{ timestamps: true });

const userSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    age: Number,
    email: String,
    phone: String,
    password: String,
    followers: [String],
    following: [String],
    googleId: String,
    sgList:[subGredditSchema], // for outh
    saved:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
});



userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("user",userSchema);

const SubGreddit = new mongoose.model("subgreddit", subGredditSchema);

const Post = new mongoose.model("post",postSchema);

const Comment = new mongoose.model("comment",commentSchema);

const Report = new mongoose.model("report",reportSchema);

const StatInstance = new mongoose.model("stat",statSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
});
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3003/auth/google/greddit",
  },
  function(accessToken, refreshToken,profile, cb) {
    User.findOrCreate({ googleId:profile.id},{username:profile.displayName,email:profile.emails[0].value}, function (err, user) { 
      return cb(err, user);
    });
  }
));


app.get("/auth/google",
    passport.authenticate("google",{scope: ['profile','email']})
);

app.get('/auth/google/greddit', 
  passport.authenticate('google', { 
    failureRedirect:'/auth/failed'}),(req,res) =>{
        res.cookie('GredditUser',req.user.username);
        res.cookie('GredditToken',generateAccessToken(req.user.username));
        res.redirect("http://localhost:3000");
    }
);

app.get('/auth/success',(req,res) => {
    res.cookie('GredditOauth',"random");
    res.status(200).json({
        success: true,
        message: "sucess",
    });
})

app.get('/auth/failure',(req,res) => {
    res.status(401).json({
        success: false,
        message: "failure",
      });
});

app.post("/register",(req,res) => {
    User.findOne({username: req.body.username},(err,user) => {
        if(err){
            console.log(err);
            res.send(err);
        }
        if(user) {
            res.status(401).json({
                success: false,
                message: "failed",
            });
        } else {
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                if(err) {
                    console.log(err);
                    res.send(err);
                } else {
                    newUser = new User({
                        ...omit(req.body,"password"),
                        ...{"password":hash},
                    });
                    newUser.save((err) => {
                        if(err){
                            console.log(err);
                            res.send(err);
                        } else {
                            const token = generateAccessToken(req.body.username);
                            res.status(200).json({
                                success: true,
                                message: "success",
                                token: token
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/login',(req,res) => {
    User.findOne({username: req.body.username},(err,user) => {
        if(err) {
            console.log(err);
            res.send(err);
        } else if(user){
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if(result) {
                    const token = generateAccessToken(req.body.username);
                    res.status(200).json({
                        success: true,
                        message: "success",
                        token: token
                    });
                } else {
                    res.status(200).json({
                        success: false,
                        message: "failed",
                    });
                }
            });
        } else {
            res.send("failed");
        }
    });
});

app.post('/profile',authenticateToken1,(req,res) => {
    const username = req.body.username;
    User.findOne({username: req.body.username},(err,user) => {
        if(user) {
            res.send(user);
        }
    });
});

app.post('/profile_update',authenticateToken1,(req,res) => {
    User.findOne({username: req.body.username},(err,user) => {
        if(user) {
            const result_followers = user.followers.filter(element => !req.body.followers.includes(element));

            for(uname of result_followers) {
                User.findOne({username:uname},(errI,userFi) =>{
                    userFi.following = userFi.following.filter((element) =>{
                        return element !== req.body.username;
                    })
                    userFi.save();
                })
            }

            const result_following = user.following.filter(element => !req.body.following.includes(element));

            for(uname of result_following) {
                User.findOne({username:uname},(errI,userFi) =>{
                    userFi.followers = userFi.followers.filter((element) =>{
                        return element !== req.body.username;
                    })
                    userFi.save();
                })
            }


        }
    });
    User.updateOne({username: req.body.username},req.body,(err,user) => {
        if(err) {
            console.log(err);
            res.send(err);
        } else {
            res.send("success");
        }
    });
});

// app.get('/auth/jwt/test',(req,res) => {
//     const token = generateAccessToken("haran71");
//     res.send(token);
// });

// for jwt authentication
app.get('/auth/jwt',authenticateToken,(req,res) => {
    res.status(200).json({
        username:req.user,
    });
});


// list of routes for MySubGreddits Page

app.post("/createSubGreddit",authenticateToken1,(req,res) => {

    const SG = new SubGreddit({
        ...req.body,
        // ...{users:5,joined:["Arnav","Bala","Himanshu","Ananth","Sreeram"],requests:["AMom","BMom","HMom","Mom5","Mom6","Mom7"],posts:[],numPosts:0,blocked:[]}
        ...{users:0,joined:[],requests:[],posts:[],numPosts:0,blocked:[]}
    })
    let flag = false;
    User.findOne({username:req.body.moderator},(err,user) =>{
        for (let i = 0; i < user.sgList.length; i++) {
            if(user.sgList[i].name === SG.name){
                flag = true;
            }
        }
        if(flag){
            res.json({success:false});
        } else {
            user.sgList.push(SG);
            user.save();
            res.json({success:true});
        }
    });

});

app.post("/MySubGreddits",authenticateToken1,(req,res) => {
    User.findOne({username:req.body.username},(err,user) =>{
        if(user){
            res.json({sgList:user.sgList});
        }
    })
});

app.post("/deleteSubGreddit",authenticateToken1,(req,res) => {
    console.log(req.body.sgList);

    User.findOne({username:req.body.username},(err,user) =>{
        let result = user.sgList.filter(sg =>(!req.body.sgList.includes(sg)));
        console.log(result);
        Post.deleteMany({owner:user.username,subgreddit:result[0].name},(err) =>{
           if(err){
            console.log(err);
           }
        });
    })

    User.updateOne({username:req.body.username},{$set:{sgList:req.body.sgList}},(err,user) =>{
        if(err){
            res.send(err);
        } else{
            console.log(user);
            res.send({success:true});
        }
    });
});

// My subgreddit page

app.post("/subgredditInfo",authenticateToken1,(req,res) =>{
    let flag = false;
    let ret_obj = {};
    User.findOne({username:req.body.username},(err,user) =>{
        if(!user){
            res.status(200).json({message:"Failed"});
        }
        else {
            for (let i = 0; i < user.sgList.length; i++) {
                if(user.sgList[i].name === req.body.name){
                    flag = true;
                    ret_obj = user.sgList[i]
                }
            }
            if(flag){
                res.status(200).json(ret_obj);
            } else {
                res.status(200).json({message:"Failed"});
            }
        }    
    });
})

// for mysubgreddit requests 

app.post("/updateRequests",authenticateToken1,(req,res) =>{
    User.findOne({username:req.body.username},(err,user) =>{
        
        if(!user){
            res.status(200).json({message:"Failed"});
        }
        else {
            for (let i = 0; i < user.sgList.length; i++) {
                if(user.sgList[i].name === req.body.name){
                    let final = req.body.joined.length;
                    let initial = user.sgList[i].joined.length;

                    let stat_obj = new StatInstance({
                        Date: new Date().toLocaleDateString(),
                        User: final - initial
                    })

                    user.sgList[i].joined = req.body.joined;
                    user.sgList[i].requests = req.body.requests;
                    let flag = 0;

                    if(final - initial > 0){
                        for (user_stat of user.sgList[i].stats.GrowthSG) {
                            if(user_stat.Date.localeCompare(stat_obj.Date) === 0){
                                flag = 1;
                                user_stat.User += stat_obj.User;
                            }
                        }
                        if(flag === 0){
                            user.sgList[i].stats.GrowthSG.push(stat_obj);
                        }
                    }
                    
                    user.save();
                }
            }
            res.status(200);  
        } 
    });
});

// for my subgreddits reports

app.post("/deleteReportedPost",authenticateToken1,(req,res) =>{
    Post.findById(req.body.report.post_id,(err,post) =>{
        User.findOne({username:post.owner},(err,user) =>{
            for(sg of user.sgList){
                if(sg.name === post.subgreddit){
                    sg.stats.DRP += 1;
                    user.save();
                }
            }
        })
    });

    Post.deleteOne({_id:req.body.report.post_id},(err) =>{
        if(err) res.send(err);
        else res.status(200);
    })


})

app.post("/blockReportedUser",authenticateToken1,(req,res) =>{
    Post.findById(req.body.report.post_id,(err,post) =>{
        User.findOne({username:post.owner},(err,user) =>{
            for(sg of user.sgList){
                if(sg.name == post.subgreddit){
                    sg.joined = sg.joined.filter((it) =>{
                        return it !== req.body.report.reportee; 
                    })
                    if(!sg.blocked.includes(req.body.report.reportee) && req.body.reportee != post.owner){
                        sg.blocked.push(req.body.report.reportee);
                    }
                    user.save();
                }
            }
        });

        post.reports = post.reports.filter((report,idx) =>{
            return !(report._id.toString() === req.body.report._id);
        })
        post.blocked = true;
        post.save();
    })

    res.status(200);

});

app.post("/ignoreReport",authenticateToken1,(req,res) =>{
    Post.findById(req.body.report.post_id,(err,post) =>{
        for(let report of post.reports){
            if(report._id == req.body.report._id){
                report.ignored = true;
                post.save();
            }
        }
    })
    res.status(200);
});

// for the subgreddits page

app.post("/subGreddits",authenticateToken1,(req,res) =>{
    User.find({"sgList": {$ne:null}},(err,users) => {
        if(err) {
            console.log(err);
        } else {
            if(users) {
                const sgAll = _.flatten(users.map((user) =>{return user.sgList}));
                res.status(200).json({list: sgAll});
            }
        }
    });
});

app.post("/newRequest",authenticateToken1,(req,res) =>{
    User.findOne({username:req.body.moderator},(err,user) =>{
        if(!user){
            res.status(200).json({message:"Failed"});
        }
        else {
            for (let i = 0; i < user.sgList.length; i++) {
                if(user.sgList[i].name === req.body.name){
                    if(user.sgList[i].traitors.includes(req.body.user) || user.sgList[i].blocked.includes(req.body.user) ){
                        return res.status(200).json({message:"Traitor"});
                    } else {
                        user.sgList[i].requests = [
                            ...user.sgList[i].requests,
                            req.body.user
                        ];
                        user.save();
                    }
                }
            }
            res.status(200);  
        } 
    });
})

app.post("/LeaveSubGreddit",authenticateToken1,(req,res) =>{
    User.findOne({username:req.body.moderator},(err,user) =>{
        if(!user){
            res.status(200).json({message:"Failed"});
        }
        else {
            for (let i = 0; i < user.sgList.length; i++) {
                if(user.sgList[i].name === req.body.name){
                    user.sgList[i].joined = user.sgList[i].joined.filter((it) =>{
                        return it !== req.body.user
                    })
                    user.sgList[i].traitors = [
                        ...user.sgList[i].traitors,
                        req.body.user
                    ]
                    user.save();
                }
            }
            res.status(200);  
        } 
    });
})

app.post("/getPosts",authenticateToken1,(req,res)=>{
    Post.find({owner:req.body.username,subgreddit:req.body.name},(err,posts) =>{
        if(err) res.status(404).json({error:err})
        else {
            let ret_posts = [];
            for(let post of posts){
                if(post.blocked){
                    post.creator = "blocked user";
                } 
            }
            // console.log(ret_posts)
            // console.log(posts);
            res.status(200).json({posts: posts});
        }
    });
})

app.post("/getReports",authenticateToken1,(req,res)=>{
    Post.find({owner:req.body.username,subgreddit:req.body.name},(err,posts) =>{
        let reports = [];
        if(err) res.status(404).json({error:err})
        else {
            for(let post of posts){
                if(post.reports.length > 0){
                    for(let report of post.reports){
                        let today = new Date()
                        let created = new Date(report.createdAt);

                        if((today.getTime() - created.getTime())/(1000*3600*24) < 10){
                            reports.push(report);
                        }
                    }
                }
            }
            res.status(200).json({posts: posts,reports:reports});
        }
    });
})

app.post("/addPost",authenticateToken1,(req, res) => {
    User.findOne({username:req.body.moderator},(err,user) =>{
        if(!user){
            res.status(200).json({message:"Failed"});
        }
        else {
            for (let i = 0; i < user.sgList.length; i++) {
                if(user.sgList[i].name === req.body.name){
                    let post_obj = new Post({
                        text:req.body.text,
                        creator:req.body.creator,
                        reports:[],
                        upvotes:0,
                        downvotes:0,
                        comments:[],
                        liked:[],
                        disliked:[],
                        subgreddit:req.body.name,
                        owner:req.body.moderator,
                    })

                    let stat_obj = new StatInstance({
                        Date: new Date().toLocaleDateString(),
                        User: 1
                    })
                    let flag = 0;
                    for (user_stat of user.sgList[i].stats.DP) {
                        if(user_stat.Date.localeCompare(stat_obj.Date) === 0){
                            flag = 1;
                            user_stat.User += stat_obj.User;
                        }
                    }
                    if(flag === 0){
                        user.sgList[i].stats.DP.push(stat_obj);
                    }

                    user.save();


                    let new_string = req.body.text;
                    for(tag of user.sgList[i].banned){
                        new_string = new_string.replace(new RegExp(tag, "gi"),"*".repeat(tag.length));
                    }         
                    post_obj.text = new_string;  
                    post_obj.save();
                }
            }
            res.status(200);  
        } 
    });
    
    
})

app.post("/updateLikes",authenticateToken1,(req,res) =>{
    console.log(req.body);

    // User.findOne({username:req.body.post.owner},(err,user) =>{
    //     if(err){
    //         res.send(err);
    //     } else if(user){
    //         for (let i = 0; i < user.sgList.length; i++) {
    //             if(user.sgList[i].name === req.body.post.subgreddit){
    //                 for(let j =0; j<user.sgList[i].posts.length;j++){
    //                     console.log("Post search");
    //                     if(user.sgList[i].posts[j]._id == req.body.post._id){
    //                         user.sgList[i].posts[j] = req.body.post;
    //                         console.log("Here");
    //                         console.log(user.sgList[i].posts[j]);
    //                         user.save();
    //                     }
    //                 }
    //             }
    //         }    
    //     }

    //     res.status(200);
    // })

    Post.findById(req.body.post._id,((err, post) => {
        if(err){res.status(err).json({error:err});}
        else if (post){
            post.liked = req.body.post.liked;
            post.disliked = req.body.post.disliked;
            post.save();
        }
    }))
});

app.post("/addComment",authenticateToken1,(req,res) =>{
    // User.findOne({username:req.body.post.owner},(err,user) =>{
    //     if(err){
    //         res.send(err);
    //     } else if(user){
    //         for (let i = 0; i < user.sgList.length; i++) {
    //             if(user.sgList[i].name === req.body.post.subgreddit){
    //                 for(let j =0; j<user.sgList[i].posts.length;j++){
    //                     if(user.sgList[i].posts[j]._id == req.body.post._id){
    //                         let newComment = new Comment(req.body.comment);
    //                         user.sgList[i].posts[j].comments.push(newComment);
    //                         user.save();
    //                     }
    //                 }
    //             }
    //         }    
    //     }

    //     res.status(200);
    // })
    Post.findById(req.body.post._id,((err, post) => {
        if(err){res.status(err).json({error:err});}
        else if (post){
            let newComment = new Comment(req.body.comment);
            post.comments.push(newComment);
            post.save();
        }
    }))
})

app.post("/addFollower",authenticateToken1,(req,res) =>{
    User.findOne({username:req.body.post.creator},(err,user) =>{
        if(err){
            res.send(err);
        } else if(user){
            if(!user.followers.includes(req.body.user)){
                user.followers.push(req.body.user)
                user.save();
            }
        }
       
    })

    User.findOne({username:req.body.user},(err,user) =>{
        if(err){
            res.send(err);
        } else if(user){
            if(!user.following.includes(req.body.post.creator)){
                user.following.push(req.body.post.creator)
                user.save();
            }
        }
       
    })

    res.status(200);



});

app.post("/savePost",authenticateToken1,(req,res) =>{
    User.findOne({username:req.body.user},(err,user) =>{
        if(err){
            res.send(err);
        } else if(user){
            let flag = false;
            for(obj of user.saved){
                if(req.body.post._id == obj._id){
                    flag = true;
                }
            }
            if(!flag){
                user.saved.push(req.body.post._id);
                user.save();
            }
            
        }
    })
    res.status(200);
});

app.post("/handleReport",authenticateToken1,(req,res) =>{
    Post.findById(req.body.post._id,(err,post) =>{
        if(err){
            res.send(err);
        }
        else if(post){
            let newRep = new Report(req.body.report);
            post.reports.push(newRep);
            post.save();
            res.status(200);
        } else{
            res.status(404);
        }
    })


    User.findOne({username:req.body.post.owner},(err, user) => {
        if(user){
            for(let i = 0;i<user.sgList.length;i++){
                if(user.sgList[i].name === req.body.post.subgreddit){
                    user.sgList[i].stats.RP += 1;
                    user.save();
                }
            }
        }
        res.status(200);
    })
});



// Saved posts page
app.post("/getSaved",authenticateToken1,(req,res) =>{
    User.findOne({username:req.body.username})
    .populate([{path:'saved',model:Post}])
    .exec((err, user) => {
        if(err){
            res.send(err);
        }
        
        else if(user){
            res.status(200).json({list:user.saved});
        }
    });
})


app.post("/visitStat",authenticateToken1,(req,res) =>{
    User.findOne({username:req.body.username}, (err, user) =>{
        if(err){
            return res.send(err);
        } else if(user){
            console.log(user);
            for (let i = 0; i < user.sgList.length; i++) {

                console.log("Here");
                if(user.sgList[i].name === req.body.name){

                    let stat_obj = new StatInstance({
                        Date: new Date().toLocaleDateString(),
                        User: 1
                    })

                    let flag = 0;
                    for (user_stat of user.sgList[i].stats.DV) {
                        if(user_stat.Date.localeCompare(stat_obj.Date) === 0){
                            flag = 1;
                            user_stat.User += stat_obj.User;
                        }
                    }
                    if(flag === 0){
                        user.sgList[i].stats.DV.push(stat_obj);
                    }
                }
            }
            user.save();
            res.status(200).send("Visit");
        } else{
            res.status(200).send("Visit failed");
        }
    })
});

// for stats

app.post("/getStats",authenticateToken1,(req,res) => {
    User.findOne({username: req.body.username},(err,user) => {
        for(sg of user.sgList){
            if(sg.name === req.body.name){
                res.status(200).json({stat:sg.stats});
            }
        }
    })
});



app.listen(3003,() => {
    console.log('listening on port 3003');
});