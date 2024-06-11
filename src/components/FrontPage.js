import React, { Component, useState, useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography, TextField, AppBar, Toolbar, Select, MenuItem, FormControl, InputLabel} from "@mui/material";
import { Map, Marker, GoogleApiWrapper } from "@react-google-maps/api";
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate,} from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import AccountCard from "./AccountCard";
import PostCard from "./PostCard";
import Geocode from "react-geocode";
import { Loader } from "@googlemaps/js-api-loader"
import { DisabledByDefaultRounded } from "@mui/icons-material";

export default function FrontPage(props) {
    
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [account, setAccount] = useState({});
  const [posts, setPosts] = useState([{}]);
  const [page, setPage] = useState(1);
  const [locations, setLocations] = useState([]);
  const [numberOfPosts, setNumberOfPosts] = useState(1);
  const [postPerPage, setPostPerPage] = useState(5);
  const [pageOffset, setPageOffset] = useState(0);

  //Geocode.setApiKey("AIzaSyB9XVnywutDApvjuKIIFPesDyHPmusHuxo");

  useEffect(() => {
    // code to run on component mount
    fetch('https://d035-2601-646-401-2670-3deb-26d5-e74e-521.ngrok-free.app/api/get-account').then((response) => {
      if (!response.ok){
        console.log("retrieve account error")
        props.clearAccountIdCallback();
        navigate("/");
      } else {
        response.json().then((data) => {
          setAccount(data);
          setUsername(data.username);
          console.log(data)
          console.log(data.username)
        })
      }
    })
    // cleanup function to run on component unmount
    return () => {
    };
  }, [navigate, props]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://d035-2601-646-401-2670-3deb-26d5-e74e-521.ngrok-free.app/api/get-posts/${page}/${postPerPage}`, {
          headers: new Headers({
            "ngrok-skip-browser-warning": "6024",
          }),
        });
        if (!response.ok) {
          // Handle error if needed
          console.error("Error fetching posts");
          return;
        }
        const data = await response.json();
        setPosts(data.results);
        setNumberOfPosts(data.count);
      } catch (error) {
        console.error("Error fetching and processing posts data", error);
      }
    };
  
    fetchData();
  
    console.log(posts)

    const prevLink = document.getElementById("prev");
    const nextLink = document.getElementById("next");
  

    if (page === 1) {
      prevLink.classList.add('disabled');
    } else if (prevLink.classList.contains("disabled")) {
      prevLink.classList.remove('disabled');
    }
  
    if (page === Math.ceil(numberOfPosts / postPerPage)) {
      nextLink.classList.add('disabled');
    } else if (nextLink.classList.contains("disabled")) {
      nextLink.classList.remove('disabled');
    }
  }, [page, numberOfPosts, postPerPage]);

  useEffect(() => {
    const pageFirst = document.getElementById("first");
    const pageSecond = document.getElementById("second");
    const pageThird = document.getElementById("third");
  
    switch (page) {
      case parseInt(pageFirst.innerText):
        pageFirst.classList.add("active");
        pageSecond.classList.remove("active");
        pageThird.classList.remove("active");   
        break;
      case parseInt(pageSecond.innerText):
        pageFirst.classList.remove("active");
        pageSecond.classList.add("active");
        pageThird.classList.remove("active");
        break;
      case parseInt(pageThird.innerText):
        pageFirst.classList.remove("active");
        pageSecond.classList.remove("active");
        pageThird.classList.add("active");
        break;
      default:
        break;
    }
  }, [page, numberOfPosts, postPerPage]);

  useEffect(() => {
    const pageSecond = document.getElementById("second");
    const pageThird = document.getElementById("third");
    const nextLink = document.getElementById("next");
  
    if (parseInt(pageSecond.innerText) > Math.ceil(numberOfPosts / postPerPage)) {
      pageSecond.classList.add("hidden");
      pageThird.classList.add("hidden")
    } else {
      pageSecond.classList.remove("hidden");
      pageThird.classList.remove("hidden")
    }
  
    if (parseInt(pageThird.innerText) > Math.ceil(numberOfPosts / postPerPage)) {
      pageThird.classList.add("hidden");
    } else {
      pageThird.classList.remove("hidden");
    }

    if (numberOfPosts === 0) {
        nextLink.classList.add("disabled")
    }
  }, [numberOfPosts, postPerPage]);

  // Geocode the addresses from the posts
  const geocodeAddresses = async () => {
    const geocodedPosts = [];

    for (const post of posts) {
      try {
        const response = await Geocode.fromAddress(post.location);
        const { lat, lng } = response.results[0].geometry.location;
        geocodedPosts.push({ lat: lat, lng: lng, post: post });
      } catch (error) {
        console.error("Error geocoding address:", error);
      }
    }
    //console.log(geocodedPosts)
    return geocodedPosts;
  };

  useEffect(() => {
    const updateLocations = async () => {
      const coords = await geocodeAddresses();
      setLocations(coords)
    };

    updateLocations();
    //initMap(locations);
  }, [posts]);

  // Map from gogle website

  let map;

  const loader = new Loader({
    apiKey: "AIzaSyB9XVnywutDApvjuKIIFPesDyHPmusHuxo",
    version: "weekly",
  });
  
  loader.load().then(async () => {
    const { Map } = await google.maps.importLibrary("maps");
  
    if (locations.length > 0) {
      map = new Map(document.getElementById("map"), {
        center: { lat: locations[0].lat, lng: locations[0].lng },
        zoom: 8,
      });
    }
  });

  useEffect(() => {
    for (const postInfo of locations) {
      let marker;
    
      if (postInfo) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(postInfo.lat, postInfo.lng),
          title: postInfo.post.title
        });
      }
      if (marker) {
        marker.setMap(map);
      }
    }
  }, [locations]);

  
  const handleNextPage = () => {
    const pageFirst = document.getElementById("first");
    const pageSecond = document.getElementById("second");
    const pageThird = document.getElementById("third");
    if (page - 2 == parseInt(pageFirst.innerText)) {
      setPageOffset(pageOffset + 1);
    }
    setPage(page + 1 > Math.ceil(numberOfPosts/postPerPage) ? Math.ceil(numberOfPosts/postPerPage) : page + 1);
  }

  const handlePrevPage = () => {
    const pageFirst = document.getElementById("first");
    const pageSecond = document.getElementById("second");
    const pageThird = document.getElementById("third");
    if (page + 2 == parseInt(pageThird.innerText)) {
      setPageOffset(pageOffset - 1);
    }
    setPage(page - 1 <= 0 ? 1 : page - 1);
  }



  const handleActive = (id) => {
    const ids = ["first", "second", "third"];
    for (const other_id of ids) {
      if (other_id !== id) {
        document.getElementById(other_id).classList.remove("active");
      }
    }
    const pageClicked = document.getElementById(id);
    const page = parseInt(pageClicked.innerText);
    if (!document.getElementById(id).classList.contains("active")){
    setPage(page)
    }
    pageClicked.classList.add("active");
  };

  return (
    <Grid container justifyContent="space-around" style = {{height: "100vh"}}>
      <AppBar sx={{ backgroundColor: "#3f51b5" }} className="app-bar" position="static">
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
      <Grid className = "post-control" item xs = {12}>
        <Typography variant="h5">All Posts!</Typography>
      </Grid>
      <Grid className = "post-control" item xs = {12}>
        <ul className="pagination">
          <li id="prev" className="page-item disabled">
            <a className="page-link" onClick={handlePrevPage}>Previous</a>
          </li>
          <li id="first" className="page-item active">
            <a className="page-link" onClick={() => handleActive("first")}>{1 + pageOffset}</a>
          </li>
          <li id="second" className="page-item">
            <a className="page-link" onClick={() => handleActive("second")}>{2 + pageOffset}</a>
          </li>
          <li id="third" className="page-item">
            <a className="page-link" onClick={() => handleActive("third")}>{3 + pageOffset}</a>
          </li>
          <li id="next" className="page-item">
            <a className="page-link" onClick={handleNextPage}>Next</a>
          </li>
        </ul>
      </Grid>
      <Grid item xs={9} className = "map-container">
        <div id="map"></div>
      </Grid>
      <Grid item xs={3} className="posts-container">          
        {posts.map(post => (<PostCard key={post.id} owner = {post.account_poster == username ? true : false} {...post} />))}
      </Grid>
    </Grid>
  );

}

