import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import ListCard from './ListCard.js'
import List from '@mui/material/List';
import { Typography, Box, Tabs, Tab, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import YouTubePlayer from './YouTubePlayer';
import HomeBar from './HomeBar';

/*
    This React component lists all the playlist lists in the UI.
    
    @author Tommy Lin
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);


    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    let listCard = "";
    if (store) {
        listCard = 
            <List disablePadding sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }

    // Source code adopted from MUI Tabs
    function TabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
            <div
              role="tabpanel"
              hidden={value !== index}
              id={`simple-tabpanel-${index}`}
              aria-labelledby={`simple-tab-${index}`}
              {...other}
            >
              {value === index && (
                <Box sx={{ p: 0}}>
                  <Typography>{children}</Typography>
                </Box>
              )}
            </div>
          );
        }
        TabPanel.propTypes = {
          children: PropTypes.node,
          index: PropTypes.number.isRequired,
          value: PropTypes.number.isRequired,
        };
        
        function a11yProps(index) {
          return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
          };
    }
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div id="homescreen">

            <HomeBar />

            <div id="homescreen-sections">
                <div id="list-selector-list">
                    {listCard}
                </div>
                <div id="player-comment-selector">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Player" {...a11yProps(0)} />
                        <Tab label="Comments" {...a11yProps(1)} />
                    </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                    {/* <YouTubePlayer /> */}
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                    <TextField></TextField>
                    </TabPanel>
                </div>
            </div>
                
        </div>
    );
}

export default HomeScreen;