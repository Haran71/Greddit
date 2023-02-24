import React,{useState} from "react";
import {Form} from 'react-router-dom'

function Register() {

    const [uname,setUname] = useState("");
    const [email,setEmail] = useState("");

    function handleUname(event) {
        const newValue = event.target.value;
        setUname(newValue);
    }

    function handleEmail(event) {
        const newValue = event.target.value;
        setEmail(newValue);
    }

    return (
        <Form className="form-outline form-white mb-2" method="post" action="/">
            <input type="text" id="fname" className="form-control form-control-lg mb-2" name="firstName" placeholder="Enter First Name" autoComplete='off' required/>
            <input type="text" id="lname" className="form-control form-control-lg mb-2" name="lastName" placeholder="Enter Last Name" autoComplete='off' required/>
            <input onChange={handleUname} type="text" id="username" className="form-control form-control-lg mb-2" name="username" placeholder="Enter username" autoComplete='off' value={uname} required/>
            <input onChange={handleEmail} type="email" id="email" className="form-control form-control-lg mb-2" name="email" placeholder="Enter Email ID" autoComplete='off' value={email} required/>
            <input type="number" id="age" className="form-control form-control-lg mb-2" name="age" placeholder="Enter Age" autoComplete='off' required/>
            <input type="tel" id="phone" className="form-control form-control-lg mb-2" name="phone" placeholder="Enter Phone Number" autoComplete='off' required/>
            <input type="password" id="password" className="form-control form-control-lg" name="password" placeholder="Enter password"  autoComplete='off' required/>

            <button disabled={!uname || !email} className="btn btn-outline-light btn-lg px-5 mt-5" type="submit">Register</button>
        </Form>
    );
};

export default Register;