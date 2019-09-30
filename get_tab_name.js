var name = ''	// The name of the tab will be saved in this variable.

chrome.tabs.onActivated.addListener(printTab);	
// This function is called, only when a tab swtich event is occured.

function printTab(){
	/*
		This function retrieves the name of the tab if in any case, user makes a tab swtich
	*/
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		chrome.tabs.getSelected(null,function(tab) { // null defaults to current window
	  		var title = tab.title;
	  		console.log(title);
		});
	});
}

// Whenever a tab is refreshed. content_script sends the name of the current tab.
chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(msg, sender, sendResponse){
	console.log(msg);
}
