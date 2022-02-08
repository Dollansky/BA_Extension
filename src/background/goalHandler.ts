import {serverUrl} from "./exportedFunctions";
import {Goal} from "../models/goal";

export function sendGoalAndSaveId(setGoal: string, domain: string, setGoalTime: number,reason: string) {

    chrome.storage.local.get(['participantId'],(result)=> {
        let goal: Goal = new Goal(result.participantId,setGoal, reason, domain, setGoalTime)
        fetch(serverUrl + "goal/create", {
            method: 'post',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(goal)
        }).then(response => response.text())
            .then(data => {

                addGoalId(data, domain);
            })
            .catch(function () {

            });
    })

}

function addGoalId(goalId: string, domain: string) {
    chrome.storage.local.get(['activeWebsites'], (result) => {
        let updatedActiveWebsites: Array<any> = [];
        result.activeWebsites.forEach((obj: any) => {
            if (obj.hostname == domain) {
                let activeWebsite = {
                    hostname: obj.hostname,
                    reminderRunning: obj.reminderRunning,
                    goal: obj.goal,
                    reason: obj.reason,
                    goalId: goalId
                }
                updatedActiveWebsites.unshift(activeWebsite)
                chrome.storage.local.set({atLeastOne: activeWebsite});

            } else {
                updatedActiveWebsites.unshift(obj)
            }
        })
        chrome.storage.local.set({activeWebsites: updatedActiveWebsites});
    });
}
