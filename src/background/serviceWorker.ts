import {checkIfParticipantIdSet, onInstalledDo} from "./onInstallationSetup";
import {
    checkDomain, findGoalAndOpenReminder,
    openOrCloseModalOnEveryTab, removeActiveWebsite,
    updateActiveWebsitesAndCreateAlarm
} from "./background";
import {checkIfModeActive, sendMessageToEveryTab, setIcon, updateIconTimer} from "./exportedFunctions";
import {calcDateWhenModeEnds, handleModeChange, sendMode, setModeAlarm} from "./modeSelection";
import {sendGoalAndSaveId} from "./goalHandler";




chrome.tabs.onUpdated.addListener((res) => {
    chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
        if (tab[0]) {
            checkDomain(tab[0].url, tab[0].id)
        }
    });
    routineCheck();
})

chrome.tabs.onActivated.addListener((e) => {
    chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
        if (tab[0]) {
            checkDomain(tab[0].url, tab[0].id)
        }
    })
})

chrome.runtime.onInstalled.addListener((details) => {
    onInstalledDo();
})

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
    if (alarm.name.startsWith("Goal Setting Extension: ")) {
        let hostname = alarm.name.slice(24);
        findGoalAndOpenReminder(hostname);
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
    var today = new Date();
    chrome.storage.local.set({baselineFinished: [today.getUTCDate(), today.getUTCMonth(), today.getUTCFullYear()]});


    chrome.storage.local.set({startTimeIntervall: new Date().getTime()});
    chrome.storage.local.set({lastDomain: "StartUp"});
    chrome.storage.local.set({activeWebsites: []});
    chrome.storage.local.set({atLeastOne: null});
    routineCheck();
}


// Won´t be used cause it switches state while watching a video <- Data cleanup will probably be necessary
// chrome.idle.setDetectionInterval(120);
//
// chrome.idle.onStateChanged.addListener((r) =>{
//     console.log(r);
//     console.log(r === "idle")
//     if(r === "idle"){
//         checkDomain("http://idle.com/",1)
//     }
//     if( r === "active"){
//         chrome.storage.local.set({startTimeIntervall: new Date().getTime()});
//     }
// })

function routineCheck() {


    chrome.storage.local.get(['dateWhenModeEnds'], (result) => {
        if (checkIfModeActive(result.dateWhenModeEnds)) {
            setIcon();
            updateIconTimer();
        }
    })
}
