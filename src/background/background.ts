// @ts-ignore
import {TimeIntervall, TimeIntervallDto} from "../models/TimeIntervall.ts";

let startTimeintervall: number;
let lastDomain = "";
let lastClicked = 0;
// const serverUrl = "http://217.160.214.199:8080/api/timeIntervall/create";
const serverUrl = "nurdamitsgeht"
chrome.storage.local.set({activeWebsites: []});

setInterval(function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
        if (tab[0]) {
            checkDomain(tab[0].url, tab[0].id)
        }
    })
}, 1000)
var today = new Date();
chrome.storage.local.set({baselineFinished: [today.getDay() + 7, today.getMonth(), today.getFullYear()]})

// TODO FIX EVERY result.baselineFinished-7 remove -7
function checkDomain(website: string, tabId: number) {
    try {
        const url: URL = new URL(website);
        const currentDomain: string = url.hostname;
        window.console.log(currentDomain);
        if (currentDomain !== lastDomain) {


            chrome.storage.local.get(['blacklist', 'mode', 'baselineFinished'], (result) => {

                var today = new Date();
                // TODO REMOVE THE -7
                var baselineFinished = new Date(result.baselineFinished[2], result.baselineFinished[1], result.baselineFinished[0] - 7);
                var intervene = (today > baselineFinished);

                if (result.blacklist.includes(currentDomain) && intervene && (result.mode === true)) {
                    chrome.tabs.sendMessage(tabId, {domain: currentDomain, openReminder: false});
                }
                if (result.blacklist.includes(lastDomain)) {
                    sendIntervall(lastDomain, true, startTimeintervall, result.mode, intervene);
                } else {
                    sendIntervall(lastDomain, false, startTimeintervall, result.mode, intervene);
                }
                startTimeintervall = new Date().getTime();
                lastDomain = currentDomain;
            })
        }
    } catch (e) {
    }
}

function sendIntervall(domain: string, blacklisted: boolean, startTime: number, mode: boolean, baselineFinished: boolean) {

    let timeSpend = (new Date().getTime() - startTime) / 1000;
    var latestGoal = '';
    chrome.storage.local.get(['activeWebsites'], (result) => {
        result.activeWebsites.forEach(obj => {
            if (obj.hostname === domain) {
                latestGoal = obj.goal;
            }
        })

    });

    let newTimeIntervallDto: TimeIntervallDto = new TimeIntervallDto(999, mode, blacklisted, timeSpend, baselineFinished, latestGoal);
    if (domain !== "") {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', serverUrl, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = apiHandler;
        console.log("TimeIntervall send:", newTimeIntervallDto);
        xhr.send(JSON.stringify(newTimeIntervallDto));

        function apiHandler() {
            if (xhr.readyState === 1) {
                xhr.setRequestHeader("Content-type", "application/json");
            }
            if (xhr.readyState === 4 && xhr.status === 200) {
                xhr.open('POST', serverUrl, true);
            }
        }
    }

}


chrome.browserAction.onClicked.addListener(function () {
    chrome.storage.local.get(['mode'], (result) => {
        if (lastClicked > (Date.now() - 500) / 1000) {

            chrome.tabs.create({url: 'chrome-extension://' + chrome.runtime.id + '/options/options.html'})
        }
        if (result.mode === true) {
            chrome.browserAction.setIcon({path: 'img/break.png'});
            chrome.storage.local.set({mode: false})
        } else {
            chrome.storage.local.set({mode: true})
            chrome.browserAction.setIcon({path: 'img/work.png'});
        }

        lastClicked = Date.now() / 1000;
    });
})


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    let reminderExpiration = Date.now() + message.reminderTime;
    let tabId = sender.tab.id;
    let hostname = message.hostname;


    chrome.storage.local.get(['activeWebsites'], (result) => {
        result.activeWebsites.unshift({
            hostname: hostname,
            reminderRunning: reminderExpiration,
            goal: message.goal,
            tabId: tabId
        });
        chrome.storage.local.set({activeWebsites: result.activeWebsites});
    })

    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            if (hostname === new URL(tab.url).hostname) {
                chrome.tabs.sendMessage(tab.id, {
                    openReminder: false,
                    goal: message.goal,
                    url: message.hostname,
                    closeModal: true
                })
            }
        })
    });
    setTimeout(() => {
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach(function (tab) {
                if (hostname === new URL(tab.url).hostname) {
                    chrome.tabs.sendMessage(tab.id, {
                        openReminder: true,
                        goal: message.goal,
                        url: message.hostname,
                        closeModal: false
                    })
                }
            })

        })
        chrome.storage.local.get(['activeWebsites'], (result) => {
            let newArray = [];
            result.activeWebsites.forEach(obj => {
                if (obj.hostname !== hostname) {
                    newArray.unshift(obj)
                }
            })
            chrome.storage.local.set({activeWebsites: newArray});

        });
    }, message.reminderTime)

});
