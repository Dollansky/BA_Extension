/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 144:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Kk": () => (/* binding */ browserUrl),
/* harmony export */   "mU": () => (/* binding */ sendMessageToEveryTab),
/* harmony export */   "p6": () => (/* binding */ checkIfBaselineIsFinished)
/* harmony export */ });
/* unused harmony exports serverUrl, checkIfModeActive, openModeSelectInCurrentTab, updateIconTimer, calcIconTimer, setIcon, checkIfParticipantIdIsSet, onInstalledDo */
/* harmony import */ var _onInstallationSetup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(765);

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
function checkIfParticipantIdIsSet() {
    chrome.storage.local.get(['participantId'], function (result) {
        if (result.participantId == undefined) {
            createParticipant();
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
            createParticipant();
        }
    });
}


/***/ }),

/***/ 765:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports onInstalledDo, createParticipant, checkIfParticipantIdSet */
/* harmony import */ var _exportedFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(144);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
//@ts-ignore

chrome.storage.local.get(['blacklist', 'baselineFinished', 'previousGoals', 'lastDomain', 'activeWebsites', 'mode', 'dateWhenModeEnds'], function (result) {
    if (result.blacklist == undefined) {
        var blacklist = ["www.instagram.com", "www.facebook.com", "www.youtube.com", "www.netflix.com", "www.twitch.tv"];
        chrome.storage.local.set({ blacklist: blacklist });
        chrome.action.setIcon({ path: 'img/work.png' });
        chrome.bookmarks.create({ parentId: '1', title: 'Blacklist Extension', url: _exportedFunctions__WEBPACK_IMPORTED_MODULE_0__/* .browserUrl */ .Kk + 'options/options.html' });
    }
    if (result.baselineFinished === undefined || result.baselineFinished == null) {
        var today = new Date();
        chrome.storage.local.set({ baselineFinished: [today.getUTCDate() + 7, today.getUTCMonth(), today.getUTCFullYear()] });
    }
    if (result.previousGoals == undefined) {
        chrome.storage.local.set({ previousGoals: [] });
    }
    if (result.lastDomain == undefined) {
        chrome.storage.local.set({ lastDomain: { domain: "Installation Time" } });
    }
    if (result.activeWebsites == undefined) {
        chrome.storage.local.set({ activeWebsites: [] });
    }
    if (result.mode == undefined) {
        (0,_exportedFunctions__WEBPACK_IMPORTED_MODULE_0__/* .sendMessageToEveryTab */ .mU)("Open Mode Select");
    }
    if (result.dateWhenModeEnds == undefined) {
        chrome.storage.local.set({ dateWhenModeEnds: 0 });
    }
});
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
            chrome.storage.local.set({ previousGoals: [] });
        }
        if (result.lastDomain == undefined) {
            chrome.storage.local.set({ lastDomain: { domain: "Installation Time" } });
        }
        if (result.activeWebsites == undefined) {
            chrome.storage.local.set({ activeWebsites: [] });
        }
        if (result.mode == undefined) {
            chrome.storage.local.set({ mode: false });
        }
        if (result.dateWhenModeEnds == undefined) {
            chrome.storage.local.set({ dateWhenModeEnds: 0 });
        }
        if (result.participantId == undefined) {
            checkIfParticipantIdIsSet();
            setTimeout(function () {
                chrome.tabs.create({ url: browserUrl + 'options/options.html' });
                setTimeout(function () {
                    chrome.runtime.sendMessage({ action: "firstInstall" });
                }, 500);
            }, 1000);
        }
        if (result.startTimeIntervall == undefined) {
            chrome.storage.local.set({ startTimeIntervall: new Date().getTime() });
        }
    });
}
function createParticipant() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            fetch(serverUrl + "participant/create", {
                method: 'post',
                headers: {
                    "Content-type": "application/json"
                },
            }).then(function (response) { return response.text(); })
                .then(function (data) {
                setParticipantId(data);
            })
                .catch(function (error) {
            });
            return [2 /*return*/];
        });
    });
}
function setParticipantId(participantId) {
    chrome.storage.local.set({ participantId: participantId });
}
function checkIfParticipantIdSet(name, email) {
    chrome.storage.local.get(['participantId'], function (result) {
        if (result.participantId == undefined || result.participantId == "") {
            createParticipant();
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

// EXTERNAL MODULE: ./src/background/exportedFunctions.ts
var exportedFunctions = __webpack_require__(144);
;// CONCATENATED MODULE: ./src/html/reminderModal.html
// Module
var code = "<html lang=\"en\"> <head> <link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\"> <meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"> <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"> <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin> <link href=\"https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap\" rel=\"stylesheet\"> </head> <div class=\"modal\" style=\"width:75%!important\" id=\"modal1\" tabindex=\"0\"> <div class=\"modal-content\"><img> <div class=\"input-field\"> <div class=\"row\"> <p style=\"font-size:20px\"> Du wolltest gerade eigentlich lernen, falls du diese Seite nicht zum Lernen benutzt setzte dir ein konkretes Ziel: </p> </div> <div class=\"row\"> <input id=\"goalInput\" class=\"autocomplete col s9\" placeholder=\"Was ist Ihr Ziel beim Besuch von www.google.de\"> <div class=\"input-field col\" id=\"timeSelect\" style=\"width:200px;height:50px;font-size:14px;font-weight:700\"><select id=\"timeSelectValue\" class=\"browser-default\"> <option value=\"1\">1Minute</option> <option value=\"2\">2 Minuten</option> <option value=\"3\">3 Minuten</option> <option value=\"4\">4 Minuten</option> <option value=\"5\">5 Minuten</option> <option value=\"10\">10 Minuten</option> <option value=\"15\">15 Minuten</option> <option value=\"20\">20 Minuten</option> <option value=\"25\">25 Minuten</option> <option value=\"30\">30 Minuten</option> <option value=\"45\">45 Minuten</option> <option value=\"60\">60 Minuten</option> </select></div> </div> </div> <div class=\"input-field\" id=\"selectDiv\"> <div class=\"row s2\"></div> </div> <div class=\"row\"> <button id=\"submitButton\" class=\"col offset-s9 s3 waves-effect waves-light btn-large\">Ziel setzen</button> </div> </div> </div> <div class=\"modal\" style=\"width:80%!important\" id=\"reminderModal\"> <div class=\"modal-content\"> <div class=\"row\"> <div class=\"col s2\" id=\"imgContainer\"> </div> <div class=\"col align-bottom\"> <p id=\"goalSpan\" style=\"font-size:35px\"></p> </div> </div> <div class=\"row offset-s2\"> <form> <div class=\"col offset-s1\"> <div class=\"card-panel teal lighten-5\" id=\"option1\"> <label> <input name=\"reason\" type=\"radio\" class=\"with-gap\" value=\"Ich habe mein Ziel noch nicht erreicht.\" id=\"option1Button\"> <span style=\"font-size:14px;font-weight:700;color:#000\">Ich habe mein Ziel noch nicht erreicht.</span> </label> </div> </div> <div class=\"col\"> <div class=\"card-panel teal lighten-5\" id=\"option2\"> <label> <input name=\"reason\" type=\"radio\" class=\"with-gap\" value=\"Ich brauche noch mehr Erholung.\" id=\"option2Button\"> <span style=\"font-size:14px;font-weight:700;color:#000\">Ich brauche noch mehr Erholung.</span> </label> </div> </div> <div class=\"col\"> <div class=\"card-panel teal lighten-5\" id=\"option3\"> <label> <input name=\"reason\" type=\"radio\" class=\"with-gap\" value=\"Ich hab keine Lust mehr zu lernen.\" id=\"option3Button\"> <span style=\"font-size:14px;font-weight:700;color:#000\">Ich hab keine Lust mehr zu lernen.</span> </label> </div> </div> </form> </div> </div> </div> </html> ";
// Exports
/* harmony default export */ const reminderModal = (code);
;// CONCATENATED MODULE: ./src/contentInjection/contentInjection.ts

//@ts-ignore

var currentDomain = new URL(location.href).hostname;
var reason = null;
setupContent();
function setupContent() {
    chrome.storage.local.get(['blacklist'], function (result) {
        if (result.blacklist.includes(currentDomain)) {
            createShadowrootAndAddHtml();
            openModalIfValid();
        }
    });
}
// For tab navigation
chrome.runtime.onMessage.addListener(function (message) {
    if (message.action == "Close Intervention Modal") {
        getModalInstance().close();
    }
    else if (message.action == "Open Intervention Modal") {
        openModalIfValid();
    }
    else if (message.action == "Open Reminder Modal" && (message.url === new URL(location.href).hostname)) {
        openReminder(message.goal);
    }
    else if (message.action == "Close Reminder Modal") {
        closeReminder();
    }
});
function openModalIfValid() {
    chrome.storage.local.get(['blacklist', 'baselineFinished', 'mode', 'activeWebsites'], function (result) {
        var currentDomain = new URL(location.href).hostname;
        if (result.blacklist.includes(currentDomain) && (0,exportedFunctions/* checkIfBaselineIsFinished */.p6)(result.baselineFinished) && result.mode && !checkIfAlreadyActive(result, currentDomain)) {
            if ((getShadowWrapper() === null)) {
                createShadowrootAndAddHtml();
            }
            if (!getReminderInstance().isOpen) {
                var modalInstance = getModalInstance();
                // timeout prevents site from scrolling
                if (!modalInstance.isOpen) {
                    //window.console.
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
    var isActive = false;
    result.activeWebsites.forEach(function (obj) {
        if (obj.hostname === currentDomain) {
            isActive = true;
        }
    });
    return isActive;
}
function getReminderInstance() {
    return M.Modal.getInstance(getShadowWrapper().shadowRoot.getElementById('reminderModal'));
}
function getModalInstance() {
    return M.Modal.getInstance(getShadowWrapper().shadowRoot.getElementById('modal1'));
}
function openReminder(goal) {
    var shadowWrapper = getShadowWrapper();
    shadowWrapper.shadowRoot.getElementById('goalSpan').innerText = goal;
    var reminderInstance = M.Modal.getInstance(shadowWrapper.shadowRoot.getElementById('reminderModal'));
    reminderInstance.open();
}
function setLatestAndPreviousGoals(goalInput, timeFrame) {
    chrome.storage.local.get(['previousGoals'], function (result) {
        var newPreGoals = result.previousGoals;
        newPreGoals.unshift(goalInput);
        chrome.storage.local.set({ previousGoals: newPreGoals });
    });
    chrome.runtime.sendMessage({
        action: "Set Reminder",
        goal: goalInput,
        hostname: new URL(location.href).hostname,
        reminderTime: timeFrame * 60000,
        reason: reason
    });
}
function disableShortcuts() {
    window.addEventListener('keydown', stopPropagation, true);
    window.addEventListener('keypress', stopPropagation, true);
}
function enableShortcuts() {
    window.removeEventListener('keydown', stopPropagation, true);
    window.removeEventListener('keypress', stopPropagation, true);
}
function stopPropagation(e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
}
function setUpAutoComplete() {
    var autocompleteInstance = M.Autocomplete.init(getShadowWrapper().shadowRoot.querySelectorAll('.autocomplete'));
    var newAutocompleteData = {};
    chrome.storage.local.get(['previousGoals'], function (result) {
        var previousGoals = result.previousGoals;
        previousGoals.forEach(function (entry) {
            newAutocompleteData[entry] = null;
        });
        autocompleteInstance[0].updateData(newAutocompleteData);
    });
}
function addInputAndReminderModal() {
    getShadowWrapper().shadowRoot.innerHTML += (reminderModal);
}
function createShadowrootAndAddHtml() {
    var shadowWrapper = document.createElement('div');
    shadowWrapper.id = 'shadowWrapper';
    var shadowRoot = shadowWrapper.attachShadow({ mode: 'open' });
    var materializeStyle = document.createElement('link');
    materializeStyle.type = "text/css";
    materializeStyle.media = "screen,projection";
    materializeStyle.setAttribute('rel', 'stylesheet');
    materializeStyle.setAttribute('href', exportedFunctions/* browserUrl */.Kk + 'materialize/materialize.min.css');
    var materializeJs = document.createElement('script');
    materializeJs.type = "text/javascript";
    materializeJs.src = exportedFunctions/* browserUrl */.Kk + 'materialize/materialize.js';
    shadowRoot.append(materializeStyle, materializeJs);
    document.body.appendChild(shadowWrapper);
    addInputAndReminderModal();
    addFunctionality();
}
function addFunctionality() {
    initializeModals();
    addImgToReminder();
    addButtonFunctionality();
    setUpAutoComplete();
}
function addImgToReminder() {
    var imgContainer = getShadowWrapper().shadowRoot.getElementById('imgContainer');
    var img = document.createElement('img');
    var randomIcon = Math.floor(Math.random() * (5 - 1 + 1) + 1).toString();
    img.src = exportedFunctions/* browserUrl */.Kk + "img/reminder/" + randomIcon + ".png";
    imgContainer.append(img);
}
function addButtonFunctionality() {
    addSubmitButtonFunctionality();
    addRadioButtonsFunctionality();
}
function addSubmitButtonFunctionality() {
    var submitButton = getShadowWrapper().shadowRoot.getElementById('submitButton');
    var goalInput = getShadowRoot().querySelectorAll('#goalInput')[0];
    var timeSelector = getShadowRoot().getElementById('timeSelectValue');
    submitButton.addEventListener('click', function () {
        //@ts-ignore
        setLatestAndPreviousGoals(goalInput.value, timeSelector.value);
        getModalInstance().close();
    }, false);
    goalInput.addEventListener('keyup', function (event) {
        //@ts-ignore
        if (event.code === 'Enter') {
            //@ts-ignore
            setLatestAndPreviousGoals(goalInput.value, timeSelector.value);
            getModalInstance().close();
        }
    });
}
function addRadioButtonsFunctionality() {
    var radioButtons = getShadowRoot().querySelectorAll("input.with-gap");
    radioButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            getReminderInstance().options.dismissible = true;
        });
    });
    var cards = getShadowRoot().querySelectorAll('.card-panel');
    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            getReminderInstance().options.dismissible = true;
            //@ts-ignore
            getShadowRoot().getElementById(card.id + "Button").checked = true;
        });
    });
}
function closeReminder() {
    getReminderInstance().close();
}
function initializeModals() {
    M.Modal.init(getShadowRoot().getElementById('modal1'), {
        dismissible: false,
        onCloseEnd: function () {
            enableShortcuts();
        }
    });
    M.Modal.init(getShadowRoot().getElementById('reminderModal'), {
        dismissible: false,
        onCloseEnd: function () {
            setReason();
            unCheckRadioButtons();
            openModalIfValid();
            closeReminderInOtherTabs();
        }
    });
}
function unCheckRadioButtons() {
    var radioButtons = getShadowRoot().querySelectorAll("input.with-gap");
    radioButtons.forEach(function (btn) {
        //@ts-ignore
        btn.checked = false;
    });
    getReminderInstance().options.dismissible = false;
}
function getShadowWrapper() {
    return document.getElementById('shadowWrapper');
}
function getShadowRoot() {
    return getShadowWrapper().shadowRoot;
}
function setReason() {
    //@ts-ignore
    var radioButtons = getShadowRoot().querySelectorAll("input.with-gap");
    radioButtons.forEach(function (btn) {
        //@ts-ignore
        if (btn.checked) {
            //@ts-ignore
            reason = btn.value;
        }
    });
}
function closeReminderInOtherTabs() {
    chrome.runtime.sendMessage({
        action: "Close Reminder in every Tab",
        hostname: currentDomain
    });
}

})();

/******/ })()
;