import {React,useState} from "react";
import { useCookies } from "react-cookie";
import Input from "../Profile/Input";
import axios from "axios";
import {redirect, useNavigate, useParams} from "react-router-dom";

function CreateGreddit(){
    const navigate = useNavigate();
    const [cookies,setCookies,removeCookies] = useCookies();
    const [name,setName] = useState("");
    const [desc,setDesc] = useState("");
    const [tags,setTags] = useState("");
    const [ban,setBan] = useState("");
    const [error,setError] = useState(null);

    function handleName(event){
        const newValue = event.target.value;
        setName(newValue);
    }
    function handleDesc(event){
        const newValue = event.target.value;
        setDesc(newValue);
    }
    function handleTag(event){
        const newValue = event.target.value;
        setTags(newValue);
    }
    function handleBan(event){
        const newValue = event.target.value;
        setBan(newValue);
    }

   

    function handleSubmit(){
        if(name && desc) {
            const sgObj = {
                tokenH:cookies.GredditToken,
                id:cookies.GredditUser,
                moderator:cookies.GredditUser,
                name:name,
                description:desc,
                banned:ban.split(","),
                tags:tags.split(",")
            }
            setName("");
            axios.post("http://localhost:3003/createSubGreddit",sgObj).then((response) => {
                if(response.data.success){
                    navigate("/MySubGreddit");
                } else {
                    setError(1);
                }
            })
        }
    }
    

    return (
        <section className="vh-100 gradient-custom">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div className="card bg-dark text-white" styleName="border-radius: 1rem;">
                    <div className="card-body px-5 py-3 text-center">

                        <div className="mb-md-5 mt-md-4 pb-5">

                        <h2 className="fw-bold mb-4 text-uppercase">Create New SubGreddit</h2>
                        
                        <Input type = "text" id="Mod" value={cookies.GredditUser} label="Moderator"/> 
                        <Input onChange={handleName} type = "text" id="name" value={name} label="Name"/> 
                        <Input onChange={handleDesc} type ="text" id="desc" value={desc} label="Description"/> 
                        <Input onChange={handleTag} type ="text" id="Tags" value={tags} label="Tags"/> 
                        <Input onChange={handleBan} type ="text" id="Ban" value={ban} label="Banned Keywords"/> 
                        <button disabled={!name || !desc} onClick={handleSubmit} className="btn btn-lg btn-outline-danger mt-5" type="submit">Create</button>
                        {error && <p className="errorText">User already has SubGreddit with name</p>}
                        
                        
                    </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </section>
    );
}

export default CreateGreddit;