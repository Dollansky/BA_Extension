/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 144:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports serverUrl, browserUrl, checkIfModeActive, sendMessageToEveryTab, openModeSelectInCurrentTab, checkIfBaselineIsFinished, updateIconTimer, calcIconTimer, setIcon, fetchParticipantId, checkIfParticipantIdIsSet, onInstalledDo */
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


/***/ }),

/***/ 709:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports TimeIntervall, TimeIntervallDto */
var TimeIntervall = /** @class */ (function () {
    function TimeIntervall(domain, blacklisted, workMode, startTime, endTime, baselineFinished, goal) {
        this.domain = domain;
        this.goal = goal;
        this.blacklisted = blacklisted;
        this.workMode = workMode;
        this.startTime = startTime;
        this.endTime = endTime;
    }
    return TimeIntervall;
}());

var TimeIntervallDto = /** @class */ (function () {
    function TimeIntervallDto(participantId, mode, domain, blacklisted, timeSpend, baselineFinished, started, ended, goalId, goal, reason) {
        this.participantId = participantId;
        this.mode = mode;
        this.domain = domain;
        this.blacklisted = blacklisted;
        this.timeSpend = timeSpend;
        this.baselineFinished = baselineFinished;
        this.started = started;
        this.ended = ended;
        this.goalId = goalId;
        this.goal = goal;
        this.reason = reason;
    }
    return TimeIntervallDto;
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
/* unused harmony exports checkDomain, checkIfCriticalDataIsUndefined, sendIntervallAndGetGoal, sendIntervall, openOrCloseModalOnEveryTab, updateActiveWebsitesAndCreateAlarm, addNewActiveWebsite, removeActiveWebsite */
/* harmony import */ var _models_TimeIntervall__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(709);
/* harmony import */ var _exportedFunctions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(144);


function checkDomain(website, tabId) {
    try {
        var currentDomain_1 = new URL(website).hostname;
        chrome.storage.local.get(['blacklist', 'mode', 'baselineFinished', 'participantId', 'lastDomain', 'startTimeIntervall', 'dateWhenModeEnds'], function (result) {
            if (currentDomain_1 !== result.lastDomain) {
                checkIfCriticalDataIsUndefined(result);
                var baselineFinished = checkIfBaselineIsFinished(result.baselineFinished);
                if (result.blacklist.includes(currentDomain_1) && baselineFinished && (result.mode === true)) {
                    // Open Modal
                    chrome.tabs.sendMessage(tabId, { domain: currentDomain_1, action: "Open Intervention Modal" });
                }
                sendIntervallAndGetGoal(result.lastDomain, result.blacklist.includes(result.lastDomain), result.startTimeIntervall, result.mode, baselineFinished, result.participantId);
                setUpForNextTimeIntervall(currentDomain_1);
            }
        });
    }
    catch (e) {
    }
}
function setUpForNextTimeIntervall(currentDomain) {
    chrome.storage.local.set({ startTimeIntervall: new Date().getTime() });
    chrome.storage.local.set({ lastDomain: currentDomain });
}
function checkIfCriticalDataIsUndefined(result) {
    if (result.dateWhenModeEnds < Date.now()) {
        sendMessageToEveryTab("Open Mode Select");
    }
    checkIfParticipantIdIsSet();
}
function sendIntervallAndGetGoal(domain, blacklisted, startTime, mode, baselineFinished, participantId) {
    removeActiveWebsite("");
    var timeSpend = (new Date().getTime() - startTime) / 1000;
    var latestGoal = null;
    var reasonToStay = null;
    var goalId = null;
    chrome.storage.local.get(['activeWebsites', 'atLeastOne'], function (result) {
        if (result.atLeastOne != null) {
            latestGoal = result.atLeastOne.goal;
            reasonToStay = result.atLeastOne.reason;
            goalId = result.atLeastOne.goalId;
            chrome.storage.local.set({ atLeastOne: null });
        }
        result.activeWebsites.forEach(function (obj) {
            if (obj.hostname === domain) {
                goalId = obj.goalId;
                latestGoal = obj.goal;
                reasonToStay = obj.reason;
            }
            ;
        });
        var newTimeIntervallDto = new TimeIntervallDto(participantId, mode, domain, blacklisted, timeSpend, baselineFinished, startTime, new Date().getTime(), goalId, latestGoal, reasonToStay);
        if (domain !== "") {
            sendIntervall(newTimeIntervallDto);
        }
    });
}
function sendIntervall(newTimeIntervallDto) {
    if (newTimeIntervallDto.participantId != undefined && newTimeIntervallDto.participantId != "") {
        fetch(serverUrl + "timeIntervall/create", {
            method: 'post',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(newTimeIntervallDto)
        })
            .then()
            .then(function (data) {
        })
            .catch(function (error) {
        });
    }
}
function openOrCloseModalOnEveryTab(hostname, message, action) {
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
function updateActiveWebsitesAndCreateAlarm(hostname, reminderDuration, message, tabId) {
    addNewActiveWebsite(hostname, Date.now() + reminderDuration, message, tabId);
    openOrCloseModalOnEveryTab(hostname, message, "Close Intervention Modal");
    chrome.alarms.create("Goal Setting Extension/" + hostname + "/" + message.goal, { delayInMinutes: reminderDuration / 60000 });
}
function addNewActiveWebsite(hostname, reminderExpiration, message, tabId) {
    chrome.storage.local.get(['activeWebsites'], function (result) {
        result.activeWebsites.unshift({
            hostname: hostname,
            reminderRunning: reminderExpiration,
            goal: message.goal,
            reason: message.reason
        });
        chrome.storage.local.set({ activeWebsites: result.activeWebsites });
    });
}
function removeActiveWebsite(hostname) {
    var buffer = 0;
    if (hostname == "") {
        buffer = 2000;
    }
    chrome.storage.local.get(['activeWebsites'], function (result) {
        console.log(result.activeWebsites);
        var updatedActiveWebsites = [];
        result.activeWebsites.forEach(function (obj) {
            if (obj.hostname !== hostname && obj.reminderRunning + buffer > Date.now()) {
                updatedActiveWebsites.unshift(obj);
            }
        });
        chrome.storage.local.set({ activeWebsites: updatedActiveWebsites });
    });
}

})();

/******/ })()
;