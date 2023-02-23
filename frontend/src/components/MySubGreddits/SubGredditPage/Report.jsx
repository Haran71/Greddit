import {React,useEffect,useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

function Report(props){
    const duration  = 3;
    const [count, setCount] = useState(duration);
    const [running, setRunning] = useState(false);


    useEffect(() => {
        let intervalId;
    
        if (running) {
          intervalId = setInterval(() => {
            setCount((count) => {
              if (count <= 0) {
                clearInterval(intervalId);
                setRunning(false);
                props.handleBlock(props.id)
                return duration;
              } else {
                return count - 1;
              }
            });
          }, 1000);
        }
    
        return () => {
          clearInterval(intervalId);
        };
      }, [running]);

    const handleBlock = () => {
    if (running) {
        setRunning(false);
        setCount(duration);
    } else {
        setRunning(true);
    }
    };

    


    return (
        <div>
            <section styleName="display: none;">
                    <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                        <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                            <p>Reporter: {props.report.reporter}</p>
                            <p>Reported: {props.report.reportee}</p>
                            <p>Post in question: {props.report.post_text}</p>
                            <p>Concern: {props.report.concern}</p>

                            <button disabled = {props.report.ignored} onClick={handleBlock} className="btn btn-lg btn-outline-danger my-2 mx-auto">{running ? `Countdown: ${count}` : "Block"}</button><br />
                            <button onClick={() => {props.handleIgnore(props.id)}} className="btn btn-lg btn-outline-info my-2 mx-auto">Ignore</button><br />
                            <button disabled = {props.report.ignored} onClick={() => {props.handleDelete(props.id)}} className="btn btn-lg btn-outline-warning my-2 mx-auto">Delete Post</button>
                        </div>
                        
                    </div>
            </section>


        </div>
    )
}

export default Report;