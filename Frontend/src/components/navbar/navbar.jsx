import "./navbar.css";
<<<<<<< HEAD
import React, { useState } from "react";
=======
import React from "react";
>>>>>>> 8b6be90b7f90cefe062533ef1e0248a5b03f38b3
import logo from "@/assets/media/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import app from "../../feathers";
import { logOutUser } from "../../redux/userSlice";
<<<<<<< HEAD
import CustomerCare from "../customerCare/CustomerCare";

export default function Navbar() {
  const [chatOpen, setChatOpen] = useState(false)
=======

export default function Navbar() {
>>>>>>> 8b6be90b7f90cefe062533ef1e0248a5b03f38b3

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const username = useSelector((state) => state.user.userData.username);

  async function logOut(){
    try{
      await app.authentication.logout()
      dispatch( logOutUser() )
      window.alert("User logged out successfully")
      navigate("/")
    }catch(err){
      console.log(err)
    }

  }

  return (
    <div className="navbar">
      <div className="navbar-content">
        <div className="left">
          <img src={logo} alt="logo" />
        </div>
        <div className="right">
          <div className="set-1">
            <Link to="/" className="menu-item">
              Home
            </Link>
            <Link to="/" className="menu-item">
              About
            </Link>
            <Link to="/tours" className="menu-item">
              Tour
            </Link>
          </div>
          {!isLoggedIn ? (
            <div className="set-2">
              <Link to="/login" className="menu-item">
                Login
              </Link>
              <Link to="/register" className="menu-item menu-button">
                Register
              </Link>
<<<<<<< HEAD
              <div className="menu-item menu-button" onClick={()=>setChatOpen(v=>!v)}>Chat</div>
=======
>>>>>>> 8b6be90b7f90cefe062533ef1e0248a5b03f38b3
            </div>
          ) : (
            <div className="set-3">
              <span className="menu-item">Hi {username || "user"}!</span>
              <Link to="/my-bookings" className="menu-item">My bookings</Link>
              <div className="menu-item menu-button" onClick={logOut}>Logout</div>
<<<<<<< HEAD
              <div className="menu-item menu-button" onClick={()=>setChatOpen(v=>!v)}>Chat</div>
=======
>>>>>>> 8b6be90b7f90cefe062533ef1e0248a5b03f38b3
            </div>
          )}
        </div>
      </div>
<<<<<<< HEAD
      {chatOpen && (
        <div className="chat-widget">
          <CustomerCare />
        </div>
      )}
=======
>>>>>>> 8b6be90b7f90cefe062533ef1e0248a5b03f38b3
    </div>
  );
}
