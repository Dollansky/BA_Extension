// Webpack imports whole file this is a workaround


export function checkIfModeActive(dateWhenModeEnds) {
    window.console.log("check If Mode Active");
    window.console.log("dateWhenModeEnds:", dateWhenModeEnds);
    if (dateWhenModeEnds < Date.now() || dateWhenModeEnds == undefined ) {
        chrome.storage.local.set({mode: null});
        openOrCloseModeSelectInEveryTab("Open Mode Select");
        return false;
    } else {
        return true;
    }
}

export function openOrCloseModeSelectInEveryTab(open) {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            chrome.tabs.sendMessage(tab.id, {
                action: open
            })
        })
    });
}

export function checkIfBaselineIsFinished(baselineFinished: { [p: string]: any }) {
    var today = new Date();
    var baselineDate = new Date(baselineFinished[0] - 7, baselineFinished[1], baselineFinished[2]);
    return (today >= baselineDate);
}
