import React, { Component, useState, useEffect} from "react";
import { Grid, ButtonGroup, Typography, TextField, AppBar, Toolbar, Card, IconButton, LinearProgress, Box, Collapse} from "@mui/material";
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate , useLocation} from "react-router-dom";
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

export default function EditPost(props) {

    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const mapsApi = process.env.REACT_APP_MAPS_API;

    const { op, post_id } = useParams();

    const { post } = useLocation().state || {};

    const [username, setUsername] = useState('');
    const [account, setAccount] = useState({});
    const [title, setTitle] = useState(post.title || "");
    const [food, setFood] = useState(post.food || "");
    const [locationData, setLocationData] = useState(post.location || "");
    //const [locationData, setLocationData] = useState({});
    const [description, setDescription] = useState(post.description || "");
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
            if (op != data.username) {
                navigate("/")
            }
            setAccount(data);
            setUsername(data.username);})
        }})
        console.log(post)
        console.log('title:', title);
        console.log('food:', food);
        console.log('location:', locationData);
        console.log('description:', description);
        console.log('username:', username);
      return () => {
      };
    }, [post]);

    var cardStyle = {
        display: 'block',
        width: '50vw',
        transitionDuration: '0.3s',
    }

    function handleEditPostButtonPressed() {        
        console.log('food_left:', document.getElementById("food_left").value );
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                title : title, 
                food : food,
                location : locationData,
                description : description,
                account_poster : username,          
                food_left: document.getElementById("food_left").value    
            }),
        };
        fetch(`${backendUrl}/api/edit-post/${post_id}`, requestOptions, {
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
                        <Typography variant="h5"> Edit Your Post! </Typography>
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
                        <input type="range" class="form-range" min="0" max="10" step="1" value = {post.food_left} id="food_left"/>
                    </Grid>
                    <Grid item xs = {12} className="auto-complete-box"> 
                        <GooglePlacesAutocomplete
                            apiKey = {mapsApi}
                            selectProps={{
                                defaultInputValue: locationData,
                                onChange: (selected) => setLocationData(selected.label),
                                placeholder: "Post Location"
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
                            onClick={handleEditPostButtonPressed}
                            className = "card.button">
                            Edit Post
                        </Button>  
                    </Grid>           
                </Grid>
            </div>
        </div>
      );
}

