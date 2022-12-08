import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import IconButton from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import { ButtonGroup } from '@mui/material';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    let isModalOpen = store.currentSong !== null

    function handleAddNewSong() {
        store.addNewSong();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }

    return (
        <div id="edit-toolbar">
            <ButtonGroup sx={{ margin: '10px'}} variant="contained" aria-label="outlined button group" >
                <IconButton
                    disabled={ isModalOpen }
                    id='add-song-button'
                    onClick={handleAddNewSong}
                    variant="contained">
                    <AddIcon />
                </IconButton>
                <IconButton
                    disabled={!store.canUndo() || isModalOpen}
                    id='undo-button'
                    onClick={handleUndo}
                    variant="contained">
                    <UndoIcon />
                </IconButton>
                <IconButton
                    disabled={!store.canRedo() || isModalOpen}
                    id='redo-button'
                    onClick={handleRedo}
                    variant="contained">
                    <RedoIcon />
                </IconButton>
            </ButtonGroup>

        </div>
    )
}

export default EditToolbar;