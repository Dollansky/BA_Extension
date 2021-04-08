// @ts-ignore
import {modal} from "./html/welcomeBack.ts";


chrome.runtime.onMessage.addListener((request, sender, resp) => {
    // Maybe here [Intervention1] Liste [Intervention2] ....

    // window.console.log("contentHandler caölleöd");
    //


})


const openModal= () => {

    var doc = document.createElement("dialog");
    doc.setAttribute("id","bonkk")
    // TODO data= html string. How to insert
    // window.console.log(chrome.extension.getURL('./html/welcomeback.html'));
    // fetch(chrome.extension.getURL('./html/welcomeback.html')).then(response => response.text()).then(data => {
    //     document.getElementById('bonk').innerHTML = data;
    //     console.log(data);
    // });



}
