

//@ts-ignore
import {getParticipantId, participantId, serverUrl} from "../background/exportedFunctions.ts";
//@ts-ignore
import {BlackList} from "../models/BlackList.ts";

let blacklist: Array<string>;
let previousGoals: Array<string>;

document.getElementById('helpButton').addEventListener("click", () =>{
    document.getElementById('helpBox').className = "col s3 card blue-grey darken-1 scale-transition scale-in";
    document.getElementById('helpButton').hidden = true;
})

chrome.storage.local.get(['blacklist', 'previousGoals'], (result) => {

    let listContainer = document.getElementById('blacklist')
    let listElement = document.createElement('ul');
    listContainer.appendChild(listElement);
    blacklist = result.blacklist;
    previousGoals = result.previousGoals;


    blacklist.forEach(function (domain) {
        addToTable(domain);
    })


    const submit = document.getElementById('submitDomain');
    submit.addEventListener('click', function () {
        newDomain();
    })



    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        M.AutoInit(document.body);
    });
})


function removeDomain(domain: string) {
    chrome.storage.local.get(['blacklist','participantId'], (result) => {
        const newBlacklist: Array<string> = result.blacklist;
        chrome.storage.local.set({blacklist: newBlacklist.filter(entry => entry !== domain)})
        sendUpdatedBlacklist(newBlacklist,result.participantId);
        openToast(domain + ' wurde aus der Blacklist entfernt');
        removeInTable(domain);
    })
}

function newDomain() {
    const newDomain = document.getElementsByTagName('input');
    var currentDomain;
    try {
        const url: URL = new URL(newDomain[0].value);
        currentDomain = url.hostname;

    } catch (e) {
        currentDomain = newDomain[0].value;
    }
    updateBlacklist(currentDomain);
}

function updateBlacklist(currentDomain) {

    chrome.storage.local.get(['blacklist','participantId'], (result) => {

        const newBlacklist: Array<string> = result.blacklist;
        if (newBlacklist.filter(entry => entry === currentDomain).length === 0) {
            newBlacklist.unshift(currentDomain)
            chrome.storage.local.set({blacklist: newBlacklist});
            M.Modal.getInstance(document.getElementById("modal1")).close();
            document.getElementById('newDomain').setAttribute('class', 'valid');
            sendUpdatedBlacklist(newBlacklist, result.participantId);
            openToast(currentDomain + ' wurde der Blacklist hinzugefügt');
            addToTable(currentDomain);
        } else {
            M.Modal.getInstance(document.getElementById("modal1")).close();
            openToast("Die Website ist bereits in der Liste");
        }
    })
}

function sendUpdatedBlacklist(blacklist, participantId) {
    var newBlackList: BlackList = new BlackList(participantId,blacklist, Date.now())
    var xhr = new XMLHttpRequest();
    xhr.open('POST', serverUrl +"blacklist/create", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = apiHandler;

    xhr.send(JSON.stringify(newBlackList));

    function apiHandler(xhr) {
        if (xhr.readyState === 1) {
            xhr.setRequestHeader("Content-type", "application/json");
        }
        if (xhr.readyState === 4 && xhr.status === 200) {
            xhr.open('POST', serverUrl, true);
        }
    }
}

function openToast(message: string){
    M.toast({html: message})
}

function removeInTable(domain) {
    document.getElementById(domain).hidden = true;
}

function addToTable(domain: string) {
    let tableRow = document.createElement('tr');
    tableRow.id = domain;



    // Icon create
    let icon = document.createElement('td');
    let img = document.createElement('img');
    img.src = "http://www.google.com/s2/favicons?domain=" + domain;
    icon.appendChild(img);

    // Domain setting
    let domainTD = document.createElement('td');
    let domainText = document.createElement('p');
    domainText.setAttribute('font-size', '23')
    domainText.innerText = domain;
    domainTD.appendChild(domainText);


    // Button creation
    let buttonTD = document.createElement('td');
    buttonTD.className = 'right-align';
    let removeButton = document.createElement('button');
    removeButton.id = domain;
    removeButton.className = "waves-effect waves-light btn";
    let removeIcon = document.createElement('i');
    removeIcon.setAttribute('class', 'material-icons');
    removeIcon.innerText = "remove_circle";
    removeButton.appendChild(removeIcon);
    removeButton.addEventListener('click', function () {
        removeDomain(domain);
    }, false);
    buttonTD.appendChild(removeButton);
    tableRow.append(icon, domainTD, buttonTD);
    let table = document.getElementById('blacklist');
    table.appendChild(tableRow);
}
