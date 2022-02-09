/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 144:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KB": () => (/* binding */ serverUrl)
/* harmony export */ });
/* unused harmony exports browserUrl, checkIfModeActive, sendMessageToEveryTab, openModeSelectInCurrentTab, checkIfBaselineIsFinished, updateIconTimer, calcIconTimer, setIcon, fetchParticipantId, checkIfParticipantIdIsSet, onInstalledDo */
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
                chrome.browserAction.setBadgeText({ text: timeTillModeEnds });
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
            chrome.browserAction.setIcon({ path: 'img/break.png' });
        }
        else if (result.mode === true) {
            chrome.browserAction.setIcon({ path: 'img/work.png' });
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
            chrome.browserAction.setIcon({ path: 'img/work.png' });
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


/***/ }),

/***/ 749:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "I": () => (/* binding */ BlackList)
/* harmony export */ });
var BlackList = /** @class */ (function () {
    function BlackList(participantId, blacklist, updated) {
        this.participantId = participantId;
        this.blacklist = blacklist;
        this.updated = updated;
    }
    return BlackList;
}());



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
/* harmony import */ var _background_exportedFunctions_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(144);
/* harmony import */ var _models_BlackList_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(749);
//@ts-ignore

//@ts-ignore

var blacklist;
var previousGoals;
setUpBlacklist();
function openHelp() {
    var insModal = M.Modal.getInstance(document.getElementById('instructionsModal'));
    insModal.open();
}
function setUpBlacklist() {
    chrome.storage.local.get(['blacklist', 'previousGoals', 'instructionCheck'], function (result) {
        var listContainer = document.getElementById('blacklist');
        var listElement = document.createElement('ul');
        listContainer.appendChild(listElement);
        blacklist = result.blacklist;
        previousGoals = result.previousGoals;
        blacklist.forEach(function (domain) {
            addToTable(domain);
        });
        var submit = document.getElementById('submitDomain');
        submit.addEventListener('click', function () {
            newDomain();
        });
        document.getElementById('newDomain').addEventListener('keyup', function (event) {
            if (event.code === 'Enter') {
                newDomain();
            }
        });
        M.AutoInit(document.body);
        document.getElementById('helpButton').addEventListener("click", function () {
            openHelp();
        });
    });
}
function removeDomain(domain) {
    chrome.storage.local.get(['blacklist', 'participantId'], function (result) {
        var newBlacklist = result.blacklist;
        chrome.storage.local.set({ blacklist: newBlacklist.filter(function (entry) { return entry !== domain; }) });
        sendUpdatedBlacklist(newBlacklist, result.participantId);
        openToast(domain + ' wurde aus der Blacklist entfernt');
        removeInTable(domain);
    });
}
function newDomain() {
    var newDomain = document.getElementsByTagName('input');
    var currentDomain;
    try {
        var url = new URL(newDomain[0].value);
        currentDomain = url.hostname;
    }
    catch (e) {
        currentDomain = newDomain[0].value;
    }
    updateBlacklist(currentDomain);
}
function updateBlacklist(currentDomain) {
    chrome.storage.local.get(['blacklist', 'participantId'], function (result) {
        var newBlacklist = result.blacklist;
        if (newBlacklist.filter(function (entry) { return entry === currentDomain; }).length === 0 && currentDomain != "") {
            //@ts-ignore
            document.getElementById('newDomain').value = "";
            newBlacklist.unshift(currentDomain);
            chrome.storage.local.set({ blacklist: newBlacklist });
            M.Modal.getInstance(document.getElementById("modal1")).close();
            document.getElementById('newDomain').setAttribute('class', 'valid');
            sendUpdatedBlacklist(newBlacklist, result.participantId);
            openToast(currentDomain + ' wurde der Blacklist hinzugefügt');
            addToTable(currentDomain);
        }
        else if (currentDomain != "") {
            M.Modal.getInstance(document.getElementById("modal1")).close();
            openToast("Die Website ist bereits in der Liste");
        }
    });
}
function sendUpdatedBlacklist(blacklist, participantId) {
    var newBlackList = new _models_BlackList_ts__WEBPACK_IMPORTED_MODULE_1__/* .BlackList */ .I(participantId, blacklist, Date.now());
    fetch(_background_exportedFunctions_ts__WEBPACK_IMPORTED_MODULE_0__/* .serverUrl */ .KB + "blacklist/create", {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(newBlackList)
    })
        .then()
        .then(function (data) {
    })
        .catch(function (error) {
    });
}
function openToast(message) {
    M.toast({ html: message });
}
function removeInTable(domain) {
    document.getElementById(domain).hidden = true;
}
function addToTable(domain) {
    var tableRow = document.createElement('tr');
    tableRow.id = domain;
    // Icon create
    var icon = document.createElement('td');
    var img = document.createElement('img');
    img.src = "http://www.google.com/s2/favicons?domain=" + domain;
    icon.appendChild(img);
    // Domain setting
    var domainTD = document.createElement('td');
    var domainText = document.createElement('p');
    domainText.setAttribute('font-size', '23');
    domainText.innerText = domain;
    domainTD.appendChild(domainText);
    // Button creation
    var buttonTD = document.createElement('td');
    buttonTD.className = 'right-align';
    var removeButton = document.createElement('button');
    removeButton.id = domain;
    removeButton.className = "waves-effect waves-light btn";
    var removeIcon = document.createElement('i');
    removeIcon.setAttribute('class', 'material-icons');
    removeIcon.innerText = "remove_circle";
    removeButton.appendChild(removeIcon);
    removeButton.addEventListener('click', function () {
        removeDomain(domain);
    }, false);
    buttonTD.appendChild(removeButton);
    tableRow.append(icon, domainTD, buttonTD);
    var table = document.getElementById('blacklist');
    table.appendChild(tableRow);
}
chrome.runtime.onMessage.addListener(function (message) {
    if (message.action == "firstInstall") {
        openHelp();
    }
});

})();

/******/ })()
;