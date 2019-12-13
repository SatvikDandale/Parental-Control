console.log("signUppage.js")

document.getElementById("form1").addEventListener('submit', function(event){
    event.preventDefault();
});


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
firebase.initializeApp(config);

var port = chrome.extension.connect({
    name: "Communicate"
});

firebase.auth().onAuthStateChanged(firebaseUser => {
    var currentUser = firebase.auth().currentUser
    if (firebaseUser){  // If logged in
        // window.location.replace('homePage.html');
        port.postMessage("Logged In");
        window.location.replace("homePage.html");
        port.postMessage("User is: " + firebaseUser.email);
    }
    else{
        console.log("Not logged in");
    }
});


const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const parentEmail = document.getElementById('parentEmail');
const btnSignUp = document.getElementById('btnSignUp');
const btnSignIn = document.getElementById('btnSignIn');

// btnSignUp.addEventListener('click', e => {
//     const email = txtEmail.value;
//     const pass = txtPassword.value;
//     const promise = firebase.auth().createUserWithEmailAndPassword(email, pass);
//     promise.catch(e => console.log(e.message));
// });

btnSignIn.addEventListener('click', e =>{
    window.location.replace("index.html")
})

function checkParents(parentName, currentChildEmail, currentChildPassword){
    parentName = parentName.replace(/@\w+\.\w+/g, "");  // Remove anything after and including @
    var childrenDB = firebase.database().ref().child('Internet Usage').child(parentName).child("Children");
    console.log("HEY");
    childrenDB.once('value', function(snap){
        // Once we get the list of children, check if any child matches with the one trying to signUp
        var childrenDict = snap.val();
        for (child in childrenDict){
            if (childrenDict[child] === currentChildEmail) {    // Then approve the signUp
                const promise = firebase.auth().createUserWithEmailAndPassword(currentChildEmail, currentChildPassword);
                promise.catch(e => console.log(e.message));
                // If no error is obtained, then the child profile is successfully created.
                /*
                    Here, get the Preset Categories dict from global database and associate it with the child.
                */
                var presetCategories = firebase.database().ref().child("Categories");
                presetCategories.once('value', function(snap){
                    var categoriesDict = snap.val();
                    console.log(categoriesDict);
                    childrenDB = firebase.database().ref()
                        .child("Internet Usage")
                        .child(currentChildEmail.replace(/@\w+\.\w+/g, "")).child('Categories');    // Remove anything after and including @
                    childrenDB.update(categoriesDict);
                });
                return;
            }
        }
        // If control reaches here means there is no child of the given email already associated with the parent
        console.log("No such child is associated with the given parent.");
    });
}

btnSignUp.addEventListener('click', e =>{
    const email = txtEmail.value;
    const password = txtPassword.value;
    const parentsEmailId = parentEmail.value;
    checkParents(parentsEmailId, email, password);
});

txtEmail.addEventListener('keyup', function(key){
    // For enter key, ascii value is 13
    if (key.keyCode2 === 13){
        key.preventDefault();
        // btn.click();
    }
});

txtPassword.addEventListener('keyup', function(key){
    // For enter key, ascii value is 13
    if (key.keyCode === 13){
        key.preventDefault();
        // btnLogin.click();
    }
});

parentEmail.addEventListener('keyup', function(key){
    // For enter key, ascii value is 13
    if (key.keyCode === 13){
        key.preventDefault();
        // btnLogin.click();
    }
});


