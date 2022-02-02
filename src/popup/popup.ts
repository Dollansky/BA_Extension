//@ts-ignore
import {browserUrl, openModeSelectInCurrentTab, sendMessageToEveryTab} from "../background/exportedFunctions.ts";


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('openBlacklist').addEventListener('click', openBlacklist);
    document.getElementById('selectMode').addEventListener('click', openModeSelectInCurrentTab);
})




function openBlacklist(){
    chrome.tabs.create({url: browserUrl + 'options/options.html'});
}

