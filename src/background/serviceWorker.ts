import {checkIfParticipantIdSet, onInstalledDo} from "./onInstallationSetup";
import {
    checkDomain,
    openOrCloseModalOnEveryTab, removeActiveWebsite,
    updateActiveWebsitesAndCreateAlarm
} from "./background";
import {checkIfModeActive, sendMessageToEveryTab, setIcon, updateIconTimer} from "./exportedFunctions";
import {calcDateWhenModeEnds, handleModeChange, sendMode, setModeAlarm} from "./modeSelection";
import {sendGoalAndSaveId} from "./goalHandler";

chrome.runtime.onInstalled.addListener((details) => {
    onInstalledDo();
})
chrome.tabs.onUpdated.addListener(((tabId, changeInfo, tab) => {
    if(changeInfo.status == 'complete'){
        checkIfNewWebsite();
    }
}))

chrome.tabs.onActivated.addListener((res) => {
    checkIfNewWebsite();
})

function checkIfNewWebsite() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
        if (tab[0]) {
            checkDomain(tab[0].url, tab[0].id)
        }
    });
    routineCheck();
}


chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action == "Set Reminder") {
        let tabId = sender.tab.id;
        let hostname = message.hostname;
        updateActiveWebsitesAndCreateAlarm(hostname, message.reminderTime, message, tabId);
        sendGoalAndSaveId(message.goal, hostname, message.reminderTime / 1000, message.reason)

    }
    if (message.action == "Close Reminder in every Tab") {
        openOrCloseModalOnEveryTab(message.hostname, "", "Close Reminder Modal")
    }

    if (message.action == "Set Mode Selection") {
        setModeSelection(message);
    }

    if (message.action == "Send Participant") {
        checkIfParticipantIdSet(message.name, message.email);
    }
    if (message.action == "Close Participant") {
        sendMessageToEveryTab("Close Participant Modal");
        chrome.runtime.sendMessage({action: "firstInstall"});
    }

});


chrome.alarms.onAlarm.addListener((alarm) => {
    let splitAlarm = alarm.name.split("/");
    if (splitAlarm[0] == "Goal Setting Extension") {
        let hostname = splitAlarm[1]
        openOrCloseModalOnEveryTab(hostname, {hostname: hostname, goal: splitAlarm[2]}, "Open Reminder Modal")
        removeActiveWebsite(hostname);
        chrome.alarms.clear(alarm.name);
    } else if(alarm.name == "No Mode"){
        routineCheck();
    }
})


chrome.runtime.onStartup.addListener(() => {
    setUpAfterStartUp();
});


function setModeSelection(message: any) {
    let dateWhenModeEnds = calcDateWhenModeEnds(message.time);
    if (dateWhenModeEnds != null) {

        chrome.storage.local.set({mode: message.mode});
        handleModeChange(message.mode);
        chrome.storage.local.set({dateWhenModeEnds: dateWhenModeEnds});
        setIcon();
        updateIconTimer();
        setModeAlarm(dateWhenModeEnds);
        sendMessageToEveryTab("Close Mode Select");
        sendMode(message.mode, dateWhenModeEnds, (dateWhenModeEnds - Date.now()));

    }
}

function setUpAfterStartUp() {
    chrome.storage.local.set({startTimeIntervall: new Date().getTime()});
    chrome.storage.local.set({lastDomain: "StartUp"});
    chrome.storage.local.set({activeWebsites: []});
    chrome.storage.local.set({atLeastOne: null});
    routineCheck();
}


function routineCheck() {
    chrome.storage.local.get(['dateWhenModeEnds'], (result) => {
        if (checkIfModeActive(result.dateWhenModeEnds)) {
            setIcon();
            updateIconTimer();
        }
    })
}
