import React, { Component, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, FormControlLabel, Checkbox} from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Redirect,
  Navigate,
} from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import GoogleLoginButton from './GoogleLoginButton';

export default function CreateAccount(props) {
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const[accountId, setaAccountId] = useState('');
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[retypePassword, setRetypePassword] = useState('');
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

    function handleRetypePasswordChange () {
        setRetypePassword(event.target.value);
    }

    function handleAccountButtonPressed () {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                username : username,
                password : password
            }),
        };
        if (password != retypePassword) {
            setPassError('Passwords Do Not Match!');
        } else {
        fetch(`${backendUrl}/api/create-account`, requestOptions, {
            credentials: 'include',  
            headers: new Headers({
              "ngrok-skip-browser-warning": "6024",
            }),
          })
        .then((response) => {
            if (response.ok) {
                response.json()
                .then((data) => {navigate(`/frontpage`);
                                console.log(data);})
            } else if (response.status === 400) {
                setUserError('Invalid Request')
            } else if (response.status === 401) {
                setUserError('Unauthorized')
            } else if (response.status === 409) {
                setUserError('Username is taken')
            }
        })
        .catch((error) => {
            console.log(error);
            setUserError('Error Occured')
        });
    }
    }


    return (
        <div className = "center">
            <Grid container spacing = {3}>
                <Grid item xs = {12} align = "center">
                    <Typography variant = "h3" compact = "h3">
                        Create Account!
                    </Typography>
                </Grid>
                <Grid item xs = {12} align = "center">
                    <TextField
                        error={user_error}
                        label="Username"
                        placeholder="Enter a New Username"
                        value={username}
                        helperText={user_error}
                        variant="outlined"
                        onChange={handleUsernameChange}
                    />
                </Grid>
                <Grid item xs = {12} align = "center">
                    <TextField
                        error={pass_error}
                        type = {showPassword ? "test" : "password"}
                        label="Password"
                        placeholder="Enter a Password"
                        value={password}
                        helperText={pass_error}
                        variant="outlined"
                        onChange={handlePasswordChange}
                    />
                </Grid>             
                <Grid item xs = {12} align = "center">
                    <TextField
                        error={pass_error}
                        type = {showPassword ? "test" : "password"}
                        label="Retype Password"
                        placeholder="Enter Password Again"
                        value={retypePassword}
                        helperText={pass_error}
                        variant="outlined"
                        onChange={handleRetypePasswordChange}
                    />
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
                        Create Account
                    </Button>
                </Grid>
                <Grid item xs = {12} align = "center">
                    <GoogleLoginButton text = {"signup_with"}/>
                </Grid>
            </Grid>
        </div>
    )

}
