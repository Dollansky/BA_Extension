//@ts-ignore
import {browserUrl, openModeSelectInCurrentTab, sendMessageToEveryTab} from "../background/exportedFunctions.ts";





document.getElementById('openBlacklist').addEventListener('click', openBlacklist);
document.getElementById('selectMode').addEventListener('click', openModeSelectInCurrentTab);
getTimeAndUpdatePopup();

function openBlacklist(){
    chrome.tabs.create({url: browserUrl + 'options/options.html'});
}

function getTimeRemaining(endtime: any) {

    let t = endtime - Date.now();
    var minutes =  Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);

    return {
        'total': t,
        'hours': hours,
        'minutes': minutes,
    };
}

function initializeClock(id: string, endtime: Date) {

    var clock = document.getElementById(id);
    var hoursSpan = clock.querySelector('.hours');
    var minutesSpan = clock.querySelector('.minutes');


    function updateClock() {
        var t = getTimeRemaining(endtime);

        hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);

        if (t.total <= 0) {
            clearInterval(timeinterval);
        }
    }

    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
}

function setCurrentMode(mode: boolean) {

    let img = document.getElementsByTagName('img')[0];

    if (mode === false) {
        img.src = browserUrl + 'img/breakPopup.png';
    } else if (mode === true) {
        img.src = browserUrl + 'img/laptopPopup.png';
    }
}

export function getTimeAndUpdatePopup(){

    chrome.storage.local.get(['mode', 'dateWhenModeEnds'], (result) =>{
        setCurrentMode(result.mode)
        initializeClock('clockdiv', new Date(result.dateWhenModeEnds));
    })
}

window.onload = function() {
    getTimeAndUpdatePopup()
}
