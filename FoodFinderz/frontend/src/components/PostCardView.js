import React, { Component, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, AppBar, Toolbar, Card, CardActionArea, CardContent} from '@material-ui/core'
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate,} from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import AccountCard from "./AccountCard";
import { makeStyles } from '@material-ui/core/styles';

export default function PostCardView(props) {

    const useStyles = makeStyles((theme) => ({
        container: {
          padding: theme.spacing(2),
        },
        item: {
          marginBottom: theme.spacing(2),
        },
        label: {
          fontWeight: "bold",
          marginRight: theme.spacing(1),
        },
      }));

    const { post_id } = useParams();
    const [post, setPost] = useState({});
    const classes = useStyles();
    const[account, setAccount] = useState({});


    useEffect(() => {
        // code to run on component mount        
        console.log(post_id)
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json"},
        };
        fetch(`/api/get-post-info/${post_id}`, requestOptions)
        .then((response) => {
            if (response.ok) {
                response.json()
                .then((data) => {
                    setPost(data)
                    console.log(post);})
            } else if (response.status === 409) {
                response.json().then((data) => {setError(data.error)
                    console.log(data.error);});
                    console.log(response.statusText);
                    console.log("409")
            
            } else if (response.status === 404) {
                response.json().then((data) => {setError(data.error);
                    console.log(data.error);});
                    console.log(response.statusText);
                    console.log("404")
            }
        })
        fetch('/api/get-account').then((response) => {
            if (!response.ok){
              console.log("OH OOHHH")
              props.clearAccountIdCallback();
              navigate("/");
            } else {
              response.json().then((data) => {
                setAccount(data);
                setUsername(data.username);
                //console.log(data);
              })
            }
          })
        // cleanup function to run on component unmount
        return () => {
        };
      }, [post_id]);

      return (
    <Grid container>
        <AppBar position="static">
            <Grid container>
            <Grid item xs = {12} sm = {3}>
                <Toolbar>
                <Typography variant="h4">Food Finderz</Typography>
                </Toolbar>
            </Grid>
            <Grid item xs={12} sm={9} align="right">
                <AccountCard frontpage = {true} {...account}/>
            </Grid>
            </Grid>
        </AppBar>
        <Grid container className={classes.container}>
            <Grid item xs={12} sm={6} className={classes.item}>
                <Typography className={classes.label}>Poster:</Typography>
                <Typography>{post.account_poster}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.item}>
                <Typography className={classes.label}>Title:</Typography>
                <Typography>{post.title}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.item}>
                <Typography className={classes.label}>Food:</Typography>
                <Typography>{post.food}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.item}>
                <Typography className={classes.label}>Location:</Typography>
                <Typography>{post.location}</Typography>
            </Grid>
            <Grid item xs={12} className={classes.item}>
                <Typography className={classes.label}>Description:</Typography>
                <Typography>{post.description}</Typography>
            </Grid>
        </Grid>
    </Grid>
      )

}