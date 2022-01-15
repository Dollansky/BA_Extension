/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 144:
/***/ ((__unused_webpack_module, exports) => {


// Webpack imports whole file this is a workaround
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkIfBaselineIsFinished = exports.openOrCloseModeSelectInEveryTab = exports.checkIfModeActive = void 0;
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
chrome.storage.local.get(['blacklist', 'baselineFinished', 'previousGoals', 'lastDomain', 'activeWebsites', 'mode', 'dateWhenModeEnds'], (result) => {
    if (result.blacklist == undefined) {
        const blacklist = ["www.crunchyroll.com", "www.reddit.com", "www.instagram.com", "www.facebook.com", "www.youtube.com", "www.netflix.com", "9gag.com", 'www.twitch.tv'];
        chrome.storage.local.set({ blacklist: blacklist });
        chrome.browserAction.setIcon({ path: 'img/work.png' });
        chrome.bookmarks.create({ parentId: '1', title: 'Options for Goal Setting Extension', url: 'chrome-extension://' + chrome.runtime.id + '/options/options.html' });
    }
    if (result.baselineFinished === undefined) {
        var today = new Date();
        chrome.storage.local.set({ baselineFinished: [today.getUTCDate() + 7, today.getUTCMonth(), today.getUTCFullYear()] });
    }
    if (result.previousGoals == undefined) {
        const previousGoals = ['Pause', 'Kurzes Video schauen'];
        chrome.storage.local.set({ previousGoals: previousGoals });
    }
    if (result.lastDomain == undefined) {
        chrome.storage.local.set({ lastDomain: { domain: "Installation Time" } });
    }
    if (result.activeWebsites == undefined) {
        chrome.storage.local.set({ activeWebsites: [] });
    }
    if (result.mode == undefined) {
        exportedFunctions_ts_1.openOrCloseModeSelectInEveryTab("Open Mode Select");
    }
    if (result.dateWhenModeEnds == undefined) {
        chrome.storage.local.set({ dateWhenModeEnds: 0 });
    }
});
chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.local.get(['blacklist', 'baselineFinished', 'previousGoals', 'lastDomain', 'activeWebsites', 'mode', 'dateWhenModeEnds'], (result) => {
        if (result.blacklist == undefined) {
            const blacklist = ["www.crunchyroll.com", "www.reddit.com", "www.instagram.com", "www.facebook.com", "www.youtube.com", "www.netflix.com", "9gag.com", 'www.twitch.tv'];
            chrome.storage.local.set({ blacklist: blacklist });
            chrome.browserAction.setIcon({ path: 'img/work.png' });
            chrome.bookmarks.create({ parentId: '1', title: 'Options for Goal Setting Extension', url: 'chrome-extension://' + chrome.runtime.id + '/options/options.html' });
        }
        if (result.baselineFinished === undefined) {
            var today = new Date();
            chrome.storage.local.set({ baselineFinished: [today.getUTCDate() + 7, today.getUTCMonth(), today.getUTCFullYear()] });
        }
        if (result.previousGoals == undefined) {
            const previousGoals = ['Pause', 'Kurzes Video schauen'];
            chrome.storage.local.set({ previousGoals: previousGoals });
        }
        if (result.lastDomain == undefined) {
            chrome.storage.local.set({ lastDomain: { domain: "Installation Time" } });
        }
        if (result.activeWebsites == undefined) {
            chrome.storage.local.set({ activeWebsites: [] });
        }
        if (result.mode == undefined) {
            exportedFunctions_ts_1.openOrCloseModeSelectInEveryTab("Open Mode Select");
        }
        if (result.dateWhenModeEnds == undefined) {
            chrome.storage.local.set({ dateWhenModeEnds: 0 });
        }
    });
});
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.set({ lastDomain: { domain: "StartUp" } });
    chrome.storage.local.set({ activeWebsites: [] });
});

})();

/******/ })()
;