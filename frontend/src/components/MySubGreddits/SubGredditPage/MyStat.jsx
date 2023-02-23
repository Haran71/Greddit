import {React,useEffect,useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import axios from "axios";


function MyStat() {
    const navigate = useNavigate();
    const {name} = useParams();
    const [cookies,setCookies,removeCookies] = useCookies();

    const [stat,setStat] = useState({});
    const [chart4,setChart4] = useState([]);
    useEffect(() => {
        axios.post("http://localhost:3003/subgredditInfo",{tokenH:cookies.GredditToken,id:cookies.GredditUser,username:cookies.GredditUser,"name":name}).then((response) =>{
            if(response.data.message === "Failed"){
                navigate("/MySubGreddit")
            }
        });

        axios.post("http://localhost:3003/getStats",{tokenH:cookies.GredditToken,id:cookies.GredditUser,username:cookies.GredditUser,name:name}).then((response) =>{
            setStat(response.data.stat);
            let c4 = [{Reported: response.data.stat.RP,Deleted: response.data.stat.DRP,title:"Reported vs Deleted"}];
            setChart4(c4);
        });
    },[]);
    return (
        <div>
            <section id="header" styleName="display: none;">
                    <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                        <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                            <h1>{cookies.GredditUser}'s SubGreddit {name} Stats</h1>
                        </div>
                    
                    </div>
            </section> 

            <section id="chart1-title" styleName="display: none;">
                    <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                        <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                            <h1>1. Growth of user's over time</h1>
                        </div>
                    
                    </div>
            </section> 

            <section id="chart1" styleName="display: none;">
                    <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                        <LineChart
                            width={500}
                            height={300}
                            data={stat.GrowthSG}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="User" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                    </div>
            </section> 

            <section id="chart2-title" styleName="display: none;">
                    <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                        <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                            <h1>2. Daily Posts</h1>
                        </div>
                    
                    </div>
            </section> 

            <section id="chart2" styleName="display: none;">
                    <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                        <LineChart
                            width={500}
                            height={300}
                            data={stat.DP}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="User" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                    </div>
            </section> 
                    
            <section id="chart3-title" styleName="display: none;">
                    <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                        <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                            <h1>3. Daily Views</h1>
                        </div>
                    
                    </div>
            </section> 

            <section id="chart3" styleName="display: none;">
                    <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                        <LineChart
                            width={500}
                            height={300}
                            data={stat.DV}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="User" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                    </div>
            </section>                 
                   
            <section id="chart4-title" styleName="display: none;">
                    <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                        <div className="card bg-dark text-white w-50 text-center" styleName="border-radius: 1rem;">
                            <h1>4. Reported Posts vs Deleted Posts</h1>
                        </div>
                    
                    </div>
            </section> 

            <section id="chart4" styleName="display: none;">
                    <div className="row d-flex justify-content-center align-items-center h-100 mt-4 mb-4">
                    <BarChart
                    width={500}
                    height={300}
                    data={chart4}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Reported" fill="#8884d8" />
                    <Bar dataKey="Deleted" fill="#82ca9d" />
                    </BarChart>
                    </div>
            </section> 
                
        </div>
    )
}

export default MyStat;