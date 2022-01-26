// @ts-ignore
import {TimeIntervall, TimeIntervallDto} from "../models/TimeIntervall.ts";
// @ts-ignore
import {checkIfModeActive, openOrCloseModeSelectInEveryTab, serverUrl, participantId, getParticipantId, fetchParticipantId} from "./exportedFunctions.ts";

let startTimeintervall: number = 0;
let lastDomain = "";

chrome.storage.local.set({activeWebsites: []});
var today = new Date();
chrome.storage.local.set({baselineFinished: [today.getDay() + 7, today.getMonth(), today.getFullYear()]})

setInterval(function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
        if (tab[0]) {
            checkDomain(tab[0].url, tab[0].id)
        }
    })
}, 1000)

// TODO remove this
chrome.storage.local.set({participantId: undefined});
// TODO FIX EVERY result.baselineFinished-7 remove -7
function checkDomain(website: string, tabId: number) {
    try {
        const currentDomain: string = new URL(website).hostname;
        if (currentDomain !== lastDomain) {
            chrome.storage.local.get(['blacklist', 'mode', 'baselineFinished','participantId'], (result) => {

                if(result.mode === null){
                    openOrCloseModeSelectInEveryTab("Open Mode Select");
                }
                if(result.participantId == undefined) {

                    fetchParticipantId();
                }
                var today = new Date();
                // TODO REMOVE THE -7 AND SWITCH FOR
                // checkIfBaselineIsFinished(result.baselineFinished)
                var baselineFinished = new Date(result.baselineFinished[2], result.baselineFinished[1], result.baselineFinished[0] - 7);
                var intervene = (today > baselineFinished);

                if (result.blacklist.includes(currentDomain) && intervene && (result.mode === true)) {
                    // Open Modal
                    chrome.tabs.sendMessage(tabId, {domain: currentDomain, action: "Open Intervention Modal"});
                }

                sendIntervallAndGetGoal(lastDomain, result.blacklist.includes(lastDomain), startTimeintervall, result.mode, intervene, result.participantId);

                startTimeintervall = new Date().getTime();
                lastDomain = currentDomain;
            })
        }
    } catch (e) {
    }
}


function sendIntervallAndGetGoal(domain: string, blacklisted: boolean, startTime: number, mode: boolean, baselineFinished: boolean, participantId) {

    let timeSpend = (new Date().getTime() - startTime) / 1000;
    var latestGoal = '';
    chrome.storage.local.get(['activeWebsites'], (result) => {
        result.activeWebsites.forEach(obj => {
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

function sendIntervall(newTimeIntervallDto: TimeIntervallDto) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', serverUrl + "timeIntervall/create", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = apiHandler;

    xhr.send(JSON.stringify(newTimeIntervallDto));


    function apiHandler(xhr) {
        if (xhr.readyState === 1) {
            xhr.setRequestHeader("Content-type", "application/json");

        }
        if (xhr.readyState === 4 && xhr.status === 200) {
            xhr.open('POST', serverUrl, true);

        }
    }
}

chrome.runtime.onMessage.addListener((message, sender) => {
    if(message.action == "Set Reminder") {
        let reminderExpiration = Date.now() + message.reminderTime;
        let tabId = sender.tab.id;
        let hostname = message.hostname;
        updateActiveWebsitesAndSetTimeoutForReminder(hostname, reminderExpiration, message, tabId);

    }
});

function openOrCloseInputModalOnEveryTab(hostname, message, action) {
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

function updateActiveWebsitesAndSetTimeoutForReminder(hostname, reminderExpiration: number, message, tabId: number) {

    addNewActiveWebsite(hostname, reminderExpiration, message, tabId);

    openOrCloseInputModalOnEveryTab(hostname, message, "Close Intervention Modal");

    setTimeout(() => {
        openOrCloseInputModalOnEveryTab(hostname, message, "Open Reminder Modal")
        removeActiveWebsite(hostname);
    }, message.reminderTime)
}

function addNewActiveWebsite(hostname, reminderExpiration: number, message, tabId: number) {
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

function removeActiveWebsite(hostname) {
    chrome.storage.local.get(['activeWebsites'], (result) => {
        let newArray = [];
        result.activeWebsites.forEach(obj => {
            if (obj.hostname !== hostname) {
                newArray.unshift(obj)
            }
        })
        chrome.storage.local.set({activeWebsites: newArray});
    });
}
