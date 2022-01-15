chrome.runtime.onMessage.addListener((message => {

    if (message.action == "Open Mode Select" && getModeShadow() == null) {
        createShadowroot();
        createModal();
        openModal();

    } else if (message.action == "Open Mode Select" && !isModalOpen()) {
        openModal();
    } else if (message.action == "Close Mode Select") {
        window.console.log("Should modeselect modal be called to close? ");
        window.console.log(message);

        closeModal();
    }
}))

var mode;
var time;

function getModeShadow() {
    return document.getElementById('modeShadow');
}

function isModalOpen() {
    return M.Modal.getInstance(getModeShadow().shadowRoot.getElementById('modeModal')).isOpen;
}

function openModal() {
    var ModalInstance = M.Modal.getInstance(getModeShadow().shadowRoot.getElementById('modeModal'));
    ModalInstance.open();
}

function createShadowroot() {
    const shadowWrapper = document.createElement('div');
    shadowWrapper.id = 'modeShadow';
    var domain = new URL(location.href).hostname.toString();
    if (domain === 'www.youtube.com') {
        shadowWrapper.setAttribute('style', `
                                 position: fixed;
                                 z-index: 99999999999999999999999999999999999999999999999999999999999999 !important;
                                 bottom: -999999;
                                 top:3123;
                                left: 0;
                                width: 100%;
                                height: 100%;    
                                `);

    } else {
        shadowWrapper.setAttribute('style', `
                                bottom: 0;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;    
                                `);

    }

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
    shadowRoot.append(materializeStyle, materializeJs, createTimeSelect());
    document.body.appendChild(shadowWrapper);
}


function createModal() {
    let containerModal = document.createElement('div');
    containerModal.className = "modal";
    containerModal.setAttribute('style', 'width: 75% !important; height: 100% !important')
    containerModal.id = "modeModal";

    let containerContent = document.createElement('div');
    containerContent.className = "container";
    containerContent.setAttribute('style', 'width: 100% !important; height: 100% !important')


    createAndAppendButtons(containerContent);

    containerModal.append(containerContent);
    document.getElementById('modeShadow').shadowRoot.append(containerModal);

    M.Modal.init(document.getElementById('modeShadow').shadowRoot.getElementById('modeModal'),
        {
            dismissible: false,
        });
    M.Timepicker.init(document.getElementById('modeShadow').shadowRoot.getElementById('modeTimepicker'),{
        twelveHour: false,
        onCloseEnd: () => {
            window.console.log("Set Time and Mode should be called");
            setTimeAndMode();
        },

    });
}


function createAndAppendButtons(containerContent) {
// TODO Lineup buttons and write work / freetime
    let row1 = document.createElement('div');
    row1.className = "row s6"
    let span = document.createElement('span');
    span.textContent = "Modusauswahl";
    row1.append(span);


    let row2 = document.createElement('div');
    row2.className = "row offset-s4"

    let leftContainer = document.createElement('div');
    leftContainer.className = "col s4 offset-s2";
    let rightContainer = document.createElement('div');
    rightContainer.className = "col s4 offset-s2";

    let workButton = document.createElement('button');
    let freetimeButton = document.createElement('button');
    let workPictogram = document.createElement('img');
    let freetimePictogram = document.createElement('img');

    workPictogram.src = "chrome-extension://" + chrome.runtime.id + "/img/laptop.png";
    freetimePictogram.src = "chrome-extension://" + chrome.runtime.id + "/img/coffee-cup.png";

    workButton.append(workPictogram);
    freetimeButton.append(freetimePictogram);
    addButtonFunctionality(freetimeButton, workButton);
    leftContainer.append(workButton);
    rightContainer.append(freetimeButton);
    row2.append(leftContainer, rightContainer);

    containerContent.append(row1,row2);
}

function createTimeSelect() {
    let timeSelector = document.createElement('input');
    timeSelector.className = 'timepicker';
    timeSelector.id = 'modeTimepicker';
    timeSelector.style.display = "none";
    return timeSelector;
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
    window.console.log("Setting time and mode");
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



