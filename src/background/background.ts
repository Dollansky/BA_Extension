// @ts-ignore
import {TimeIntervall} from "../models/TimeIntervall.ts";



// TODO end Timeintervall on Idle
let startTimeintervall: number;
let lastDomain = "";
let secondsTillInactive: number = 5;
let counter : number = secondsTillInactive;
let isInactive: boolean = true;
setInterval(function(){
    chrome.tabs.query({active:true, currentWindow: true}, function(tab) {
        if(tab[0]) {
            isInactive = false;
            counter = secondsTillInactive;
            checkDomain(tab[0].url, tab[0].id, isInactive)
        } else if (!isInactive){
            counter -= 1;
            if(counter === 0) {
                isInactive = true;
                counter = secondsTillInactive;
            }
        }
    })
}, 1000)


function checkDomain(website: string, tabId: number, isReactivated: boolean){
    try{
        const url: URL = new URL(website);
        const currentDomain: string = url.hostname;
        if(currentDomain !== lastDomain || isInactive) {
            chrome.storage.local.get(['blacklist','mode'], (result) => {
                chrome.tabs.sendMessage(tabId, {domain: currentDomain});
                console.log("messageSendgh");
                console.log(currentDomain);
                console.log(tabId);
                document.createElement('div')
                if(result.blacklist.includes(lastDomain)){
                    saveIntervall(lastDomain, true, startTimeintervall, result.mode);
                } else {
                    saveIntervall(lastDomain, false, startTimeintervall, result.mode);
                }
                startTimeintervall = new Date().getTime();
                lastDomain = currentDomain;
            })
        }
    } catch (e) {
    }
}

function saveIntervall(domain: string, blacklisted: boolean, startTime: number, mode: boolean) {

    let newIntervall: TimeIntervall = new TimeIntervall(domain,blacklisted,mode ,startTime, new Date().getTime());
    // if(domain !== ""){
    //     xhr.send(JSON.stringify(newIntervall));
    // }
    chrome.storage.local.get(['archive'], (result) => {
        let updatedArchive : Array<TimeIntervall> = result.archive;
        updatedArchive.push(newIntervall);
        chrome.storage.local.set({archive: updatedArchive});

        // TODO Send Data to remote Database
    })
}


var xhr = new XMLHttpRequest();
xhr.onreadystatechange = apiHandler;
xhr.open('POST',"http://localhost:8080/api/timeintervall/create/1", true);


function apiHandler(response){
    console.log(xhr.readyState)
    console.log(response);
    if(xhr.readyState === 1){
        xhr.setRequestHeader("Content-type", "application/json");
    }
    if(xhr.readyState === 4 && xhr.status === 200){
        xhr.open('POST',"http://localhost:8080/api/timeintervall/create/1", true);
    }
}





