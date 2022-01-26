// Webpack imports whole file this is a workaround

// export const serverUrl = "nurdamitsgeht";

export const serverUrl = "http://217.160.214.199:8080/api/";

export function checkIfModeActive(dateWhenModeEnds) {
    if (dateWhenModeEnds < Date.now() || dateWhenModeEnds == undefined) {
        chrome.storage.local.set({mode: null});
        openOrCloseModeSelectInEveryTab("Open Mode Select");
        return false;
    } else {
        return true;
    }
}

export function openOrCloseModeSelectInEveryTab(action) {
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
    var baselineDate = new Date(baselineFinished[0] - 7, baselineFinished[1], baselineFinished[2]);
    return (today >= baselineDate);
}

export function updateIconTimer() {
    chrome.storage.local.get(['dateWhenModeEnds'], (result) => {
        let timeTillModeEnds = calcIconTimer(result.dateWhenModeEnds);
        if (timeTillModeEnds != null) {
            chrome.browserAction.setBadgeText({text: timeTillModeEnds});
            if (timeTillModeEnds.substr(timeTillModeEnds.length - 3) === 'sec' && timeTillModeEnds[0] != '0') {
                setTimeout(() => {
                    updateIconTimer()
                }, 1000)
            }
        }
    })
}

export function calcIconTimer(dateWhenModeEnds) {
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


export function getParticipantId() {
    chrome.storage.local.get(['participantId'], (result) => {
        if (result.participantId == undefined) {
            fetchParticipantId();
        } else {
            return result.participantId;
        }
    })
}

