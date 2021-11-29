/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
__webpack_unused_export__ = void 0;
function sendData(timeIntervall) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/", true);
    xhr.send();
}
__webpack_unused_export__ = sendData;

})();

/******/ })()
;
