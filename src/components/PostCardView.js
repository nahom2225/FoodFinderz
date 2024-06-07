import React, { Component, useRef, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, AppBar, Toolbar, Card, CardActionArea, CardContent} from "@mui/material";
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate,} from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import AccountCard from "./AccountCard";
import { makeStyles } from '@mui/styles';

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
    const [showDeleteButton, setShowDeleteButton] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {     
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
                //console.log(data);
              })
            }
          })

        return () => {
        };
      }, [post_id]);

  

      const isInitialRender = useRef(true);

      useEffect(() => {
          if (isInitialRender.current) {
              isInitialRender.current = false;
              return;
          }

          setShowDeleteButton(post.account_poster === account.username);
      }, [post, account]);



      function deletePost () {
        const requestOptions = {
          method: "DELETE",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({
              post_id : post.post_id               
          }),
        };
        fetch(`/api/delete-post`, requestOptions).
        then((response) => {
            if (!response.ok){
              console.log("OH OOHHH")          
            } else {
              console.log("deleted")
              navigate(`/frontpage`)
              }})
        }
        
        function editPost() {
          navigate(`/edit-post/${post.account_poster}/${post_id}`, {
            state: { post: post }
          });
        }
          
      

      return (
    <Grid container>
          <AppBar position="static">
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
            <Grid item xs={12} className={classes.item}>
                {showDeleteButton && (
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={deletePost}
                    >
                        Delete
                    </Button>
                )}
            </Grid>
            <Grid item xs={12} className={classes.item}>
                {showDeleteButton && (
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={editPost}
                    >
                        Edit
                    </Button>
                )}
            </Grid>
        </Grid>
    </Grid>
      )

}