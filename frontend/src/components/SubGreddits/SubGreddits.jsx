import {React,useEffect,useState} from "react";
import { useCookies } from 'react-cookie';
import {redirect, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Fuse from 'fuse.js'

import JoinedItem from "./JoinedItem";
import UnjoinedItem from "./UnjoinedItem";
import Tag from "./Tag";

import Paper from '@mui/material/Paper';


function SubGreddits(){

    

    const navigate = useNavigate();
    const [cookies,setCookies,removeCookies] = useCookies();

    const [sgAll,setSgAll] = useState([]);
    const [tags,setTags] = useState([]);
    const [curTag,setCurTag] = useState("");

    const [criteria,setCriteria] = useState(0);

    const [search,setSearch] = useState("");
    const [results,setResults] = useState([]);
    const options = {
        includeScore: true,
        // Search in `author` and in `tags` array
        keys: ['name']
      }
    
    const fuse = new Fuse(sgAll, options)

    function handleSearch(event){
        const newVal = event.target.value;
        setSearch(newVal);

        let result = fuse.search(newVal);
        setResults(result);
    }

    function handleDelete(idx) {
        console.log("delete");
        setTags((prev) => {
            return prev.filter((it, index) => {
                return index !== idx;
              });
        });
    }

    function handleTag(event){
        if(event.key === "Enter"){
            setTags((prev) =>{
                return [
                    ...prev,
                    curTag
                ]
            })
            setCurTag("");

            console.log(tags);
        }
    }

    function handleCurTag(event){
        setCurTag(event.target.value);
    }

    function handleSort(event){
        const label = event.target.innerText;
        console.log(label);
        if(label === "Name(asc)") setCriteria(0);
        else if(label === "Users") setCriteria(1);
        else if(label === "Creation Time") setCriteria(2);
        else if(label === "Name(desc)") setCriteria(3);
    }

    function handleJoin(sG){

       
        const p_obj = {
            tokenH:cookies.GredditToken,
            id:cookies.GredditUser,
            moderator:sG.moderator,
            name:sG.name,
            user:cookies.GredditUser
        }
        axios.post("http://localhost:3003/newRequest",p_obj).then((response) => {
            if(response.data.message === "Traitor"){
                alert("Sorry, you cannot request to join this SubGreddit as you have already left it")
            }
        })
        setSgAll([]);
        
    }

    function handleLeave(sG){

        const p_obj = {
            tokenH:cookies.GredditToken,
            id:cookies.GredditUser,
            moderator:sG.moderator,
            name:sG.name,
            user:cookies.GredditUser
        }
        axios.post("http://localhost:3003/LeaveSubGreddit",p_obj).then((response) => {
            console.log(response);
        })
        // axios.get("http://localhost:3003/subGreddits").then((response) =>{
        //     setSgAll(response.data.list);
        // });
        setSgAll([]);
        
    }


    useEffect(() => {
        const p_obj = {
            tokenH:cookies.GredditToken,
            id:cookies.GredditUser,
        }
        axios.post("http://localhost:3003/subGreddits",p_obj).then((response) =>{
            setSgAll(response.data.list);
        });
    },[sgAll])
    return (
        <div>
            <section id="header" styleName="display: none;">
                <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                    <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                        <h1>Welcome to the SubGreddits Page</h1>
                    </div>
                </div>
            </section> 
            <section id="search" styleName="display: none;">
                <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                    <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                        <div className="form-outline">
                            <input onChange={handleSearch} type="search" className="form-control my-4" placeholder="Fuzzy Search" value = {search}/>
                        </div>
                    </div>
                </div>
            </section> 
            <section id="tags" styleName="display: none;">
                <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                    <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                        <div className="form-outline">
                            <input onKeyDown={handleTag} onChange={handleCurTag} type="search" className="form-control my-4" placeholder="Add Tags" value = {curTag}></input>
                        </div>
                        {tags.length > 0 && <Paper
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0.5,
                            m: 0,
                        }}
                        component="ul"
                        >
                        {tags.map((item,idx) =>(
                            <Tag text={item} handleDelete={handleDelete} key={idx} id={idx}/>
                        ))}
                        </Paper>}
                    </div>
                </div>
            </section> 
            <section id="header" styleName="display: none;">
                <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                    <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                        <h2>Sorting Criteria</h2>
                        <button onClick={handleSort} className="btn btn-info my-2">Name(asc)</button>
                        <button onClick={handleSort} className="btn btn-info my-2">Name(desc)</button>
                        <button onClick={handleSort} className="btn btn-info my-2">Users</button>
                        <button onClick={handleSort} className="btn btn-info my-2">Creation Time</button>

                    </div>
                </div>
            </section> 
            <section id="list" styleName="display: none;">
                <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                    <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                    <h2 className="my-4">Joined SubGreddits</h2>
                    <div class="d-grid gap-3">
                        {sgAll.filter((it,idx)=>{
                            if(search.length > 0){
                                let flag = false;
                                for(let i=0; i<results.length;i++){
                                    if(it.name === results[i].item.name && it.moderator === results[i].item.moderator){
                                        flag = true;
                                    }   
                                }
                                if(!flag){
                                    return false;
                                }
                            }
                            for(let tag of tags) {
                               if(!(it.tags.includes(tag))) return false;
                            }
                            return it.joined.includes(cookies.GredditUser) || it.moderator === cookies.GredditUser
                        }).sort((a,b)=>{
                            if(criteria===0){
                                return a.name.localeCompare(b.name);
                            } else if(criteria===1){
                                return a.joined?.length - b.joined?.length;
                            } else if(criteria===2){
                                return new Date(b.createdAt) - new Date(a.createdAt);
                            } else if(criteria===3){
                                return b.name.localeCompare(a.name);
                            }
                        }).map((item,idx) => (
                            <JoinedItem 
                            info={item}
                            key={idx}
                            id={idx} 
                            handleLeave={handleLeave}
                            />
                        ))}
                    </div>
                    <h2 className="my-4">SubGreddits Not Joined</h2>
                    <div class="d-grid gap-3">
                        {sgAll.filter((it,idx)=>{
                            if(search.length > 0){
                                let flag = false;
                                for(let i=0; i<results.length;i++){
                                    if(it.name === results[i].item.name && it.moderator === results[i].item.moderator){
                                        flag = true;
                                    }   
                                }
                                if(!flag){
                                    return false;
                                }
                            }
                            for(let tag of tags) {
                               if(!(it.tags.includes(tag))) return false;
                            }
                            return !(it.joined.includes(cookies.GredditUser) || it.moderator === cookies.GredditUser)
                        }).sort((a,b)=>{
                            if(criteria===0){
                                return a.name.localeCompare(b.name);
                            } else if(criteria===1){
                                return a.joined?.length - b.joined?.length;
                            } else if(criteria===2){
                                return new Date(b.createdAt) - new Date(a.createdAt);
                            } else if(criteria===3){
                                return b.name.localeCompare(a.name);
                            }
                        }).map((item,idx) => (
                            <UnjoinedItem 
                            info={item}
                            key={idx}
                            id={idx} 
                            handleJoin ={handleJoin}
                            />
                        ))}
                    </div>
                    </div>
                </div>
            </section> 
        </div>
    )
}

export default SubGreddits;