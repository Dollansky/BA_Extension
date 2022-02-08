
//@ts-ignore
import {
    checkIfModeActive,
    sendMessageToEveryTab,
    updateIconTimer,
    setIcon,
    serverUrl,
    checkIfParticipantIdIsSet
} from "./exportedFunctions";
//@ts-ignore
import {ModeDto} from "../models/ModeDto.ts";


export function handleModeChange(mode: boolean) {
    if (mode) {
        sendMessageToEveryTab("Open Intervention Modal");
    } else {
        sendMessageToEveryTab("Close Intervention Modal");
    }

}

export function setModeAlarm(dateWhenModeEnds: any) {
    chrome.alarms.create('No Mode', {delayInMinutes: (dateWhenModeEnds - Date.now()) / 60000 })
}

export function sendModeDto(mode: boolean, dateWhenModeEnds: any, duration: any, participantId: string) {
    var newModeDto: ModeDto = new ModeDto(participantId, mode, dateWhenModeEnds, duration);

    fetch(serverUrl + "modeDto/create", {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(newModeDto)
    })
        .then()
        .then(function (data) {

        })
        .catch(function (error) {

        });
}

export function sendMode(mode: any, dateWhenModeEnds: any, duration: any) {
    chrome.storage.local.get(['participantId'], (result) => {
        sendModeDto(mode, dateWhenModeEnds, duration, result.participantId)
    });
}


export function calcDateWhenModeEnds(time: any) {
    if (time != null) {
        var currTime = new Date;
        var hour = currTime.getHours();
        var minutes = currTime.getMinutes();
        var day = currTime.getDate();
        var setHour = time[0] + time[1];
        var setMinute = time[3] + time[4];

        if (hour > setHour || hour == setHour && minutes >= setMinute) {
            // next day ?
            day += 1;
        }

        var dateWhenModeEnds: Date = new Date(currTime.getFullYear(), currTime.getMonth(), day, setHour, setMinute);
        return dateWhenModeEnds.getTime();
    }
}

