import { TimeIntervallDto} from "../models/TimeIntervall";
import {
    sendMessageToEveryTab,
    serverUrl,
    fetchParticipantId,
    checkIfBaselineIsFinished,
} from "./exportedFunctions";

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/background.js');
}
//
let startTimeintervall: number = 0;
let lastDomain = "";


chrome.storage.local.set({activeWebsites: []});

//TODO Remove
chrome.storage.local.set({participantId: "sd"});

export function checkDomain(website: string, tabId: number) {
    try {
        const currentDomain: string = new URL(website).hostname;
        if (currentDomain !== lastDomain) {
            chrome.storage.local.get(['blacklist', 'mode', 'baselineFinished','participantId', 'lastDomain'], (result) => {
                checkIfCriticalDataIsUndefined(result);

                var baselineFinished: boolean = checkIfBaselineIsFinished(result.baselineFinished);

                if (result.blacklist.includes(currentDomain) && baselineFinished && (result.mode === true)) {
                    // Open Modal
                    chrome.tabs.sendMessage(tabId, {domain: currentDomain, action: "Open Intervention Modal"});
                }

                sendIntervallAndGetGoal(lastDomain, result.blacklist.includes(lastDomain), startTimeintervall, result.mode, baselineFinished, result.participantId);

                startTimeintervall = new Date().getTime();
                lastDomain = currentDomain;
            })
        }
    } catch (e) {
    }
}

export function checkIfCriticalDataIsUndefined(result: { [p: string]: any }) {
    if (result.mode === undefined) {
        sendMessageToEveryTab("Open Mode Select");
    }
    if (result.participantId == undefined || result.participantId == "") {

        fetchParticipantId();
    }
}


export function sendIntervallAndGetGoal(domain: string, blacklisted: boolean, startTime: number, mode: boolean, baselineFinished: boolean, participantId: string) {

    let timeSpend = (new Date().getTime() - startTime) / 1000;
    var latestGoal = '';
    chrome.storage.local.get(['activeWebsites'], (result) => {
        result.activeWebsites.forEach((obj : any) => {
            if (obj.hostname === domain) {
                latestGoal = obj.goal;
            }

        })
        let newTimeIntervallDto: TimeIntervallDto = new TimeIntervallDto(participantId, mode, blacklisted, timeSpend, baselineFinished, latestGoal);
        if (domain !== "") {

            sendIntervall(newTimeIntervallDto);
        }
    });
}

export function sendIntervall(newTimeIntervallDto: TimeIntervallDto) {
    console.log(newTimeIntervallDto);
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

export function openOrCloseModalOnEveryTab(hostname: string, message: any, action: string) {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            if (hostname === new URL(tab.url).hostname) {
                chrome.tabs.sendMessage(tab.id, {
                    action: action,
                    goal: message.goal,
                    url: message.hostname,
                })
            }
        })
    });

}

export function updateActiveWebsitesAndSetTimeoutForReminder(hostname: string, reminderExpiration: number, message: any, tabId: number) {

    addNewActiveWebsite(hostname, reminderExpiration, message, tabId);

    openOrCloseModalOnEveryTab(hostname, message, "Close Intervention Modal");

    setTimeout(() => {
        openOrCloseModalOnEveryTab(hostname, message, "Open Reminder Modal")
        removeActiveWebsite(hostname);
    }, message.reminderTime)
}

export function addNewActiveWebsite(hostname: string, reminderExpiration: number, message: any, tabId: number) {
    chrome.storage.local.get(['activeWebsites'], (result) => {
        result.activeWebsites.unshift({
            hostname: hostname,
            reminderRunning: reminderExpiration,
            goal: message.goal,
            tabId: tabId
        });
        chrome.storage.local.set({activeWebsites: result.activeWebsites});
    })
}

export function removeActiveWebsite(hostname: string) {
    chrome.storage.local.get(['activeWebsites'], (result) => {
        let updatedActiveWebsites: Array<string> = [];
        result.activeWebsites.forEach((obj: any) => {
            if (obj.hostname !== hostname) {
                updatedActiveWebsites.unshift(obj)
            }
        })
        chrome.storage.local.set({activeWebsites: updatedActiveWebsites});
    });
}
