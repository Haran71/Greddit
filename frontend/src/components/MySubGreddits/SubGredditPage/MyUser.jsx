import {React,useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

function MyUser() {
    const {name} = useParams();
    const [cookies,setCookies,removeCookies] = useCookies();
    const navigate = useNavigate();

    const [subgreddit,setSubgreddit] = useState({});


    useEffect(() => {
        
        axios.post("http://localhost:3003/subgredditInfo",{tokenH:cookies.GredditToken,id:cookies.GredditUser,username:cookies.GredditUser,"name":name}).then((response) =>{
            if(response.data.message === "Failed"){
                navigate("/MySubGreddit")
            }

            setSubgreddit(response.data);
            
        })

    },[]);

    useEffect(() => {},[subgreddit]);


    return (
        <div>
            <section id="header" styleName="display: none;">
                    <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                        <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                            <h1>{cookies.GredditUser}'s SubGreddit {name} Users</h1>
                        </div>
                    </div>
            </section> 
            <section id="SubList" styleName="display: none;" className="mt-5">   
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="card bg-dark text-white w-50 text-center pt-2 pb-2" styleName="border-radius: 1rem;">
                <h2 className="my-4">Users</h2>
                <ul class="list-group">
                    {subgreddit.joined?.map((item,idx) => (
                        <li
                        className="list-group-item"
                        key={idx} 
                        >{item}</li>
                    ))}
                </ul>
                <h2 className="my-4">Blocked Users</h2>
                <ul class="list-group">
                    {subgreddit.blocked?.map((item,idx) => (
                        <li
                        className="list-group-item list-group-item-danger"
                        key={idx} 
                        >{item}</li>
                    ))}
                </ul>
                </div>
            </div>
        </section>
    </div>

    )
}

export default MyUser;
