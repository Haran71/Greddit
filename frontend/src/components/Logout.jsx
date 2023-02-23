import React,{useEffect} from "react";
import { useCookies } from "react-cookie";
import { NavLink } from "react-router-dom";

function Logout() {
    const [cookies,setCookies,removeCookies] = useCookies();
    useEffect(() => {
       removeCookies("GredditUser",{path:"/"}); 
       removeCookies("GredditToken",{path:"/"}); 
    },[]);
    return (
        <div>
            <h1>You have logged out successfully</h1>
            <p>Click <NavLink to="/">here</NavLink> to return to the Login Page</p>
        </div>
    )
}

export default Logout;