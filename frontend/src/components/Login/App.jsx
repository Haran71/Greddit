import React,{useState,useEffect} from 'react';
import Login from './Login';
import Register from './Register';
import { useCookies } from 'react-cookie';
import {redirect, useActionData, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from 'axios';



function App() {

    const data = useActionData();

    const disabled = "btn btn-dark mx-3";
    const active = "btn btn-outline-light mx-3";

    const [togState,setTogState] = useState("Login");
    const [loginState,setLoginState] = useState(active);
    const [registerState,setRegisterState] = useState(disabled);
    const [cookies] = useCookies();
    const navigate = useNavigate();

    useEffect(() => {
        if(cookies.GredditUser !== undefined && cookies.GredditToken !== undefined) {
            navigate("/profile");
        }
    },[]);

    function handleClick(event){
        const val = event.target.value;
        if(val === togState) {
            return;
        }
        setTogState(val);

        if(val === "Login") {
            setLoginState(active);
            setRegisterState(disabled);
        }
        else {
            setRegisterState(active);
            setLoginState(disabled);
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

                        <h2 className="fw-bold mb-2 text-uppercase">Greddit</h2>
                        <p className="text-white-50 mb-3">Welcome to Greddit</p>
                        <div class="d-flex justify-content-center text-center mt-4">
                            {/* <a href="#!" class="text-white"><i class="fab fa-facebook-f fa-lg"></i></a> */}
                            {/* <a href="#!" class="text-white"><i class="fab fa-twitter fa-lg mx-4 px-2"></i></a> */}
                            <a href="http://localhost:3003/auth/google" class="text-white"><i class="fab fa-google fa-lg"></i></a>
                        </div>
                        <div className='mb-3 mt-4'>
                            <button className={loginState} onClick={handleClick} value="Login">
                                Login
                            </button>
                            <button className={registerState} onClick={handleClick} value="Register">
                                Register
                            </button>
                        </div>
                        {togState === "Login" ? <Login/>:<Register />}
                        {data && data.error && <p className="errorText">{data.error}</p>}
                    </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </section>
    );
}

export const LoginAction = async({request}) => {
    // post request after logging in or registering
    const data = Object.fromEntries(await request.formData());

    if(data.age == undefined) {
        const response = await axios.post('http://localhost:3003/login',data);
        if(response.data.message==="success") {
            Cookies.set('GredditUser',data.username,{path:"/"});
            Cookies.set('GredditToken',response.data.token,{path:"/"});
            return redirect("/profile");
        } else {
            return {error:"Password or Username is incorrect"};
        }
    } else {
        // register
        const response = await axios.post('http://localhost:3003/register', data)
        // posting the required data to the database and checking if the username and email is unique
        if(response.data.message === "success") {
            Cookies.set('GredditUser',data.username,{path:"/"});
            Cookies.set('GredditToken',response.data.token,{path:"/"});
            return redirect("/profile");
        } else {
            return {error:"Username is already taken"};
        }
    }
};


export default App;