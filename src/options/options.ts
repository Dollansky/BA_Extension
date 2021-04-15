

// TODO Layout Überschrift  remove functionality
// TODO blacklist -> Object Blacklist: domain , intervention, default antworten
window.console.log("hi");
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

       // let listItem = document.createElement('li');
       // listItem.setAttribute('class','collection-item');
       // let img = document.createElement('img');
       // img.src = "chrome://favicon/https:/" + domain;
       //
       // listItem.innerHTML = domain;
       // listItem.appendChild(img);
       // let container = document.createElement('div');
       // container.className = "secondary-content";
       // let removeButton = document.createElement('button');
       // removeButton.id = domain;
       // removeButton.className = "waves-effect waves-light btn";
       // let removeIcon= document.createElement('i');
       // removeIcon.setAttribute('class','material-icons');
       // removeIcon.innerText = "remove_circle";
       // removeButton.appendChild(removeIcon);
       // removeButton.addEventListener('click', function() {
       //     removeDomain(domain);
       // }, false);
       // container.appendChild(removeButton);
       // listItem.appendChild(container);
       // listElement.appendChild(listItem);
    })
})


// TODO add functionality
function removeDomain(domain: string) {
    window.console.log(domain);

}
