/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
// var reminderRunning = 0;
//
// // First time opening new website
// chrome.storage.local.get(['blacklist', 'baselineFinished'], (result) => {
//     var today = new Date();
//     var baselineFinished = new Date(result.baselineFinished[2], result.baselineFinished[1],result.baselineFinished[0])
//     window.console.log(location.href);
//     const currentDomain = new URL(location.href).hostname;
//     window.console.log(result);
//     window.console.log(currentDomain);
//     if(result.blacklist.includes(currentDomain) && (today >= baselineFinished)){
//         openInitialModal(currentDomain.toString());
//     };
//
//
//
// })
//
// // For tab navigation
// chrome.runtime.onMessage.addListener((request, sender, resp) => {
//     window.console.log('contentInjection');
//
//     const shadowWrapper = document.getElementById('shadowWrapper');
//     if((Date.now() > reminderRunning) && shadowWrapper !== undefined)  {
//         // @ts-ignore
//         document.getElementById('shadowWrapper').shadowRoot.getElementById('goalInput').value = '';
//         var modalinstance = M.Modal.getInstance(document.getElementById('shadowWrapper').shadowRoot.getElementById('modal1'))
//         modalinstance.open();
//     } else {
//         openInitialModal(request.domain)
//     }
// })
//
// function openGoalReminder(goalInput) {
//     window.console.log("openGoalReminder)");
//     const shadowWrapper = document.createElement('div');
//     shadowWrapper.setAttribute('style', `
//     top: 0;
//     left: 0;
//     width: 0%;
//     height: 0%;
//     `);
//     shadowWrapper.id = 'goalReminder'
//     const shadowRoot = shadowWrapper.attachShadow({mode: 'open'});
//     const materializeStyle = document.createElement('link');
//     materializeStyle.type = "text/css";
//     materializeStyle.media = "screen,projection";
//     materializeStyle.setAttribute('rel', 'stylesheet');
//     materializeStyle.setAttribute('href', 'chrome-extension://ocfjoiapekdfcfajoopoeejhkfkdfepb/materialize/materialize.min.css');
//
//     const materializeJs = document.createElement('script');
//     materializeJs.type = "text/javascript";
//     materializeJs.src = "chrome-extension://ocfjoiapekdfcfajoopoeejhkfkdfepb/materialize/materialize.min.js";
//     shadowRoot.append(materializeStyle, materializeJs);
//
//     let containerModal = document.createElement('div');
//     containerModal.className = "modal";
//     containerModal.setAttribute('style', 'width: 75% !important')
//     containerModal.id = "reminderModal";
//     containerModal.tabIndex = 0;
//
//     let imgAlarm = document.createElement('img');
//     imgAlarm.src = "chrome-extension://ocfjoiapekdfcfajoopoeejhkfkdfepb/img/wecker.png";
//
//     let goalSpan = document.createElement('span');
//     goalSpan.id = 'goalSpan';
//     goalSpan.style.setProperty("font-size","50px")
//     goalSpan.innerText = goalInput;
//
//     let row1 = document.createElement('div');
//     row1.className = "row";
//
//     row1.append(imgAlarm, goalSpan);
//
//     let containerContent = document.createElement('div');
//     containerContent.className = "modal-content";
//     let containerHeader = document.createElement('div');
//     containerContent.append(containerHeader, row1);
//     containerModal.append(containerContent);
//     shadowRoot.appendChild(containerModal);
//     document.body.appendChild(shadowWrapper);
//
//
//     var ModalInstance = M.Modal.init(shadowRoot.getElementById('reminderModal'));
//     ModalInstance.open();
//
//     window.scrollTo(0, 0);
//
//
// }
//
// function openInitialModal(domain) {
//     const shadowWrapper = document.createElement('div');
//     shadowWrapper.id = 'shadowWrapper';
//     shadowWrapper.setAttribute('style', `
//     top: 0;
//     left: 0;
//     width: 0%;
//     height: 0%;
//     `);
//     const shadowRoot = shadowWrapper.attachShadow({mode: 'open'});
//     const materializeStyle = document.createElement('link');
//     materializeStyle.type = "text/css";
//     materializeStyle.media = "screen,projection";
//     materializeStyle.setAttribute('rel', 'stylesheet');
//     materializeStyle.setAttribute('href', 'chrome-extension://ocfjoiapekdfcfajoopoeejhkfkdfepb/materialize/materialize.min.css');
//
//     const materializeJs = document.createElement('script');
//     materializeJs.type = "text/javascript";
//     materializeJs.src = "chrome-extension://ocfjoiapekdfcfajoopoeejhkfkdfepb/materialize/materialize.js";
//     shadowRoot.append(materializeStyle, materializeJs);
//
//     let row1 = document.createElement('div');
//     row1.className = "row";
//     let row2 = document.createElement('div');
//     row2.className = "row";
//     let row3 = document.createElement('div')
//     row3.className = "row";
//     let row4 = document.createElement('div');
//     row4.className = "row";
//
//     let containerModal = document.createElement('div');
//     containerModal.className = "modal";
//     containerModal.setAttribute('style', 'width: 75% !important')
//     containerModal.id = "modal1";
//     containerModal.tabIndex = 0;
//     let containerContent = document.createElement('div');
//     containerContent.className = "modal-content";
//     let containerHeader = document.createElement('img');
//     // TODO passendes Icon suchen
//     // containerHeader.src = "chrome-extension://ocfjoiapekdfcfajoopoeejhkfkdfepb/img/palm-of-hand.png";
//     // Input Field
//     let inputDiv = document.createElement('div');
//     inputDiv.className = "input-field";
//     let selectDiv = document.createElement('div');
//     selectDiv.className = "input-field";
//     selectDiv.id = "selectDiv";
//     let goalInput = document.createElement('input');
//     goalInput.id = "goalInput";
//     goalInput.className = "col s9 autocomplete"
//     goalInput.placeholder = "Was ist Ihr Ziel beim Besuch von " + domain;
//     let label = document.createElement('label');
//     label.innerText = "Ziel";
//     let submitButton = document.createElement('button');
//     submitButton.className = "waves-effect waves-light btn";
//     submitButton.innerText = "Ziel setzen"
//
//
//
//     let timeSelectorDiv = document.createElement('div');
//     timeSelectorDiv.className = "input-field col";
//     timeSelectorDiv.id = "timeSelect";
//     timeSelectorDiv.setAttribute("style", "width: 200px height: 50px")
//     let timeSelector = document.createElement('select');
//     timeSelector.className = "browser-default";
//
//     let options = ['1', '2', '3', '4', '5', '10', '15', '30', ,'45', '60'];
//     options.forEach(option => {
//         let timeOption = document.createElement('option');
//         timeOption.value = option;
//         if (option != '1') {
//             timeOption.innerText = option + " Minuten";
//         } else {
//             timeOption.innerText = option + "Minute";
//         }
//         timeSelector.appendChild(timeOption);
//     })
//     timeSelectorDiv.append(timeSelector);
//     row1.append(label);
//     row2.append(goalInput, timeSelectorDiv);
//     row3.append(submitButton);
//     inputDiv.append(row1, row2, row3);
//     selectDiv.append(row4);
//
//
//     containerContent.append(containerHeader, inputDiv, selectDiv);
//     containerModal.append(containerContent);
//     shadowRoot.appendChild(containerModal);
//     document.body.appendChild(shadowWrapper);
//
//
//     var ModalInstance = M.Modal.init(shadowRoot.getElementById('modal1'));
//     console.log(ModalInstance);
//     ModalInstance.open();
//
//     var autocompleteInstance = M.Autocomplete.init(shadowRoot.querySelectorAll('.autocomplete'));
//
//     var newAutocompleteData: {[key: string]: string} = {};
//     chrome.storage.local.get(['previousGoals'], (result) => {
//         // window.console.log(instances);
//         previousGoals = result.previousGoals;
//         previousGoals.forEach(entry => {
//             newAutocompleteData[entry] = null;
//         })
//         autocompleteInstance[0].updateData(newAutocompleteData);
//     })
//     submitButton.addEventListener('click', function () {
//         getGoal(goalInput.value, timeSelector.value, ModalInstance, domain);
//     }, false);
//     goalInput.addEventListener('keyup', function(event) {
//         if(event.code === 'Enter'){
//             getGoal(goalInput.value, timeSelector.value, ModalInstance, domain);
//         }
//     })
//
//     // Opening Modal scrolls Page to the bottom, following line prevents that from happening
//     window.scrollTo(0, 0);
//
// }
//
// function getGoal(goalInput: string, timeFrame: any, instance: any, domain: string) {
//
//     chrome.storage.local.set({latestGoal: goalInput});
//     chrome.storage.local.get(['previousGoals'], (result) => {
//         const newPreGoals = result.previousGoals;
//         newPreGoals.unshift(goalInput);
//         chrome.storage.local.set({previousGoals: newPreGoals});
//     });
//     reminderRunning = Date.now() + timeFrame * 60000;
//     setTimeout(function () {
//         if (new URL(location.href).hostname === domain) {
//             const shadowWrapper = document.getElementById('goalReminder');
//             if(shadowWrapper === null) {
//                 openGoalReminder(goalInput);
//             } else {
//                 shadowWrapper.shadowRoot.getElementById('goalSpan').innerText = goalInput;
//                 var modalinstance = M.Modal.getInstance(shadowWrapper.shadowRoot.getElementById('reminderModal'))
//                 modalinstance.open();
//             }
//         }
//
//         // TODO tF* 60000
//     }, timeFrame * 1000);
//     instance.close();
// }

/******/ })()
;
