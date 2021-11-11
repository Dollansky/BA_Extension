chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.local.get(['blacklist', 'baselineFinished'], (result) => {

        if (result.blacklist == undefined) {
            window.console.log('blacklist was undefined');
            const blacklist: Array<string> = ["www.crunchyroll.com", "www.reddit.com", "www.instagram.com", "www.facebook.com", "www.youtube.com", "www.netflix.com", "9gag.com"];
            const previousGoals: Array<String> = ['Pause', 'Kurzes Video schauen'];
            chrome.storage.local.set({lastDomain: {domain: "Installation Time"}})
            chrome.storage.local.set({blacklist: blacklist});
            chrome.storage.local.set({mode: true});
            chrome.storage.local.set({previousGoals: previousGoals});
            chrome.browserAction.setIcon({path: 'img/work.png'});
        }
        if (result.baselineFinished === undefined) {
            window.console.log('baselineFinished was undefined');
            var today = new Date();
            chrome.storage.local.set({baselineFinished: [today.getDay() + 7, today.getMonth(), today.getFullYear()]})

        }
    })
})


chrome.runtime.onStartup.addListener(() => {
        chrome.storage.local.set({lastDomain: {domain: "Installation Time"}})
}
)
