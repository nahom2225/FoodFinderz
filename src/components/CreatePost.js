import React, { Component, useState, useEffect } from "react";
import { Grid, ButtonGroup, Typography, TextField, AppBar, Toolbar, Card, IconButton, LinearProgress, Box, Collapse} from "@mui/material";
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate } from "react-router-dom";
import Autocomplete from 'react-google-autocomplete';
import { useParams, useNavigate } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CreateIcon from '@mui/icons-material/Create';
import {withRouter} from "./withRouter";
import AccountCard from "./AccountCard";
import Divider from '@mui/material/Divider'
import Button from "@mui/material/Button";
import Alert from "@mui/lab/Alert";
import { Title } from "@mui/icons-material";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

//import GOOGLE_API_KEY from "C:/Users/nahom/Desktop/FF/FoodFinderz/google/credentials.py";

export default function EditPost(props) {

    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const mapsApi = process.env.REACT_APP_BACKEND_URL;

    const [username, setUsername] = useState('');
    const [account, setAccount] = useState({});
    const [title, setTitle] = useState("");
    const [food, setFood] = useState("");
    const [locationData, setLocationData] = useState({});
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [locationOptions, setLocationOptions] = useState([]);
  
    useEffect(() => {
      fetch(`${backendUrl}/api/get-account`, {
        credentials: 'include',  
        headers: new Headers({
          "ngrok-skip-browser-warning": "6024",
        }),
      }).then((response) => {
        if (!response.ok){
          console.log("OH OOHHH")
          props.clearAccountIdCallback();
          navigate("/");
        } else {
          response.json().then((data) => {
            setAccount(data);
            setUsername(data.username);
            console.log(data);
            console.log(GOOGLE_API_KEY);})
        }})
      return () => {
      };
    }, []);

    var cardStyle = {
        display: 'block',
        width: '50vw',
        transitionDuration: '0.3s',
    }

    function handleCreatePostButtonPressed() {        
        console.log('title:', title);
        console.log('food:', food);
        console.log('location:', locationData.label);
        console.log('description:', description);
        console.log('username:', username);
        console.log('food_left:', document.getElementById("food_left").value );
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                title : title, 
                food : food,
                location : locationData.label,
                description : description,
                account_poster : username,          
                food_left: document.getElementById("food_left").value    
            }),
        };
        fetch(`${backendUrl}/api/create-post`, requestOptions, {
            credentials: 'include',  
            headers: new Headers({
              "ngrok-skip-browser-warning": "6024",
            }),
          })
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setError("");
                    navigate(`/frontpage`);
                    console.log(data);})
            } else if (response.status === 409 || response.status === 400) {
                response.json().then((data) => {
                    setError(data.error);
                    console.log(data.error);});
                    console.log(response.statusText);                    
            }
        })
        .catch((error) => {
            console.log(error);
            setError(error)
        });
    }


    return (
        <div className = "blue-background">
            <AppBar sx={{ backgroundColor: "#3f51b5" }} position="static">
                <Grid container alignItems="center">
                    <Grid item xs = {6}>
                        <Toolbar>
                            <Typography variant="h4">Free Food Finderz</Typography>
                        </Toolbar>
                    </Grid>
                    <Grid item xs={6} align="right">
                        <AccountCard frontpage = {true} {...account}/>
                    </Grid>
                </Grid>
            </AppBar>
            <div className = "topmidleft">
                <Grid container style={{ gap: 15 }}>
                    <Grid item xs = {12}>
                        <Typography variant="h5"> Create a Post! </Typography>
                    </Grid>
                    <Grid item xs = {12} algin = "center">
                    <Collapse in = {error != ""}>
                        <Alert severity="error" onClose={() => {setError("")}} style = {{width: "100%"}}>
                            {error}
                        </Alert>
                    </Collapse>
                    </Grid>
                    <Grid item xs = {12}>
                        <Divider variant = "fullWidth" sx={{ borderBottomWidth: 5, width:"100%", color: "black"}}/>
                    </Grid>
                    <Grid item xs = {12} style = {{width: "100%"}}> 
                        <div id = "post-title">
                            <TextField
                                error={null}
                                label=""
                                placeholder="Title"
                                value={title}
                                helperText={null}
                                variant="outlined"
                                onChange={(e) => {setTitle(e.target.value)
                                                console.log(locationData);}}
                                inputProps={{
                                    style: {
                                        width: "85%",                                       
                                    },
                                    maxLength: 50
                                    }}
                                />
                        </div>
                        <Typography variant = "h6">
                            {title.length} / 50
                        </Typography>
                    </Grid>
                    <Grid item xs = {12} style = {{width: "100%"}}> 
                        <div id = "post-food">
                            <TextField
                                error={null}
                                label=""
                                placeholder="Food"
                                value={food}
                                helperText={null}
                                variant="outlined"
                                onChange={(e) => {setFood(e.target.value)}}
                                inputProps={{
                                    style: {
                                        width: "75%",                                                                    
                                    },
                                    maxLength: 50
                                    }}
                                />
                            </div>
                        <Typography variant = "h6">
                            {food.length} / 50
                        </Typography>
                    </Grid>
                    <Grid item xs = {12}> 
                        <Typography variant = "h6">
                            Food Invetory
                        </Typography>
                        <input type="range" class="form-range" min="0" max="10" step="1" id="food_left"/>
                    </Grid>
                    <Grid item xs = {12} className="auto-complete-box"> 
                        <GooglePlacesAutocomplete
                            apiKey = {mapsApi}
                            selectProps={{
                                locationData,
                                onChange: setLocationData,
                            }}
                            style={{
                                input: {
                                    width: "80%", 
                                },
                            }}
                            className="custom-autocomplete"
                        />
                    </Grid>
                    <Grid item xs = {12} style = {{width: "100%"}}> 
                        <div id = "post-description">
                            <TextField
                                multiline
                                rows={9}
                                maxRows={10}
                                error={null}
                                label=""
                                placeholder="Description (Optional)"
                                value={description}
                                helperText={null}
                                variant="outlined"
                                onChange={(e) => {setDescription(e.target.value)}}
                                inputProps={{
                                    style: {
                                        width: "100%",                                            
                                    },
                                    maxLength: 2000
                                    }}
                                />
                            </div>
                        <Typography variant = "h6">
                        {description.length} / 2000
                        </Typography>
                    </Grid>
                    <Grid item xs = {12} style = {{width: "100%"}}> 
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={handleCreatePostButtonPressed}
                            className = "card.button">
                            Post
                        </Button>  
                    </Grid>           
                </Grid>
            </div>
        </div>
      );
}

