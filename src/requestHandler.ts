import {TimeIntervall} from "./models/TimeIntervall";




export function sendData(timeIntervall: TimeIntervall){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/", true);
    xhr.send();
}

