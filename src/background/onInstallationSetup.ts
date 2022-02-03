//@ts-ignore
import {browserUrl, fetchParticipantId, sendMessageToEveryTab, serverUrl, setIcon, updateIconTimer} from "./exportedFunctions.ts";
//@ts-ignore
import {Participant} from "../createParticipant/Participant.ts";
chrome.storage.local.set({baselineFinished: undefined});

chrome.storage.local.get(['blacklist', 'baselineFinished','previousGoals','lastDomain','activeWebsites','mode','dateWhenModeEnds'], (result) => {
    if (result.blacklist == undefined) {
        const blacklist: Array<string> = ["www.crunchyroll.com", "www.reddit.com", "www.instagram.com", "www.facebook.com", "www.netflix.com", "9gag.com",'www.twitch.tv'];
        chrome.storage.local.set({blacklist: blacklist});
        chrome.action.setIcon({path: 'img/work.png'});
        chrome.bookmarks.create({ parentId: '1', title: 'Options for Goal Setting Extension', url: browserUrl + 'options/options.html' });
    }
    if (result.baselineFinished === undefined || result.baselineFinished == null) {
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
        sendMessageToEveryTab("Open Mode Select");
    }
    if(result.dateWhenModeEnds == undefined){
        chrome.storage.local.set( {dateWhenModeEnds: 0})
    }
})

export function onInstalledDo() {
    chrome.storage.local.get(['blacklist', 'baselineFinished', 'previousGoals', 'lastDomain', 'activeWebsites', 'mode', 'dateWhenModeEnds', 'participantId'], (result) => {
        if (result.blacklist == undefined) {
            const blacklist: Array<string> = ["www.instagram.com", "www.facebook.com", "www.youtube.com", "www.netflix.com", "www.twitch.tv"];
            chrome.storage.local.set({blacklist: blacklist});
            chrome.action.setIcon({path: 'img/work.png'});
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
            const previousGoals: Array<String> = ['Kurzes Video schauen'];
            chrome.storage.local.set({previousGoals: previousGoals});
        }
        if (result.lastDomain == undefined) {
            chrome.storage.local.set({lastDomain: {domain: "Installation Time"}})
        }
        if (result.activeWebsites == undefined) {
            chrome.storage.local.set({activeWebsites: []});
        }
        if (result.mode == undefined) {
            sendMessageToEveryTab("Open Mode Select");
        }
        if (result.dateWhenModeEnds == undefined) {
            chrome.storage.local.set({dateWhenModeEnds: 0})
        }

        if (result.participantId == undefined) {
            fetchParticipantId();
        }
    })
}



chrome.runtime.onStartup.addListener(() => {
        chrome.storage.local.set({lastDomain: {domain: "StartUp"}});
        chrome.storage.local.set({activeWebsites: []});
        setIcon()
        updateIconTimer();
}
)

chrome.runtime.onMessage.addListener((message) => {
    if(message.action == "Send Participant"){
        checkIfParticipantIdSet(message.name, message.email);
    }
    if(message.action == "Close Participant"){
        sendMessageToEveryTab("Close Participant Modal")
    }
})

async function createParticipant(name: string, email: string) {

    let participant: Participant = new Participant(name, email);
    chrome.storage.local.set({participantId: "Usability Study"});
    // TODO remove uncomment
    // fetch(serverUrl + "participant/create", {
    //     method: 'post',
    //     headers: {
    //         "Content-type": "application/json"
    //     },
    //     body: JSON.stringify(participant)
    // }).then(response=> response.text())
    //     .then(data => {
    //         setParticipantId(data)
    //     })
    //     .catch(function (error) {
    //
    //     });


}

function setParticipantId(participantId: string){
    chrome.storage.local.set({participantId: participantId});
}

function checkIfParticipantIdSet(name: string, email: string) {
    chrome.storage.local.get(['participantId'], (result) => {
        if(result.participantId == undefined || result.participantId == ""){
            createParticipant(name, email);
        };
    })
}

