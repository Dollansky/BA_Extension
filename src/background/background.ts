// @ts-ignore
import {TimeIntervall, TimeIntervallDto} from "../models/TimeIntervall.ts";


// TODO end Timeintervall on Idle
let startTimeintervall: number;
let lastDomain = "";
let secondsTillInactive: number = 30;
let counter: number = secondsTillInactive;
let isInactive: boolean = true;
const serverUrl = "http://217.160.214.199:8080/api/timeIntervall/create"

setInterval(function () {
    // TODO idk how to handle this
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
        window.console.log("new URL:", url);
        const currentDomain: string = url.hostname;
        if (currentDomain !== lastDomain) {
            chrome.storage.local.get(['blacklist', 'mode', 'latestGoal'], (result) => {
                // setTimeout(function() {
                //     chrome.tabs.sendMessage(tabId, {domain: currentDomain});
                // }, 500);
                // chrome.tabs.sendMessage(tabId, {domain: currentDomain});
                console.log("latest Goal:", result.latestGoal);

                if(result.blacklist.includes(currentDomain) ){
                    setTimeout(function() {
                        chrome.tabs.sendMessage(tabId, {domain: currentDomain});
                    }, 1000);
                }
                if (result.blacklist.includes(lastDomain)) {
                    sendIntervall(lastDomain, result.latestGoal, true, startTimeintervall, result.mode);
                    chrome.storage.local.set({latestGoal: ''});
                } else {
                    window.console.log("send");
                    sendIntervall(lastDomain, "", false, startTimeintervall, result.mode);
                }
                startTimeintervall = new Date().getTime();
                lastDomain = currentDomain;
            })
        }
    } catch (e) {
    }
}

function sendIntervall(domain: string, latestGoal: string, blacklisted: boolean, startTime: number, mode: boolean) {

    let timeSpend = (new Date().getTime() - startTime) / 1000
    let newTimeIntervallDto: TimeIntervallDto = new TimeIntervallDto(2, blacklisted, timeSpend, latestGoal);
    window.console.log(domain);
    if (domain !== "") {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', serverUrl, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = apiHandler;
        console.log("TimeIntervall send:", newTimeIntervallDto);
        xhr.send(JSON.stringify(newTimeIntervallDto));


        function apiHandler() {
            if (xhr.readyState === 1) {
                console.log("Readystate 1", xhr)
                xhr.setRequestHeader("Content-type", "application/json");
            }
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log("Readystate 4 and status 200", xhr)
                xhr.open('POST', serverUrl, true);
            }
        }
    }

}






