/*
// GET THE TAB ID

// On refresh
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(tab.url !== undefined && changeInfo.status == "complete")
    // Trigger just once when the reload is complete
    console.log(tabId);
});

// On Tab Shift
chrome.tabs.onActivated.addListener(function(activeInfo){
  console.log(activeInfo.tabId);
});
*/

var tabs_data = {}
var interval = 1000 // The interval
// Use ID of each tab as the key
// The element contain the running time of each id

function set_time(){
    var current = new Date();
    var hour = current.getHours();
    var min = current.getMinutes();
    var sec = current.getSeconds();
    return [hour, min, sec];
}

// Update the tabs data after each inteval time

function update_info(){
    chrome.tabs.query({}, function(tabs){

        for (var i=0; i < tabs.length; i++){
            if (tabs_data[tabs[i].title] === undefined){
                tabs_data[tabs[i].title] = 0; // Just started
            }
            else{
                tabs_data[tabs[i].title] += interval; // Add the interval time
            }
        }

    });
}

// Print the time
function print_info(){
    for (id in tabs_data){
        var time = tabs_data[id] / 1000;
        var sec = time%60;
        var min = time/60;
        var hour = time/360;
        console.log(id + ": " + hour.toFixed(0) + " hours : " + min.toFixed(0) + " mins : " + sec + " secs");
    }
}

// After every 5 seconds, update the data of the open tabs
setInterval(update_info, interval);
chrome.browserAction.onClicked.addListener(function(){
    // Print on Pop up
    var views = chrome.extension.getViews({
        type: "popup"
    });
    for(var i = 0; i < views.length; i++){
        views[i].document.write("HELLO!");
    }
    console.log("Hello");
});
