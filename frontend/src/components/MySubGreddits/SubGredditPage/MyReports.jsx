import {React,useEffect,useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Report from "./Report";

function MyReports(){

    const navigate = useNavigate();
    const {name} = useParams();
    const [cookies,setCookies,removeCookies] = useCookies();

    const [posts,setPosts] = useState([]);
    const [reports,setReports] = useState([]);

    function handleDelete(idx){
        let report = reports[idx];
        axios.post("http://localhost:3003/deleteReportedPost",{tokenH:cookies.GredditToken,id:cookies.GredditUser,report:report}).then((response) => {
            console.log(response.data);
        });
        setPosts([]);
    }

    function handleBlock(idx){
        let report = reports[idx];
        axios.post("http://localhost:3003/blockReportedUser",{tokenH:cookies.GredditToken,id:cookies.GredditUser,report:report}).then((response) => {
            console.log(response.data);
        });
        setPosts([]);
    }

    function handleIgnore(idx){
        let report = reports[idx];
        if(!report.ignored){
            axios.post("http://localhost:3003/ignoreReport",{tokenH:cookies.GredditToken,id:cookies.GredditUser,report:report}).then((response) => {
                console.log(response.data);
            });
            setPosts([]);
        }
        
    }



    useEffect(() => {
        axios.post("http://localhost:3003/getReports",{tokenH:cookies.GredditToken,id:cookies.GredditUser,username:cookies.GredditUser,"name":name}).then((response) =>{
            if(response.data.posts){
                setPosts(response.data.posts);
                setReports(response.data.reports);
            }
        });
    },[posts]);




    return (
        <div>
            <section id="header" styleName="display: none;">
                    <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                        <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                            <h1>{cookies.GredditUser}'s SubGreddit {name} Reports</h1>
                        </div>
                    </div>
            </section>

            {reports.map((report,idx) =>(
                <Report key={idx} id={idx} report={report} handleDelete={handleDelete} handleBlock={handleBlock} handleIgnore={handleIgnore}/>
            ))}

        </div> 
    )
}

export default MyReports;