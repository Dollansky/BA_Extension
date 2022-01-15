// TODO Layout Überschrift  remove functionality
// TODO blacklist -> Object Blacklist: domain , intervention, default antworten
// TODO Add Button for manual learn or freetime change;

let blacklist: Array<string>;
let previousGoals: Array<string>;

chrome.storage.local.get(['blacklist', 'previousGoals'], (result) => {

    let listContainer = document.getElementById('blacklist')
    let listElement = document.createElement('ul');
    listContainer.appendChild(listElement);
    blacklist = result.blacklist;
    previousGoals = result.previousGoals;


    blacklist.forEach(function (domain) {
        let tableRow = document.createElement('tr');

        // Icon create
        let icon = document.createElement('td');
        let img = document.createElement('img');
        img.src = "chrome://favicon/https:/" + domain;
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
    chrome.storage.local.get(['blacklist'], (result) => {
        const newBlacklist: Array<string> = result.blacklist;
        chrome.storage.local.set({blacklist: newBlacklist.filter(entry => entry !== domain)})
        window.location.reload();
    })
}

function newDomain() {
    const newDomain = document.getElementsByTagName('input');
    try {
        const url: URL = new URL(newDomain[0].value);
        const currentDomain: string = url.hostname;
        chrome.storage.local.get(['blacklist'], (result) => {
            const newBlacklist: Array<string> = result.blacklist;
            if (newBlacklist.filter(entry => entry === currentDomain).length === 0) {
                newBlacklist.unshift(currentDomain)
                chrome.storage.local.set({blacklist: newBlacklist});
                M.Modal.getInstance(document.getElementById("modal1")).close();
                document.getElementById('newDomain').setAttribute('class', 'valid');
                window.location.reload();
            } else {
                document.getElementsByTagName('input')[0].value = "Die Website ist bereits in der Liste.";
            }
        })
    } catch (e) {
        document.getElementById('newDomain').setAttribute('class', 'invalid');
        document.getElementsByTagName('input')[0].value = "Bitte kopieren Sie die komplette Adresse der Website. Bsp. https://www.google.de/"
    }
}

