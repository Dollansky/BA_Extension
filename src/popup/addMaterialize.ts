import {browserUrl} from "../background/exportedFunctions";



const materializeStyle = document.createElement('link');
materializeStyle.type = "text/css";
materializeStyle.media = "screen,projection";
materializeStyle.setAttribute('rel', 'stylesheet');
materializeStyle.setAttribute('href', browserUrl + 'materialize/materialize.min.css');

const materializeJs = document.createElement('script');
materializeJs.type = "text/javascript";
materializeJs.src = browserUrl + 'materialize/materialize.js';

document.body.append(materializeStyle,materializeJs);
