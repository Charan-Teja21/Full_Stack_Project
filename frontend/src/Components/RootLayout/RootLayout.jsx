import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import './RootLayout.css'

function RootLayout(){
    return(
        <div className="root">
            <Navbar/>
            <div className="h">
                <Outlet />  
            </div>
            <Footer />
        </div>
    )
}
export default RootLayout;