import {onInstalledDo} from "./onInstallationSetup";
import {checkDomain, openOrCloseModalOnEveryTab, updateActiveWebsitesAndSetTimeoutForReminder} from "./background";
import {checkIfModeActive, sendMessageToEveryTab, setIcon, updateIconTimer} from "./exportedFunctions";
import {calcDateWhenModeEnds, handleModeChange, sendModeDtoAndGetParticipantId} from "./modeSelection";
import {sendGoalAndSaveId} from "./goalHandler";



//TODO Remove
chrome.runtime.onStartup.addListener(() => {

    chrome.storage.local.set({participantId: ""});
})

chrome.runtime.onInstalled.addListener((details) => {
    onInstalledDo();
})

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action == "Set Reminder") {
        let reminderExpiration = Date.now() + message.reminderTime;
        let tabId = sender.tab.id;
        let hostname = message.hostname;
        updateActiveWebsitesAndSetTimeoutForReminder(hostname, reminderExpiration, message, tabId);
        sendGoalAndSaveId(message.goal,hostname,message.reminderTime / 1000, message.reason)

    }
    if (message.action == "Close Reminder in every Tab") {
        openOrCloseModalOnEveryTab(message.hostname, "", "Close Reminder Modal")
    }

    if (message.action == "Set Mode Selection") {
        console.log("SetModeSElect");
        setModeSelection(message);
    }


});

chrome.action.onClicked.addListener(() => {
    sendMessageToEveryTab("Open Mode Select")
})



function setModeSelection(message: any) {
    let dateWhenModeEnds = calcDateWhenModeEnds(message.time);
    if (dateWhenModeEnds != null) {
        chrome.storage.local.set({mode: message.mode});
        handleModeChange(message.mode);
        chrome.storage.local.set({dateWhenModeEnds: dateWhenModeEnds});
        setIcon();
        updateIconTimer();
        sendMessageToEveryTab("Close Mode Select");
        sendModeDtoAndGetParticipantId(message.mode, dateWhenModeEnds, (dateWhenModeEnds - Date.now()));
    }
}

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.set({activeWebsites: []});
})



setInterval(function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
        if (tab[0]) {

            checkDomain(tab[0].url, tab[0].id)
        }
    })
}, 1000)

setInterval(() => {
    setIcon();
    chrome.storage.local.get(['dateWhenModeEnds'], (result) => {
        if(checkIfModeActive(result.dateWhenModeEnds)) {
            updateIconTimer();
        }
    })
}, 30000) // TODO back to 30000
