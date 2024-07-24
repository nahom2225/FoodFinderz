import React, { Component, useState, useEffect, useRef} from "react";
import { Grid, Typography, Card, CardActionArea, CardContent, IconButton } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { green, red } from "@mui/material/colors";

const StyledCard = styled(Card)(({ theme }) => ({
  

  color: theme.palette.primary.main,
  '&:hover': {
    border: '3px solid #3f51b5',
    borderRadius: '4px',
    boxShadow: 'none'
  },
  border: '2px solid gray',
  borderRadius: '10px',
}));

const StyledVoteContainer = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f1f1f1",
  padding: theme.spacing(1),
  borderTopLeftRadius: "10px",
  borderBottomLeftRadius: "10px",
}));

const StyledPostContent = styled(Grid)(({ theme }) => ({
  paddingLeft: theme.spacing(0),
  flexGrow: 1,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}));

const StyledIconButtonClicked = styled(IconButton)(({ color }) => ({
  color,
}));

export default function PostCard(props) {
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const[votes, setVotes] = useState(props.votes)
  const[upvote, setUpvote] = useState(false)
  const[downvote, setDownvote] = useState(false)
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/getCSRFToken`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error("Failed to fetch CSRF token");
        }
        const jsonResponse = await response.json();
        console.log("CSRFToken: ", jsonResponse["token"]);
        setCsrftoken(jsonResponse["token"]);
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    const fetchAccountData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/get-account`, {
          credentials: 'include',
          headers: {
            "ngrok-skip-browser-warning": "6024",
            'X-CSRFToken': csrftoken,
            "SameSite": "None"
          },
        });
        if (!response.ok) {
          console.log("retrieve account error");
          props.clearAccountIdCallback();
          navigate("/");
          return;
        }
        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
      }
    };

    const fetchPostVote = async () => {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json"},
    };
    fetch(`${backendUrl}/api/get-post-vote/${props.post_id}/${username}`, requestOptions, {
      credentials: 'include',  
      headers: new Headers({
        "ngrok-skip-browser-warning": "6024",
      }),
    }).
    then((response) => {
        if (!response.ok){
          console.log("OH OOHHH")          
        } else {
          response.json().then((data) => {
            setUpvote(data["upvote"]);
            setDownvote(data["downvote"]);
          })
        }})
    };

    fetchCSRFToken().then(fetchAccountData).then(fetchPostVote);
  }, [navigate, props, votes]);


  function handleClick() {
    navigate(`/frontpage/${props.post_id}`);
  }

  function handleUpVote() {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            post_id : props.post_id               
        }),
    };
    fetch(`${backendUrl}/api/post-vote/${1}`, requestOptions, {
      credentials: 'include',  
      headers: new Headers({
        "ngrok-skip-browser-warning": "6024",
      }),
    }).
    then((response) => {
        if (!response.ok){
          console.log("OH OOHHH")          
        } else {
          response.json().then((data) => {
            setVotes(data["votes"]);
            setUpvote(data["upvote"]);
            setDownvote(data["downvote"]);
          })
        }})
  }

  function handleDownVote() {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            post_id : props.post_id               
        }),
    };
    fetch(`${backendUrl}/api/post-vote/${0}`, requestOptions, {
      credentials: 'include',  
      headers: new Headers({
        "ngrok-skip-browser-warning": "6024",
      }),
    }).
    then((response) => {
        if (!response.ok){
          console.log("OH OOHHH")          
        } else {
          response.json().then((data) => {
            setVotes(data["votes"]);
            setUpvote(data["upvote"]);
            setDownvote(data["downvote"]);
          })
        }})
  }

  return (
    <StyledCard>
      <Grid container>
        <StyledVoteContainer item xs={2}>
          <StyledIconButton onClick={handleUpVote} className={upvote ? 'clicked' : ''}>
            <ArrowUpward />
          </StyledIconButton>
          <Typography>{votes}</Typography>
          <StyledIconButton onClick={handleDownVote} className={downvote ? 'clicked' : ''}>
            <ArrowDownward />
          </StyledIconButton>
        </StyledVoteContainer>
        <StyledPostContent item xs={10}>
          <CardActionArea onClick={handleClick}>
            <CardContent>
              <Typography>Poster: {props.account_poster}</Typography>
              <Typography>Title: {props.title}</Typography>
              <Typography>Food: {props.food}</Typography>
              <Typography>Location: {props.location}</Typography>
              <input type="range" className="form-range" min="0" max="10" step="1" id="food_left" value={props.food_left} disabled />
            </CardContent>
          </CardActionArea>
        </StyledPostContent>
      </Grid>
    </StyledCard>
  );
}
