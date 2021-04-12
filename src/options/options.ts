import {MDCTextField} from '@material/textfield';
import {MDCRipple} from '@material/ripple'
import {MDCList} from "@material/list/component";
import onButtonClicked = chrome.notifications.onButtonClicked;

// TODO Layout Überschrift  remove functionality
// TODO blacklist -> Object Blacklist: domain , intervention, default antworten
window.console.log("hi");
let blacklist: Array<string>;
chrome.storage.local.get(['blacklist'], (result) => {

    let listContainer = document.createElement('div');
    listContainer.setAttribute('class', 'collection');
    let listElement = document.createElement('ul');
    document.getElementsByTagName('body')[0].appendChild(listContainer);
    document.getElementById('blacklist').appendChild(listContainer);
    listContainer.appendChild(listElement);
    blacklist = result.blacklist;


    blacklist.forEach(function(domain) {
       let listItem = document.createElement('li');
       listItem.setAttribute('class','collection-item');
       let img = document.createElement('img');
       img.src = "chrome://favicon/https:/" + domain;
       listItem.appendChild(img);
       listItem.innerHTML = domain;
       let container = document.createElement('div');
       container.className = "secondary-content";
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
       container.appendChild(removeButton);
       listItem.appendChild(container);
       listElement.appendChild(listItem);
    })
})

function removeDomain(domain: string) {
    window.console.log(domain);

}
