import React, { Component, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography} from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Redirect,
  Navigate,
} from "react-router-dom";
import CreateAccount from "./CreateAccount";
import FrontPage from "./FrontPage";
import Login from "./Login";
import CreatePost from "./CreatePost";
import PostCardView from "./PostCardView";
import AccountPage from "./AccountPage";
import EditPost from "./EditPost";

export default function Home(props) {

    const[accountId, setAccountId] = useState(null);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

      useEffect(() => {
        const fetchCSRFToken = async () => {
          try {
            const response = await fetch(`${backendUrl}/api/getCSRFToken`, {
              credentials: 'include',
            });
            if (!response.ok) {
              throw new Error("Failed to fetch CSRF token");
            }
            const jsonResponse = await response.json();
            console.log("CSRFToken: ", jsonResponse["token"]);
            setCsrftoken(jsonResponse["token"]);
          } catch (error) {
            console.error("Error fetching CSRF token:", error);
          }
        };
    
        const fetchAccountData = async () => {
          try {
            const response = await fetch(`${backendUrl}/api/get-account`, {
              credentials: 'include',
              headers: {
                "ngrok-skip-browser-warning": "6024",
                'X-CSRFToken': csrftoken,
                "SameSite": "None"
              },
            });
            if (!response.ok) {
              console.log("retrieve account error");
              props.clearAccountIdCallback();
              navigate("/");
              return;
            }
            const data = await response.json();
            console.log("HOMEPAGE");
            setAccountId(data.account_id);
            console.log(data.accountId);  
          } catch (error) {
            console.error("Error fetching account data:", error);
          }
        };
    
        fetchCSRFToken().then(fetchAccountData);
      }, []);


    function renderHomePage() {
        return (
        <div className = "center">
            <Grid container spacing = {4}>
                <Grid item xs = {12} align = "center">
                    <Typography variant = "h3" compact = "h3">
                        Free Food Finderz
                    </Typography>
                </Grid>
                <Grid item xs = {12} align = "center">
                    <ButtonGroup disableElevation variant="contained">
                        <Button sx={{ backgroundColor: "#3f51b5" }} color="primary" href='/create-account'>
                            Create Account
                        </Button>
                        <Button sx={{ backgroundColor: "#f50057" }} color="secondary" href='/login'>
                            Login
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </div>
        )
    }

    function clearAccountId() {
        setAccountId(null);
    }

    return (
        <Router basename={process.env.PUBLIC_UR}>
            <Routes>
                <Route exact path = "/" element={accountId != null ? (<Navigate replace to={`/frontpage`}/>) : renderHomePage()}/>
                <Route path = '/create-account' element={<CreateAccount/>} />
                <Route path = '/frontpage' element={<FrontPage clearAccountIdCallback = {(clearAccountId)}/>} />
                <Route path ='/login' element={<Login/>} />
                <Route path ='/create-post' element={<CreatePost/>} />
                <Route path = '/frontpage/:post_id' element={<PostCardView/>} />
                <Route path = '/account/:username' element={<AccountPage/>} />
                <Route path = '/edit-post/:op/:post_id' element={<EditPost/>} />
            </Routes>
        </Router>
    );
}
