var reminderRunning = 0;

function getAndOpenModal() {
    chrome.storage.local.get(['blacklist', 'baselineFinished', 'mode'], (result) => {
        var today = new Date();
        var baselineFinished = new Date(result.baselineFinished[2] - 7, result.baselineFinished[1], result.baselineFinished[0])
        const currentDomain = new URL(location.href).hostname;
        const shadowWrapper = document.getElementById('shadowWrapper');
        window.console.log(shadowWrapper);
        if ((shadowWrapper === null)) {
            openInitialModal(currentDomain.toString());
            createGoalReminder();
        }
        if (result.blacklist.includes(currentDomain) && (today >= baselineFinished) && result.mode === true && (Date.now() > reminderRunning)) {
            var reminderInstance = M.Modal.getInstance(document.getElementById('shadowWrapper').shadowRoot.getElementById('reminderModal'));

            if(!reminderInstance.isOpen){
                // @ts-ignore
                document.getElementById('shadowWrapper').shadowRoot.getElementById('goalInput').value = '';
                var modalInstance = M.Modal.getInstance(document.getElementById('shadowWrapper').shadowRoot.getElementById('modal1'));
                if (!modalInstance.isOpen) {
                    modalInstance.open();
                }
            }
        }
    })
}

getAndOpenModal();

// For tab navigation
chrome.runtime.onMessage.addListener(() => {
    if ((Date.now() > reminderRunning)) {
        getAndOpenModal();
    }
})

function createGoalReminder() {
    window.console.log("openGoalReminder");
    const shadowRoot = document.getElementById('shadowWrapper').shadowRoot;
    const extensionUrl = 'chrome-extension://' + chrome.runtime.id

    let containerModal = document.createElement('div');
    containerModal.className = "modal";
    containerModal.setAttribute('style', 'width: 75% !important')
    containerModal.id = "reminderModal";
    containerModal.tabIndex = 0;

    let imgAlarm = document.createElement('img');
    imgAlarm.src = extensionUrl + "/img/wecker.png";

    let goalSpan = document.createElement('span');
    goalSpan.id = 'goalSpan';
    goalSpan.style.setProperty("font-size", "50px")
    goalSpan.innerText = 'template';

    let row1 = document.createElement('div');
    row1.className = "row";

    row1.append(imgAlarm, goalSpan);

    let containerContent = document.createElement('div');
    containerContent.className = "modal-content";
    let containerHeader = document.createElement('div');
    containerContent.append(containerHeader, row1);
    containerModal.append(containerContent);
    shadowRoot.appendChild(containerModal);

    M.Modal.init(shadowRoot.getElementById('reminderModal'), {
        dismissible: true,
        onCloseEnd: () => {
            getAndOpenModal();
        }
    });
    // modalInstance.open();
    // window.scrollTo(0, 0);


}

function openInitialModal(domain) {
    const shadowWrapper = document.createElement('div');
    shadowWrapper.id = 'shadowWrapper';
    shadowWrapper.setAttribute('style', `
    top: 0;
    left: 0;
    width: 0%;
    height: 0%;
    `);
    const shadowRoot = shadowWrapper.attachShadow({mode: 'open'});
    const materializeStyle = document.createElement('link');
    materializeStyle.type = "text/css";
    materializeStyle.media = "screen,projection";
    const extensionUrl = 'chrome-extension://' + chrome.runtime.id
    materializeStyle.setAttribute('rel', 'stylesheet');
    materializeStyle.setAttribute('href', extensionUrl + '/materialize/materialize.min.css');

    const materializeJs = document.createElement('script');
    materializeJs.type = "text/javascript";
    materializeJs.src = extensionUrl + '/materialize/materialize.js';
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
        });


    var autocompleteInstance = M.Autocomplete.init(shadowRoot.querySelectorAll('.autocomplete'));

    var newAutocompleteData: { [key: string]: string } = {};
    chrome.storage.local.get(['previousGoals'], (result) => {
        // window.console.log(instances);
        previousGoals = result.previousGoals;
        previousGoals.forEach(entry => {
            newAutocompleteData[entry] = null;
        })
        autocompleteInstance[0].updateData(newAutocompleteData);
    })
    submitButton.addEventListener('click', function () {
        getGoal(goalInput.value, timeSelector.value, ModalInstance, domain);
    }, false);
    goalInput.addEventListener('keyup', function (event) {
        if (event.code === 'Enter') {
            getGoal(goalInput.value, timeSelector.value, ModalInstance, domain);
        }
    })

    // Opening Modal scrolls Page to the bottom, following line prevents that from happening
    window.scrollTo(0, 0);

}

function getGoal(goalInput: string, timeFrame: any, instance: any, domain: string) {

    chrome.storage.local.set({latestGoal: goalInput});
    chrome.storage.local.get(['previousGoals'], (result) => {
        const newPreGoals = result.previousGoals;
        newPreGoals.unshift(goalInput);
        chrome.storage.local.set({previousGoals: newPreGoals});
    });
    // TODO tF* 60000
    reminderRunning = Date.now() + timeFrame * 6000;
    setTimeout(function () {
        if (new URL(location.href).hostname === domain) {
            window.console.log('openReminder');
            const shadowWrapper = document.getElementById('shadowWrapper');
            shadowWrapper.shadowRoot.getElementById('goalSpan').innerText = goalInput;
            var modalinstance = M.Modal.getInstance(shadowWrapper.shadowRoot.getElementById('reminderModal'))
            modalinstance.open();

        }

        // TODO tF* 60000
    }, timeFrame * 6000);
    instance.close();
}
