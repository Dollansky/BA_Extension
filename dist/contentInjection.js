/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
var currentDomain = new URL(location.href).hostname;
// TODO youtube sucks with input fix kinda workaround at least input stays focused when pressing shortcuts
// youtube still recognises shortcuts even when input is focused
onkeydown = function (ev) {
    const shadowWrapper = document.getElementById('shadowWrapper');
    if (currentDomain === 'www.youtube.com' && shadowWrapper !== null) {
        // @ts-ignore
        var modalInstance = M.Modal.getInstance(document.getElementById('shadowWrapper').shadowRoot.getElementById('modal1'));
        if (modalInstance.isOpen) {
            var goalInput = shadowWrapper.shadowRoot.getElementById('goalInput');
            goalInput.focus();
        }
    }
};
function openInitialModal(domain) {
    const shadowWrapper = document.createElement('div');
    shadowWrapper.id = 'shadowWrapper';
    if (domain === 'www.youtube.com') {
        shadowWrapper.setAttribute('style', `
                                 position: fixed;
                                 z-index: 99999999999999999999999999999999999999999999999999999999999999 !important;
                                 bottom: -999999;
                                 top:3123;
                                left: 0;
                                width: 0%;
                                height: 0%;    
                                `);
    }
    else {
        shadowWrapper.setAttribute('style', `
                                bottom: 0;
                                top: 0;
                                left: 0;
                                width: 0%;
                                height: 0%;    
                                `);
    }
    const shadowRoot = shadowWrapper.attachShadow({ mode: 'open' });
    const materializeStyle = document.createElement('link');
    materializeStyle.type = "text/css";
    materializeStyle.media = "screen,projection";
    const extensionUrl = 'chrome-extension://' + chrome.runtime.id;
    materializeStyle.setAttribute('rel', 'stylesheet');
    materializeStyle.setAttribute('href', extensionUrl + '/materialize/materialize.min.css');
    const materializeJs = document.createElement('script');
    materializeJs.type = "text/javascript";
    materializeJs.src = extensionUrl + '/materialize/materialize.js';
    shadowRoot.append(materializeStyle, materializeJs);
    let row1 = document.createElement('div');
    row1.className = "row";
    let row2 = document.createElement('div');
    row2.className = "row";
    let row3 = document.createElement('div');
    row3.className = "row";
    let row4 = document.createElement('div');
    row4.className = "row";
    let containerModal = document.createElement('div');
    containerModal.className = "modal";
    containerModal.setAttribute('style', 'width: 75% !important');
    containerModal.id = "modal1";
    containerModal.tabIndex = 0;
    let containerContent = document.createElement('div');
    containerContent.className = "modal-content";
    let containerHeader = document.createElement('img');
    // TODO passendes Icon suchen
    // containerHeader.src = "chrome-extension://ocfjoiapekdfcfajoopoeejhkfkdfepb/img/palm-of-hand.png";
    // Input Field
    let inputDiv = document.createElement('div');
    inputDiv.className = "input-field";
    let selectDiv = document.createElement('div');
    selectDiv.className = "input-field";
    selectDiv.id = "selectDiv";
    let goalInput = document.createElement('input');
    goalInput.id = "goalInput";
    goalInput.className = "col s9 autocomplete";
    goalInput.placeholder = "Was ist Ihr Ziel beim Besuch von " + domain;
    let label = document.createElement('label');
    label.innerText = "Ziel";
    let submitButton = document.createElement('button');
    submitButton.className = "waves-effect waves-light btn";
    submitButton.innerText = "Ziel setzen";
    let timeSelectorDiv = document.createElement('div');
    timeSelectorDiv.className = "input-field col";
    timeSelectorDiv.id = "timeSelect";
    timeSelectorDiv.setAttribute("style", "width: 200px height: 50px");
    let timeSelector = document.createElement('select');
    timeSelector.className = "browser-default";
    // TODO Remove when done testing
    let testOption1 = document.createElement('option');
    testOption1.innerText = '1 Sekunde (Testing)';
    testOption1.value = '0.01666666666';
    let testOption2 = document.createElement('option');
    testOption2.value = '0.08333333333';
    testOption2.innerText = '5 Sekunden (Testing)';
    let testOption3 = document.createElement('option');
    testOption3.value = '0.25';
    testOption3.innerText = '15 Sekunden (Testing)';
    let testOption4 = document.createElement('option');
    testOption4.value = '0.5';
    testOption4.innerText = '30 Sekunden (Testing)';
    timeSelector.append(testOption1, testOption2, testOption3, testOption4);
    // until here remove
    let options = ['1', '2', '3', '4', '5', '10', '15', '20', '25', '30', '45', '60'];
    options.forEach(option => {
        let timeOption = document.createElement('option');
        timeOption.value = option;
        if (option != '1') {
            timeOption.innerText = option + " Minuten";
        }
        else {
            timeOption.innerText = option + "Minute";
        }
        timeSelector.appendChild(timeOption);
    });
    timeSelectorDiv.append(timeSelector);
    row1.append(label);
    row2.append(goalInput, timeSelectorDiv);
    row3.append(submitButton);
    inputDiv.append(row1, row2, row3);
    selectDiv.append(row4);
    containerContent.append(containerHeader, inputDiv, selectDiv);
    containerModal.append(containerContent);
    shadowRoot.appendChild(containerModal);
    document.body.appendChild(shadowWrapper);
    var ModalInstance = M.Modal.init(shadowRoot.getElementById('modal1'), {
        dismissible: false,
    });
    var autocompleteInstance = M.Autocomplete.init(shadowRoot.querySelectorAll('.autocomplete'));
    var newAutocompleteData = {};
    chrome.storage.local.get(['previousGoals'], (result) => {
        // window.console.log(instances);
        previousGoals = result.previousGoals;
        previousGoals.forEach(entry => {
            newAutocompleteData[entry] = null;
        });
        autocompleteInstance[0].updateData(newAutocompleteData);
    });
    submitButton.addEventListener('click', function () {
        getGoal(goalInput.value, timeSelector.value, ModalInstance, domain);
    }, false);
    goalInput.addEventListener('keyup', function (event) {
        goalInput.focus();
        if (event.code === 'Enter') {
            getGoal(goalInput.value, timeSelector.value, ModalInstance, domain);
        }
    });
    goalInput.addEventListener('keydown', function (event) {
        goalInput.focus();
        if (domain === 'www.youtube.com' && event.code === 'Space') {
            goalInput.value = goalInput.value + ' ';
        }
    });
    // Opening Modal scrolls Page to the bottom, following line prevents that from happening
    window.scrollTo(0, 0);
    // Goal Reminder
    let reminderModal = document.createElement('div');
    reminderModal.className = "modal";
    reminderModal.setAttribute('style', 'width: 75% !important');
    reminderModal.id = "reminderModal";
    reminderModal.tabIndex = 0;
    let imgAlarm = document.createElement('img');
    imgAlarm.src = extensionUrl + "/img/wecker.png";
    let goalSpan = document.createElement('span');
    goalSpan.id = 'goalSpan';
    goalSpan.style.setProperty("font-size", "50px");
    goalSpan.innerText = 'template';
    let reminderRow1 = document.createElement('div');
    reminderRow1.className = "row";
    reminderRow1.append(imgAlarm, goalSpan);
    let reminderContent = document.createElement('div');
    reminderContent.className = "modal-content";
    let reminderHeader = document.createElement('div');
    reminderContent.append(reminderHeader, reminderRow1);
    reminderModal.append(reminderContent);
    shadowRoot.appendChild(reminderModal);
    M.Modal.init(shadowRoot.getElementById('reminderModal'), {
        dismissible: true,
        onCloseEnd: () => {
            getAndOpenModal();
        }
    });
    getAndOpenModal();
}
chrome.storage.local.get(['blacklist'], result => {
    if (result.blacklist.includes(currentDomain)) {
        openInitialModal(currentDomain);
    }
});
function getAndOpenModal() {
    chrome.storage.local.get(['blacklist', 'baselineFinished', 'mode', 'activeWebsites'], (result) => {
        var today = new Date();
        var baselineFinished = new Date(result.baselineFinished[0] - 7, result.baselineFinished[1], result.baselineFinished[2]);
        var isAlreadyActive = false;
        const currentDomain = new URL(location.href).hostname;
        const shadowWrapper = document.getElementById('shadowWrapper');
        result.activeWebsites.forEach(obj => {
            if (obj.hostname === currentDomain) {
                isAlreadyActive = true;
            }
        });
        if ((shadowWrapper === null)) {
            openInitialModal(currentDomain.toString());
        }
        // TODO deactivated to make testing easier
        // if (result.blacklist.includes(currentDomain) && (today >= baselineFinished) && result.mode === true  && !isAlreadyActive) {
        if (result.blacklist.includes(currentDomain) && !isAlreadyActive && result.mode === true) {
            var reminderInstance = M.Modal.getInstance(document.getElementById('shadowWrapper').shadowRoot.getElementById('reminderModal'));
            if (!reminderInstance.isOpen) {
                // @ts-ignore
                document.getElementById('shadowWrapper').shadowRoot.getElementById('goalInput').value = '';
                var modalInstance = M.Modal.getInstance(document.getElementById('shadowWrapper').shadowRoot.getElementById('modal1'));
                // timeout prevents site from scrolling
                if (!modalInstance.isOpen) {
                    setTimeout(function () {
                        modalInstance.open();
                    }, 500);
                }
            }
        }
    });
}
// For tab navigation
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.openReminder && (message.url === new URL(location.href).hostname)) {
        openReminder(message.goal);
    }
    if (message.closeModal) {
        // @ts-ignore
        document.getElementById('shadowWrapper').shadowRoot.getElementById('goalInput').value = '';
        var modalInstance = M.Modal.getInstance(document.getElementById('shadowWrapper').shadowRoot.getElementById('modal1'));
        modalInstance.close();
    }
    else {
        getAndOpenModal();
    }
});
function openReminder(goal) {
    const shadowWrapper = document.getElementById('shadowWrapper');
    shadowWrapper.shadowRoot.getElementById('goalSpan').innerText = goal;
    var modalInstance = M.Modal.getInstance(shadowWrapper.shadowRoot.getElementById('reminderModal'));
    modalInstance.options.dismissible = false;
    modalInstance.open();
    // Reminder can be dismissed after 1 sek
    setTimeout(() => {
        modalInstance.options.dismissible = true;
    }, 1000);
}
function getGoal(goalInput, timeFrame, instance, domain) {
    chrome.storage.local.set({ latestGoal: goalInput });
    chrome.storage.local.get(['previousGoals'], (result) => {
        const newPreGoals = result.previousGoals;
        newPreGoals.unshift(goalInput);
        chrome.storage.local.set({ previousGoals: newPreGoals });
    });
    chrome.runtime.sendMessage({
        goal: goalInput,
        hostname: new URL(location.href).hostname,
        reminderTime: timeFrame * 60000
    });
    instance.close();
}

/******/ })()
;
