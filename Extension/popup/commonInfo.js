var port = chrome.extension.connect({
    name: "Communicate"
});
port.postMessage("Status");

port.onMessage.addListener(function(msg){
    if (msg === "YES")  // LOGGED IN
        window.location.replace("homePage.html");
    else
        window.location.replace("index.html");
});
