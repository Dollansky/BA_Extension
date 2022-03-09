/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 851:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ng": () => (/* binding */ checkDomain),
/* harmony export */   "UW": () => (/* binding */ openOrCloseModalOnEveryTab),
/* harmony export */   "Pp": () => (/* binding */ updateActiveWebsitesAndCreateAlarm),
/* harmony export */   "il": () => (/* binding */ removeActiveWebsite)
/* harmony export */ });
/* unused harmony exports checkIfCriticalDataIsUndefined, sendIntervallAndGetGoal, sendIntervall, addNewActiveWebsite */
/* harmony import */ var _models_TimeIntervall__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(709);
/* harmony import */ var _exportedFunctions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(144);


function checkDomain(website, tabId) {
    try {
        var currentDomain_1 = new URL(website).hostname;
        chrome.storage.local.get(['blacklist', 'mode', 'baselineFinished', 'participantId', 'lastDomain', 'startTimeIntervall', 'dateWhenModeEnds'], function (result) {
            if (currentDomain_1 !== result.lastDomain) {
                checkIfCriticalDataIsUndefined(result);
                var baselineFinished = (0,_exportedFunctions__WEBPACK_IMPORTED_MODULE_1__/* .checkIfBaselineIsFinished */ .p6)(result.baselineFinished);
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
        (0,_exportedFunctions__WEBPACK_IMPORTED_MODULE_1__/* .sendMessageToEveryTab */ .mU)("Open Mode Select");
    }
    (0,_exportedFunctions__WEBPACK_IMPORTED_MODULE_1__/* .checkIfParticipantIdIsSet */ .$T)();
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
        var newTimeIntervallDto = new _models_TimeIntervall__WEBPACK_IMPORTED_MODULE_0__/* .TimeIntervallDto */ .k(participantId, mode, domain, blacklisted, timeSpend, baselineFinished, startTime, new Date().getTime(), goalId, latestGoal, reasonToStay);
        if (domain !== "") {
            sendIntervall(newTimeIntervallDto);
        }
    });
}
function sendIntervall(newTimeIntervallDto) {
    if (newTimeIntervallDto.participantId != undefined && newTimeIntervallDto.participantId != "") {
        fetch(_exportedFunctions__WEBPACK_IMPORTED_MODULE_1__/* .serverUrl */ .KB + "timeIntervall/create", {
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
        var updatedActiveWebsites = [];
        result.activeWebsites.forEach(function (obj) {
            if (obj.hostname !== hostname && obj.reminderRunning + buffer > Date.now()) {
                updatedActiveWebsites.unshift(obj);
            }
        });
        chrome.storage.local.set({ activeWebsites: updatedActiveWebsites });
    });
}


/***/ }),

/***/ 144:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KB": () => (/* binding */ serverUrl),
/* harmony export */   "Kk": () => (/* binding */ browserUrl),
/* harmony export */   "$N": () => (/* binding */ checkIfModeActive),
/* harmony export */   "mU": () => (/* binding */ sendMessageToEveryTab),
/* harmony export */   "p6": () => (/* binding */ checkIfBaselineIsFinished),
/* harmony export */   "JH": () => (/* binding */ updateIconTimer),
/* harmony export */   "Bf": () => (/* binding */ setIcon),
/* harmony export */   "$T": () => (/* binding */ checkIfParticipantIdIsSet)
/* harmony export */ });
/* unused harmony exports openModeSelectInCurrentTab, calcIconTimer, onInstalledDo */
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
        if (result.participantId == undefined || result.participantId == "") {
            (0,_onInstallationSetup__WEBPACK_IMPORTED_MODULE_0__/* .createParticipant */ .Yn)();
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

/***/ 568:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "O": () => (/* binding */ sendGoalAndSaveId)
/* harmony export */ });
/* harmony import */ var _exportedFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(144);
/* harmony import */ var _models_goal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(805);


function sendGoalAndSaveId(setGoal, domain, setGoalTime, reason) {
    chrome.storage.local.get(['participantId'], function (result) {
        var goal = new _models_goal__WEBPACK_IMPORTED_MODULE_1__/* .Goal */ .k(result.participantId, setGoal, reason, domain, setGoalTime);
        fetch(_exportedFunctions__WEBPACK_IMPORTED_MODULE_0__/* .serverUrl */ .KB + "goal/create", {
            method: 'post',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(goal)
        }).then(function (response) { return response.text(); })
            .then(function (data) {
            addGoalId(data, domain);
        })
            .catch(function () {
        });
    });
}
function addGoalId(goalId, domain) {
    chrome.storage.local.get(['activeWebsites'], function (result) {
        var updatedActiveWebsites = [];
        result.activeWebsites.forEach(function (obj) {
            if (obj.hostname == domain) {
                var activeWebsite = {
                    hostname: obj.hostname,
                    reminderRunning: obj.reminderRunning,
                    goal: obj.goal,
                    reason: obj.reason,
                    goalId: goalId
                };
                updatedActiveWebsites.unshift(activeWebsite);
                chrome.storage.local.set({ atLeastOne: activeWebsite });
            }
            else {
                updatedActiveWebsites.unshift(obj);
            }
        });
        chrome.storage.local.set({ activeWebsites: updatedActiveWebsites });
    });
}


/***/ }),

/***/ 411:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Mj": () => (/* binding */ handleModeChange),
/* harmony export */   "$X": () => (/* binding */ setModeAlarm),
/* harmony export */   "No": () => (/* binding */ sendMode),
/* harmony export */   "g_": () => (/* binding */ calcDateWhenModeEnds)
/* harmony export */ });
/* unused harmony export sendModeDto */
/* harmony import */ var _exportedFunctions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(144);
/* harmony import */ var _models_ModeDto_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(245);
//@ts-ignore

//@ts-ignore

function handleModeChange(mode) {
    if (mode) {
        (0,_exportedFunctions__WEBPACK_IMPORTED_MODULE_0__/* .sendMessageToEveryTab */ .mU)("Open Intervention Modal");
    }
    else {
        (0,_exportedFunctions__WEBPACK_IMPORTED_MODULE_0__/* .sendMessageToEveryTab */ .mU)("Close Intervention Modal");
    }
}
function setModeAlarm(dateWhenModeEnds) {
    chrome.alarms.create('No Mode', { delayInMinutes: (dateWhenModeEnds - Date.now()) / 60000 });
}
function sendModeDto(mode, dateWhenModeEnds, duration, participantId) {
    var newModeDto = new _models_ModeDto_ts__WEBPACK_IMPORTED_MODULE_1__/* .ModeDto */ .$(participantId, mode, dateWhenModeEnds, duration);
    fetch(_exportedFunctions__WEBPACK_IMPORTED_MODULE_0__/* .serverUrl */ .KB + "modeDto/create", {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(newModeDto)
    })
        .then()
        .then(function (data) {
    })
        .catch(function (error) {
    });
}
function sendMode(mode, dateWhenModeEnds, duration) {
    chrome.storage.local.get(['participantId'], function (result) {
        sendModeDto(mode, dateWhenModeEnds, duration, result.participantId);
    });
}
function calcDateWhenModeEnds(time) {
    if (time != null) {
        var currTime = new Date;
        var hour = currTime.getHours();
        var minutes = currTime.getMinutes();
        var day = currTime.getDate();
        var setHour = time[0] + time[1];
        var setMinute = time[3] + time[4];
        if (hour > setHour || hour == setHour && minutes >= setMinute) {
            // next day ?
            day += 1;
        }
        var dateWhenModeEnds = new Date(currTime.getFullYear(), currTime.getMonth(), day, setHour, setMinute);
        return dateWhenModeEnds.getTime();
    }
}


/***/ }),

/***/ 765:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "nG": () => (/* binding */ onInstalledDo),
/* harmony export */   "Yn": () => (/* binding */ createParticipant),
/* harmony export */   "yP": () => (/* binding */ checkIfParticipantIdSet)
/* harmony export */ });
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

function onInstalledDo() {
    chrome.storage.local.get(['blacklist', 'baselineFinished', 'previousGoals', 'lastDomain', 'activeWebsites', 'mode', 'dateWhenModeEnds', 'participantId', 'einwilligung'], function (result) {
        if (result.blacklist == undefined) {
            var blacklist = ["www.instagram.com", "www.facebook.com", "www.youtube.com", "www.netflix.com", "www.twitch.tv"];
            chrome.storage.local.set({ blacklist: blacklist });
            chrome.action.setIcon({ path: 'img/work.png' });
            chrome.bookmarks.create({
                parentId: '1',
                title: 'Optionen für Zielsetzungs-Erweiterung',
                url: _exportedFunctions__WEBPACK_IMPORTED_MODULE_0__/* .browserUrl */ .Kk + 'options/options.html'
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
            chrome.storage.local.set({ dateWhenModeEnds: Date.now() + 300000 });
        }
        if (result.participantId == undefined) {
            (0,_exportedFunctions__WEBPACK_IMPORTED_MODULE_0__/* .checkIfParticipantIdIsSet */ .$T)();
            setTimeout(function () {
                chrome.tabs.create({ url: _exportedFunctions__WEBPACK_IMPORTED_MODULE_0__/* .browserUrl */ .Kk + 'options/options.html' });
                setTimeout(function () {
                    chrome.runtime.sendMessage({ action: "firstInstall" });
                }, 500);
            }, 1000);
        }
        if (result.startTimeIntervall == undefined) {
            chrome.storage.local.set({ startTimeIntervall: new Date().getTime() });
        }
        if (result.einwilligung == undefined) {
            chrome.storage.local.set({ einwilligung: false });
        }
    });
}
function createParticipant() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            fetch(_exportedFunctions__WEBPACK_IMPORTED_MODULE_0__/* .serverUrl */ .KB + "participant/create", {
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


/***/ }),

/***/ 245:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$": () => (/* binding */ ModeDto)
/* harmony export */ });
var ModeDto = /** @class */ (function () {
    function ModeDto(participantId, mode, dateWhenModeEnds, duration) {
        this.participantId = participantId;
        this.mode = mode;
        this.dateWhenModeEnds = dateWhenModeEnds;
        this.duration = duration;
    }
    return ModeDto;
}());



/***/ }),

/***/ 709:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "k": () => (/* binding */ TimeIntervallDto)
/* harmony export */ });
/* unused harmony export TimeIntervall */
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



/***/ }),

/***/ 805:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "k": () => (/* binding */ Goal)
/* harmony export */ });
var Goal = /** @class */ (function () {
    function Goal(participantId, goal, reason, domain, setGoalTime) {
        this.participantId = participantId;
        this.goal = goal;
        this.reason = reason;
        this.domain = domain;
        this.setGoalTime = setGoalTime;
    }
    return Goal;
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
/* harmony import */ var _onInstallationSetup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(765);
/* harmony import */ var _background__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(851);
/* harmony import */ var _exportedFunctions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(144);
/* harmony import */ var _modeSelection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(411);
/* harmony import */ var _goalHandler__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(568);





chrome.runtime.onInstalled.addListener(function (details) {
    (0,_onInstallationSetup__WEBPACK_IMPORTED_MODULE_0__/* .onInstalledDo */ .nG)();
});
chrome.tabs.onUpdated.addListener((function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        checkIfNewWebsite();
    }
}));
chrome.tabs.onActivated.addListener(function (res) {
    checkIfNewWebsite();
});
function checkIfNewWebsite() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        if (tab[0]) {
            (0,_background__WEBPACK_IMPORTED_MODULE_1__/* .checkDomain */ .Ng)(tab[0].url, tab[0].id);
        }
    });
    routineCheck();
}
chrome.runtime.onMessage.addListener(function (message, sender) {
    if (message.action == "Set Reminder") {
        var tabId = sender.tab.id;
        var hostname = message.hostname;
        (0,_background__WEBPACK_IMPORTED_MODULE_1__/* .updateActiveWebsitesAndCreateAlarm */ .Pp)(hostname, message.reminderTime, message, tabId);
        (0,_goalHandler__WEBPACK_IMPORTED_MODULE_4__/* .sendGoalAndSaveId */ .O)(message.goal, hostname, message.reminderTime / 1000, message.reason);
    }
    if (message.action == "Close Reminder in every Tab") {
        (0,_background__WEBPACK_IMPORTED_MODULE_1__/* .openOrCloseModalOnEveryTab */ .UW)(message.hostname, "", "Close Reminder Modal");
    }
    if (message.action == "Set Mode Selection") {
        setModeSelection(message);
    }
    if (message.action == "Send Participant") {
        (0,_onInstallationSetup__WEBPACK_IMPORTED_MODULE_0__/* .checkIfParticipantIdSet */ .yP)(message.name, message.email);
    }
    if (message.action == "Close Participant") {
        (0,_exportedFunctions__WEBPACK_IMPORTED_MODULE_2__/* .sendMessageToEveryTab */ .mU)("Close Participant Modal");
        chrome.runtime.sendMessage({ action: "firstInstall" });
    }
});
chrome.alarms.onAlarm.addListener(function (alarm) {
    var splitAlarm = alarm.name.split("/");
    if (splitAlarm[0] == "Goal Setting Extension") {
        var hostname = splitAlarm[1];
        (0,_background__WEBPACK_IMPORTED_MODULE_1__/* .openOrCloseModalOnEveryTab */ .UW)(hostname, { hostname: hostname, goal: splitAlarm[2] }, "Open Reminder Modal");
        (0,_background__WEBPACK_IMPORTED_MODULE_1__/* .removeActiveWebsite */ .il)(hostname);
        chrome.alarms.clear(alarm.name);
    }
    else if (alarm.name == "No Mode") {
        routineCheck();
    }
});
chrome.runtime.onStartup.addListener(function () {
    setUpAfterStartUp();
});
function setModeSelection(message) {
    var dateWhenModeEnds = (0,_modeSelection__WEBPACK_IMPORTED_MODULE_3__/* .calcDateWhenModeEnds */ .g_)(message.time);
    if (dateWhenModeEnds != null) {
        chrome.storage.local.set({ mode: message.mode });
        (0,_modeSelection__WEBPACK_IMPORTED_MODULE_3__/* .handleModeChange */ .Mj)(message.mode);
        chrome.storage.local.set({ dateWhenModeEnds: dateWhenModeEnds });
        (0,_exportedFunctions__WEBPACK_IMPORTED_MODULE_2__/* .setIcon */ .Bf)();
        (0,_exportedFunctions__WEBPACK_IMPORTED_MODULE_2__/* .updateIconTimer */ .JH)();
        (0,_modeSelection__WEBPACK_IMPORTED_MODULE_3__/* .setModeAlarm */ .$X)(dateWhenModeEnds);
        (0,_exportedFunctions__WEBPACK_IMPORTED_MODULE_2__/* .sendMessageToEveryTab */ .mU)("Close Mode Select");
        (0,_modeSelection__WEBPACK_IMPORTED_MODULE_3__/* .sendMode */ .No)(message.mode, dateWhenModeEnds, (dateWhenModeEnds - Date.now()));
    }
}
function setUpAfterStartUp() {
    chrome.storage.local.set({ startTimeIntervall: new Date().getTime() });
    chrome.storage.local.set({ lastDomain: "StartUp" });
    chrome.storage.local.set({ activeWebsites: [] });
    chrome.storage.local.set({ atLeastOne: null });
    routineCheck();
}
function routineCheck() {
    chrome.storage.local.get(['dateWhenModeEnds'], function (result) {
        if ((0,_exportedFunctions__WEBPACK_IMPORTED_MODULE_2__/* .checkIfModeActive */ .$N)(result.dateWhenModeEnds)) {
            (0,_exportedFunctions__WEBPACK_IMPORTED_MODULE_2__/* .setIcon */ .Bf)();
            (0,_exportedFunctions__WEBPACK_IMPORTED_MODULE_2__/* .updateIconTimer */ .JH)();
        }
    });
}

})();

/******/ })()
;