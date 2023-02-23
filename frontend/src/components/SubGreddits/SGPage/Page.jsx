import {React,useEffect,useState} from "react";
import { useCookies } from 'react-cookie';
import {redirect, useNavigate, useParams} from "react-router-dom";
import axios from "axios";


import Post from "./Post";

function Page(){
    const {user,name} = useParams();
    const [cookies,setCookies,removeCookies] = useCookies();
    const navigate = useNavigate();
    const [sg,setSg] = useState({});
    const [newPost,setNewPost] = useState("");
    const [comment,setComment] = useState("");
    const [posts,setPosts] = useState([]);
    const [report,setReport] = useState("");

    useEffect(() => {
        
       axios.post("http://localhost:3003/visitStat",{tokenH:cookies.GredditToken,id:cookies.GredditUser,username:user,"name":name}).then((response) =>{
        console.log(response);
       });

    },[])
    useEffect(() => {

        axios.post("http://localhost:3003/subgredditInfo",{tokenH:cookies.GredditToken,id:cookies.GredditUser,username:user,"name":name}).then((response) =>{
            if(response.data.message === "Failed"){
                navigate("/SubGreddit")
            }
            setSg(response.data);
        });
        axios.post("http://localhost:3003/getPosts",{tokenH:cookies.GredditToken,id:cookies.GredditUser, username:user,"name":name}).then((response) =>{
            setPosts(response.data.posts);
            console.log(response.data.posts);
        });

    },[sg])

    function handleComment(idx){
        let post = posts[idx];
        let comment_obj = {
            text:comment,
            user:cookies.GredditUser
        }

        
        let p_obj = {
            tokenH: cookies.GredditToken,
            id:cookies.GredditUser,
            post:post,
            comment:comment_obj
        }

        axios.post("http://localhost:3003/addComment",p_obj).then((response) =>{
            console.log(response.data);
        })
        setComment("");
        setSg({});
        
    }

    function handleFollow(idx){
        let post = posts[idx];
        let p_obj = {
            tokenH: cookies.GredditToken,
            id:cookies.GredditUser,
            post:post,
            user:cookies.GredditUser,
        }

        axios.post("http://localhost:3003/addFollower",p_obj).then((response) =>{
            console.log(response.data);
        })

        setSg({});
    }

    function handleSave(idx){
        let post = posts[idx];
        let p_obj = {
            tokenH: cookies.GredditToken,
            id:cookies.GredditUser,
            post:post,
            user:cookies.GredditUser,
        }

        axios.post("http://localhost:3003/savePost",p_obj).then((response) =>{
            console.log(response.data);
        })

        setSg({});
    }


    function handleNewComment(event){
        setComment(event.target.value);
    }

    function handleLikes(event,idx){
        const label = event.target.innerText.split(" ")[0];
        let post = posts[idx];

        post.liked = post.liked.filter((it) =>{
            return it !== cookies.GredditUser;
        })
        post.disliked = post.disliked.filter((it) =>{
            return it !== cookies.GredditUser;
        })

        if(label === "UpVote"){
            post.liked.push(cookies.GredditUser);
        } else if(label === "DownVote"){
            post.disliked.push(cookies.GredditUser);
        }

        let p_obj = {
            tokenH: cookies.GredditToken,
            id:cookies.GredditUser,
            post:post,
        }

        axios.post("http://localhost:3003/updateLikes",p_obj).then((response) =>{
            console.log(response.data);
        })
        setSg({});
    }

    function handleReport(idx){
        let post = posts[idx];
        let p_obj = {
            tokenH: cookies.GredditToken,
            id: cookies.GredditUser,
            report:{
                reporter:cookies.GredditUser,
                reportee:post.creator,
                concern:report,
                post_text:post.text,
                post_id:post._id
            },
            post:post,
        }

        axios.post("http://localhost:3003/handleReport",p_obj).then((response) =>{
            console.log(response.data);
        });
        setReport("");
    }

    function handleNewReport(event){
        setReport(event.target.value);
    }

    function handleChange(event){
        setNewPost(event.target.value);
    }

    function CreatePost(){
        let p_obj = {
            text:newPost,
            tokenH:cookies.GredditToken,
            id: cookies.GredditUser,
            moderator: sg.moderator,
            name: sg.name,
            creator:cookies.GredditUser,
        }

        axios.post("http://localhost:3003/addPost",p_obj).then((response) =>{
            console.log(response)
        })
        setNewPost("")
        setSg({});
    }
    
    return (
        <div>
            <section id="header" styleName="display: none;">
                <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                    <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                        <h1>Welcome to {user}'s SubGreddit {name}</h1>
                        <img className="mx-auto my-4" height="200" width="150" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR7-NsMg7EfTfX72N8apT-yHfrQYFK-s5kSsaLxXv_XSSAFneVwDysT8odC5SI_39DmOQ&usqp=CAU"/>
                        <p>Description: {sg.description}</p>
                    </div>
                </div>
            </section> 
            <section id="add_post" styleName="display: none;">
                <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                    <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                        <h2>Add your own post</h2>
                        <textarea className="my-4 mx-3" onChange={handleChange} rows="10" cols="70" value={newPost}></textarea>
                        <button onClick={CreatePost} className="btn btn-outline-warning my-4 mx-auto">Create Post</button>
                    </div>
                </div>
            </section> 
            {posts?.length > 0 && <section id="posts" styleName="display: none;">
                <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                    <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                        {posts?.map((post,idx) =>(
                            <Post info={post} key={idx} id={idx} handleLikes = {handleLikes} handleComment={handleComment} handleNewComment = {handleNewComment} comment={comment} report={report}  handleNewReport={handleNewReport} handleReport={handleReport} handleFollow={handleFollow} handleSave={handleSave} blocked={sg.blocked}/>
                        ))}
                    </div>
                </div>
            </section>}

        </div>
    )
}

export default Page;