// TODO WEBPACK IMPROTING WHOLE FILE INSTEAD OF JUSTN THE FUNCTION
//@ts-ignore
import {checkIfModeActive, openOrCloseModeSelectInEveryTab, updateIconTimer} from "./exportedFunctions.ts";



setInterval(() => {
    chrome.storage.local.get(['dateWhenModeEnds'], (result) => {
        let modeActive: boolean = checkIfModeActive(result.dateWhenModeEnds);
        window.console.log("mode Active ? ", modeActive);
        if(modeActive) {
            updateIconTimer();
        }
    })
}, 6000) // TODO back to 30000


chrome.browserAction.onClicked.addListener(() => {
    openOrCloseModeSelectInEveryTab("Open Mode Select")
})


chrome.runtime.onMessage.addListener((message => {
    if (message.action == "Set Mode Selection") {
        let dateWhenModeEnds = calcDateWhenModeEnds(message.time);
        setModeAndIcon(message.mode);
        chrome.storage.local.set({dateWhenModeEnds: dateWhenModeEnds});
        updateIconTimer();
        openOrCloseModeSelectInEveryTab("Close Mode Select");
    }
}))


function calcDateWhenModeEnds(time) {
    var currTime = new Date;
    var hour = currTime.getHours();
    var minutes = currTime.getMinutes();
    var day = currTime.getDate();
    var setHour = time[0] + time[1];
    var setMinute = time[3] + time[4];

    if (hour > setHour || hour == setHour && minutes > setMinute) {
        // next day ?
        day += 1;
    }
    var dateWhenModeEnds: Date = new Date(currTime.getFullYear(), currTime.getMonth(), day, setHour, setMinute);
    return dateWhenModeEnds.getTime();
}




function setModeAndIcon(mode) {
    chrome.storage.local.set({mode: mode});
    if (mode === false) {
        chrome.browserAction.setIcon({path: 'img/break.png'});
    } else if (mode === true) {
        chrome.browserAction.setIcon({path: 'img/work.png'});
    }
}


