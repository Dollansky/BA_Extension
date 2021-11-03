//@tsignore
// @ts-ignore
import {TimeIntervall} from "../models/TimeIntervall.ts";

// TODO check if this gets called more than 1 time if so think of something new to handle this
chrome.runtime.onInstalled.addListener((details) => {
        window.console.log("onInstalled was called? ")
    // if(details.reason === 'install') {
        const blacklist: Array<string> = ["www.crunchyroll.com", "www.reddit.com", "www.instagram.com", "www.facebook.com", "www.youtube.com", "www.netflix.com", "9gag.com"];
        const previousGoals: Array<String> = ['Pause'];
        chrome.storage.local.set({lastDomain: {domain: "Installation Time"}})
        chrome.storage.local.set({blacklist: blacklist});
        chrome.storage.local.set({mode: true});
        chrome.storage.local.set({previousGoals: previousGoals});
        chrome.browserAction.setIcon({path: 'img/work.png'});
    // }
})




