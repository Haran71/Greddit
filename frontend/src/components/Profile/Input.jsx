import {React} from "react";

function Input(props) {
    return (
        <div>
            <input onChange={props.onChange} type={props.type} id={props.id} className="form-control form-control-lg mt-4 mb-2" name={props.name} value={props.value}  autoComplete='off' required/>
            <label>{props.label}</label>
        </div>
    )
}

export default Input;