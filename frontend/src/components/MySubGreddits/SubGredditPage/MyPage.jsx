import {React,useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";


function MyPage() {
    const navigate = useNavigate();
    const {name} = useParams();
    const [cookies,setCookies,removeCookies] = useCookies();
    useEffect(() => {
        

        axios.post("http://localhost:3003/subgredditInfo",{tokenH:cookies.GredditToken,id:cookies.GredditUser,username:cookies.GredditUser,"name":name}).then((response) =>{
            if(response.data.message === "Failed"){
                navigate("/MySubGreddit")
            }
        });

    },[]);
    return (
        <section id="header" styleName="display: none;">
                <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                    <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                        <h1>{cookies.GredditUser}'s SubGreddit {name}</h1>
                    </div>
                
                </div>
        </section> 
    )
}

export default MyPage;