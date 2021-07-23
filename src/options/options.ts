


// TODO Layout Überschrift  remove functionality
// TODO blacklist -> Object Blacklist: domain , intervention, default antworten

let blacklist: Array<string>;
chrome.storage.local.get(['blacklist'], (result) => {

    let listContainer = document.getElementById('blacklist')
    let listElement = document.createElement('ul');
    listContainer.appendChild(listElement);
    blacklist = result.blacklist;


    blacklist.forEach(function(domain) {
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
        let removeIcon= document.createElement('i');
        removeIcon.setAttribute('class','material-icons');
        removeIcon.innerText = "remove_circle";
        removeButton.appendChild(removeIcon);
        removeButton.addEventListener('click', function() {
            removeDomain(domain);
        }, false);
        buttonTD.appendChild(removeButton);
        tableRow.append(icon,domainTD,buttonTD);
        let table = document.getElementById('blacklist');
        table.appendChild(tableRow);
    })
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currTab = tabs[0];
        let timeSelectorDiv = document.createElement('div');
        timeSelectorDiv.className = "input-field col s12";


        let timeSelector = document.createElement('select');
        let options = ['1','2','3','4','5','10','15','30'];
        options.forEach(option =>  {
            let timeOption = document.createElement('option');
            timeOption.value = option;
            if (option != '1') {
                timeOption.innerText = option + " Minuten";
            } else {
                timeOption.innerText = option + "Minute";
            }
            timeSelector.appendChild(timeOption);
        })
        let timeSelectorLabel = document.createElement('label');
        timeSelectorLabel.innerText = "Someting";
        timeSelectorDiv.append(timeSelector , timeSelectorLabel);
        
        document.body.appendChild(timeSelectorDiv);
        M.AutoInit(document.body);
        window.console.log(timeSelectorDiv);



    });
    // TODO wenn select hier functioniert im model anwenden

    // var elems = document.querySelectorAll('.modal');
    // var instances = M.Modal.init(elems);
    // console.log(elems);
    // instances[0].open();
})


// TODO add functionality
function removeDomain(domain: string) {
    window.console.log(domain);

}

