

chrome.runtime.onMessage.addListener((request, sender, resp) => {
    // Maybe here [Intervention1] Liste [Intervention2] ....
    // TODO always send request.toDo and domain or change stuff
    window.console.log("contentHandler called");
    if (request.toDo === 'Ask for Mode') {
        window.console.log("Time has comccdsdsssfsdsse");
    }
    if(request.domain){
        window.console.log("document");
        window.console.log(document);
    }
})
