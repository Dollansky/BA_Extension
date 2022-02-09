import {browserUrl, checkIfBaselineIsFinished} from "../background/exportedFunctions";
//@ts-ignore
import html from "../html/reminderModal.html"

var currentDomain = new URL(location.href).hostname;
var reason: any = null;

setupContent();

function setupContent() {
    chrome.storage.local.get(['blacklist'], result => {
        if (result.blacklist.includes(currentDomain)) {
            createShadowrootAndAddHtml();
            openModalIfValid();
        }
    });

}
// For tab navigation
chrome.runtime.onMessage.addListener((message) => {

    if (message.action == "Close Intervention Modal") {
        getModalInstance().close();

    } else if (message.action == "Open Intervention Modal") {
        openModalIfValid();
    } else if (message.action == "Open Reminder Modal" && (message.url === new URL(location.href).hostname)) {
        openReminder(message.goal)
    } else if (message.action == "Close Reminder Modal") {
        closeReminder();

    }
});


function openModalIfValid() {
    chrome.storage.local.get(['blacklist', 'baselineFinished', 'mode', 'activeWebsites'], (result) => {
        const currentDomain = new URL(location.href).hostname;

        if (result.blacklist.includes(currentDomain) && checkIfBaselineIsFinished(result.baselineFinished) && result.mode && !checkIfAlreadyActive(result, currentDomain)) {
            if ((getShadowWrapper() === null)) {
                createShadowrootAndAddHtml();
            }

            if (!getReminderInstance().isOpen) {

                var modalInstance = getModalInstance();

                // timeout prevents site from scrolling
                if (!modalInstance.isOpen) {
                    //window.console.
                    setTimeout(function () {
                            modalInstance.open();
                            disableShortcuts();
                        },
                        500);
                }
            }
        }
    })
}


function checkIfAlreadyActive(result: { [p: string]: any }, currentDomain: string) {
    let isActive: boolean = false;
    result.activeWebsites.forEach((obj: any) => {
        if (obj.hostname === currentDomain) {
            isActive = true;
        }
    });

    return isActive;
}

function getReminderInstance() {
    return M.Modal.getInstance(getShadowWrapper().shadowRoot.getElementById('reminderModal'));
}

function getModalInstance() {
    return M.Modal.getInstance(getShadowWrapper().shadowRoot.getElementById('modal1'));
}

function openReminder(goal: string) {
    const shadowWrapper = getShadowWrapper();
    shadowWrapper.shadowRoot.getElementById('goalSpan').innerText = goal;
    var reminderInstance = M.Modal.getInstance(shadowWrapper.shadowRoot.getElementById('reminderModal'));
    reminderInstance.open();
}


function setLatestAndPreviousGoals(goalInput: string, timeFrame: any) {
    chrome.storage.local.get(['previousGoals'], (result) => {
        const newPreGoals = result.previousGoals;
        newPreGoals.unshift(goalInput);
        chrome.storage.local.set({previousGoals: newPreGoals});
    });
    chrome.runtime.sendMessage({
        action: "Set Reminder",
        goal: goalInput,
        hostname: new URL(location.href).hostname,
        reminderTime: timeFrame * 60000,
        reason: reason
    });

}

function disableShortcuts() {
    window.addEventListener('keydown', stopPropagation, true);
    window.addEventListener('keypress', stopPropagation, true);

}

function enableShortcuts() {
    window.removeEventListener('keydown', stopPropagation, true)
    window.removeEventListener('keypress', stopPropagation, true);
}


function stopPropagation(e: any) {
    e.stopPropagation();
    e.stopImmediatePropagation();
}

function setUpAutoComplete() {

    var autocompleteInstance = M.Autocomplete.init(getShadowWrapper().shadowRoot.querySelectorAll('.autocomplete'));

    var newAutocompleteData: { [key: string]: string } = {};

    chrome.storage.local.get(['previousGoals'], (result) => {
        let previousGoals = result.previousGoals;
        previousGoals.forEach((entry: string) => {
            newAutocompleteData[entry] = null;
        })
        autocompleteInstance[0].updateData(newAutocompleteData);
    })
}

function addInputAndReminderModal() {
    getShadowWrapper().shadowRoot.innerHTML += (html);
}

function createShadowrootAndAddHtml() {
    const shadowWrapper = document.createElement('div');
    shadowWrapper.id = 'shadowWrapper';

    const shadowRoot = shadowWrapper.attachShadow({mode: 'open'});
    const materializeStyle = document.createElement('link');
    materializeStyle.type = "text/css";
    materializeStyle.media = "screen,projection";

    materializeStyle.setAttribute('rel', 'stylesheet');
    materializeStyle.setAttribute('href', browserUrl + 'materialize/materialize.min.css');

    const materializeJs = document.createElement('script');
    materializeJs.type = "text/javascript";
    materializeJs.src = browserUrl + 'materialize/materialize.js';
    shadowRoot.append(materializeStyle, materializeJs);
    document.body.appendChild(shadowWrapper);

    addInputAndReminderModal();
    addFunctionality();
}


function addFunctionality() {
    initializeModals();
    addImgToReminder();
    addButtonFunctionality();
    setUpAutoComplete();
}


function addImgToReminder() {
    let imgContainer = getShadowWrapper().shadowRoot.getElementById('imgContainer');
    let img = document.createElement('img');
    let randomIcon: string = Math.floor(Math.random() * (5 - 1 + 1) + 1).toString();
    img.src = browserUrl + "img/reminder/" + randomIcon + ".png";
    imgContainer.append(img);
}


function addButtonFunctionality() {
    addSubmitButtonFunctionality();
    addRadioButtonsFunctionality();
}

function addSubmitButtonFunctionality() {
    let submitButton = getShadowWrapper().shadowRoot.getElementById('submitButton');
    let goalInput = getShadowRoot().querySelectorAll('#goalInput')[0];
    let timeSelector = getShadowRoot().getElementById('timeSelectValue');
    submitButton.addEventListener('click', function () {

        //@ts-ignore
        setLatestAndPreviousGoals(goalInput.value, timeSelector.value);
        getModalInstance().close();
    }, false);

    goalInput.addEventListener('keyup', function (event) {
        //@ts-ignore
        if (event.code === 'Enter') {
            //@ts-ignore
            setLatestAndPreviousGoals(goalInput.value, timeSelector.value);
            getModalInstance().close();
        }
    })
}

function addRadioButtonsFunctionality() {
    let radioButtons = getShadowRoot().querySelectorAll("input.with-gap");

    radioButtons.forEach(function (btn) {
        btn.addEventListener('click', () => {
            getReminderInstance().options.dismissible = true;

        })
    });


    let cards = getShadowRoot().querySelectorAll('.card-panel');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            getReminderInstance().options.dismissible = true;
            //@ts-ignore
            getShadowRoot().getElementById(card.id +"Button").checked = true;
        });

    })

}

function closeReminder() {
    getReminderInstance().close();
}

function initializeModals() {
    M.Modal.init(getShadowRoot().getElementById('modal1'),
        {
            dismissible: false,
            onCloseEnd: () => {
                enableShortcuts();
            }
        });
    M.Modal.init(getShadowRoot().getElementById('reminderModal'), {
        dismissible: false,
        onCloseEnd: () => {
            setReason();
            unCheckRadioButtons();
            openModalIfValid();
            closeReminderInOtherTabs();
        }
    });
}

function unCheckRadioButtons() {
    let radioButtons = getShadowRoot().querySelectorAll("input.with-gap");
    radioButtons.forEach(function (btn) {
        //@ts-ignore
        btn.checked = false;
    });
    getReminderInstance().options.dismissible = false;

}

function getShadowWrapper() {
    return document.getElementById('shadowWrapper');
}

function getShadowRoot() {
    return getShadowWrapper().shadowRoot;
}

function setReason() {
    //@ts-ignore
    let radioButtons = getShadowRoot().querySelectorAll("input.with-gap");
    radioButtons.forEach(function (btn) {
        //@ts-ignore
        if(btn.checked){
            //@ts-ignore
            reason = btn.value;
        }
    });
}


function closeReminderInOtherTabs() {
    chrome.runtime.sendMessage({
        action: "Close Reminder in every Tab",
        hostname: currentDomain
    })

}
