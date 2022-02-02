// @ts-ignore
import html from "../createParticipant/createParticipant.html";
//@ts-ignore
import {browserUrl, serverUrl} from "../background/exportedFunctions.ts";
//@ts-ignore
import {Participant} from "./Participant.ts";
import {BlackList} from "../models/BlackList";
import "../materialize/materialize";


chrome.runtime.onMessage.addListener((message) => {
    if (message.action == "Create Participant") {
        if (getShadow() == undefined) {
            createShadowroot();
            document.getElementById('getParticipantId').shadowRoot.innerHTML += (html);
            addButtonFunctionality();
            initModal();
            openModal();
        } else if (!getInstance().isOpen) {
            openModal();
        }
    }
    else if(message.action == "Close Participant Modal"){
        if(getShadow() != undefined){
            getInstance().close()
        }
    }
})


function initModal() {
    M.Modal.init(getNameModal(), {
        dismissible: false,
        onCloseEnd: closeInOtherTabs});
}

function openModal() {
    getInstance().open();
    // Opening Modal scrolls Page to the bottom, following line prevents that from happening
    window.scrollTo(0, 0);
}
function closeInOtherTabs(){
    chrome.runtime.sendMessage({action: "Close Participant"})
}

function getInstance() {
    return M.Modal.getInstance(getNameModal());
}

function getNameModal() {
    return getShadow().shadowRoot.getElementById('nameModal');
}

function getShadow() {
    return document.getElementById('getParticipantId');
}

function createShadowroot() {
    const shadowWrapper = document.createElement('div');
    shadowWrapper.id = 'getParticipantId';

    const shadowRoot = shadowWrapper.attachShadow({mode: 'open'});
    const materializeStyle = document.createElement('link');
    materializeStyle.type = "text/css";
    materializeStyle.media = "screen,projection";

    materializeStyle.setAttribute('rel', 'stylesheet');
    materializeStyle.setAttribute('href', browserUrl + 'materialize/materialize.min.css');

    const materializeJs = document.createElement('script');
    materializeJs.type = "text/javascript";
    materializeJs.src = browserUrl + 'materialize/materialize.js';
    shadowRoot.append(materializeStyle, materializeJs);
    document.body.appendChild(shadowWrapper);
}


function requestParticipantId(name: any, email: string) {
    chrome.runtime.sendMessage({
        action: "Send Participant",
        name: name,
        email: email
    })

}


function addButtonFunctionality() {
    getShadow().shadowRoot.getElementById('nameSubmit').addEventListener('click', ev => {
        checkIfValidInputAndSend();
    })
    getShadow().shadowRoot.getElementById('Name').addEventListener('keyup', function (event) {
        if (event.code === 'Enter') {
            checkIfValidInputAndSend();
        }
    })
    getShadow().shadowRoot.getElementById('Email').addEventListener('keyup', function (event) {
        if (event.code === 'Enter') {
            checkIfValidInputAndSend();
        }
    })

}

function checkIfValidInputAndSend() {
    let nameAndEmail = getShadow().shadowRoot.querySelectorAll('input');
    let nameInput = nameAndEmail[0];
    let emailInput = nameAndEmail[1];
    //@ts-ignore
    let name = nameInput.value;
    //@ts-ignore
    let email = emailInput.value;
    if (validateEmail(email)) {
        requestParticipantId(name, email);
        getInstance().close();
    } else {

        emailInput.className = "invalid";
    }
}

function validateEmail(email: string) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
