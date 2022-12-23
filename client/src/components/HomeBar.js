import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import { Box, Button, IconButton, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SortIcon from '@mui/icons-material/Sort';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';

/*
    This React component displays and functions the selection home bar when the user logs in.
    
    @author Tommy Lin
*/
const HomeBar = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isDropdownOpen = Boolean(anchorEl);

    const handleDropdownOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDropdownClose = (event) => {
        setAnchorEl(null);
    };

    const handleClickHomeButton = () => {
        store.homePage();
    };

    const handleClickAllListsButton = () => {

    };

    const handleClickAllUsersButton = () => {

    };

    // Home Button functionality different depending on the user logged in (guest or not)
    let homeButton;

    if (auth.user.username !== "Guest") {
        homeButton = (
            <IconButton
                aria-label="home"
                id="home-button"
                style={{ color: "black" }}
                onClick={handleClickHomeButton}
            >
                <HomeIcon style={{ fontSize: 45 }} />
            </IconButton>
        );
    }
    else {
        homeButton = (
            <IconButton
                disabled
                aria-label="home"
                id="home-button"
                style={{ color: "gray" }}
            >
                <HomeIcon style={{ fontSize: 45 }} />
                
            </IconButton>
        );
    }

    let searchBar = (
        <form id="search-bar">
            <TextField
                id="search-field"
                className="text"
                variant='outlined'
                placeholder='Search...'
                sx={{ width: 500 }}
            />
            <IconButton type="submit" aria-label="search">
                <SearchIcon style={{ fill: "black", fontSize: 40 }} />
            </IconButton>
        </form>
    );

    let allPlaylistsButton = (
        <IconButton
            aria-label="all-playlists"
            id="all-playlists-button"
            style={{ color: "black" }}
        >
            <GroupsIcon style={{ fontSize: 45 }} />
        </IconButton>
    );

    let allUsersButton = (
        <IconButton
            aria-label="all-users"
            id="all-users-button"
            style={{ color: "black" }}
        >
            <PersonIcon style={{ fontSize: 45 }} />
        </IconButton>
    );

    let dropdown = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id='primary-search-account-menu'
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isDropdownOpen}
            onClose={handleDropdownClose}
        >
            <MenuItem onClick={handleDropdownClose}>Name &#40;A - Z&#41;</MenuItem>
            <MenuItem onClick={handleDropdownClose}>Publish Date &#40;Newest&#41;</MenuItem>
            <MenuItem onClick={handleDropdownClose}>Listens &#40;High - Low&#41;</MenuItem>
            <MenuItem onClick={handleDropdownClose}>Likes &#40;High - Low&#41;</MenuItem>
            <MenuItem onClick={handleDropdownClose}>Dislikes &#40;High - Low&#41;</MenuItem>
        </Menu>
    );

    return (
        <div style={{ width: '100%' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    m: 1,
                    borderRadius: 1,
                }}
            >

                <Box>
                    {homeButton}
                    {allPlaylistsButton}
                    {allUsersButton}
                </Box>

                <Box>
                    {searchBar}
                </Box>

                <Box>
                    <Button
                        aria-label="sort by"
                        aria-controls='primary-search-account-menu'
                        onClick={handleDropdownOpen}
                        endIcon={<SortIcon style={{ fontSize: 45 }} />}
                        sx={{ color: 'black', fontSize: 20, fontWeight: 'bold', flexGrow: 1 }}
                    >
                        Sort By
                    </Button>
                    {dropdown}
                </Box>
                
            </Box>
        </div>
    );
}


export default HomeBar;