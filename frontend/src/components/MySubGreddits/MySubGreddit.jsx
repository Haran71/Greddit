import {React,useEffect,useState} from "react";
import { useCookies } from 'react-cookie';
import {redirect, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import SubGredditItem from "./SubGredditItem";

function MySubGreddit() {
    const navigate = useNavigate();
    const [cookies,setCookies,removeCookies] = useCookies();
    const [sgList,setSGList] = useState([]);


    function handleDelete(idx) {
        setSGList((prev) => {
            return prev.filter((it, index) => {
                return index !== idx;
              });
        });
        const delObj = {
            tokenH:cookies.GredditToken,
            id:cookies.GredditUser,
            username: cookies.GredditUser,
            sgList:sgList.filter((it, index) => {
                return index !== idx;
            })
        }
        axios.post("http://localhost:3003/deleteSubGreddit",delObj).then((response) => {
            console.log(response.data);
        });
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
        
        axios.post("http://localhost:3003/MySubGreddits",{tokenH:cookies.GredditToken,id:cookies.GredditUser,username:cookies.GredditUser}).then((response) =>{
            setSGList(response.data.sgList);
        })
    },[]);


    return (
        <div>
            <section id="header" styleName="display: none;">
                <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                    <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                        <h1>{cookies.GredditUser}'s SubGreddits</h1>
                    </div>
                
                </div>
            </section> 
            
            <section id="SubList" styleName="display: none;" className="mt-5">   
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="card bg-dark text-white w-50 text-center pt-2 pb-2" styleName="border-radius: 1rem;">
                    <button onClick={() => {navigate("/CreateSubGreddit")}} className="btn btn-outline-warning my-4 mx-auto">Add SubGreddit</button>
                    <div class="d-grid gap-3">
                        {sgList.map((item,idx) => (
                            <SubGredditItem 
                            info={item}
                            key={idx}
                            id={idx} 
                            handleDelete={handleDelete}  
                            />
                        ))}
                    </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default MySubGreddit;