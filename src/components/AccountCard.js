import React, { Component, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, AppBar, Toolbar, Card, IconButton, LinearProgress} from "@mui/material";
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CreateIcon from '@mui/icons-material/Create';
import { styled } from '@mui/material/styles';
import {withRouter} from "./withRouter";
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';


export default withRouter(AccountCard);

function AccountCard(props) {

    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const StyledIconButton = styled(IconButton)(({ theme }) => ({
        color: theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
        },
      }));

    const handleLogout = () => {
        console.log(props.username);
        fetch(`${backendUrl}/api/logout`, { 
            method: 'GET', 
            credentials: 'include',  
            headers: new Headers({
            "ngrok-skip-browser-warning": "6024",
          })})
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
        <Grid container alignItems="center" className="nav-buttons">
            <Grid item align="center" xs={3}>
                <StyledIconButton onClick={() => { navigate('/frontpage') }}>
                    <HomeIcon sx={{ color: "#ffffff" }} color="success" />
                </StyledIconButton>
            </Grid>
            <Grid item align="center" xs={3}>
                <StyledIconButton onClick={() => { navigate('/create-post') }}>
                    <CreateIcon sx={{ color: "#ffffff" }} color="success" />
                </StyledIconButton>
            </Grid>
            <Grid item align="center" xs={3}>
                <StyledIconButton onClick={handleLogout}>
                    <ExitToAppIcon sx={{ color: "#ffffff" }} color="success" />
                </StyledIconButton>
            </Grid>
            <Grid item align="center" xs={3}>
            <StyledIconButton onClick={handleAccountPage}>
                <PersonIcon />
                <Typography variant="subtitle2" style={{ marginLeft: '5px' }}>
                {props.username}
                </Typography>
            </StyledIconButton>
            </Grid>
        </Grid>
    )

}

