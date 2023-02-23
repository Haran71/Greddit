import {React,useState} from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LaunchIcon from '@mui/icons-material/Launch';
import { NavLink,Outlet } from "react-router-dom";
import { useCookies } from 'react-cookie';

function JoinedItem(props){
    const [infoClass,setInfoClass] = useState("HideDiv");
    const path = "/SubGreddit/" + props.info.moderator + "/" + props.info.name;
    const [cookies,setCookies,removeCookies] = useCookies();

    function handleToggle(){
        setInfoClass((prev) => {
            if(prev === ""){
                return "HideDiv";
            } else {
                return "";
            }
        })
    }
    return (
        <div>
        <div  className="p-2 bg-light border text-dark">
        <nav class="navbar navbar-expand">
        <div class="container">
            <div class="collapse navbar-collapse" id="navbarNav">
            <ul id="menu-main-nav" class="navbar-nav nav-fill w-100">
                <li onClick={handleToggle} class="nav-item">{props.info.name}</li>
                <li  class="nav-item"><NavLink to={path}><LaunchIcon /></NavLink></li>
                <li  class="nav-item"><button disabled={cookies.GredditUser === props.info.moderator} onClick={() => {props.handleLeave(props.info)}} className="btn btn-outline-danger">Leave</button></li>
            </ul>
            </div>
        </div>
        </nav>
        </div>
        <div className = {infoClass}>
            <p>Moderator:{props.info.moderator}</p>
            <p>Description: {props.info.description}</p>
            <p>No of Users: {props.info.joined.length}</p>
            <p>No of Posts: {props.info.posts.length}</p>
            <p>Banned Keywords: {props.info.banned.map((item,idx) => (
                idx === props.info.banned.length - 1 ? item : item + ", "
            ))}</p>
        </div>
        </div>
    );
}

export default JoinedItem;