/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 144:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Kk": () => (/* binding */ browserUrl)
/* harmony export */ });
/* unused harmony exports serverUrl, checkIfModeActive, sendMessageToEveryTab, openModeSelectInCurrentTab, checkIfBaselineIsFinished, updateIconTimer, calcIconTimer, setIcon, fetchParticipantId, checkIfParticipantIdIsSet, onInstalledDo */
// Webpack imports whole file this is a workaround
// export const serverUrl = "nurdamitsgeht";
var serverUrl = "http://217.160.214.199:8080/api/";
var browserUrl = chrome.runtime.getURL("");
function checkIfModeActive(dateWhenModeEnds) {
    if (dateWhenModeEnds < Date.now() || dateWhenModeEnds == undefined) {
        chrome.storage.local.set({ mode: null });
        sendMessageToEveryTab("Open Mode Select");
        return false;
    }
    else {
        return true;
    }
}
function sendMessageToEveryTab(action) {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            chrome.tabs.sendMessage(tab.id, {
                action: action
            });
        });
    });
}
function openModeSelectInCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (activeTab) {
        chrome.tabs.sendMessage(activeTab[0].id, {
            action: "Open Mode Select"
        });
    });
}
function checkIfBaselineIsFinished(baselineFinished) {
    var today = new Date();
    var baselineDate = new Date(baselineFinished[2], baselineFinished[1], baselineFinished[0]);
    return (today >= baselineDate);
}
function updateIconTimer() {
    chrome.storage.local.get(['dateWhenModeEnds'], function (result) {
        var timeTillModeEnds = calcIconTimer(result.dateWhenModeEnds);
        if (timeTillModeEnds != null) {
            if (timeTillModeEnds[0] != "-") {
                chrome.action.setBadgeText({ text: timeTillModeEnds });
            }
            if (timeTillModeEnds.substr(timeTillModeEnds.length - 3) === 'sec') {
                setTimeout(function () {
                    updateIconTimer();
                }, 1000);
            }
        }
        if (timeTillModeEnds == "0sec") {
            openModeSelectInCurrentTab();
        }
    });
}
function calcIconTimer(dateWhenModeEnds) {
    var timeLeftInSec = (dateWhenModeEnds - Date.now()) / 1000;
    var hour = Math.floor(timeLeftInSec / 3600);
    var minutes = Math.floor((timeLeftInSec % 3600) / 60);
    var seconds = Math.floor(timeLeftInSec % 3600 % 60);
    if (hour >= 1) {
        return Math.round(timeLeftInSec / 3600) + "h";
    }
    else if (minutes >= 1) {
        return minutes + 'min';
    }
    else {
        return seconds + 'sec';
    }
}
function setIcon() {
    chrome.storage.local.get(['mode'], function (result) {
        if (result.mode === false) {
            chrome.action.setIcon({ path: 'img/break.png' });
        }
        else if (result.mode === true) {
            chrome.action.setIcon({ path: 'img/work.png' });
        }
    });
}
function fetchParticipantId() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (activeTab) {
        chrome.tabs.sendMessage(activeTab[0].id, {
            action: "Create Participant"
        });
    });
}
function checkIfParticipantIdIsSet() {
    chrome.storage.local.get(['participantId'], function (result) {
        if (result.participantId == undefined) {
            fetchParticipantId();
        }
        else {
            return result.participantId;
        }
    });
}
function onInstalledDo() {
    chrome.storage.local.get(['blacklist', 'baselineFinished', 'previousGoals', 'lastDomain', 'activeWebsites', 'mode', 'dateWhenModeEnds', 'participantId'], function (result) {
        if (result.blacklist == undefined) {
            var blacklist = ["www.instagram.com", "www.facebook.com", "www.youtube.com", "www.netflix.com", "www.twitch.tv"];
            chrome.storage.local.set({ blacklist: blacklist });
            chrome.action.setIcon({ path: 'img/work.png' });
            chrome.bookmarks.create({
                parentId: '1',
                title: 'Options for Goal Setting Extension',
                url: browserUrl + 'options/options.html'
            });
        }
        if (result.baselineFinished === undefined) {
            var today = new Date();
            chrome.storage.local.set({ baselineFinished: [today.getUTCDate() + 7, today.getUTCMonth(), today.getUTCFullYear()] });
        }
        if (result.previousGoals == undefined) {
            var previousGoals = ['Kurzes Video schauen'];
            chrome.storage.local.set({ previousGoals: previousGoals });
        }
        if (result.lastDomain == undefined) {
            chrome.storage.local.set({ lastDomain: { domain: "Installation Time" } });
        }
        if (result.activeWebsites == undefined) {
            chrome.storage.local.set({ activeWebsites: [] });
        }
        if (result.mode == undefined) {
            sendMessageToEveryTab("Open Mode Select");
        }
        if (result.dateWhenModeEnds == undefined) {
            chrome.storage.local.set({ dateWhenModeEnds: 0 });
        }
        if (result.participantId == undefined) {
            fetchParticipantId();
        }
    });
}


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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

;// CONCATENATED MODULE: ./src/html/modeSelection.html
// Module
var code = "<html lang=\"en\"> <head> <meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"> </head> <div class=\"modal\" style=\"width:75%!important;height:100%!important\" id=\"modeModal\"> <div class=\"container\" style=\"width:100%!important;height:100%!important\"> <div class=\"row\"> <div class=\"center-align\"><h2>Modusauswahl</h2></div> <hr> </div> <div class=\"row offset-s4\"> <div class=\"col s6\"> <div class=\"center-align\"> <button id=\"workButton\"></button> </div> </div> <div class=\"col s6\"> <div class=\"center-align\"> <button id=\"freetimeButton\"></button> </div> </div> </div> </div> </div> </html> ";
// Exports
/* harmony default export */ const modeSelection = (code);
// EXTERNAL MODULE: ./src/background/exportedFunctions.ts
var exportedFunctions = __webpack_require__(144);
;// CONCATENATED MODULE: ./src/contentInjection/mode.ts
//@ts-ignore


chrome.runtime.onMessage.addListener((function (message) {
    if (message.action == "Open Mode Select" && getModeShadow() == null) {
        createModeModal();
        openModeModal();
    }
    else if (message.action == "Open Mode Select" && !isModalOpen()) {
        openModeModal();
    }
    else if (message.action == "Close Mode Select") {
        closeModal();
    }
}));
function createModeModal() {
    createShadowroot();
    document.getElementById('modeShadow').shadowRoot.innerHTML += (modeSelection);
    initializeModalAndTimePicker();
    functionalityAndImgForButtons();
    openModeModal();
}
var mode;
var time;
function initializeModalAndTimePicker() {
    M.Modal.init(document.getElementById('modeShadow').shadowRoot.getElementById('modeModal'), {
        dismissible: false,
    });
    M.Timepicker.init(document.getElementById('modeShadow').shadowRoot.getElementById('modeTimepicker'), {
        twelveHour: false,
        onCloseEnd: function () {
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
    var shadowWrapper = document.createElement('div');
    shadowWrapper.id = 'modeShadow';
    var shadowRoot = shadowWrapper.attachShadow({ mode: 'open' });
    var materializeStyle = document.createElement('link');
    materializeStyle.type = "text/css";
    materializeStyle.media = "screen,projection";
    materializeStyle.setAttribute('rel', 'stylesheet');
    materializeStyle.setAttribute('href', exportedFunctions/* browserUrl */.Kk + 'materialize/materialize.min.css');
    var materializeJs = document.createElement('script');
    materializeJs.type = "text/javascript";
    materializeJs.src = exportedFunctions/* browserUrl */.Kk + 'materialize/materialize.js';
    shadowRoot.append(materializeStyle, materializeJs, createTimeSelect());
    document.body.appendChild(shadowWrapper);
}
function createTimeSelect() {
    var timeSelector = document.createElement('input');
    timeSelector.className = 'timepicker';
    timeSelector.id = 'modeTimepicker';
    timeSelector.style.display = "none";
    return timeSelector;
}
function functionalityAndImgForButtons() {
    var workButton = getModeShadow().shadowRoot.getElementById('workButton');
    var freetimeButton = getModeShadow().shadowRoot.getElementById('freetimeButton');
    addPictograms(workButton, freetimeButton);
    addButtonFunctionality(freetimeButton, workButton);
}
function addPictograms(workButton, freetimeButton) {
    var workPictogram = document.createElement('img');
    var freetimePictogram = document.createElement('img');
    workPictogram.style.setProperty('style', "width: 30vw;");
    workPictogram.src = exportedFunctions/* browserUrl */.Kk + "img/laptop.png";
    freetimePictogram.src = exportedFunctions/* browserUrl */.Kk + "img/coffee-cup.png";
    workButton.append(workPictogram);
    freetimeButton.append(freetimePictogram);
}
function addButtonFunctionality(freetimeButton, workButton) {
    freetimeButton.addEventListener('click', function () {
        openTimePicker(false);
    }, false);
    workButton.addEventListener('click', function () {
        openTimePicker(true);
    }, false);
}
function openTimePicker(currentMode) {
    mode = currentMode;
    var timepicker = getTimepicker();
    timepicker.open();
}
function getTimepicker() {
    return M.Timepicker.getInstance(getModeShadow().shadowRoot.getElementById('modeTimepicker'));
}
function setTimeAndMode() {
    time = getTimepicker().time;
    chrome.runtime.sendMessage({
        action: "Set Mode Selection",
        time: time,
        mode: mode,
    });
    closeModal();
}
function closeModal() {
    if (getModeShadow() !== null) {
        var modalDiv = getModeShadow().shadowRoot.getElementById('modeModal');
        M.Modal.getInstance(modalDiv).close();
    }
}

})();

/******/ })()
;