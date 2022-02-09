// Webpack imports whole file this is a workaround

// export const serverUrl = "nurdamitsgeht";

export const serverUrl = "http://217.160.214.199:8080/api/";


export const browserUrl = chrome.runtime.getURL("");



export function checkIfModeActive(dateWhenModeEnds: any) {
    if (dateWhenModeEnds < Date.now() || dateWhenModeEnds == undefined) {
        chrome.storage.local.set({mode: null});
        sendMessageToEveryTab("Open Mode Select");
        return false;
    } else {
        return true;
    }
}

export function sendMessageToEveryTab(action: string) {

    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            chrome.tabs.sendMessage(tab.id, {
                action: action
            })
        })
    });
}

export function openModeSelectInCurrentTab() {
    chrome.tabs.query({active: true, currentWindow: true},
        function (activeTab) {
            chrome.tabs.sendMessage(activeTab[0].id, {
                action: "Open Mode Select"
            })

        });
}

export function checkIfBaselineIsFinished(baselineFinished: { [p: string]: any }) {
    var today = new Date();
    var baselineDate = new Date(baselineFinished[2] , baselineFinished[1], baselineFinished[0]);

    return (today >= baselineDate);
}

export function updateIconTimer() {
    chrome.storage.local.get(['dateWhenModeEnds'], (result) => {
        let timeTillModeEnds = calcIconTimer(result.dateWhenModeEnds);
        if (timeTillModeEnds != null) {
            if(timeTillModeEnds[0] != "-"){
                chrome.browserAction.setBadgeText({text: timeTillModeEnds});
            }
            if (timeTillModeEnds.substr(timeTillModeEnds.length - 3) === 'sec') {
                setTimeout(() => {
                    updateIconTimer()
                }, 1000)
            }
        }
        if(timeTillModeEnds == "0sec"){
            openModeSelectInCurrentTab();
        }
    })
}

export function calcIconTimer(dateWhenModeEnds: any) {
    let timeLeftInSec = (dateWhenModeEnds - Date.now()) / 1000;

    let hour = Math.floor(timeLeftInSec / 3600);
    let minutes = Math.floor((timeLeftInSec % 3600) / 60);
    let seconds = Math.floor(timeLeftInSec % 3600 % 60);
    if (hour >= 1) {
        return Math.round(timeLeftInSec / 3600) + `h`;
    } else if (minutes >= 1) {
        return minutes + 'min';
    } else {
        return seconds + 'sec';
    }
}

export function setIcon() {
    chrome.storage.local.get(['mode'], (result) => {
        if (result.mode === false) {
            chrome.browserAction.setIcon({path: 'img/break.png'});
        } else if (result.mode === true) {
            chrome.browserAction.setIcon({path: 'img/work.png'});
        }
    })
}

export function fetchParticipantId() {
    chrome.tabs.query({active: true, currentWindow: true},
        function (activeTab) {
            chrome.tabs.sendMessage(activeTab[0].id, {
                action: "Create Participant"
            })
        });
}


export function checkIfParticipantIdIsSet() {
    chrome.storage.local.get(['participantId'], (result) => {
        if (result.participantId == undefined) {
            fetchParticipantId();
        } else {
            return result.participantId;
        }
    })
}

export function onInstalledDo() {
    chrome.storage.local.get(['blacklist', 'baselineFinished', 'previousGoals', 'lastDomain', 'activeWebsites', 'mode', 'dateWhenModeEnds', 'participantId'], (result) => {
        if (result.blacklist == undefined) {
            const blacklist: Array<string> =  ["www.instagram.com", "www.facebook.com", "www.youtube.com", "www.netflix.com", "www.twitch.tv"];
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
