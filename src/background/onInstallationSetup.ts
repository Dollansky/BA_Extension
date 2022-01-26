//@ts-ignore
import {fetchParticipantId, openOrCloseModeSelectInEveryTab, serverUrl, setIcon, updateIconTimer} from "./exportedFunctions.ts";
//@ts-ignore
import {Participant} from "../createParticipant/Participant.ts";


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
    chrome.storage.local.get(['blacklist', 'baselineFinished','previousGoals','lastDomain','activeWebsites','mode','dateWhenModeEnds','participantId'], (result) => {
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

        if(result.participantId == undefined) {
            fetchParticipantId();
        }
    })
})



chrome.runtime.onStartup.addListener(() => {
        chrome.storage.local.set({lastDomain: {domain: "StartUp"}});
        chrome.storage.local.set({activeWebsites: []});
        setIcon()
        updateIconTimer();
}
)

chrome.runtime.onMessage.addListener((message) => {
    if(message.action == "Send Participant"){
        checkIfParticipantIdSet(message.name);
    }
})

function createParticipant(name: string) {

    let participant: Participant = new Participant(name);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', serverUrl + "participant/create", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = apiHandler;
    console.log("TimeIntervall send:", name);
    xhr.send(JSON.stringify(participant));

    function apiHandler(xhr) {
        if(xhr.currentTarget.response !== undefined) {
            try {
                let participantId = JSON.parse(xhr.currentTarget.response)['id'];
                setParticipantId(participantId);
            } catch (e) {
            }
        }
        if (xhr.readyState === 1) {
            xhr.setRequestHeader("Content-type", "application/json");
        }
        if (xhr.readyState === 4 && xhr.status === 200) {
            xhr.open('POST', serverUrl, true);
        }
    }
}

function setParticipantId(participantId: string){
    chrome.storage.local.set({participantId: participantId});
}

function checkIfParticipantIdSet(name) {
    chrome.storage.local.get(['participantId'], (result) => {
        if(result.participantId == undefined){
            createParticipant(name);
        };
    })
}
