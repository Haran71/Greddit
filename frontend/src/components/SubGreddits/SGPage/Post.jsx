import {React,useEffect,useState} from "react";
import { useCookies } from 'react-cookie';
import {redirect, useNavigate, useParams} from "react-router-dom";
import axios from "axios";

function Post(props) {
    let content = "content_" + props.id;
    let likes = "likes_" + props.id;
    let content_href = "#" + content;
    let likes_href = "#" + likes;   
    let comments = "comments_" + props.id;
    let comments_href = "#" + comments;
    let reports = "reports_" + props.id;
    let reports_href = "#" + reports;

    const [cookies,setCookies,removeCookies] = useCookies();

    return (
        <div className="container shadow  py-2">
    <div className="container network_wrapper col-sm p-2 ">
        <div className="card">
            <div className="card-header">
                <h5 className="card-title text-dark">By {props.blocked?.includes(props.info.creator) ? "Blocked User":props.info.creator}</h5>
                <ul className="nav nav-tabs card-header-tabs" data-bs-tabs="tabs">
                    <li className="nav-item">
                        <a className="nav-link active" aria-current="true" data-bs-toggle="tab" href={content_href}>Content</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href={likes_href}>Likes and Follow</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href={comments_href}>Comments</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href={reports_href}>Report</a>
                    </li>
                </ul>
            </div>
            <div className="card-body tab-content">
                <div className="tab-pane active text-dark" id={content}>
                    <p className="card-text">{props.info.text}</p>
                    <button onClick={() =>{props.handleSave(props.id)}} className="btn btn-lg btn-outline-warning my-2 mx-auto">Save Post</button>
                </div>
                <div className="tab-pane text-dark" id={likes}>
                    <p className=" card-text"><button onClick={(e) => {props.handleLikes(e,props.id)}} type="button" className="btn btn-outline-success btn-lg mt-3">
                            UpVote <span class="badge bg-secondary">{props.info.liked?.length}</span>
                    </button></p>
                    <p className=" card-text"><button onClick={(e) => {props.handleLikes(e,props.id)}} type="button" className="btn btn-outline-danger btn-lg mt-3">
                            DownVote <span class="badge bg-secondary">{props.info.disliked?.length}</span>
                    </button></p>
                    <button disabled ={cookies.GredditUser === props.info.creator} onClick={() =>{props.handleFollow(props.id)}} className="btn btn-lg btn-outline-warning my-2 mx-auto">Follow</button>
                    
                    

                </div>

                <div className="tab-pane text-dark" id={comments}>
                    <textarea onChange={(e) =>{props.handleNewComment(e)}} className="my-4 mx-auto" rows="5" cols="30" value={props.comment}></textarea><br />
                    <button onClick={() =>{props.handleComment(props.id)}} disabled={!props.comment} className="btn btn-outline-warning my-2 mx-auto">Add Comment</button>

                    {props.info.comments?.map((comment) =>(
                        
                        <div className="card border-info mb-3" styleName="max-width: 18rem;">
                        <div className="card-header">{comment.user}</div>
                        <div className="card-body text-info">
                            <p className="card-text">{comment.text}</p>
                        </div>
                        </div>
                    ))}
                </div>

                <div className="tab-pane text-dark" id={reports}>
                    <textarea onChange={(e) =>{props.handleNewReport(e)}} className="my-4 mx-auto" rows="5" cols="30" value={props.report}></textarea><br />
                    <button onClick={() =>{props.handleReport(props.id)}} className="btn btn-lg btn-outline-danger my-2 mx-auto">Report</button>
                </div>
            </div>
        </div>
    </div>
</div>
    )
}

export default Post;