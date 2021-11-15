// @ts-ignore
import {TimeIntervall, TimeIntervallDto} from "../models/TimeIntervall.ts";


// TODO end Timeintervall on Idle
let startTimeintervall: number;
let lastDomain = "";
// let secondsTillInactive: number = 120;
// let counter: number = secondsTillInactive;
// let isInactive: boolean = true;
const serverUrl = "http://217.160.214.199:8080/api/timeIntervall/create"


setInterval(function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
        if (tab[0]) {
            checkDomain(tab[0].url, tab[0].id)
        }
    })
}, 1000)

// TODO FIX EVERY result.baselineFinished-7 remove -7
function checkDomain(website: string, tabId: number) {
    try {
        const url: URL = new URL(website);
        const currentDomain: string = url.hostname;
        window.console.log(currentDomain);
        if (currentDomain !== lastDomain) {
            chrome.storage.local.get(['blacklist', 'mode', 'latestGoal','baselineFinished'], (result) => {

                var today = new Date();
                var baselineFinished = new Date(result.baselineFinished[2]-7, result.baselineFinished[1],result.baselineFinished[0]);
                var intervene = (today > baselineFinished);
                if(result.blacklist.includes(currentDomain) && intervene && (result.mode === true )){
                    chrome.tabs.sendMessage(tabId, {domain: currentDomain});
                }
                if (result.blacklist.includes(lastDomain)) {
                    window.console.log(result.blacklist.includes(lastDomain));
                    sendIntervall(lastDomain, result.latestGoal, true, startTimeintervall, result.mode, intervene);
                    chrome.storage.local.set({latestGoal: ''});
                } else {
                    sendIntervall(lastDomain, "", false, startTimeintervall, result.mode, intervene );
                }
                startTimeintervall = new Date().getTime();
                lastDomain = currentDomain;
            })
        }
    } catch (e) {
    }
}

function sendIntervall(domain: string, latestGoal: string, blacklisted: boolean, startTime: number, mode: boolean, baselineFinished: boolean) {

    let timeSpend = (new Date().getTime() - startTime) / 1000
    let newTimeIntervallDto: TimeIntervallDto = new TimeIntervallDto(999,mode, blacklisted, timeSpend, baselineFinished, latestGoal);
    window.console.log(newTimeIntervallDto);
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



chrome.browserAction.onClicked.addListener(function() {
    chrome.storage.local.get(['mode'], (result) => {
        window.console.log('clicked');
        window.console.log(result.mode);
        if(result.mode === true){
            chrome.browserAction.setIcon({path: 'img/break.png'});
            chrome.storage.local.set({mode: false})
        } else {
            chrome.storage.local.set({mode: true})
            chrome.browserAction.setIcon({path: 'img/work.png'});
        }
    })
;
})


