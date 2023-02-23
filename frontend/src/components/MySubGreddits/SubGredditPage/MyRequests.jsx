import {React,useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import RequestItem from "./RequestItem";
import useState from 'react-usestateref'

function MyRequests(){
    const {name} = useParams();
    const [cookies,setCookies,removeCookies] = useCookies();
    const navigate = useNavigate();

    const [requests,setRequests,reqRef] = useState([]);
    const [joined,setJoined,joinRef] = useState([]);

    function handleDelete(idx) {
        setRequests((prev) => {
            return prev.filter((it, index) => {
                return index !== idx;
              });
        });

        axios.post("http://localhost:3003/updateRequests",{tokenH:cookies.GredditToken,id:cookies.GredditUser,username:cookies.GredditUser,name:name,requests:reqRef.current,joined:joinRef.current}).then((response) =>{
            console.log(response.data);
        });
    } 
    
    function handleUpdate(idx) {
        setRequests((prev) => {
            return prev.filter((it, index) => {
                if(index === idx) {
                    console.log(index);
                    setJoined((prevJ) =>{
                        if(prevJ.includes(it)){
                            return prevJ;
                        } else {
                            return [
                                ...prevJ,
                                it,
                            ];
                        }
                        
                    });
                }
                return index !== idx;
              });
        });

        axios.post("http://localhost:3003/updateRequests",{tokenH:cookies.GredditToken,id:cookies.GredditUser,username:cookies.GredditUser,name:name,requests:reqRef.current,joined:joinRef.current}).then((response) =>{
            console.log(response.data);
        });
    }

    useEffect(() => {
        

        axios.post("http://localhost:3003/subgredditInfo",{tokenH:cookies.GredditToken,id:cookies.GredditUser,username:cookies.GredditUser,"name":name}).then((response) =>{
            if(response.data.message === "Failed"){
                navigate("/MySubGreddit")
            }
            setRequests(response.data.requests);
            setJoined(response.data.joined);
            
        })

    },[]);

    return (
        <div>
            <section id="header" styleName="display: none;">
                    <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                        <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                            <h1>{cookies.GredditUser}'s SubGreddit {name} Join Requests</h1>
                        </div>
                    </div>
            </section> 
            <section id="SubList" styleName="display: none;" className="mt-5">   
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="card bg-dark text-white w-50 text-center pt-2 pb-2" styleName="border-radius: 1rem;">
                    <h2 className="my-4">Requests</h2>
                    <div class="d-grid gap-3">
                        {requests.map((item,idx) => (
                            <RequestItem
                            info={item}
                            key={idx}
                            id={idx} 
                            handleDelete={handleDelete} 
                            handleUpdate={handleUpdate} 
                            />
                        ))}
                    </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default MyRequests;