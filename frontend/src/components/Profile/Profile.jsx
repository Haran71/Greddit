import React,{useState,useEffect} from "react";
import {redirect, useNavigate, useParams} from "react-router-dom";
import Input from "./Input";
import { useCookies } from "react-cookie";
import FollowItem from "./FollowItem";
import axios from "axios";



function Profile() {
    const Dfname = "";
    const Dlname = "";
    const Dusername = "";
    const Demail = "";
    const Dcontact = null;
    const Dage = null;

    // const {username} = useParams();
    const navigate = useNavigate();
    const [cookies,setCookies,removeCookies] = useCookies();

    const [fname,setFname] = useState(Dfname);
    const [lname,setLname] = useState(Dlname);
    const [uname,setUname] = useState(Dusername);
    const [email,setEmail] = useState(Demail);
    const [age,setAge] = useState(Dage);
    const [contact,setContact] = useState(Dcontact);

    // followers list
    const [followers,setFollowers] = useState(["admin1","admin2"]); // get the list from the server
    const [foClass,setFoClass] = useState("mt-2 HideDiv"); 

    const [following,setFollowing] = useState(["admin1","admin2"]); // get the list from the server
    const [fiClass,setFiClass] = useState("mt-2 HideDiv"); 

    function handleDeleteFo(idx) {
        setFollowers((prev) => {
            return prev.filter((it, index) => {
                return index !== idx;
              });
        });
    }

    function handleDeleteFi(idx) {
        setFollowing((prev) => {
            return prev.filter((it, index) => {
                return index !== idx;
              });
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


        axios.post("http://localhost:3003/profile",{tokenH:cookies.GredditToken,id:cookies.GredditUser,username: cookies.GredditUser}).then((response) => {
            setFname(response.data.firstName);
            setLname(response.data.lastName);
            setUname(response.data.username);
            setEmail(response.data.email);
            setAge(response.data.age);
            setContact(response.data.phone);
            setFollowers(response.data.followers);
            setFollowing(response.data.following);
        });

    },[]);

    function handleFname(event) {
        const newValue = event.target.value;
        setFname(newValue);
    }
    function handleLname(event) {
        const newValue = event.target.value;
        setLname(newValue);
    }
    // function handleUname(event) {
    //     const newValue = event.target.value;
    //     setUname(newValue);
    // }
    function handleAge(event) {
        const newValue = event.target.value;
        setAge(newValue);
    }
    function handleEmail(event) {
        const newValue = event.target.value;
        setEmail(newValue);
    }
    function handleContact(event) {
        const newValue = event.target.value;
        setContact(newValue);
    }

    function handleToggleFo(){
        setFoClass((prev) => {
            if(prev === "mt-2") {
                return "mt-2 HideDiv"
            } else {
                return "mt-2" 
            }
        });
    }

    function handleToggleFi(){
        setFiClass((prev) => {
            if(prev === "mt-2") {
                return "mt-2 HideDiv"
            } else {
                return "mt-2" 
            }
        });
    }

    function handleEdit(){
        const patch_object = {
            tokenH:cookies.GredditToken,
            id:cookies.GredditUser,
            username:uname,
            firstName:fname,
            lastName:lname,
            age:age,
            phone:contact,
            email:email,
            followers:followers,
            following:following,
        }
        axios.post("http://localhost:3003/profile_update",patch_object).then((response) => {
            console.log(response.data);
        });
    }

    
    return (
        <section className="vh-100 gradient-custom">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div className="card bg-dark text-white" style={{borderRadius: "1rem"}}>
                    <div className="card-body px-5 py-3 text-center">

                        <div className="mb-md-5 mt-md-4 pb-5">

                        <h2 className="fw-bold mb-2 text-uppercase">Profile</h2>
                        <p className="text-white-50 mb-3">This is your Greddit Profile</p>
                        <Input onChange={handleFname} tyep = "text" id="fname" value={fname} label="First Name"/> 
                        <Input onChange={handleLname} type = "text" id="lname" value={lname} label="Last Name"/> 
                        <Input type="text" id="username" value={uname} label="Username"/> 
                        <Input onChange={handleAge} type ="number" id="age" value={age} label="Age"/> 
                        <Input onChange={handleEmail} type = "email" id="email" value={email} label="Email"/> 
                        <Input onChange={handleContact} type="tel" id="phone" value={contact} label="Contact No"/>
                        <button onClick={handleToggleFo} type="button" className="btn btn-outline-light btn-lg mt-3">
                            Followers <span class="badge bg-secondary">{followers==undefined ? 0:followers.length}</span>
                        </button><br />
                        <div className = {foClass}>
                            <ul className="list-group">
                                {followers !== undefined ? followers.map((follower, idx) => (
                                    <FollowItem
                                    key={idx}
                                    id={idx}
                                    text={follower}
                                    onChecked={handleDeleteFo}
                                    />
                                )): undefined}  
                            </ul>
                        </div>
                        <button onClick={handleToggleFi} type="button" className="btn btn-outline-light btn-lg mt-3">
                            Following <span class="badge bg-secondary">{following == undefined ? 0:following.length}</span>
                        </button><br />
                        <div className = {fiClass}>
                            <ul className="list-group">
                                {following !== undefined ? following.map((follower, idx) => (
                                    <FollowItem
                                    key={idx}
                                    id={idx}
                                    text={follower}
                                    onChecked={handleDeleteFi}
                                    />
                                )) : undefined}  
                            </ul>
                        </div>
                        <p className="mt-4">Click on any username in the Followers or Following list to remove them. These changes will be saved after clicking the button below</p>
                        <button onClick={handleEdit} className="btn btn-large btn-outline-danger mt-5">Save Changes</button>
                    </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </section>   
    );
}






export default Profile;