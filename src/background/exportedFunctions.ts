// Webpack imports whole file this is a workaround


export function checkIfModeActive(dateWhenModeEnds) {
    window.console.log("check If Mode Active");
    window.console.log("dateWhenModeEnds:", dateWhenModeEnds);
    if (dateWhenModeEnds < Date.now() || dateWhenModeEnds == undefined ) {
        chrome.storage.local.set({mode: null});
        openOrCloseModeSelectInEveryTab("Open Mode Select");
        return false;
    } else {
        return true;
    }
}

export function openOrCloseModeSelectInEveryTab(open) {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            chrome.tabs.sendMessage(tab.id, {
                action: open
            })
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
    if(hour >= 1){
        return hour+`h`;
    } else if (minutes > 1) {
        return minutes+'min';
    } else {
        return seconds +'sec';
    }
}
