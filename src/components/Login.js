import React, { Component, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, Collapse, FormControlLabel, Checkbox, Input} from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Redirect,
  Navigate,
} from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import Alert from "@mui/lab/Alert";
import { getOptionGroupUnstyledUtilityClass } from "@mui/base";
import GoogleLoginButton from './GoogleLoginButton';

export default function Login(props) {
    const navigate = useNavigate();

    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');
    const[user_error, setUserError] = useState('');
    const[pass_error, setPassError] = useState('');
    const[showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
    
        document.body.appendChild(script);
    
        return () => {
          document.body.removeChild(script);
        };
      }, []);

    function handleUsernameChange () {
        setUsername(event.target.value);
    }

    function handlePasswordChange () {
        setPassword(event.target.value);
    }


    const handleAccountButtonPressed = (event) => {
        event.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                username : username,
                password : password
            }),
        };
        fetch("https://d035-2601-646-401-2670-3deb-26d5-e74e-521.ngrok-free.app/api/login", requestOptions)
        .then((response) => {
            if (response.ok) {
                response.json()
                .then((data) => {navigate(`/frontpage`);
                                console.log(data);})
            } else if (response.status === 400) {
                response.json().then((data) => {setError(data.error)
                    console.log(data.error);});
                    console.log(response.statusText);
                    console.log("400")
               
            } else if (response.status === 401) {
                response.json().then((data) => {setError(data.error);
                    console.log(data.error);});
                    console.log(response.statusText);
                    console.log("401")
            }
        })
        .catch((error) => {
            console.log(error);
            setError(error)
        });
    }


 return (
    <div className = "center">
        <Grid container spacing = {3}>
            <Grid item xs = {12} algin = "center">
                <Collapse in = {error != ""}>
                    <Alert severity="error" onClose={() => {setError("")}}>
                        {error}
                    </Alert>
                </Collapse>
            </Grid>
            <Grid item xs = {12} align = "center">
                <Typography variant = "h3" compact = "h3">
                    Enter Your Information
                </Typography>
            </Grid>
            <Grid item xs = {12} align = "center">
                <div class = "login">
                    <TextField
                        error={user_error}
                        label="Username"
                        placeholder="Enter Your Username"
                        value={username}
                        helperText={user_error}
                        variant="outlined"
                        onChange={handleUsernameChange}
                    />
                </div>
            </Grid>
            <Grid item xs = {12} align = "center">
                <div class = "login">
                    <TextField
                        error={pass_error}
                        type = {showPassword ? "test" : "password"}
                        label="Password"
                        placeholder="Enter your Password"
                        value={password}
                        helperText={pass_error}
                        variant="outlined"
                        onChange={handlePasswordChange}
                    />
                </div>
            </Grid>
            <Grid item xs = {12} align = "center">
                <FormControlLabel 
                    control={
                    <Checkbox
                    checked={showPassword}
                    onChange={(event) => setShowPassword(event.target.checked)}
                    color="primary"
                    />
                    }
                    label="Show Password"
                />
            </Grid>
            <Grid item xs = {12} align = "center">
                <Button
                color="primary"
                variant="contained"
                onClick={handleAccountButtonPressed}
                >
                    Login
                </Button>
            </Grid>
            <Grid item xs = {12} align = "center">
                <GoogleLoginButton text = {"signin_with"}/>
            </Grid>
        </Grid>
    </div>
    )
}
