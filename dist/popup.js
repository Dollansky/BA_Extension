/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 144:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Kk": () => (/* binding */ browserUrl),
/* harmony export */   "mU": () => (/* binding */ sendMessageToEveryTab),
/* harmony export */   "c1": () => (/* binding */ openModeSelectInCurrentTab)
/* harmony export */ });
/* unused harmony exports serverUrl, checkIfModeActive, checkIfBaselineIsFinished, updateIconTimer, calcIconTimer, setIcon, checkIfParticipantIdIsSet, onInstalledDo */
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
        chrome.browserAction.setIcon({ path: 'img/work.png' });
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
        chrome.storage.local.set({ dateWhenModeEnds: Date.now() + 100000 });
    }
});
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
                }, 100);
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
/* unused harmony export getTimeAndUpdatePopup */
/* harmony import */ var _background_exportedFunctions_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(144);
//@ts-ignore

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('openBlacklist').addEventListener('click', openBlacklist);
    document.getElementById('selectMode').addEventListener('click', _background_exportedFunctions_ts__WEBPACK_IMPORTED_MODULE_0__/* .openModeSelectInCurrentTab */ .c1);
    getTimeAndUpdatePopup();
});
function openBlacklist() {
    chrome.tabs.create({ url: _background_exportedFunctions_ts__WEBPACK_IMPORTED_MODULE_0__/* .browserUrl */ .Kk + 'options/options.html' });
}
function getTimeRemaining(endtime) {
    var t = endtime - Date.now();
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    return {
        'total': t,
        'hours': hours,
        'minutes': minutes,
    };
}
function initializeClock(id, endtime) {
    var clock = document.getElementById(id);
    var hoursSpan = clock.querySelector('.hours');
    var minutesSpan = clock.querySelector('.minutes');
    function updateClock() {
        var t = getTimeRemaining(endtime);
        hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        if (t.total <= 0) {
            clearInterval(timeinterval);
        }
    }
    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
}
function setCurrentMode(mode) {
    var img = document.getElementsByTagName('img')[0];
    if (mode === false) {
        img.src = _background_exportedFunctions_ts__WEBPACK_IMPORTED_MODULE_0__/* .browserUrl */ .Kk + 'img/breakPopup.png';
    }
    else if (mode === true) {
        img.src = _background_exportedFunctions_ts__WEBPACK_IMPORTED_MODULE_0__/* .browserUrl */ .Kk + 'img/laptopPopup.png';
    }
}
function getTimeAndUpdatePopup() {
    chrome.storage.local.get(['mode', 'dateWhenModeEnds'], function (result) {
        setCurrentMode(result.mode);
        initializeClock('clockdiv', new Date(result.dateWhenModeEnds));
    });
}
window.onload = function () {
    getTimeAndUpdatePopup();
};

})();

/******/ })()
;