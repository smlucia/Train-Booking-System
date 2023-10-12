import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home/Home.css"

export default function Home() {
    const navigate = useNavigate();

    const handlebtn = () => {
        navigate("/addTrain");
    };

    return (
        <html>
            <body className='home-background'>
                <h1 className="app-name">Ticket Tunes</h1>
                <h4 className="app-intro-para">Ticket Tunes is a user-friendly train ticket booking system that
                    simplifies the process of reserving train tickets, providing a seamless
                    and convenient platform for travelers to secure their journeys with ease.</h4>
                <button className="get-start-btn" onClick={() => handlebtn()}>GET STARTED</button>
            </body>
        </html>

    );
}