/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/* unused harmony exports TimeIntervall, TimeIntervallDto */
var TimeIntervall = /** @class */ (function () {
    function TimeIntervall(domain, blacklisted, workMode, startTime, endTime, baselineFinished, goal) {
        this.domain = domain;
        this.goal = goal;
        this.blacklisted = blacklisted;
        this.workMode = workMode;
        this.startTime = startTime;
        this.endTime = endTime;
    }
    return TimeIntervall;
}());

var TimeIntervallDto = /** @class */ (function () {
    function TimeIntervallDto(participantId, mode, domain, blacklisted, timeSpend, baselineFinished, started, ended, goalId, goal, reason) {
        this.participantId = participantId;
        this.mode = mode;
        this.domain = domain;
        this.blacklisted = blacklisted;
        this.timeSpend = timeSpend;
        this.baselineFinished = baselineFinished;
        this.started = started;
        this.ended = ended;
        this.goalId = goalId;
        this.goal = goal;
        this.reason = reason;
    }
    return TimeIntervallDto;
}());


/******/ })()
;