//@ts-ignore
import {
    browserUrl,
    checkIfParticipantIdIsSet,
    sendMessageToEveryTab,
    serverUrl,
    setIcon,
    updateIconTimer
} from "./exportedFunctions";
//@ts-ignore
import {Participant} from "../createParticipant/Participant";


chrome.storage.local.get(['blacklist', 'baselineFinished','previousGoals','lastDomain','activeWebsites','mode','dateWhenModeEnds'], (result) => {
    if (result.blacklist == undefined) {
        const blacklist: Array<string> = ["www.instagram.com", "www.facebook.com", "www.youtube.com", "www.netflix.com", "www.twitch.tv"];
        chrome.storage.local.set({blacklist: blacklist});
        chrome.browserAction.setIcon({path: 'img/work.png'});
        chrome.bookmarks.create({ parentId: '1', title: 'Blacklist Extension', url: browserUrl + 'options/options.html' });
    }
    if (result.baselineFinished === undefined || result.baselineFinished == null) {
        var today = new Date();
        chrome.storage.local.set({baselineFinished: [today.getUTCDate() + 7, today.getUTCMonth() , today.getUTCFullYear()]});
    }
    if(result.previousGoals == undefined){
        chrome.storage.local.set({previousGoals: []});
    }
    if(result.lastDomain == undefined){
        chrome.storage.local.set({lastDomain: {domain: "Installation Time"}})
    }
    if(result.activeWebsites == undefined){
        chrome.storage.local.set({activeWebsites: []});
    }
    if(result.mode == undefined){
        sendMessageToEveryTab("Open Mode Select");
    }
    if(result.dateWhenModeEnds == undefined){
        chrome.storage.local.set( {dateWhenModeEnds: Date.now() + 100000})
    }
})

export function onInstalledDo() {
    chrome.storage.local.get(['blacklist', 'baselineFinished', 'previousGoals', 'lastDomain', 'activeWebsites', 'mode', 'dateWhenModeEnds', 'participantId'], (result) => {
        if (result.blacklist == undefined) {
            const blacklist: Array<string> = ["www.instagram.com", "www.facebook.com", "www.youtube.com", "www.netflix.com", "www.twitch.tv"];
            chrome.storage.local.set({blacklist: blacklist});
            chrome.browserAction.setIcon({path: 'img/work.png'});
            chrome.bookmarks.create({
                parentId: '1',
                title: 'Options for Goal Setting Extension',
                url: browserUrl + 'options/options.html'
            });
        }
        if (result.baselineFinished === undefined) {

            var today = new Date();
            chrome.storage.local.set({baselineFinished: [today.getUTCDate() + 7, today.getUTCMonth(), today.getUTCFullYear()]});

        }
        if (result.previousGoals == undefined) {
            chrome.storage.local.set({previousGoals: []});
        }
        if (result.lastDomain == undefined) {
            chrome.storage.local.set({lastDomain: {domain: "Installation Time"}})
        }
        if (result.activeWebsites == undefined) {
            chrome.storage.local.set({activeWebsites: []});
        }
        if (result.mode == undefined) {
            chrome.storage.local.set({mode: false});

        }
        if (result.dateWhenModeEnds == undefined) {
            chrome.storage.local.set({dateWhenModeEnds: 0 });
        }

        if (result.participantId == undefined) {
            checkIfParticipantIdIsSet()
            setTimeout(() => {
                chrome.tabs.create({url: browserUrl + 'options/options.html'});
                setTimeout(() => {
                    chrome.runtime.sendMessage({action: "firstInstall"});
                }, 500)
            }, 1000)
        }

        if(result.startTimeIntervall == undefined){
            chrome.storage.local.set({startTimeIntervall: new Date().getTime()})
        }
    })
}


export async function createParticipant() {


    fetch(serverUrl + "participant/create", {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
    }).then(response=> response.text())
        .then(data => {
            setParticipantId(data)
        })
        .catch(function (error) {

        });


}

function setParticipantId(participantId: string){
    chrome.storage.local.set({participantId: participantId});
}

export function checkIfParticipantIdSet(name: string, email: string) {
    chrome.storage.local.get(['participantId'], (result) => {
        if(result.participantId == undefined || result.participantId == ""){
            createParticipant();
        }
    })
}

