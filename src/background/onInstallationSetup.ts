//@ts-ignore
import {openOrCloseModeSelectInEveryTab} from "./exportedFunctions.ts";


chrome.storage.local.get(['blacklist', 'baselineFinished','previousGoals','lastDomain','activeWebsites','mode','dateWhenModeEnds'], (result) => {
    if (result.blacklist == undefined) {
        const blacklist: Array<string> = ["www.crunchyroll.com", "www.reddit.com", "www.instagram.com", "www.facebook.com", "www.youtube.com", "www.netflix.com", "9gag.com",'www.twitch.tv'];
        chrome.storage.local.set({blacklist: blacklist});
        chrome.browserAction.setIcon({path: 'img/work.png'});
        chrome.bookmarks.create({ parentId: '1', title: 'Options for Goal Setting Extension', url: 'chrome-extension://' + chrome.runtime.id + '/options/options.html' });
    }
    if (result.baselineFinished === undefined) {
        var today = new Date();
        chrome.storage.local.set({baselineFinished: [today.getUTCDate() + 7, today.getUTCMonth() , today.getUTCFullYear()]});
    }
    if(result.previousGoals == undefined){
        const previousGoals: Array<String> = ['Pause', 'Kurzes Video schauen'];
        chrome.storage.local.set({previousGoals: previousGoals});
    }
    if(result.lastDomain == undefined){
        chrome.storage.local.set({lastDomain: {domain: "Installation Time"}})
    }
    if(result.activeWebsites == undefined){
        chrome.storage.local.set({activeWebsites: []});
    }
    if(result.mode == undefined){
        openOrCloseModeSelectInEveryTab("Open Mode Select")
    }
    if(result.dateWhenModeEnds == undefined){
        chrome.storage.local.set( {dateWhenModeEnds: 0})
    }
})

chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.local.get(['blacklist', 'baselineFinished','previousGoals','lastDomain','activeWebsites','mode','dateWhenModeEnds'], (result) => {
        if (result.blacklist == undefined) {
            const blacklist: Array<string> = ["www.crunchyroll.com", "www.reddit.com", "www.instagram.com", "www.facebook.com", "www.youtube.com", "www.netflix.com", "9gag.com",'www.twitch.tv'];
            chrome.storage.local.set({blacklist: blacklist});
            chrome.browserAction.setIcon({path: 'img/work.png'});
            chrome.bookmarks.create({ parentId: '1', title: 'Options for Goal Setting Extension', url: 'chrome-extension://' + chrome.runtime.id + '/options/options.html' });
        }
        if (result.baselineFinished === undefined) {
            var today = new Date();
            chrome.storage.local.set({baselineFinished: [today.getUTCDate() + 7, today.getUTCMonth() , today.getUTCFullYear()]});
        }
        if(result.previousGoals == undefined){
            const previousGoals: Array<String> = ['Pause', 'Kurzes Video schauen'];
            chrome.storage.local.set({previousGoals: previousGoals});
        }
        if(result.lastDomain == undefined){
            chrome.storage.local.set({lastDomain: {domain: "Installation Time"}})
        }
        if(result.activeWebsites == undefined){
            chrome.storage.local.set({activeWebsites: []});
        }
        if(result.mode == undefined){
            openOrCloseModeSelectInEveryTab("Open Mode Select")
        }
        if(result.dateWhenModeEnds == undefined){
            chrome.storage.local.set( {dateWhenModeEnds: 0})
        }
    })
})



chrome.runtime.onStartup.addListener(() => {
        chrome.storage.local.set({lastDomain: {domain: "StartUp"}});
        chrome.storage.local.set({activeWebsites: []});
}
)
