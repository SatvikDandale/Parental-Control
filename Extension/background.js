
/*
    #####################
    BLOCK WEBSITES IF NOT LOGGED IN
    #####################
*/
function blockRequest(details) {
    if (details.url.includes("googleapis"))
        return {cancel: false}
    return {cancel: true};
 }

function updateFilters(status) {
    if(chrome.webRequest.onBeforeRequest.hasListener(blockRequest))
        chrome.webRequest.onBeforeRequest.removeListener(blockRequest);

    if (status === false){
        chrome.webRequest.onBeforeRequest.addListener(blockRequest, {urls: ["*://*/*"]}, ['blocking']);
    }
}

updateFilters(false);
//////////////////////////////////////////////////////////

/*
    This script is for the calculation in local domain
*/


var tabs_data = {}
// Use ID of each tab as the key
// The element contain the running time of each id
var interval = 1000 // The interval

/*
    Flags for login Status
*/
var loggedIn = false;
var user = null;

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
    if (loggedIn && user !== null){
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
                    tabs_data[domain] += interval/1000; // Add the interval time in sec not msec
                }
                current_tabs.push(domain);
            }
        });
    }

}

function trigger(){
    // UPDATE FIREBASE DATA
    if (loggedIn){
        UpdateInfo(tabs_data);
    }
}

// After every fixed interval, update the data of the open tabs
setInterval(update_info, interval); // LOCAL
setInterval(trigger, interval); // FIREBASE

chrome.extension.onConnect.addListener(function(port){
	//console.log("Connected with pop");
	port.onMessage.addListener(function(msg){
		if (msg === "Connected")
            port.postMessage(tabs_data);
        if (msg === "Logged In"){
            loggedIn = true;
            updateFilters(true);
        }
        if (msg === "Logged Out"){
            loggedIn = false
            updateFilters(false);
        }
        if (msg === "Status"){
            if (loggedIn)
                port.postMessage("YES");
            else
                port.postMessage("NO");
        }
        if (msg.includes("User")){
            user = msg.replace("User is: ", "")
            user = user.replace(/@\w+.\w+/i,"");
            setUser(user);
        }
	});
});


