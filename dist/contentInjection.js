/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 144:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setModeAndIcon = exports.calcIconTimer = exports.updateIconTimer = exports.checkIfBaselineIsFinished = exports.openModeSelectInCurrentTab = exports.openOrCloseModeSelectInEveryTab = exports.checkIfModeActive = exports.serverUrl = exports.participantId = void 0;
// Webpack imports whole file this is a workaround
exports.participantId = 999;
// export const serverUrl = "nurdamitsgeht";
exports.serverUrl = "http://217.160.214.199:8080/api/";
function checkIfModeActive(dateWhenModeEnds) {
    window.console.log("check If Mode Active");
    window.console.log("dateWhenModeEnds:", dateWhenModeEnds);
    if (dateWhenModeEnds < Date.now() || dateWhenModeEnds == undefined) {
        chrome.storage.local.set({ mode: null });
        openOrCloseModeSelectInEveryTab("Open Mode Select");
        return false;
    }
    else {
        return true;
    }
}
exports.checkIfModeActive = checkIfModeActive;
function openOrCloseModeSelectInEveryTab(action) {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            chrome.tabs.sendMessage(tab.id, {
                action: action
            });
        });
    });
}
exports.openOrCloseModeSelectInEveryTab = openOrCloseModeSelectInEveryTab;
function openModeSelectInCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (activeTab) {
        chrome.tabs.sendMessage(activeTab[0].id, {
            action: "Open Mode Select"
        });
    });
}
exports.openModeSelectInCurrentTab = openModeSelectInCurrentTab;
function checkIfBaselineIsFinished(baselineFinished) {
    var today = new Date();
    var baselineDate = new Date(baselineFinished[0] - 7, baselineFinished[1], baselineFinished[2]);
    return (today >= baselineDate);
}
exports.checkIfBaselineIsFinished = checkIfBaselineIsFinished;
function updateIconTimer() {
    chrome.storage.local.get(['dateWhenModeEnds'], (result) => {
        let timeTillModeEnds = calcIconTimer(result.dateWhenModeEnds);
        if (timeTillModeEnds != null) {
            chrome.browserAction.setBadgeText({ text: timeTillModeEnds });
            if (timeTillModeEnds.substr(timeTillModeEnds.length - 3) === 'sec' && timeTillModeEnds[0] != '0') {
                setTimeout(() => {
                    updateIconTimer();
                }, 1000);
            }
        }
    });
}
exports.updateIconTimer = updateIconTimer;
function calcIconTimer(dateWhenModeEnds) {
    let timeLeftInSec = (dateWhenModeEnds - Date.now()) / 1000;
    let hour = Math.floor(timeLeftInSec / 3600);
    let minutes = Math.floor((timeLeftInSec % 3600) / 60);
    let seconds = Math.floor(timeLeftInSec % 3600 % 60);
    if (hour >= 1) {
        return Math.round(timeLeftInSec / 3600) + `h`;
    }
    else if (minutes >= 1) {
        return minutes + 'min';
    }
    else {
        return seconds + 'sec';
    }
}
exports.calcIconTimer = calcIconTimer;
function setModeAndIcon() {
    chrome.storage.local.get(['mode'], (result) => {
        if (result.mode === false) {
            chrome.browserAction.setIcon({ path: 'img/break.png' });
        }
        else if (result.mode === true) {
            chrome.browserAction.setIcon({ path: 'img/work.png' });
        }
    });
}
exports.setModeAndIcon = setModeAndIcon;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
//@ts-ignore
const exportedFunctions_ts_1 = __webpack_require__(144);
var currentDomain = new URL(location.href).hostname;
chrome.storage.local.get(['blacklist'], result => {
    if (result.blacklist.includes(currentDomain)) {
        openInitialModal(currentDomain);
    }
});
function getAndOpenModal() {
    chrome.storage.local.get(['blacklist', 'baselineFinished', 'mode', 'activeWebsites'], (result) => {
        const currentDomain = new URL(location.href).hostname;
        var isBaselineFinished = exportedFunctions_ts_1.checkIfBaselineIsFinished(result.baselineFinished);
        var isAlreadyActive = checkIfAlreadyActive(result, currentDomain);
        window.console.log(isAlreadyActive);
        // TODO deactivated to make testing easier
        // if (result.blacklist.includes(currentDomain) && isBaselineFinished && result.mode && !isAlreadyActive) {
        if (result.blacklist.includes(currentDomain) && !isAlreadyActive && result.mode === true) {
            const shadowWrapper = document.getElementById('shadowWrapper');
            if ((shadowWrapper === null)) {
                openInitialModal(currentDomain);
            }
            if (!getReminderInstance().isOpen) {
                // @ts-ignore
                document.getElementById('shadowWrapper').shadowRoot.getElementById('goalInput').value = '';
                var modalInstance = getModalInstance();
                // timeout prevents site from scrolling
                if (!modalInstance.isOpen) {
                    setTimeout(function () {
                        modalInstance.open();
                        disableShortcuts();
                    }, 500);
                }
            }
        }
    });
}
function checkIfAlreadyActive(result, currentDomain) {
    let isActive = false;
    result.activeWebsites.forEach(obj => {
        if (obj.hostname === currentDomain) {
            isActive = true;
        }
    });
    return isActive;
}
function getReminderInstance() {
    return M.Modal.getInstance(document.getElementById('shadowWrapper').shadowRoot.getElementById('reminderModal'));
}
function getModalInstance() {
    return M.Modal.getInstance(document.getElementById('shadowWrapper').shadowRoot.getElementById('modal1'));
}
// For tab navigation
chrome.runtime.onMessage.addListener((message) => {
    if (message.action == "Open Reminder Modal" && (message.url === new URL(location.href).hostname)) {
        openReminder(message.goal);
    }
    if (message.action == "Close Intervention Modal") {
        // @ts-ignore
        document.getElementById('shadowWrapper').shadowRoot.getElementById('goalInput').value = '';
        getModalInstance().close();
    }
    else if (message.action == "Open Intervention Modal") {
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
function setLatestAndPreviousGoals(goalInput, timeFrame) {
    chrome.storage.local.set({ latestGoal: goalInput });
    chrome.storage.local.get(['previousGoals'], (result) => {
        const newPreGoals = result.previousGoals;
        newPreGoals.unshift(goalInput);
        chrome.storage.local.set({ previousGoals: newPreGoals });
    });
    chrome.runtime.sendMessage({
        action: "Set Reminder",
        goal: goalInput,
        hostname: new URL(location.href).hostname,
        reminderTime: timeFrame * 60000
    });
}
function disableShortcuts() {
    window.addEventListener('keydown', stopPropagation, true);
}
function enableShortcuts() {
    window.removeEventListener('keydown', stopPropagation, true);
}
function stopPropagation(e) {
    e.stopPropagation();
}
function openInitialModal(domain) {
    const shadowWrapper = document.createElement('div');
    shadowWrapper.id = 'shadowWrapper';
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
        onCloseEnd: () => {
            enableShortcuts();
        }
    });
    var autocompleteInstance = M.Autocomplete.init(shadowRoot.querySelectorAll('.autocomplete'));
    var newAutocompleteData = {};
    chrome.storage.local.get(['previousGoals'], (result) => {
        let previousGoals = result.previousGoals;
        previousGoals.forEach(entry => {
            newAutocompleteData[entry] = null;
        });
        autocompleteInstance[0].updateData(newAutocompleteData);
    });
    submitButton.addEventListener('click', function () {
        setLatestAndPreviousGoals(goalInput.value, timeSelector.value);
        ModalInstance.close();
    }, false);
    goalInput.addEventListener('keyup', function (event) {
        goalInput.focus();
        if (event.code === 'Enter') {
            setLatestAndPreviousGoals(goalInput.value, timeSelector.value);
            ModalInstance.close();
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

})();

/******/ })()
;