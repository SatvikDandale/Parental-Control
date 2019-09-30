/*
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
// Use ID of each tab as the key
// The element contain the running time of each id
var interval = 1000 // The interval

function set_time(){
    var current = new Date();
    var hour = current.getHours();
    var min = current.getMinutes();
    var sec = current.getSeconds();
    return [hour, min, sec];
}

// Get the domain name from url
function getDomain(url){
	var arr = url.split("/");
	// arr[0] is https:
	// arr[2] is domain name
    // Firebase does not support "." in the key of dictionary. Replacing it with "_"
	return arr[2].replace(/\./g, '_');
}


// Update the tabs data after each inteval time
function update_info(){
    chrome.tabs.query({}, function(tabs){
		var current_tabs = [];
		// This list is used to check if multiple tabs of same domain are open
        for (var i=0; i < tabs.length; i++){
			domain = getDomain(tabs[i].url);
            if (tabs_data[domain] === undefined){
                tabs_data[domain] = 0; // The domain name of this tab not found in the list.
                // That means the tab just opened in the current session.
            }
            else if (!(current_tabs.includes(domain))){
                tabs_data[domain] += interval; // Add the interval time
            }
			current_tabs.push(domain);
        }
    });

}

function trigger(){
    updateInfo(tabs_data, 'testing_tabs');
}

// After every fixed interval, update the data of the open tabs
setInterval(update_info, interval);

chrome.extension.onConnect.addListener(function(port){
	//console.log("Connected with pop");
	port.onMessage.addListener(function(msg){
		if (msg === "Connected")
			port.postMessage(tabs_data);
        else if (msg === "Sync")
            updateInfo(tabs_data, 'testing_tabs');
        else if (msg === "Update")
            port.postMessage(tabs_data);
	});
});
