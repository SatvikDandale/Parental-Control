

/*
    #####################
    BLOCK WEBSITES
    #####################
*/

var restrictedList = []   // Blocklist
var blockListFlag = false;  // It will be true when the block list is updated.
var timeExceededWebsites = []   // List of websites where time limit has been exceeded.
function setBlockListFlag(input){
    blockListFlag = input;
}

// Block all the websites if not logged in.
function blockRequest(details) {
    if (details.url.includes("googleapis"))
        return {cancel: false}
    return {cancel: true};
}
// Block specific websites if the websites are restricted.
function blockSpecific(details){
    for(website in categories["Restricted"]){
        if (!restrictedList.includes(website))
            restrictedList.push(website)
    }

    for(var i=0; i <= restrictedList.length; i++){
        if (details.url.includes(restrictedList[i]))
            return {cancel: true};  // Only block specific websites
        }
    for (var i=0; i <= timeExceededWebsites.length; i++){
        if (details.url.includes(timeExceededWebsites[i]))
            return {cancel: true};
    }
    return {cancel: false};
}
// Filter for above types of blocking.
function updateFilters(status) {
    if (status === false){
        if(chrome.webRequest.onBeforeRequest.hasListener(blockRequest))
            chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
        chrome.webRequest.onBeforeRequest.addListener(blockRequest, {urls: ["*://*/*"]}, ['blocking']);
    }
    else {
        if(chrome.webRequest.onBeforeRequest.hasListener(blockRequest))
            chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
        chrome.webRequest.onBeforeRequest.addListener(blockSpecific, {urls: ["*://*/*"]}, ["blocking"]);
    }
}
updateFilters(false);   // By default, block all websites. (NOT LOGGED IN).

//////////////////////////////////////////////////////////

/*
    This script is for the calculation in local domain
*/

var tabs_data = {}
// Use ID of each tab as the key
// The element contain the running time of each id
var interval = 1000 // The interval
categories = {}
allWebsitesTimeLimt = {}    // Compiled data of all websites and their permitted time limit

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
	return arr[2].replace(/\./g, '_').replace(/_com|_org/g, "").replace("www_", "");
}


// Update the tabs data after each inteval time
function update_info(){
    if (loggedIn && user !== null && categories != null){
        chrome.tabs.query({}, function(tabs){
            var current_tabs = [];
            // This list is used to check if multiple tabs of same domain are open
            for (var i = 0; i < tabs.length; i++){
                // Get the domain name of the URL on this tab
                domain = getDomain(tabs[i].url);
                if (tabs_data[domain] === undefined ){
                    tabs_data[domain] = 0; // The domain name of this tab not found in the list.
                    // That means the tab just opened in the current session.
                }
                else if (!(current_tabs.includes(domain)) && !restrictedList.includes(domain)){   // Don't update time for blocked tabs
                    // Check the time limit of this domain name
                    for(var website in allWebsitesTimeLimt){
                        if (website.includes(domain)){
                            // Check the time limit
                            var timeLimit = allWebsitesTimeLimt[domain];
                            if (tabs_data[domain] >= timeLimit){
                                // The time limit has been exceeded
                                // Add the page to the timeLimitReach list
                                console.log(timeExceededWebsites);
                                var breakFlag = false;
                                for(var j = 0; j < timeExceededWebsites.length; j++){
                                    if (timeExceededWebsites[j].includes(domain)){
                                        breakFlag = true;
                                        break;  // The timeLimitReached list already has this domain. Do not add this domain to the list.
                                    }
                                }
                                if (breakFlag === true){
                                    break   // Next Tab
                                }
                                else{
                                    // Add this domain to the list timeLimitReached
                                    timeExceededWebsites.push(domain);
                                }
                                // Refresh the tab
                                var refreshCode = "window.location.replace(\"blocked.html\")"
                                chrome.tabs.executeScript(tabs[i].id, {code: refreshCode});
                                console.log("Time limit exceeded for " + domain);
                            }
                        }
                    }
                    var isLimitExceeded = false;
                    for(var i=0; i < timeExceededWebsites.length; i++){
                        try{
                            if (timeExceededWebsites[i].includes(domain)){   // Then don't add the time usage
                            isLimitExceeded = true;
                            break;
                            }
                        }
                        catch(e){
                            console.log(e);
                        }
                        
                    }
                    if (!isLimitExceeded){
                        tabs_data[domain] += interval/1000; // Add the interval time in sec not msec
                        console.log("Time incremented for website: " + domain);
                    }
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

function updatingCategories(){
	retrieveCategories().then(function(webCategories){
		categories = webCategories;
		/*
			NOW iterate in this categories dictionary
			When a website is found, add that to the allWebsitesTimeLimit dictionary
		*/
		for(var category in categories){
			// For each category: there are websites
			category = categories[category];
			for(var eachWebsite in category){
				allWebsitesTimeLimt[eachWebsite] = category[eachWebsite];
			}
		}
	});
}

setInterval(updatingCategories, 5000);

chrome.extension.onConnect.addListener(function(port){
	//console.log("Connected with pop");
	port.onMessage.addListener(function(msg){
		if (msg === "Connected")
            port.postMessage(tabs_data);
        if (msg === "Logged In"){
            loggedIn = true;
            // updateFilters(true);
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
            retrieveCategories().then(function(webCategories){
                categories = webCategories;
                /*
                    NOW iterate in this categories dictionary
                    When a website is found, add that to the allWebsitesTimeLimit dictionary
                */
                for(var category in categories){
                    // For each category: there are websites
                    category = categories[category];
                    for(var eachWebsite in category){
                        allWebsitesTimeLimt[eachWebsite] = category[eachWebsite];
                    }
                }
                updateFilters(true);
            });
        }
	});
});


