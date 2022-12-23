import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    // eslint-disable-next-line
    const [draggedTo, setDraggedTo] = useState(0);
    const { song, index } = props;

    function handleDragStart(event) {
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
    function handleRemoveSong(event) {
        store.showRemoveSongModal(index, song);
    }

    function handleClick(event) {
        // DOUBLE CLICK IS FOR SONG EDITING
        if (event.detail === 2) {
            store.showEditSongModal(index, song);
        }
    }

    let removeSongButton;
    if (store.currentList.published === false) {
        removeSongButton = (
            <IconButton type='button' className="list-card-button" onClick={handleRemoveSong}>
                <DeleteIcon id={'remove-song-' + index} sx={{ color: 'white', fontSize: 'medium' }}></DeleteIcon>
            </IconButton>
        );
    }

    let cardClass = "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable={!store.currentList.published}
            onClick={handleClick}
        >
            {index + 1}. { }
            {song.title} by {song.artist}

            {removeSongButton}
        </div>
    );
}

export default SongCard;