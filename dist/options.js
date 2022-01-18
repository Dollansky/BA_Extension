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


/***/ }),

/***/ 749:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BlackList = void 0;
class BlackList {
    constructor(participantId, blacklist, updated) {
        this.participantId = participantId;
        this.blacklist = blacklist;
        this.updated = updated;
    }
}
exports.BlackList = BlackList;


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
//@ts-ignore
const BlackList_ts_1 = __webpack_require__(749);
let blacklist;
let previousGoals;
chrome.storage.local.get(['blacklist', 'previousGoals'], (result) => {
    let listContainer = document.getElementById('blacklist');
    let listElement = document.createElement('ul');
    listContainer.appendChild(listElement);
    blacklist = result.blacklist;
    previousGoals = result.previousGoals;
    blacklist.forEach(function (domain) {
        let tableRow = document.createElement('tr');
        // Icon create
        let icon = document.createElement('td');
        let img = document.createElement('img');
        img.src = "chrome://favicon/https:/" + domain;
        icon.appendChild(img);
        // Domain setting
        let domainTD = document.createElement('td');
        let domainText = document.createElement('p');
        domainText.setAttribute('font-size', '23');
        domainText.innerText = domain;
        domainTD.appendChild(domainText);
        // Button creation
        let buttonTD = document.createElement('td');
        buttonTD.className = 'right-align';
        let removeButton = document.createElement('button');
        removeButton.id = domain;
        removeButton.className = "waves-effect waves-light btn";
        let removeIcon = document.createElement('i');
        removeIcon.setAttribute('class', 'material-icons');
        removeIcon.innerText = "remove_circle";
        removeButton.appendChild(removeIcon);
        removeButton.addEventListener('click', function () {
            removeDomain(domain);
        }, false);
        buttonTD.appendChild(removeButton);
        tableRow.append(icon, domainTD, buttonTD);
        let table = document.getElementById('blacklist');
        table.appendChild(tableRow);
    });
    const submit = document.getElementById('submitDomain');
    submit.addEventListener('click', function () {
        newDomain();
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        M.AutoInit(document.body);
    });
});
function removeDomain(domain) {
    chrome.storage.local.get(['blacklist'], (result) => {
        const newBlacklist = result.blacklist;
        chrome.storage.local.set({ blacklist: newBlacklist.filter(entry => entry !== domain) });
        sendUpdatedBlacklist(newBlacklist);
        window.location.reload();
    });
}
function newDomain() {
    const newDomain = document.getElementsByTagName('input');
    try {
        const url = new URL(newDomain[0].value);
        const currentDomain = url.hostname;
        chrome.storage.local.get(['blacklist'], (result) => {
            const newBlacklist = result.blacklist;
            if (newBlacklist.filter(entry => entry === currentDomain).length === 0) {
                newBlacklist.unshift(currentDomain);
                chrome.storage.local.set({ blacklist: newBlacklist });
                M.Modal.getInstance(document.getElementById("modal1")).close();
                document.getElementById('newDomain').setAttribute('class', 'valid');
                sendUpdatedBlacklist(newBlacklist);
                window.location.reload();
            }
            else {
                document.getElementsByTagName('input')[0].value = "Die Website ist bereits in der Liste.";
            }
        });
    }
    catch (e) {
        document.getElementById('newDomain').setAttribute('class', 'invalid');
        document.getElementsByTagName('input')[0].value = "Bitte kopieren Sie die komplette Adresse der Website. Bsp. https://www.google.de/";
    }
}
function sendUpdatedBlacklist(blacklist) {
    var newBlackList = new BlackList_ts_1.BlackList(exportedFunctions_ts_1.participantId, blacklist, Date.now());
    var xhr = new XMLHttpRequest();
    xhr.open('POST', exportedFunctions_ts_1.serverUrl + "blacklist/create", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = apiHandler;
    xhr.send(JSON.stringify(newBlackList));
    window.console.log("updatedBlacklist:", newBlackList);
    function apiHandler(xhr) {
        if (xhr.readyState === 1) {
            xhr.setRequestHeader("Content-type", "application/json");
        }
        if (xhr.readyState === 4 && xhr.status === 200) {
            xhr.open('POST', exportedFunctions_ts_1.serverUrl, true);
        }
    }
}

})();

/******/ })()
;