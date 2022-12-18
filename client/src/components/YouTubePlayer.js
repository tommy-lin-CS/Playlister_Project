import React from 'react';
import { useContext, useState } from 'react';
import YouTube from 'react-youtube';
import { Box, Typography, ButtonGroup, IconButton } from '@mui/material'
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import GlobalStoreContext from '../store';

export default function YoutubePlayer() {
    const { store } = useContext(GlobalStoreContext);
    const [currentSong, setCurrentSong] = useState(0);
    const [eventTarget, setEventTarget] = useState();
    let name = "";
    let title = "";
    let artist = "";
    let songIndex = "";
    let playlist = [];

    if (store.currentList && store.currentList.songs) {
        playlist = store.currentList.songs.map((song) => (song.youTubeId));
        name = store.currentList.name;
        if (store.currentList.songs.length !== 0) {
            title = store.currentList.songs[currentSong].title;
            artist = store.currentList.songs[currentSong].artist;
            songIndex = currentSong + 1
        }
    }

    const playerOptions = {
        height: '290',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
    }

    // THIS FUNCTIONS HANDLES PLAY SONG
    function handlePlaySong() {
        eventTarget.playVideo();
    }

    function handleStopSong() {
        eventTarget.pauseVideo();
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function skipSong() {
        if(currentSong !== store.currentList.songs.length - 1) {
            let i = currentSong+1;
            setCurrentSong(i);
        }
    }

    function prevSong () {
        if(currentSong !== 0) {
            let i = currentSong - 1
            setCurrentSong(i);
        }
    }

    function onPlayerReady(event) {
        setEventTarget(event.target);
        event.target.playVideo();
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            skipSong(player);
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
            eventTarget.playVideo();
        }
    }

    return (
        <div>
            <YouTube
                videoId={playlist[currentSong]}
                opts={playerOptions}
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange}
            />
            <Box id="song-info" >
                <Typography sx={{ pl: 1, pt: 1, fontWeight: 'bold' }}>Playlist: {name}</Typography>
                <Typography sx={{ pl: 1, fontWeight: 'bold' }}>Song #: {songIndex}</Typography>
                <Typography sx={{ pl: 1, fontWeight: 'bold' }}>Title: {title}</Typography>
                <Typography sx={{ pl: 1, fontWeight: 'bold' }}>Artist: {artist}</Typography>
            </Box>
            <Box id="player-buttons" display="flex" justifyContent="center">
                <ButtonGroup variant="contained" aria-label="outlined button group" >
                    <IconButton onClick={ prevSong }><FastRewindIcon></FastRewindIcon></IconButton>
                    <IconButton onClick={ handleStopSong }><PauseIcon></PauseIcon></IconButton>
                    <IconButton onClick={ handlePlaySong }><PlayArrowIcon></PlayArrowIcon></IconButton>
                    <IconButton onClick={ skipSong }><FastForwardIcon ></FastForwardIcon></IconButton>
                </ButtonGroup>
            </Box>

        </div>
    )


}