import PlaylisterLogo from '../assets/playlisterlogo.png'
import { Button } from "@mui/material"

// HANDLES REGISTER BUTTON CLICKED
let handleRegister = () => {
    window.location.href += "register";
}

// HANDLES LOGIN BUTTON CLICKED
let handleLogin = () => {
    window.location.href += "login"
}

// HANDLES GUEST BUTTON CLICKED
let handleGuest = () => {
    // TODO: GUEST HANDLER
}

export default function SplashScreen() {

    const buttonStyle = {
        width: '200px', 
        height:"75px", 
        borderRadius: "10px", 
        backgroundColor: "#ffffff",
        color: "#000000",
        fontSize: "18px",
        margin: "10px"
    }

    return (
        <div id="splash-screen">
            <div>
                <img alt="playlister-logo" src={PlaylisterLogo} />
            </div>
            <div id="welcome-message">
                <p id="app-purpose-message">CREATE.LISTEN.SHARE 🎵</p>
                <p>Your #1 all-in-one place to create, listen, and share your favorite music with your friends and family.</p>
            </div>
            <div id="splash-screen-buttons">
                <Button sx={ buttonStyle } variant="contained" onClick={handleLogin}>LOGIN</Button>
                <Button sx={ buttonStyle } variant="contained" onClick={handleRegister}>CREATE ACCOUNT</Button>
                <Button sx={ buttonStyle } variant="contained" onClick={handleGuest}>CONTINUE AS GUEST</Button>
            </div>
            <div id="splash-page-footer">
                <p>Developed By Tommy Lin</p>
            </div>
        </div>
    )
}