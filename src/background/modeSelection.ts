// TODO WEBPACK IMPROTING WHOLE FILE INSTEAD OF JUSTN THE FUNCTION
//@ts-ignore
import {checkIfModeActive, openOrCloseModeSelectInEveryTab, updateIconTimer, setIcon,serverUrl, getParticipantId} from "./exportedFunctions.ts";
//@ts-ignore
import {ModeDto} from "../models/ModeDto.ts";


setInterval(() => {
    setIcon();
    chrome.storage.local.get(['dateWhenModeEnds'], (result) => {
        if(checkIfModeActive(result.dateWhenModeEnds)) {
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
        if(dateWhenModeEnds != null){
            chrome.storage.local.set({mode: message.mode});
            chrome.storage.local.set({dateWhenModeEnds: dateWhenModeEnds});

            setIcon();
            updateIconTimer();

            openOrCloseModeSelectInEveryTab("Close Mode Select");

            sendModeDtoAndGetParticipantId(message.mode, dateWhenModeEnds,(dateWhenModeEnds - Date.now()) );
        }

    }
}))

function sendModeDto(mode, dateWhenModeEnds, duration, participantId) {
        var newModeDto: ModeDto = new ModeDto(participantId, mode, dateWhenModeEnds,duration)
        var xhr = new XMLHttpRequest();
        xhr.open('POST', serverUrl + "modeDto/create", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = apiHandler;

        xhr.send(JSON.stringify(newModeDto));

        function apiHandler(xhr) {
            if (xhr.readyState === 1) {
                xhr.setRequestHeader("Content-type", "application/json");
            }
            if (xhr.readyState === 4 && xhr.status === 200) {
                xhr.open('POST', serverUrl, true);
            }
        }
}

function sendModeDtoAndGetParticipantId(mode,dateWhenModeEnds,duration){
    chrome.storage.local.get(['participantId'], (result) => {
       sendModeDto(mode,dateWhenModeEnds,duration, result.participantId)
    });

}


function calcDateWhenModeEnds(time) {
    if(time != null){
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

}
