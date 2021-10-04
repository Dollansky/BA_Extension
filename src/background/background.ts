// @ts-ignore
import {TimeIntervall} from "../models/TimeIntervall.ts";


// TODO end Timeintervall on Idle
let startTimeintervall: number;
let lastDomain = "";
let secondsTillInactive: number = 30;
let counter: number = secondsTillInactive;
let isInactive: boolean = true;

setInterval(function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
        if (tab[0]) {
            counter = secondsTillInactive;
            checkDomain(tab[0].url, tab[0].id, isInactive)
            isInactive = false;
        } else if (!isInactive) {
            counter -= 1;
            if (counter === 0) {
                isInactive = true;
                counter = secondsTillInactive;
            }
        }
    })
}, 1000)


function checkDomain(website: string, tabId: number, isReactivated: boolean) {
    try {
        const url: URL = new URL(website);
        const currentDomain: string = url.hostname;
        if (currentDomain !== lastDomain) {
            chrome.storage.local.get(['blacklist', 'mode', 'latestGoal'], (result) => {
                chrome.tabs.sendMessage(tabId, {domain: currentDomain});
                console.log("latest Goal:", result.latestGoal);

                if (result.blacklist.includes(lastDomain)) {
                    sendIntervall(lastDomain, result.latestGoal, true, startTimeintervall, result.mode);
                    chrome.storage.local.set({latestGoal: ''});
                } else {
                    sendIntervall(lastDomain, "", false, startTimeintervall, result.mode);
                }
                startTimeintervall = new Date().getTime();
                lastDomain = currentDomain;
            })
        }
    } catch (e) {
    }
}

var xhr = new XMLHttpRequest();
xhr.open('POST', "localhost:8080/api/timeIntervall/create", true);


function sendIntervall(domain: string, latestGoal: string, blacklisted: boolean, startTime: number, mode: boolean) {

    let newIntervall: TimeIntervall = new TimeIntervall(domain, blacklisted, mode, startTime, new Date().getTime(), latestGoal);
    window.console.log(newIntervall);

    if (domain !== "") {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = apiHandler;
        xhr.open('POST', "localhost:8080/api/timeIntervall/create", true);
        xhr.send(JSON.stringify(newIntervall));
    }
    chrome.storage.local.get(['archive'], (result) => {
        let updatedArchive: Array<TimeIntervall> = result.archive;
        updatedArchive.push(newIntervall);
        chrome.storage.local.set({archive: updatedArchive});

        // TODO Send Data to remote Database
    })
}


function apiHandler(response) {

    if (xhr.readyState === 1) {
        xhr.setRequestHeader("Content-type", "application/json");
    }
    if (xhr.readyState === 4 && xhr.status === 200) {
        xhr.open('POST', "localhost:8080/api/timeIntervall/create", true);
    }
}






