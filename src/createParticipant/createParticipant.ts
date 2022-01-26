// @ts-ignore
import html from "../createParticipant/createParticipant.html";
//@ts-ignore
import {serverUrl} from "../background/exportedFunctions.ts";
//@ts-ignore
import {Participant} from "./Participant.ts";
import {BlackList} from "../models/BlackList";

chrome.runtime.onMessage.addListener((message) => {
    if(message.action == "Create Participant"){
        if(getShadow() == undefined){

            createShadowroot();
            document.getElementById('getParticipantId').shadowRoot.innerHTML += (html);
            addButtonFunctionality();
            initModal();
            openModal();
        } else if(!getInstance().isOpen){
            openModal();
        }

    }
})

function initModal() {
    M.Modal.init(getNameModal());
}
function openModal() {
    getInstance().open();
}

function getInstance(){
    return M.Modal.getInstance(getNameModal());
}

function getNameModal(){
    return getShadow().shadowRoot.getElementById('nameModal');
}

function getShadow(){
    return document.getElementById('getParticipantId');
}

function createShadowroot() {
    const shadowWrapper = document.createElement('div');
    shadowWrapper.id = 'getParticipantId';

    const shadowRoot = shadowWrapper.attachShadow({mode: 'open'});
    const materializeStyle = document.createElement('link');
    materializeStyle.type = "text/css";
    materializeStyle.media = "screen,projection";
    const extensionUrl = 'chrome-extension://' + chrome.runtime.id
    materializeStyle.setAttribute('rel', 'stylesheet');
    materializeStyle.setAttribute('href', extensionUrl + '/materialize/materialize.min.css');

    const materializeJs = document.createElement('script');
    materializeJs.type = "text/javascript";
    materializeJs.src = extensionUrl + '/materialize/materialize.js';
    shadowRoot.append(materializeStyle, materializeJs);
    document.body.appendChild(shadowWrapper);
}


function requestParticipantId(name: any) {
    chrome.runtime.sendMessage({
        action: "Send Participant",
        name: name
    })

}

function addButtonFunctionality(){
    getShadow().shadowRoot.getElementById('nameSubmit').addEventListener('click', ev => {
        //@ts-ignore
        let name = getShadow().shadowRoot.getElementById("Name").value;
        requestParticipantId(name);
    })
}


