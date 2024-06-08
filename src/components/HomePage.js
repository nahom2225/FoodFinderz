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

    useEffect(() => {
        // code to run on component mount
        fetch('https://d035-2601-646-401-2670-3deb-26d5-e74e-521.ngrok-free.app/api/account-in-session')
        .then((response) => response.json())
        .then((data) => {
            console.log("HOMEPAGE");
          setAccountId(data.account_id);
          console.log(data.accountId);  
        })
        // cleanup function to run on component unmount
        return () => {
        };
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
                    <ButtonGroup disableElevation variant="contained" color = "primary">
                        <Button color="primary" href='/create-account'>
                            Create Account
                        </Button>
                        <Button color="secondary" href='/login'>
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
