chrome.runtime.onMessage.addListener((request, sender, resp) => {
    console.log("called");
    //
    const shadowWrapper = document.createElement('div');
    shadowWrapper.setAttribute('style', `
    top: 0;
    left: 0;
    width: 0%;
    height: 0%;
    `);
    const shadowRoot = shadowWrapper.attachShadow({ mode: 'open' });
    const bootstrapStyle = document.createElement('link');
    bootstrapStyle.setAttribute('rel', 'stylesheet');
    bootstrapStyle.setAttribute('src', 'bootstrap.min.css');
    shadowRoot.append(bootstrapStyle);
    document.body.appendChild(shadowWrapper);

    const modal = document.createElement('div');
    modal.id = "myModal";
    shadowRoot.appendChild(modal);
    // Whatever you need to do to create your modal...
    let insertedModal = shadowRoot.getElementById("myModal");
    $("#myModal").modal();


})







// chrome.runtime.onMessage.addListener((request, sender, resp) => {
//     console.log("called");
//
//
//     const shadowWrapper = document.createElement('div');
//     shadowWrapper.setAttribute('style', `
//     top: 0;
//     left: 0;
//     width: 0%;
//     height: 0%;
//     `);
//     const shadowRoot = shadowWrapper.attachShadow({ mode: 'open' });
//     const materializeStyle = document.createElement('link');
//     materializeStyle.type = "text/css";
//     materializeStyle.media = "screen,projection";
//     materializeStyle.setAttribute('rel', 'stylesheet');
//     materializeStyle.setAttribute('integrity', "sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T");
//     materializeStyle.setAttribute('crossorigin',"anonymous");
//     // materializeStyle.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css');
//     materializeStyle.setAttribute('href','https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css')
//     const scriptSRCJs = document.createElement('script');
//     scriptSRCJs.type = "text/javascript";
//     scriptSRCJs.src = "https://code.jquery.com/jquery-3.2.1.slim.min.js";
//     scriptSRCJs.setAttribute('integrity', "sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN");
//     scriptSRCJs.setAttribute('crossorigin',"anonymous");
//     const materializeJs = document.createElement('script');
//     materializeJs.type = "text/javascript";
//     materializeJs.src = "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js";
//     materializeJs.setAttribute('integrity', "sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q");
//     materializeJs.setAttribute('crossorigin',"anonymous");
//     const materializeJs2 = document.createElement('script');
//     materializeJs2.type = "text/javascript";
//     materializeJs2.src = "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js";
//     materializeJs2.setAttribute('integrity', "sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl");
//     materializeJs2.setAttribute('crossorigin',"anonymous");
//
//
//
//     // materializeJs.src = "chrome-extension://ocfjoiapekdfcfajoopoeejhkfkdfepb/materialize/materialize.min.js";
//     shadowRoot.append(materializeStyle, scriptSRCJs,materializeJs,materializeJs2);
//
//
//     let containerModal = document.createElement('div');
//     containerModal.className = "modal";
//     containerModal.id = "modal1";
//     containerModal.tabIndex = 0;
//     let containerContent = document.createElement('div');
//     containerContent.className = "modal-content";
//     let containerHeader = document.createElement('img');
//     // TODO passendes Icon suchen
//     // containerHeader.src = "chrome-extension://ocfjoiapekdfcfajoopoeejhkfkdfepb/img/palm-of-hand.png";
//     // Input Field
//     let inputDiv = document.createElement('div');
//     let goalInput = document.createElement('input');
//     goalInput.placeholder = "Was ist Ihr Ziel beim Besuch von " + request.domain;
//     let label = document.createElement('label');
//     label.innerText = "Ziel";
//     let submitButton = document.createElement('button');
//     submitButton.className = "waves-effect waves-light btn";
//     submitButton.innerText = "Ziel setzen"
//
//     // let formDiv = document.createElement('form');
//     // let labelTime = document.createElement('label');
//     // labelTime.innerText = "SHeeesh";
//     // labelTime.setAttribute('for', "times");
//     // let selectTime = document.createElement('select');
//     // selectTime.setAttribute('name',"times");
//     // let options = ['1','2','3','4','5','10','15','30'];
//     // options.forEach(option =>  {
//     //     let timeOption = document.createElement('option');
//     //     timeOption.value = option;
//     //     if (option != '1') {
//     //         timeOption.innerText = option + " Minuten";
//     //     } else {
//     //         timeOption.innerText = option + "Minute";
//     //     }
//     //     selectTime.appendChild(timeOption);
//     // });
//     // formDiv.append(labelTime,selectTime);
//
//     let timeSelectorDiv = document.createElement('div');
//     timeSelectorDiv.className = "input-field";
//     timeSelectorDiv.id = "timeSelect";
//     let timeSelector = document.createElement('select');
//     let options = ['1','2','3','4','5','10','15','30'];
//     let defaultOption = document.createElement('option');
//     defaultOption.value = "";
//     defaultOption.setAttribute('disabled', 'selected');
//     defaultOption.innerText = "Zeit";
//     timeSelector.appendChild(defaultOption);
//     options.forEach(option =>  {
//         let timeOption = document.createElement('option');
//         timeOption.value = option;
//         if (option != '1') {
//             timeOption.innerText = option + " Minuten";
//         } else {
//             timeOption.innerText = option + "Minute";
//         }
//         timeSelector.appendChild(timeOption);
//     })
//     let timeSelectorLabel = document.createElement('label');
//     timeSelectorLabel.innerText = "Someting";
//     timeSelectorDiv.append(timeSelector , timeSelectorLabel);
//
//     inputDiv.append(label,goalInput , submitButton, timeSelectorDiv);
//
//
//     let containerFooter = document.createElement('div');
//     containerFooter.className = "modal-footer";
//     let containerFooterText = document.createElement('a');
//     containerFooterText.innerText = "footer";
//     containerFooter.append(containerFooterText);
//     containerContent.append(containerHeader , inputDiv);
//     containerModal.append(containerContent, containerFooter);
//     shadowRoot.appendChild(containerModal);
//     shadowRoot.appendChild(scriptSRCJs);
//     document.body.appendChild(shadowWrapper);
//
//
//
//
//     var ModalInstance = M.Modal.init(shadowRoot.getElementById('modal1'));
//     submitButton.addEventListener('click',  function() {
//         getGoal(goalInput.value, ModalInstance);
//     }, false);
//
//     ModalInstance.open();
//
//
//     var init = M.AutoInit(shadowRoot.getElementById('timeSelect'));
//     // Opening Modal scrolls Page to the bottom, following line prevents that from happening
//     window.scrollTo(0,0);
//
// });
//
//
// function getGoal(goalInput: String, instance: any) {
//     window.console.log(goalInput)
//     instance.close();
// }
