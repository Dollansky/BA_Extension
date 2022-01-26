//@ts-ignore
import {openModeSelectInCurrentTab, openOrCloseModeSelectInEveryTab} from "../background/exportedFunctions.ts";


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('openBlacklist').addEventListener('click', openBlacklist);
    document.getElementById('selectMode').addEventListener('click', openModeSelectInCurrentTab);
})




function openBlacklist(){
    chrome.tabs.create({url: 'chrome-extension://' + chrome.runtime.id + '/options/options.html'});
}

