import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import {NavLink,useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history= useHistory()
  const toRegister=()=>{
    history.push("/register")
  }
  const toLogin=()=>{
    history.push("/login")
  }
  const toLogout=()=>{
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('balance');
    history.push("/login")
    window.location.reload();
  }
  const toProducts=()=>{
    history.push("/")
  }
  if (hasHiddenAuthButtons){
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={toProducts}
        >
          Back to explore
        </Button>
      </Box>
    );}
    return(
    <Box className="header">
    <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
    </Box>
    {/* {children} */}
    <Stack direction="row" spacing={2}>
    {(localStorage.getItem('username'))?
    (<>
    <Avatar
        // style={{ border: "2px solid gray", margin: 10 }}
        alt={localStorage.getItem("username")||"profile"}
        src="/public/avataar.png"
      />
      
      <div className="username-text">{localStorage.getItem("username")}</div>
    <Button
         
          // variant="text"
          onClick={toLogout}
        >
          Logout {/*<NavLink className="link" to="/"></NavLink>*/}
        </Button>
        
        {/* <img src="/public/avatar.png" alt={JSON.parse(localStorage.getItem('loginDetails')).userName}></img> */}
        </>)
        :
        (
          <>
            <Button onClick={toLogin}>
              Login
            </Button>
            <Button variant="contained" onClick={toRegister}>
            Register
            </Button>
          </>
        )}
    </Stack>
    
        
    </Box>)
};

export default Header;
