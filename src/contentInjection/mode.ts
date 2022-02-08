//@ts-ignore
import html from "../html/modeSelection.html";
import {browserUrl} from "../background/exportedFunctions";



chrome.runtime.onMessage.addListener((message => {

    if (message.action == "Open Mode Select" && getModeShadow() == null) {
        createModeModal();
        openModeModal();
    } else if (message.action == "Open Mode Select" && !isModalOpen()) {
        openModeModal();

    } else if (message.action == "Close Mode Select") {
        closeModal();
    }
}))

function createModeModal() {

    createShadowroot();
    document.getElementById('modeShadow').shadowRoot.innerHTML += (html);
    initializeModalAndTimePicker();
    functionalityAndImgForButtons();
    openModeModal();
}

var mode: any;
var time;

function initializeModalAndTimePicker() {


    M.Modal.init(document.getElementById('modeShadow').shadowRoot.getElementById('modeModal'),
        {
            dismissible: false,
        });
    M.Timepicker.init(document.getElementById('modeShadow').shadowRoot.getElementById('modeTimepicker'),{
        twelveHour: false,
        onCloseEnd: () => {
            setTimeAndMode();
        }

    });

}

function getModeShadow() {
    return document.getElementById('modeShadow');
}

function isModalOpen() {
    return M.Modal.getInstance(getModeShadow().shadowRoot.getElementById('modeModal')).isOpen;
}

function openModeModal() {
    var ModalInstance = M.Modal.getInstance(getModeShadow().shadowRoot.getElementById('modeModal'));
    ModalInstance.open();
    window.scrollTo(0, 0);
}

function createShadowroot() {
    const shadowWrapper = document.createElement('div');
    shadowWrapper.id = 'modeShadow';

    const shadowRoot = shadowWrapper.attachShadow({mode: 'open'});
    const materializeStyle = document.createElement('link');
    materializeStyle.type = "text/css";
    materializeStyle.media = "screen,projection";

    materializeStyle.setAttribute('rel', 'stylesheet');
    materializeStyle.setAttribute('href', browserUrl+ 'materialize/materialize.min.css');

    const materializeJs = document.createElement('script');
    materializeJs.type = "text/javascript";
    materializeJs.src = browserUrl + 'materialize/materialize.js';
    shadowRoot.append(materializeStyle, materializeJs, createTimeSelect());
    document.body.appendChild(shadowWrapper);
}

function createTimeSelect() {
    let timeSelector = document.createElement('input');
    timeSelector.className = 'timepicker';
    timeSelector.id = 'modeTimepicker';
    timeSelector.style.display = "none";
    return timeSelector;
}


function functionalityAndImgForButtons() {
    let workButton: HTMLButtonElement = <HTMLButtonElement>    getModeShadow().shadowRoot.getElementById('workButton');
    let freetimeButton: HTMLButtonElement = <HTMLButtonElement> getModeShadow().shadowRoot.getElementById('freetimeButton');
    addPictograms(workButton, freetimeButton);
    addButtonFunctionality(freetimeButton, workButton);
}

function addPictograms(workButton: HTMLButtonElement, freetimeButton: HTMLButtonElement) {
    let workPictogram = document.createElement('img');
    let freetimePictogram = document.createElement('img');
    workPictogram.style.setProperty('style',"width: 30vw;")

    workPictogram.src =  browserUrl +  "img/laptop.png";
    freetimePictogram.src =  browserUrl +  "img/coffee-cup.png";

    workButton.append(workPictogram);
    freetimeButton.append(freetimePictogram);
}

function addButtonFunctionality(freetimeButton: HTMLButtonElement, workButton: HTMLButtonElement) {
    freetimeButton.addEventListener('click', function () {
        openTimePicker(false);
    }, false);
    workButton.addEventListener('click', function () {
        openTimePicker(true);
    }, false);

}



function openTimePicker(currentMode: boolean) {
    mode = currentMode;
    let timepicker = getTimepicker();
    timepicker.open();

}

function getTimepicker(){
    return M.Timepicker.getInstance(getModeShadow().shadowRoot.getElementById('modeTimepicker'));
}

function setTimeAndMode() {
    time = getTimepicker().time;

    chrome.runtime.sendMessage({
        action: "Set Mode Selection",
        time: time,
        mode: mode,
    })
    closeModal();
}


function closeModal() {
    if(getModeShadow() !== null){
        let modalDiv = getModeShadow().shadowRoot.getElementById('modeModal');
        M.Modal.getInstance(modalDiv).close()
    }
}



