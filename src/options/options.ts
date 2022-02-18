//@ts-ignore
import {checkIfParticipantIdIsSet, participantId, serverUrl} from "../background/exportedFunctions.ts";
//@ts-ignore
import {BlackList} from "../models/BlackList.ts";


let blacklist: Array<string>;
let previousGoals: Array<string>;


setUpBlacklist()

function openHelp() {
    let insModal = M.Modal.getInstance(document.getElementById('instructionsModal'));
    insModal.open();
}

function addParticipantId(participantId: string) {
    let div = document.getElementById('participantIdDiv');
    let h4 = document.createElement('h5');
    h4.innerText = "Teilnehmer ID:" + '\n' +  participantId;

    div.append(h4);

}

function setUpBlacklist() {
    chrome.storage.local.get(['blacklist', 'previousGoals', 'instructionCheck', 'participantId'], (result) => {

        let listContainer = document.getElementById('blacklist')
        let listElement = document.createElement('ul');
        listContainer.appendChild(listElement);
        blacklist = result.blacklist;
        previousGoals = result.previousGoals;

        addParticipantId(result.participantId);

        blacklist.forEach(function (domain) {
            addToTable(domain);
        })


        const submit = document.getElementById('submitDomain');
        submit.addEventListener('click', function () {
            newDomain();
        })
        document.getElementById('newDomain').addEventListener('keyup', function (event) {
            if (event.code === 'Enter') {
                newDomain();
            }
        })

        M.AutoInit(document.body);


        document.getElementById('helpButton').addEventListener("click", () => {
            openHelp();
        });

    })
}


function removeDomain(domain: string) {
    chrome.storage.local.get(['blacklist', 'participantId'], (result) => {
        const newBlacklist: Array<string> = result.blacklist;
        chrome.storage.local.set({blacklist: newBlacklist.filter(entry => entry !== domain)})
        sendUpdatedBlacklist(newBlacklist, result.participantId);
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

function updateBlacklist(currentDomain: string) {

    chrome.storage.local.get(['blacklist', 'participantId'], (result) => {

        const newBlacklist: Array<string> = result.blacklist;
        if (newBlacklist.filter(entry => entry === currentDomain).length === 0 && currentDomain != "") {
            //@ts-ignore
            document.getElementById('newDomain').value = "";
            newBlacklist.unshift(currentDomain)
            chrome.storage.local.set({blacklist: newBlacklist});
            M.Modal.getInstance(document.getElementById("modal1")).close();
            document.getElementById('newDomain').setAttribute('class', 'valid');
            sendUpdatedBlacklist(newBlacklist, result.participantId);
            openToast(currentDomain + ' wurde der Blacklist hinzugefügt');
            addToTable(currentDomain);
        } else if (currentDomain != "") {
            M.Modal.getInstance(document.getElementById("modal1")).close();
            openToast("Die Website ist bereits in der Liste");
        }
    })
}

function sendUpdatedBlacklist(blacklist: Array<string>, participantId: string) {
    var newBlackList: BlackList = new BlackList(participantId, blacklist, Date.now())

    fetch(serverUrl + "blacklist/create", {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(newBlackList)
    })
        .then()
        .then(function (data) {

        })
        .catch(function (error) {

        });
}

function openToast(message: string) {
    M.toast({html: message})
}

function removeInTable(domain: string) {
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


chrome.runtime.onMessage.addListener((message) => {
    if (message.action == "firstInstall") {
        openHelp();
    }
});
