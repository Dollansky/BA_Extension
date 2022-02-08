import {TimeIntervallDto} from "../models/TimeIntervall";
import {
    sendMessageToEveryTab,
    serverUrl,
    checkIfBaselineIsFinished, checkIfParticipantIdIsSet,
} from "./exportedFunctions";





export function checkDomain(website: string, tabId: number) {
    try {

        const currentDomain: string = new URL(website).hostname;


        chrome.storage.local.get(['blacklist', 'mode', 'baselineFinished', 'participantId', 'lastDomain', 'startTimeIntervall','dateWhenModeEnds'], (result) => {
            if (currentDomain !== result.lastDomain) {

                checkIfCriticalDataIsUndefined(result);

                var baselineFinished: boolean = checkIfBaselineIsFinished(result.baselineFinished);
                if (result.blacklist.includes(currentDomain) && baselineFinished && (result.mode === true)) {
                    // Open Modal
                    chrome.tabs.sendMessage(tabId, {domain: currentDomain, action: "Open Intervention Modal"});
                }
                sendIntervallAndGetGoal(result.lastDomain, result.blacklist.includes(result.lastDomain), result.startTimeIntervall, result.mode, baselineFinished, result.participantId);
                setUpForNextTimeIntervall(currentDomain);

            }
        })

    } catch (e) {
    }
}

function setUpForNextTimeIntervall(currentDomain: string) {
    chrome.storage.local.set({startTimeIntervall: new Date().getTime()});
    chrome.storage.local.set({lastDomain: currentDomain})
}

export function checkIfCriticalDataIsUndefined(result: { [p: string]: any }) {

    if (result.dateWhenModeEnds < Date.now()) {

        sendMessageToEveryTab("Open Mode Select");
    }
    checkIfParticipantIdIsSet()
}


export function sendIntervallAndGetGoal(domain: string, blacklisted: boolean, startTime: number, mode: boolean, baselineFinished: boolean, participantId: string) {

    removeActiveWebsite("");

    let timeSpend = (new Date().getTime() - startTime) / 1000;
    var latestGoal: string = null;
    let reasonToStay: string = null;
    let goalId: string = null;
    chrome.storage.local.get(['activeWebsites', 'atLeastOne'], (result) => {
        if(result.atLeastOne != null){
            latestGoal= result.atLeastOne.goal;
            reasonToStay = result.atLeastOne.reason;
            goalId= result.atLeastOne.goalId;
            chrome.storage.local.set({atLeastOne: null});
        }

        result.activeWebsites.forEach((obj: any) => {
            if (obj.hostname === domain) {
                goalId = obj.goalId;
                latestGoal = obj.goal;
                reasonToStay = obj.reason;
            };
        });


        let newTimeIntervallDto: TimeIntervallDto = new TimeIntervallDto(participantId, mode, domain, blacklisted, timeSpend, baselineFinished, startTime, new Date().getTime(), goalId, latestGoal, reasonToStay);

        if (domain !== "") {
            sendIntervall(newTimeIntervallDto);
        }
    });
}

export function sendIntervall(newTimeIntervallDto: TimeIntervallDto) {

    if(newTimeIntervallDto.participantId != undefined && newTimeIntervallDto.participantId != ""){

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

}

export function openOrCloseModalOnEveryTab(hostname: string, message: any, action: string) {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            if (hostname === new URL(tab.url).hostname) {
                chrome.tabs.sendMessage(tab.id, {
                    action: action,
                    goal: message.goal,
                    url: message.hostname,
                });
            }
        })
    });

}

export function findGoalAndOpenReminder(hostname: string) {
    chrome.storage.local.get(['activeWebsites'],(result) => {
        result.activeWebsites.forEach((obj: any) => {
            if (obj.hostname === hostname) {
                openOrCloseModalOnEveryTab(hostname, {hostname: hostname, goal: obj.goal}, "Open Reminder Modal")
            }
        })
    })
}

export function updateActiveWebsitesAndCreateAlarm(hostname: string, reminderDuration: number, message: any, tabId: number) {

    addNewActiveWebsite(hostname, Date.now() + reminderDuration, message, tabId);
    openOrCloseModalOnEveryTab(hostname, message, "Close Intervention Modal");

    chrome.alarms.create("Goal Setting Extension: "+ hostname,{delayInMinutes: reminderDuration / 60000 });

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
    let buffer = 0;
    if(hostname == ""){
        buffer = 4000;
    }
    chrome.storage.local.get(['activeWebsites'], (result) => {

        let updatedActiveWebsites: Array<string> = [];
        result.activeWebsites.forEach((obj: any) => {
            if (obj.hostname !== hostname && obj.reminderRunning + buffer > Date.now()) {
                updatedActiveWebsites.unshift(obj)
            }
        })
        chrome.storage.local.set({activeWebsites: updatedActiveWebsites});
    });
}
