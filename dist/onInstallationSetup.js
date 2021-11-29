/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.local.get(['blacklist', 'baselineFinished'], (result) => {
        if (result.blacklist == undefined) {
            window.console.log('blacklist was undefined');
            const blacklist = ["www.crunchyroll.com", "www.reddit.com", "www.instagram.com", "www.facebook.com", "www.youtube.com", "www.netflix.com", "9gag.com", 'www.twitch.tv'];
            const previousGoals = ['Pause', 'Kurzes Video schauen'];
            chrome.storage.local.set({ lastDomain: { domain: "Installation Time" } });
            chrome.storage.local.set({ activeWebsites: [] });
            chrome.storage.local.set({ blacklist: blacklist });
            chrome.storage.local.set({ mode: true });
            chrome.storage.local.set({ previousGoals: previousGoals });
            chrome.browserAction.setIcon({ path: 'img/work.png' });
            chrome.bookmarks.create({ parentId: '1', title: 'Options for Goal Setting Extension', url: 'chrome-extension://' + chrome.runtime.id + '/options/options.html' });
            chrome.browserAction.setIcon({ path: 'img/work.png' });
        }
        if (result.baselineFinished === undefined) {
            var today = new Date();
            chrome.storage.local.set({ baselineFinished: [today.getUTCDate() + 7, today.getUTCMonth(), today.getUTCFullYear()] });
        }
    });
});
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.set({ lastDomain: { domain: "StartUp" } });
    chrome.storage.local.set({ activeWebsites: [] });
    chrome.browserAction.setIcon({ path: 'img/work.png' });
});

/******/ })()
;