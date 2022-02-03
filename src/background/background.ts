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
let participantId = "";


chrome.storage.local.set({activeWebsites: []});



function checkForParticipantId() {

    chrome.storage.local.get(['participantId'], (result) => {
        console.log("pId",participantId);
            participantId = result.participantId;
            if(participantId == null || participantId == ""){
                fetchParticipantId();

            }
    })

}

export function checkDomain(website: string, tabId: number) {
    try {
        checkForParticipantId();
        const currentDomain: string = new URL(website).hostname;
        if (currentDomain !== lastDomain) {
            chrome.storage.local.get(['blacklist', 'mode', 'baselineFinished','participantId', 'lastDomain'], (result) => {
                checkIfModeIsUndefined(result);

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

export function checkIfModeIsUndefined(result: { [p: string]: any }) {
    if (result.mode === undefined) {
        sendMessageToEveryTab("Open Mode Select");
    }
}


export function sendIntervallAndGetGoal(domain: string, blacklisted: boolean, startTime: number, mode: boolean, baselineFinished: boolean, participantId: string) {

    let timeSpend = (new Date().getTime() - startTime) / 1000;
    var latestGoal: string = null;
    let reasonToStay: string = null;
    let goalId: string = null;
    chrome.storage.local.get(['activeWebsites'], (result) => {
        result.activeWebsites.forEach((obj : any) => {
            if (obj.hostname === domain) {
                goalId = obj.goalId;
                latestGoal = obj.goal;
                reasonToStay = obj.reason;
            }
        });

        let newTimeIntervallDto: TimeIntervallDto = new TimeIntervallDto(participantId, mode,domain, blacklisted, timeSpend, baselineFinished,  startTime, new Date().getTime(),goalId, latestGoal,reasonToStay);
        console.log(newTimeIntervallDto);
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
            reason: message.reason
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
