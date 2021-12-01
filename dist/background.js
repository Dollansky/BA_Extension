/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
let startTimeintervall;
let lastDomain = "";
let lastClicked = 0;
// const serverUrl = "http://217.160.214.199:8080/api/timeIntervall/create";
const serverUrl = "nurdamitsgeht";
chrome.storage.local.set({ activeWebsites: [] });
setInterval(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        if (tab[0]) {
            checkDomain(tab[0].url, tab[0].id);
        }
    });
}, 1000);
var today = new Date();
chrome.storage.local.set({ baselineFinished: [today.getDay() + 7, today.getMonth(), today.getFullYear()] });
// TODO FIX EVERY result.baselineFinished-7 remove -7
function checkDomain(website, tabId) {
    try {
        const url = new URL(website);
        const currentDomain = url.hostname;
        window.console.log(currentDomain);
        if (currentDomain !== lastDomain) {
            chrome.storage.local.get(['blacklist', 'mode', 'baselineFinished'], (result) => {
                var today = new Date();
                // TODO REMOVE THE -7
                var baselineFinished = new Date(result.baselineFinished[2], result.baselineFinished[1], result.baselineFinished[0] - 7);
                var intervene = (today > baselineFinished);
                if (result.blacklist.includes(currentDomain) && intervene && (result.mode === true)) {
                    chrome.tabs.sendMessage(tabId, { domain: currentDomain, openReminder: false });
                }
                if (result.blacklist.includes(lastDomain)) {
                    sendIntervall(lastDomain, true, startTimeintervall, result.mode, intervene);
                }
                else {
                    sendIntervall(lastDomain, false, startTimeintervall, result.mode, intervene);
                }
                startTimeintervall = new Date().getTime();
                lastDomain = currentDomain;
            });
        }
    }
    catch (e) {
    }
}
function sendIntervall(domain, blacklisted, startTime, mode, baselineFinished) {
    let timeSpend = (new Date().getTime() - startTime) / 1000;
    var latestGoal = '';
    chrome.storage.local.get(['activeWebsites'], (result) => {
        result.activeWebsites.forEach(obj => {
            if (obj.hostname === domain) {
                latestGoal = obj.goal;
            }
        });
    });
    let newTimeIntervallDto = new TimeIntervall_ts_1.TimeIntervallDto(999, mode, blacklisted, timeSpend, baselineFinished, latestGoal);
    if (domain !== "") {
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
}
chrome.browserAction.onClicked.addListener(function () {
    chrome.storage.local.get(['mode'], (result) => {
        if (lastClicked > (Date.now() - 500) / 1000) {
            chrome.tabs.create({ url: 'chrome-extension://' + chrome.runtime.id + '/options/options.html' });
        }
        if (result.mode === true) {
            chrome.browserAction.setIcon({ path: 'img/break.png' });
            chrome.storage.local.set({ mode: false });
        }
        else {
            chrome.storage.local.set({ mode: true });
            chrome.browserAction.setIcon({ path: 'img/work.png' });
        }
        lastClicked = Date.now() / 1000;
    });
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    let reminderExpiration = Date.now() + message.reminderTime;
    let tabId = sender.tab.id;
    let hostname = message.hostname;
    chrome.storage.local.get(['activeWebsites'], (result) => {
        result.activeWebsites.unshift({
            hostname: hostname,
            reminderRunning: reminderExpiration,
            goal: message.goal,
            tabId: tabId
        });
        chrome.storage.local.set({ activeWebsites: result.activeWebsites });
    });
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            if (hostname === new URL(tab.url).hostname) {
                chrome.tabs.sendMessage(tab.id, {
                    openReminder: false,
                    goal: message.goal,
                    url: message.hostname,
                    closeModal: true
                });
            }
        });
    });
    setTimeout(() => {
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
                if (hostname === new URL(tab.url).hostname) {
                    chrome.tabs.sendMessage(tab.id, {
                        openReminder: true,
                        goal: message.goal,
                        url: message.hostname,
                        closeModal: false
                    });
                }
            });
        });
        chrome.storage.local.get(['activeWebsites'], (result) => {
            let newArray = [];
            result.activeWebsites.forEach(obj => {
                if (obj.hostname !== hostname) {
                    newArray.unshift(obj);
                }
            });
            chrome.storage.local.set({ activeWebsites: newArray });
        });
    }, message.reminderTime);
});

})();

/******/ })()
;