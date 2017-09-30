import * as firebase from "firebase";
import * as url from "url";

const config = require("../config.json");

firebase.initializeApp({
    apiKey: config.firebase.apiKey,
    authDomain: `${config.firebase.projectId}.firebaseapp.com`,
});

async function getCurrentTabUrl(): Promise<string> {
    return await new Promise((resolve) =>
        chrome.tabs.query(
            { active: true, currentWindow: true },
            (tabs) => resolve(tabs[0].url))) as string;
}

document.addEventListener("DOMContentLoaded", async () => {
    const button = document.getElementById("sign-in-button") as HTMLButtonElement;
    const message = document.getElementById("message");

    let signingIn = false;

    button.addEventListener("click", async () => {
        signingIn = true;
        await firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider());
    });

    firebase.auth().onAuthStateChanged((user) => {
        if (user === null) {
            button.style.display = "initial";
            message.style.display = "none";
        } else {
            button.style.display = "none";
            message.style.display = "initial";
            message.appendChild(document.createTextNode(signingIn ? "Signed in!" : "Item added"));
            setTimeout(() => window.close(), 5000);
        }
    });
});
