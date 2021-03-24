// @ts-ignore
import {TimeIntervall} from "../models/TimeIntervall.ts";

// TODO NEXT UP: Implement Timer for the reminder window
// TODO NEXT NEXT UP: Implement actual Intervention and update goal possibility for TimeIntervall

// Reacts when an chrome tab is updated.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        checkDomain(tab.url, tabId);
    }

})

// Reacts when the user switches between tabs
chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tabs) {
        console.log(tabs);
        checkDomain(tabs.url, activeInfo.tabId)
    })
})


function checkDomain(website: any, tabId: number) {
    try {
        const url: URL = new URL(website);
        const domain: string = url.hostname;
        chrome.storage.local.get(['lastDomain','blacklist','mode'], (result) => {
            if (result.lastDomain.domain !== domain) {
                    const startTime: string = (new Date).toJSON();
                    if (result.blacklist.includes(domain)) {
                        chrome.tabs.sendMessage(tabId, {domain: domain});
                        chrome.storage.local.set({lastDomain: {domain: domain, startTime: startTime, blacklisted: true}});
                    } else {
                        chrome.storage.local.set({lastDomain: {domain: domain, startTime: startTime, blacklisted: false}});
                    }
                    saveIntervall(result.lastDomain.domain, result.lastDomain.blacklisted, result.lastDomain.startTime, result.mode)

            }
        })

    } catch (e) {
        console.log(e);
    }
}



function saveIntervall(domain: string, blacklisted: boolean, startTime: string, mode: string) {
    let newIntervall: TimeIntervall = new TimeIntervall(domain,blacklisted,mode ,startTime, (new Date).toJSON())
            chrome.storage.local.get(['archive'], (result) => {
                let updatedArchive : Array<TimeIntervall> = result.archive;
                updatedArchive.push(newIntervall);
                chrome.storage.local.set({archive: updatedArchive});
                window.console.log(result.archive);
                // TODO Send Data to remote Database
            })
}


// Reacts when user is starting up Chrome
// send message to content ask what he is up to work/break
// Maybe add "lastTimeAsked" value so users that close chrome entirely often dont get spammed
chrome.runtime.onStartup.addListener(function () {
    //TODO Implement Work/Break Screen
})


// Reacts when Extension Icon is clicked
chrome.browserAction.onClicked.addListener(changeMode);


// Change Mode when extension Icon is clicked. "Work" and "Break" mode are available
// TODO add functionality for break mode so user doesnt get Interventions
function changeMode() {
    chrome.storage.local.get(['mode'], (result) => {
        let mode: string;
        if (result.mode === 'work') {
            mode = 'break';
        } else {
            mode = 'work';
        }
        chrome.browserAction.setIcon({path: 'img/' + mode + '.png'})
        chrome.storage.local.set({mode: mode});
    })
}



