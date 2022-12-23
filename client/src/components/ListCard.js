import { useContext, useState } from 'react'
import * as React from 'react';
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import PublishIcon from '@mui/icons-material/Publish';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import { ButtonGroup, Typography, Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditToolbar from './EditToolbar';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MUIDeleteModal from './MUIDeleteModal';
import SongCard from './SongCard';
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const { idNamePair } = props;
    const [text, setText] = useState(idNamePair.name);
    const [expanded, setExpanded] = React.useState(false);

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);

            // setOpenActive(!openActive);

        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleDuplicatePlaylist() {
        handleCloseList();
        store.createNewList(idNamePair.name, idNamePair.songs);
    }

    function handleCloseList() {
        store.closeCurrentList();
    }

    function handlePublishList(event) {
        event.stopPropagation();
        store.publishList();
    }

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    let songCard;
    if (store.currentList) {
        songCard =
            (
                <Box>
                    < List disablePadding
                        id="playlist-cards"
                        sx={{ width: '100%' }
                        }
                    >
                        {
                            store.currentList.songs.map((song, index) => (
                                <SongCard
                                    id={'playlist-song-' + (index)}
                                    key={'playlist-song-' + (index)}
                                    index={index}
                                    song={song}
                                />
                            ))
                        }
                    </List >
                    {modalJSX}
                </Box>
            )
    }

    let cardElement;
    if (idNamePair.published === false) {
        cardElement =
            <Box
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{ width: '100%', borderRadius: '5px', paddingBottom: '10px' }}
            >
                <ListItem
                    id={idNamePair._id}
                    key={idNamePair._id}
                    sx={{ height: '20%', p: 1, flexWrap: 'wrap', bgcolor: 'gray', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', borderTopRightRadius: '5px', borderTopLeftRadius: '5px' }}
                >
                    <Box
                        id='playlist-card-top'
                        onDoubleClick={handleToggleEdit}
                    >
                        <Typography sx={{ pr: 10, pl: 1, fontSize: 30, fontWeight: 'bold', width: '100%' }}> {idNamePair.name} </Typography>
                        <br></br>
                        <Typography sx={{ pl: 1, fontSize: 18 }}>
                            By: {idNamePair.ownerUsername}
                            <br></br>
                            <br></br>
                            <br></br>

                        </Typography>
                    </Box>

                    <Accordion
                        // expanded={expanded === idNamePair._id}
                        id={idNamePair._id}
                        elevation={0}
                        sx={{ bgcolor: 'gray', width: '100%' }}
                        onChange={(event, expanded) => {
                            if (expanded) {
                                handleLoadList(event, idNamePair._id)
                                console.log(store.currentList)
                            }
                            else if (!expanded) {
                                handleCloseList()
                            }
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                        </AccordionSummary>
                        <AccordionDetails>
                            {songCard}
                            <EditToolbar />
                            <MUIDeleteModal />
                            <ButtonGroup sx={{ margin: '10px' }} variant="contained" aria-label="outlined button group" >

                                <IconButton onClick={(event) => { handleDeleteList(event, idNamePair._id) }} aria-label='delete playlist'>
                                    <DeleteIcon></DeleteIcon>
                                </IconButton>

                                <IconButton onClick={handlePublishList} aria-label='publish playlist'>
                                    <PublishIcon></PublishIcon>
                                </IconButton>

                                <IconButton onClick={handleDuplicatePlaylist} aria-label='duplicate playlist'>
                                    <ContentCopyIcon></ContentCopyIcon>
                                </IconButton>

                            </ButtonGroup>
                        </AccordionDetails>
                    </Accordion>
                </ListItem>
            </Box>
    }
    else {
        cardElement =
            <Box
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{ width: '100%', borderRadius: '5px', paddingBottom: '10px' }}
            >
                <ListItem
                    id={idNamePair._id}
                    key={idNamePair._id}
                    sx={{ height: '20%', p: 1, flexWrap: 'wrap', bgcolor: 'gray', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px', borderTopRightRadius: '5px', borderTopLeftRadius: '5px' }}
                >
                    <Box
                        id='playlist-card-top'
                        onDoubleClick={handleToggleEdit}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <Box>
                                <Typography sx={{ pr: 10, pl: 1, fontSize: 30, fontWeight: 'bold', width: '100%' }}> {idNamePair.name} </Typography>
                            </Box>

                            <Box sx={{ pr: 10, pl: 2, fontSize: 18 }}>
                                <IconButton sx={{ fontSize: 30 }}>
                                    <ThumbUpAltIcon sx={{ fontSize: 30 }}></ThumbUpAltIcon>
                                </IconButton> {idNamePair.likes}

                                <IconButton sx={{ fontSize: 30 }}>
                                    <ThumbDownAltIcon sx={{ fontSize: 30 }}></ThumbDownAltIcon>
                                </IconButton> {idNamePair.dislikes}
                            </Box>
                        </Box>

                        <Typography sx={{ pl: 1, fontSize: 18 }}>
                            By: {idNamePair.ownerUsername}
                            <br></br>
                            Published: {idNamePair.publishedDate}
                            <br></br>
                            Listens: {idNamePair.listens}
                        </Typography>

                    </Box>

                    <Accordion
                        id={idNamePair._id}
                        elevation={0}
                        sx={{ bgcolor: 'gray', width: '100%' }}
                        onChange={(event, expanded) => {
                            if (expanded) {
                                handleLoadList(event, idNamePair._id)
                            }
                            else if (!expanded) {
                                handleCloseList()
                            }
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                        </AccordionSummary>
                        <AccordionDetails>
                            {songCard}
                            <MUIDeleteModal />
                            <ButtonGroup sx={{ margin: '10px' }} variant="contained" aria-label="outlined button group" >

                                <IconButton onClick={(event) => { handleDeleteList(event, idNamePair._id) }} aria-label='delete playlist'>
                                    <DeleteIcon></DeleteIcon>
                                </IconButton>

                                <IconButton onClick={handleDuplicatePlaylist} aria-label='duplicate playlist'>
                                    <ContentCopyIcon></ContentCopyIcon>
                                </IconButton>

                            </ButtonGroup>
                        </AccordionDetails>
                    </Accordion>
                </ListItem>
            </Box>
    }


    if (editActive) {
        if (idNamePair.published === false) {
            cardElement =
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id={"list-" + idNamePair._id}
                    label="Playlist Name"
                    name="name"
                    autoComplete="Playlist Name"
                    className='list-card'
                    onKeyPress={handleKeyPress}
                    onChange={handleUpdateText}
                    defaultValue={idNamePair.name}
                    InputProps={{ style: { fontSize: 48 } }}
                    InputLabelProps={{ style: { fontSize: 24 } }}
                    autoFocus
                />
        }

    }
    return (
        cardElement
    );
}

export default ListCard;