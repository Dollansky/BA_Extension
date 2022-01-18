//@ts-ignore
import {openModeSelectInCurrentTab, openOrCloseModeSelectInEveryTab} from "./exportedFunctions.ts";

const extensionUrl = 'chrome-extension://' + chrome.runtime.id

const materializeStyle = document.createElement('link');
materializeStyle.type = "text/css";
materializeStyle.media = "screen,projection";
materializeStyle.setAttribute('rel', 'stylesheet');
materializeStyle.setAttribute('href', extensionUrl + '/materialize/materialize.min.css');

const materializeJs = document.createElement('script');
materializeJs.type = "text/javascript";
materializeJs.src = extensionUrl + '/materialize/materialize.js';

document.body.append(materializeStyle,materializeJs);

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('openBlacklist').addEventListener('click', openBlacklist);
    document.getElementById('selectMode').addEventListener('click', openModeSelectInCurrentTab);
})




function openBlacklist(){
    chrome.tabs.create({url: 'chrome-extension://' + chrome.runtime.id + '/options/options.html'});
}

