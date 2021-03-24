

chrome.runtime.onMessage.addListener((request, sender, resp) => {
    // Maybe here [Intervention1] Liste [Intervention2] ....
    // TODO always send request.toDo and domain or change stuff
    if (request.toDo === 'Ask for Mode') {
        window.console.log("Time has comccdsdsssfsdsse");
    }
    // if(request.domain === 'www.youtube.com') {
    //     console.log(document.getElementById('category'));
    // }
    //
    //
    // var banner = document.createElement("div");
    // banner.className = "b";
    // banner.innerHTML = "Banner Contensst";
    // document.body.insertAdjacentHTML("afterbegin", "<div class='b'>Banner Content</div>");
})
