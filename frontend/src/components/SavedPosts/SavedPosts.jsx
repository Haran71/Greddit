import {React,useEffect,useState} from "react";
import { useCookies } from 'react-cookie';
import {redirect, useNavigate, useParams} from "react-router-dom";
import axios from "axios";

import Post from "../SubGreddits/SGPage/Post";

function SavedPosts(){
    const [saved,setSaved] = useState([]);
    const [comment,setComment] = useState("");
    const [cookies,setCookies,removeCookies] = useCookies();
    const [report,setReport] = useState("");

    const navigate = useNavigate();

    function handleSave(idx){
        let post = saved[idx];
        let p_obj = {
            tokenH: cookies.GredditToken,
            id:cookies.GredditUser,
            post:post,
            user:cookies.GredditUser,
        }

        axios.post("http://localhost:3003/savePost",p_obj).then((response) =>{
            console.log(response.data);
        })

        setSaved([]);
    }

    function handleFollow(idx){
        let post = saved[idx];
        let p_obj = {
            tokenH: cookies.GredditToken,
            id:cookies.GredditUser,
            post:post,
            user:cookies.GredditUser,
        }

        axios.post("http://localhost:3003/addFollower",p_obj).then((response) =>{
            console.log(response.data);
        })

        setSaved([]);
    }

    function handleComment(idx){
        let post = saved[idx];
        console.log(post);
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
        setSaved([]);
        
    }

    function handleNewComment(event){
        setComment(event.target.value);
    }

    function handleReport(idx){
        let post = saved[idx];
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

    function handleLikes(event,idx){
        const label = event.target.innerText.split(" ")[0];
        let post = saved[idx];

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
        setSaved([]);
    }

    function UnSave(post){
        let p_obj = {
            tokenH:cookies.GredditToken,
            id:cookies.GredditUser,
            username:cookies.GredditUser,
            post:post
        }

        axios.post("http://localhost:3003/unsave",p_obj).then((response) =>{
            console.log(response);
        })

        setSaved([]);
    }




    useEffect(() => {

        if(cookies.GredditUser === undefined || cookies.GredditToken === undefined) {
            removeCookies("GredditUser",{path:"/"}); 
            removeCookies("GredditToken",{path:"/"});
            navigate("/");
        }
        axios.get("http://localhost:3003/auth/jwt",{headers:{"Authorization":`Bearer ${cookies.GredditToken}`}}).then((response) =>{
            if(response.status !== 200){
                removeCookies("GredditUser",{path:"/"}); 
                removeCookies("GredditToken",{path:"/"}); 
                navigate("/");
            }
            if(response.data.username !== cookies.GredditUser){
                removeCookies("GredditUser",{path:"/"}); 
                removeCookies("GredditToken",{path:"/"}); 
                navigate("/");
            }
        })
        axios.post("http://localhost:3003/getSaved",{tokenH:cookies.GredditToken,id:cookies.GredditUser,username:cookies.GredditUser}).then((response) =>{
            console.log(response.data);
            if(response.data.list){
                setSaved(response.data.list);
            }
        });
    },[saved]);
    return(
        <div>
            <section id="header" styleName="display: none;">
                <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                    <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                        <h1>Saved Posts Page</h1>
                    </div>
                </div>
            </section> 

            {saved?.length > 0 && <section id="posts" styleName="display: none;">
                <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                    <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                        {saved.map((post,idx) =>(
                            <div key={idx}>
                            <Post info={post} id={idx} handleLikes = {handleLikes} handleComment={handleComment} handleNewComment = {handleNewComment} comment={comment} report={report}  handleNewReport={handleNewReport} handleReport={handleReport} handleFollow={handleFollow} handleSave={handleSave}/>
                            <button onClick ={() =>{UnSave(post)}} className="btn btn-lg btn-outline-danger my-2 mx-auto">Unsave Post</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>}          
        </div>

    )
}

export default SavedPosts;