import React, { Component, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, AppBar, Toolbar, Card, IconButton, LinearProgress} from '@material-ui/core'
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CreateIcon from '@material-ui/icons/Create';
import { makeStyles } from '@material-ui/core/styles';
import {withRouter} from "./withRouter";
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@mui/icons-material/Person';


export default withRouter(AccountCard);

function AccountCard(props) {

    const navigate = useNavigate();

    const useStyles = makeStyles((theme) => ({
    logoutButton: {
        color: theme.palette.primary.contrastText,
        '&:hover': {
        backgroundColor: theme.palette.primary.light,
        },
    },
    }));

    const classes = useStyles();

    const handleLogout = () => {
        console.log(props.username);
        fetch('/api/logout', { method: 'GET' })
        .then(response => {
          if (response.ok) {
            console.log('User logged out successfully');
            navigate(`/`);
          } else {
            console.log('An error occurred while logging out');
          }
        })
        .catch(error => console.log(error));
    };

    const handleAccountPage = () => {
        navigate(`/account/${props.username}`)
    }

    return(
        <Grid container alignItems = "center" className = "nav-buttons">
            <Grid item align = "center" xs = {3}>
                <IconButton onClick={() => {navigate('/frontpage')}} className = {classes.logoutButton}>
                    <HomeIcon color = "success"/>
                </IconButton>
            </Grid>
            <Grid item align = "center" xs = {3}>
                <IconButton onClick={() => {navigate('/create-post')}} className = {classes.logoutButton}>
                    <CreateIcon color="success"/>
                </IconButton>
            </Grid>
            <Grid item align = "center" xs = {3}>
                <IconButton onClick={handleLogout} className = {classes.logoutButton}>
                    <ExitToAppIcon color="success"/>
                </IconButton>
            </Grid>
            <Grid item align = "center" xs = {3}>
                <IconButton onClick={handleAccountPage} className = {classes.logoutButton}>
                    <PersonIcon/>
                    <Typography variant="subtitle2" style={{ marginLeft: '5px' }}>
                        {props.username}
                    </Typography>
                </IconButton>
            </Grid>
        </Grid>
    )

}

/*
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                username : props.username               
            }),
        };
        fetch('api/account', requestOptions)
        .then(response => {
          if (response.ok) {
            navigate(`/account/${props.username}`)
          } else {
            
          }
        })
        .catch(error => console.log(error));
*/