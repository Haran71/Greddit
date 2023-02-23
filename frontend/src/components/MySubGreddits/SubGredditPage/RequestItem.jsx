import {React,useState} from "react";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { NavLink,Outlet } from "react-router-dom";


function RequestItem(props){
    return (
        <div>
        <div  className="p-2 bg-light border text-dark">
        <nav class="navbar navbar-expand">
        <div class="container">
            <div class="collapse navbar-collapse" id="navbarNav">
            <ul id="menu-main-nav" class="navbar-nav nav-fill w-100">
                <li  class="nav-item">{props.info}</li>
                <li  class="nav-item"><a onClick={
                    () => {
                            props.handleUpdate(props.id);
                        }
                }><CheckCircleIcon /></a></li>
                <li  class="nav-item"><a onClick={
                    () => {
                            props.handleDelete(props.id);
                        }
                }>
                <HighlightOffIcon /></a></li>
            </ul>
            </div>
        </div>
        </nav>
        </div>
        </div>
    );
}

export default RequestItem;