// SCRIPT FOR FIREBASE
var flag_for_sync = false;
var flag_for_update = false;
var parents;
blockList = []


var config = {
    apiKey: "AIzaSyC5VDpdFZVH3OuzN_sbnMAiMIq9gac39WQ",
    authDomain: "chrome-extension-83331.firebaseapp.com",
    databaseURL: "https://chrome-extension-83331.firebaseio.com",
    projectId: "chrome-extension-83331",
    storageBucket: "chrome-extension-83331.appspot.com",
    messagingSenderId: "911483901445",
    appId: "1:911483901445:web:8c4577a3f06d59c7006e6c"
};
const app = firebase.initializeApp(config);


// chrome.notifications.create(
//     'name-for-notification',{   
//     type: 'basic', 
//     iconUrl: 'notification.jpg', 
//     title: "This is a notification", 
//     message: "hello there!" 
//     },
//     function() {}
// );

// Get today's date:
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;
var user = null

var db;

// CREATE REFERENCE
function setUser(User){
    user = User;
    db = firebase.database().ref().child('Internet Usage').child(user).child(yyyy).child(mm).child(dd);
    syncFirebase();
}

function syncFirebase(){
    // This will create a new Node
    db.once('value', function(snap){
        temp_dict = (snap.val());
        flag_for_sync = true;
    });
}

///////////////////////////////
// RETRIEVE THE CATEGORIES
///////////////////////////////
async function retrieveCategories(){
    var categories= {}
    var tempDb = await firebase.database().ref().child("Internet Usage").child(user).child("Categories");
    await tempDb.once('value', function(snap){
        categories = snap.val();
    });
    for (website in categories["Restricted"]){
        if (!blockList.includes(website))
        blockList.push(website);
    }
    console.log(blockList);
    setBlockListFlag(true);
    return categories;
}

function getBlockList(){
    return blockList;
}

// Add to the child
function UpdateInfo(obj){
    if (flag_for_sync){
        // Compare the snap with the updated dictionary
        //console.log("Temp Dict is", temp_dict);
        if (flag_for_update === false){ // We only have to update temp_dict with obj once
            for(var website in obj){
                if (temp_dict !== null && temp_dict[website] !== undefined && !blockList.includes[temp_dict[website]]){  // If the website is already in temp_dict, just add previous time of temp_dict to current obj dict.
                    obj[website] += temp_dict[website]
                }
                flag_for_update = true; // We only have to update temp_dict with obj once
            }
        }
        for(var website in obj){
            if (website === "")
                delete obj[website];
        }
        console.log(obj);
        db.update(obj);
    }
}


