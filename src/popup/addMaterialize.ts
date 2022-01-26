const extensionUrl = 'chrome-extension://' + chrome.runtime.id

const materializeStyle = document.createElement('link');
materializeStyle.type = "text/css";
materializeStyle.media = "screen,projection";
materializeStyle.setAttribute('rel', 'stylesheet');
materializeStyle.setAttribute('href', extensionUrl + '/materialize/materialize.min.css');

const materializeJs = document.createElement('script');
materializeJs.type = "text/javascript";
materializeJs.src = extensionUrl + '/materialize/materialize.js';

document.body.append(materializeStyle,materializeJs);
