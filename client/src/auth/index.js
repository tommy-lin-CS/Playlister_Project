import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_ERROR: "LOGIN_ERROR",
    REGISTER_ERROR: "REGISTER_ERROR",
    HIDE_ERROR_MODAL: "HIDE_ERROR_MODAL",
    GUEST_LOGIN_ACCESS: "GUESS_LOGIN_ACCESS"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        guest: false,
        loggedIn: false,
        loginError: null,
        registerError: null
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    guest: false,
                    loggedIn: payload.loggedIn,
                    loginError: null,
                    registerError: null
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    guest: false,
                    loggedIn: true,
                    loginError: null,
                    registerError: null
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    guest: false,
                    loggedIn: false,
                    loginError: null,
                    registerError: null
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    guest: false,
                    loggedIn: true,
                    loginError: null,
                    registerError: null
                })
            }
            case AuthActionType.LOGIN_ERROR: {
                return setAuth({
                    user: null,
                    guest: false,
                    loggedIn: auth.loggedIn,
                    loginError: payload.errorMessage,
                    registerError: null
                })
            }
            case AuthActionType.REGISTER_ERROR: {
                return setAuth({
                    user: null,
                    loggedIn: auth.loggedIn,
                    loginError: null,
                    registerError: payload.errorMessage
                })
            }
            case AuthActionType.HIDE_ERROR_MODAL: {
                return setAuth({
                    user: null,
                    guest: false,
                    loggedIn: auth.loggedIn,
                    loginError: null,
                    registerError: null
                })
            }
            case AuthActionType.GUEST_LOGIN_ACCESS: {
                return setAuth({
                    user: payload.user,
                    guest: true,
                    loggedIn: true,
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function (username, firstName, lastName, email, password, passwordVerify) {
        const response = await api.registerUser(username, firstName, lastName, email, password, passwordVerify)
            .catch((err) => {
                return err.response;
            });
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
        }
        else {
            console.log(response.data.errorMessage)
            auth.showRegisterErrorModal(response.data.errorMessage);
        }
    }

    auth.loginUser = async function (email, password) {
        const response = await api.loginUser(email, password)
            .catch((err) => {
                return err.response;
            });
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
        }
        else if (response.status === 400 || response.status === 401) {
            console.log(response.data.errorMessage)
            auth.showLoginErrorModal(response.data.errorMessage);
        }
    }

    auth.guestLogin = async function () {
        authReducer({
            type: AuthActionType.GUEST_LOGIN_ACCESS,
            payload: {}
        });
        history.push("/");
    }

    auth.logoutUser = async function () {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function () {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    }

    auth.showLoginErrorModal = function (errorMessage) {
        authReducer({
            type: AuthActionType.LOGIN_ERROR,
            payload: { errorMessage: errorMessage }
        })
    }

    auth.showRegisterErrorModal = function (errorMessage) {
        console.log(errorMessage)
        authReducer({
            type: AuthActionType.REGISTER_ERROR,
            payload: { errorMessage: errorMessage }
        })
    }

    auth.hideErrorModals = function () {
        authReducer({
            type: AuthActionType.HIDE_ERROR_MODAL,
            payload: null
        })
    }

    auth.guestUser = async function () {
        try {
            let response = await api.registerUser("guest", "guest", "user", "guest@noemail.email", "password", "password");
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.GUEST_LOGIN_ACCESS,
                    payload: {
                        user: response.data.user
                    }
                })
                response = await api.loginUser("guest@noemail.email", "password");
                if (response.status === 200) {
                    authReducer({
                        type: AuthActionType.GUEST_LOGIN_ACCESS,
                        payload: {
                            user: response.data.user
                        }
                    })
                }
            }
        } catch (error) {
            let response = await api.loginUser("guest@noemail.email", "password");
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.GUEST_LOGIN_ACCESS,
                    payload: {
                        user: response.data.user
                    }
                })
            }
        }
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };