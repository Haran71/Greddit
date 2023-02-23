import React,{useState} from 'react';
import {Form} from 'react-router-dom'

function Login() {

    const [user,setUser] = useState("");
    const [pass,setPass] = useState("");

    return (
        <Form className="form-outline form-white mb-2" method="post" action="/">
            <input onChange={event => {setUser(event.target.value)}} type="text" id="username" className="form-control form-control-lg mb-2" name="username"  placeholder="Enter username" value = {user} autoComplete='off' required/>
            <input onChange={event => {setPass(event.target.value)}} type="password" id="password" className="form-control form-control-lg" name="password" placeholder="Enter password"  value = {pass} autoComplete='off' required/>
            <button disabled ={!user || !pass} className="btn btn-outline-light btn-lg px-5 mt-5" type="submit">Login</button>
        </Form>
    );
}



export default Login;