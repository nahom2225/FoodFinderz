import React, { Component, useRef, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, AppBar, Toolbar, Card, CardActionArea, CardContent} from "@mui/material";
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate,} from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import AccountCard from "./AccountCard";
import { styled } from '@mui/material/styles';

export default function PostCardView(props) {

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const Container = styled(Grid)(({ theme }) => ({
      padding: theme.spacing(2),
    }));
    
    const Item = styled(Grid)(({ theme }) => ({
      marginBottom: theme.spacing(2),
    }));
    
    const Label = styled(Typography)(({ theme }) => ({
      fontWeight: "bold",
      marginRight: theme.spacing(1),
    }));

    const { post_id } = useParams();
    const [post, setPost] = useState({});
    const[account, setAccount] = useState({});
    const [showDeleteButton, setShowDeleteButton] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {     
        console.log(post_id)
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json"},
        };
        fetch(`${backendUrl}/api/get-post-info/${post_id}`, requestOptions, {
          credentials: 'include',  
          headers: new Headers({
            "ngrok-skip-browser-warning": "6024",
          }),
        })
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
        fetch(`${backendUrl}/api/get-account`, {
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
        fetch(`${backendUrl}/api/delete-post`, requestOptions, {
          credentials: 'include',  
          headers: new Headers({
            "ngrok-skip-browser-warning": "6024",
          }),
        }).
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
            <Grid item xs={6}>
              <Toolbar>
                <Typography variant="h4">Free Food Finderz</Typography>
              </Toolbar>
            </Grid>
            <Grid item xs={6} align="right">
              <AccountCard frontpage={true} {...account} />
            </Grid>
          </Grid>
        </AppBar>
        <Container container>
          <Item item xs={12} sm={6}>
            <Label>Poster:</Label>
            <Typography>{post.account_poster}</Typography>
          </Item>
          <Item item xs={12} sm={6}>
            <Label>Title:</Label>
            <Typography>{post.title}</Typography>
          </Item>
          <Item item xs={12} sm={6}>
            <Label>Food:</Label>
            <Typography>{post.food}</Typography>
          </Item>
          <Item item xs={12} sm={6}>
            <Label>Location:</Label>
            <Typography>{post.location}</Typography>
          </Item>
          <Item item xs={12}>
            <Label>Description:</Label>
            <Typography>{post.description}</Typography>
          </Item>
          <Item item xs={12}>
            {showDeleteButton && (
              <Button color="primary" variant="contained" onClick={deletePost}>
                Delete
              </Button>
            )}
          </Item>
          <Item item xs={12}>
            {showDeleteButton && (
              <Button color="secondary" variant="contained" onClick={editPost}>
                Edit
              </Button>
            )}
          </Item>
        </Container>
      </Grid>
      )

}