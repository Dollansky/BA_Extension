//@tsignore
// @ts-ignore
import {TimeIntervall} from "../models/TimeIntervall.ts";

// TODO run a automatic registration request ID for datacolleciton
chrome.runtime.onInstalled.addListener(() => {
    const blacklist: Array<string> = ["www.reddit.com", "www.instagram.com", "www.facebook.com", "www.youtube.com", "www.netflix.com", "9gag.com"];
    const archive: Array<TimeIntervall> = [];
    chrome.storage.local.set({lastDomain: {domain: "Installation Time"}})
    chrome.storage.local.set({blacklist: blacklist});
    chrome.storage.local.set({mode: 'work'});
    chrome.storage.local.set({archive: archive});
    chrome.browserAction.setIcon({path: 'img/work.png'});
})


// Set to 1500 = 25 min
// TODO Maybe handle youtube differently
chrome.idle.setDetectionInterval(15);
// Checks if user is afk
chrome.idle.onStateChanged.addListener((idleState) => {
    window.console.log('IdleState changed:', idleState);
    if (idleState == 'active') {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            window.console.log('Idle message nbsends')
            if (tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, {toDo: 'Ask for Mode'});
            }
        })
    }
})




