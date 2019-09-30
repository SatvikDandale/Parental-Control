// TODO(DEVELOPER): Change the values below using values from the initialization snippet: Firebase Console > Overview > Add Firebase to your web app.
// Initialize Firebase
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
//const appDb = app.database().ref();

// CREATE REFERENCE
const dbRefObj = firebase.database().ref().child('New_Test');
// This will create a new Node

// .on will determine the amount of synchronization.
dbRefObj.on('value', snap => console.log("The updated child is: " + JSON.stringify(snap.val())));
// snap is the snapshot of the required part of database
// Here snap includes the contents of New_Test


// Add to the child
function updateInfo(obj, database){
    const db = firebase.database().ref().child(database);
    db.update(obj);
}

/*

    1. After every predefined interval, update the firebase with the dictionary of tabs.
    2.

*/
