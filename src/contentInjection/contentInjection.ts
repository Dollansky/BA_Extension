//@ts-ignore
import {browserUrl, browserUrl2, checkIfBaselineIsFinished} from "../background/exportedFunctions.ts";


var currentDomain = new URL(location.href).hostname;

chrome.storage.local.get(['blacklist'], result => {
    if (result.blacklist.includes(currentDomain)) {

        openInitialModal(currentDomain)
    }
})


function getAndOpenModal() {
    chrome.storage.local.get(['blacklist', 'baselineFinished', 'mode', 'activeWebsites'], (result) => {
        const currentDomain = new URL(location.href).hostname;
;
        var isBaselineFinished = checkIfBaselineIsFinished(result.baselineFinished);


        if (result.blacklist.includes(currentDomain) && isBaselineFinished && result.mode && !checkIfAlreadyActive(result, currentDomain)) {
            const shadowWrapper = document.getElementById('shadowWrapper');

            if ((shadowWrapper === null)) {
                openInitialModal(currentDomain);
            }

            if (!getReminderInstance().isOpen) {
                // @ts-ignore
                document.getElementById('shadowWrapper').shadowRoot.getElementById('goalInput').value = '';
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
    return M.Modal.getInstance(document.getElementById('shadowWrapper').shadowRoot.getElementById('reminderModal'));
}

function getModalInstance() {
    return M.Modal.getInstance(document.getElementById('shadowWrapper').shadowRoot.getElementById('modal1'));
}


// For tab navigation
chrome.runtime.onMessage.addListener((message) => {

    if (message.action == "Open Reminder Modal" && (message.url === new URL(location.href).hostname)) {
        openReminder(message.goal)
    }
    else if (message.action == "Close Intervention Modal") {
        // @ts-ignore
        document.getElementById('shadowWrapper').shadowRoot.getElementById('goalInput').value = '';
        getModalInstance().close();

    }
    else if (message.action == "Open Intervention Modal") {
        getAndOpenModal();
    }
    else if (message.action == "Close Reminder Modal") {
        getReminderInstance().close();
    }
});

function openReminder(goal: string) {
    const shadowWrapper = document.getElementById('shadowWrapper');
    shadowWrapper.shadowRoot.getElementById('goalSpan').innerText = goal;
    var reminderInstance = M.Modal.getInstance(shadowWrapper.shadowRoot.getElementById('reminderModal'));
    reminderInstance.options.dismissible = false;
    reminderInstance.open();
    // Reminder can be dismissed after 1 sek
    setTimeout(() => {
            reminderInstance.options.dismissible = true
        }
        , 1000)
}


function setLatestAndPreviousGoals(goalInput: string, timeFrame: any) {

    chrome.storage.local.set({latestGoal: goalInput});
    chrome.storage.local.get(['previousGoals'], (result) => {
        const newPreGoals = result.previousGoals;
        newPreGoals.unshift(goalInput);
        chrome.storage.local.set({previousGoals: newPreGoals});
    });
    chrome.runtime.sendMessage({
        action: "Set Reminder",
        goal: goalInput,
        hostname: new URL(location.href).hostname,
        reminderTime: timeFrame * 60000
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

function openInitialModal(domain: string) {
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

    let row1 = document.createElement('div');
    row1.className = "row";
    let row2 = document.createElement('div');
    row2.className = "row";
    let row3 = document.createElement('div')
    row3.className = "row";
    let row4 = document.createElement('div');
    row4.className = "row";

    let containerModal = document.createElement('div');
    containerModal.className = "modal";
    containerModal.setAttribute('style', 'width: 75% !important')
    containerModal.id = "modal1";
    containerModal.tabIndex = 0;
    let containerContent = document.createElement('div');
    containerContent.className = "modal-content";
    let containerHeader = document.createElement('img');
    // TODO passendes Icon suchen
    // containerHeader.src = "chrome-extension://ocfjoiapekdfcfajoopoeejhkfkdfepb/img/palm-of-hand.png";
    // Input Field
    let inputDiv = document.createElement('div');
    inputDiv.className = "input-field";
    let selectDiv = document.createElement('div');
    selectDiv.className = "input-field";
    selectDiv.id = "selectDiv";
    let goalInput = document.createElement('input');
    goalInput.id = "goalInput";
    goalInput.className = "col s9 autocomplete"
    goalInput.placeholder = "Was ist Ihr Ziel beim Besuch von " + domain;
    let label = document.createElement('label');
    label.innerText = "Ziel";
    let submitButton = document.createElement('button');
    submitButton.className = "waves-effect waves-light btn";
    submitButton.innerText = "Ziel setzen"


    let timeSelectorDiv = document.createElement('div');
    timeSelectorDiv.className = "input-field col";
    timeSelectorDiv.id = "timeSelect";
    timeSelectorDiv.setAttribute("style", "width: 200px height: 50px")
    let timeSelector = document.createElement('select');
    timeSelector.className = "browser-default";
    // TODO Remove when done testing
    let testOption1 = document.createElement('option');
    testOption1.innerText = '1 Sekunde (Testing)';
    testOption1.value = '0.01666666666';
    let testOption2 = document.createElement('option');
    testOption2.value = '0.08333333333';
    testOption2.innerText = '5 Sekunden (Testing)';
    let testOption3 = document.createElement('option');
    testOption3.value = '0.25';
    testOption3.innerText = '15 Sekunden (Testing)';
    let testOption4 = document.createElement('option');
    testOption4.value = '0.5';
    testOption4.innerText = '30 Sekunden (Testing)';
    timeSelector.append(testOption1, testOption2, testOption3, testOption4);
    // until here remove
    let options = ['1', '2', '3', '4', '5', '10', '15', '20', '25', '30', '45', '60'];
    options.forEach(option => {
        let timeOption = document.createElement('option');
        timeOption.value = option;
        if (option != '1') {
            timeOption.innerText = option + " Minuten";
        } else {
            timeOption.innerText = option + "Minute";
        }
        timeSelector.appendChild(timeOption);
    })


    timeSelectorDiv.append(timeSelector);
    row1.append(label);
    row2.append(goalInput, timeSelectorDiv);
    row3.append(submitButton);
    inputDiv.append(row1, row2, row3);
    selectDiv.append(row4);

    containerContent.append(containerHeader, inputDiv, selectDiv);
    containerModal.append(containerContent);
    shadowRoot.appendChild(containerModal);




    document.body.appendChild(shadowWrapper);


    var ModalInstance = M.Modal.init(shadowRoot.getElementById('modal1'),
        {
            dismissible: false,
            onCloseEnd: () => {
                enableShortcuts();
            }
        });


    var autocompleteInstance = M.Autocomplete.init(shadowRoot.querySelectorAll('.autocomplete'));

    var newAutocompleteData: { [key: string]: string } = {};

    chrome.storage.local.get(['previousGoals'], (result) => {
        let previousGoals = result.previousGoals;
        previousGoals.forEach((entry: string) => {
            newAutocompleteData[entry] = null;
        })
        autocompleteInstance[0].updateData(newAutocompleteData);
    })
    submitButton.addEventListener('click', function () {
        setLatestAndPreviousGoals(goalInput.value, timeSelector.value);
        ModalInstance.close();
    }, false);

    goalInput.addEventListener('keyup', function (event) {
        if (event.code === 'Enter') {
            setLatestAndPreviousGoals(goalInput.value, timeSelector.value);
            ModalInstance.close();
        }
    })

    // Opening Modal scrolls Page to the bottom, following line prevents that from happening
    window.scrollTo(0, 0);

    createReminder(shadowRoot);

    getAndOpenModal();

}


function createReminder(shadowRoot: ShadowRoot) {
    let reminderModal = document.createElement('div');
    reminderModal.className = "modal";
    reminderModal.setAttribute('style', 'width: 75% !important')
    reminderModal.id = "reminderModal";
    reminderModal.tabIndex = 0;

    let imgAlarm = document.createElement('img');
    let randomIcon: string = Math.floor(Math.random() * (5 - 1 + 1) + 1).toString();
    imgAlarm.src = browserUrl + "img/reminder/" + randomIcon + ".png";

    let goalSpan = document.createElement('span');
    goalSpan.setAttribute('style', "font-size:40px; margin-left: 40px")
    goalSpan.id = 'goalSpan';
    goalSpan.innerText = 'template';

    let reminderRow1 = document.createElement('div');
    reminderRow1.className = "row";

    reminderRow1.append(imgAlarm, goalSpan);

    let reminderContent = document.createElement('div');
    reminderContent.className = "modal-content";
    let reminderHeader = document.createElement('div');
    reminderContent.append(reminderHeader, reminderRow1);
    reminderModal.append(reminderContent);
    shadowRoot.appendChild(reminderModal);

    M.Modal.init(shadowRoot.getElementById('reminderModal'), {
        dismissible: true,
        onCloseEnd: () => {
            getAndOpenModal();
            closeReminderInOtherTabs();
        }
    });



}

function closeReminderInOtherTabs(){
    chrome.runtime.sendMessage({
        action: "Close Reminder in every Tab",
        hostname: currentDomain
    })
}
