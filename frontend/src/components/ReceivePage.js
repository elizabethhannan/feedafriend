import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import GoogleLogin from 'react-google-login';
import RecipientForm from './RecipientInfo/RecipientForm';
import RecipientPortal from './RecipientPortal';
import Landing from '../components/RecipientInfo/Landing';
import Profile from '../components/Profile.js';

function ReceivePage(props) {

    // state is the user is new, if so display them the login page
    const [isNewUser, setIsNewUser] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [idtoken, setIdtoken] = useState("");
    const [profileData, setProfileData] = useState(null);

    function responseGoogle(response) {
        setIdtoken(response.getAuthResponse().id_token);
        const data = {
            idtoken: response.getAuthResponse().id_token
        }
        // fetch('http://care37-cors-anywhere.herokuapp.com/http://lvh.me:5000/login', {
        fetch('https://care37-cors-anywhere.herokuapp.com/https://care37.herokuapp.com/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        }).then(
            function (res) {
                if (res.status == 200) {
                    res.json().then(data => {
                        // sets if the user who logged in is new or not
                        console.log(data.user_exists);
                        if (data.user_exists) {
                            getProfile(idtoken)
                        }
                        setIsNewUser(!data.user_exists);
                        setIsLoggedIn(true);
                    });
                } else if (res.status == 400) {
                    alert("The server was unable to authenticate you");
                } else {
                    alert("The server was unable to authenticate you");
                }
            }
        )
    }

    function getProfile() {
        const data = {
            idtoken: props.idtoken
        }

        fetch(`https://care37-cors-anywhere.herokuapp.com/https://care37.herokuapp.com/getRecipientProfile?idtoken=${encodeURIComponent(data.idtoken)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(
            function (response) {
                if (response.status == 200) {
                    response.json().then(json => {
                        console.log(json);
                        setProfileData(json);
                    })
                } else if (response.status == 500) {
                    // there was an error with the DB
                    response.json().then(json => {
                        console.log(json);
                    })
                } else {
                    // unexpected error
                    console.log(response);
                }
            }
        )
    }
    const container = {
        marginBottom: "10%",
        display: "flex",
        justifyContent: "center",
    }
    // props:
    // firstName
    // lastName
    // profilePic
    // fb
    // insta
    // twti
    // uploadURLs

    return (
        <div style={container}>
            {!isLoggedIn && (
                <Landing googleButton={
                    <GoogleLogin
                        clientId="289368909644-hnpai51fbs9fdbbod98omhdgc6e62olh.apps.googleusercontent.com"
                        buttonText="Login"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                } />
            )}

            {isLoggedIn && isNewUser && (
                <div>
                    <RecipientForm
                        isLoggedIn={isLoggedIn}
                        idtoken={idtoken}
                    />
                </div>
            )}

            {isLoggedIn && !isNewUser && (

                <div>
                    <Profile
                        data={profileData}
                    />
                </div>
            )}
        </div>
    );
}

export default ReceivePage;