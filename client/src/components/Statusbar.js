import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Button, Typography } from '@mui/material'
import AuthContext from '../auth'
import AddIcon from '@mui/icons-material/Add';

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    let text = "";

    function handleCreateNewList() {
        store.createNewList();
    }
    
    if (auth.loggedIn) {
        if (store.currentList)
            text = store.currentList.name;
        else {
            text =
                <div>
                    <Button
                        onClick={handleCreateNewList}>
                        <AddIcon
                            id="add-list-icon"
                            sx={{ color: "black", fontSize: '40px' }}
                        >
                        </AddIcon>
                    </Button>
                    Your Lists
                </div>
                


        }
        return (
            <div id="playlister-statusbar">
                <Typography variant="h4">{text}</Typography>
            </div>
        );
    }
    else {
        return null;
    }


}

export default Statusbar;