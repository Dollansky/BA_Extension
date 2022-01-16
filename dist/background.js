/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 144:
/***/ ((__unused_webpack_module, exports) => {


// Webpack imports whole file this is a workaround
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.calcIconTimer = exports.updateIconTimer = exports.checkIfBaselineIsFinished = exports.openOrCloseModeSelectInEveryTab = exports.checkIfModeActive = void 0;
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
function openOrCloseModeSelectInEveryTab(open) {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            chrome.tabs.sendMessage(tab.id, {
                action: open
            });
        });
    });
}
exports.openOrCloseModeSelectInEveryTab = openOrCloseModeSelectInEveryTab;
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
        return hour + `h`;
    }
    else if (minutes > 1) {
        return minutes + 'min';
    }
    else {
        return seconds + 'sec';
    }
}
exports.calcIconTimer = calcIconTimer;


/***/ }),

/***/ 709:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimeIntervallDto = exports.TimeIntervall = void 0;
class TimeIntervall {
    constructor(domain, blacklisted, workMode, startTime, endTime, baselineFinished, goal) {
        this.domain = domain;
        this.goal = goal;
        this.blacklisted = blacklisted;
        this.workMode = workMode;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
exports.TimeIntervall = TimeIntervall;
class TimeIntervallDto {
    constructor(participantId, mode, blacklisted, timeSpend, baselineFinished, goal) {
        this.participantId = participantId;
        this.mode = mode;
        this.goal = goal;
        this.blacklisted = blacklisted;
        this.timeSpend = timeSpend;
        this.baselineFinished = baselineFinished;
    }
}
exports.TimeIntervallDto = TimeIntervallDto;


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
// @ts-ignore
const TimeIntervall_ts_1 = __webpack_require__(709);
// @ts-ignore
const exportedFunctions_ts_1 = __webpack_require__(144);
let startTimeintervall = 0;
let lastDomain = "";
// const serverUrl = "http://217.160.214.199:8080/api/timeIntervall/create";
const serverUrl = "nurdamitsgeht";
chrome.storage.local.set({ activeWebsites: [] });
var today = new Date();
chrome.storage.local.set({ baselineFinished: [today.getDay() + 7, today.getMonth(), today.getFullYear()] });
setInterval(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        if (tab[0]) {
            checkDomain(tab[0].url, tab[0].id);
        }
    });
}, 1000);
// TODO FIX EVERY result.baselineFinished-7 remove -7
function checkDomain(website, tabId) {
    try {
        const currentDomain = new URL(website).hostname;
        if (currentDomain !== lastDomain) {
            chrome.storage.local.get(['blacklist', 'mode', 'baselineFinished'], (result) => {
                if (result.mode === null) {
                    exportedFunctions_ts_1.openOrCloseModeSelectInEveryTab("Open Mode Select");
                }
                var today = new Date();
                // TODO REMOVE THE -7 AND SWITCH FOR
                // checkIfBaselineIsFinished(result.baselineFinished)
                var baselineFinished = new Date(result.baselineFinished[2], result.baselineFinished[1], result.baselineFinished[0] - 7);
                var intervene = (today > baselineFinished);
                if (result.blacklist.includes(currentDomain) && intervene && (result.mode === true)) {
                    // Open Modal
                    chrome.tabs.sendMessage(tabId, { domain: currentDomain, action: "Open Intervention Modal" });
                }
                sendIntervallAndGetGoal(lastDomain, result.blacklist.includes(lastDomain), startTimeintervall, result.mode, intervene);
                startTimeintervall = new Date().getTime();
                lastDomain = currentDomain;
            });
        }
    }
    catch (e) {
    }
}
function sendIntervallAndGetGoal(domain, blacklisted, startTime, mode, baselineFinished) {
    let timeSpend = (new Date().getTime() - startTime) / 1000;
    var latestGoal = '';
    chrome.storage.local.get(['activeWebsites'], (result) => {
        result.activeWebsites.forEach(obj => {
            if (obj.hostname === domain) {
                latestGoal = obj.goal;
            }
        });
        let newTimeIntervallDto = new TimeIntervall_ts_1.TimeIntervallDto(999, mode, blacklisted, timeSpend, baselineFinished, latestGoal);
        if (domain !== "") {
            sendIntervall(newTimeIntervallDto);
        }
    });
}
function sendIntervall(newTimeIntervallDto) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', serverUrl, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = apiHandler;
    console.log("TimeIntervall send:", newTimeIntervallDto);
    xhr.send(JSON.stringify(newTimeIntervallDto));
    function apiHandler() {
        if (xhr.readyState === 1) {
            xhr.setRequestHeader("Content-type", "application/json");
        }
        if (xhr.readyState === 4 && xhr.status === 200) {
            xhr.open('POST', serverUrl, true);
        }
    }
}
chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action == "Set Reminder") {
        let reminderExpiration = Date.now() + message.reminderTime;
        let tabId = sender.tab.id;
        let hostname = message.hostname;
        updateActiveWebsitesAndSetTimeoutForReminder(hostname, reminderExpiration, message, tabId);
    }
});
function openOrCloseInputModalOnEveryTab(hostname, message, action) {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            if (hostname === new URL(tab.url).hostname) {
                chrome.tabs.sendMessage(tab.id, {
                    action: action,
                    goal: message.goal,
                    url: message.hostname,
                });
            }
        });
    });
}
function updateActiveWebsitesAndSetTimeoutForReminder(hostname, reminderExpiration, message, tabId) {
    addNewActiveWebsite(hostname, reminderExpiration, message, tabId);
    openOrCloseInputModalOnEveryTab(hostname, message, "Close Intervention Modal");
    setTimeout(() => {
        openOrCloseInputModalOnEveryTab(hostname, message, "Open Reminder Modal");
        removeActiveWebsite(hostname);
    }, message.reminderTime);
}
function addNewActiveWebsite(hostname, reminderExpiration, message, tabId) {
    chrome.storage.local.get(['activeWebsites'], (result) => {
        result.activeWebsites.unshift({
            hostname: hostname,
            reminderRunning: reminderExpiration,
            goal: message.goal,
            tabId: tabId
        });
        chrome.storage.local.set({ activeWebsites: result.activeWebsites });
    });
}
function removeActiveWebsite(hostname) {
    chrome.storage.local.get(['activeWebsites'], (result) => {
        let newArray = [];
        result.activeWebsites.forEach(obj => {
            if (obj.hostname !== hostname) {
                newArray.unshift(obj);
            }
        });
        chrome.storage.local.set({ activeWebsites: newArray });
    });
}

})();

/******/ })()
;