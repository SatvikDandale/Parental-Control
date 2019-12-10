console.log("Loginpage.js")

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
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignUp');

// btnSignUp.addEventListener('click', e => {
//     const email = txtEmail.value;
//     const pass = txtPassword.value;
//     const promise = firebase.auth().createUserWithEmailAndPassword(email, pass);
//     promise.catch(e => console.log(e.message));
// });

btnSignUp.addEventListener('click', e => {
    window.location.replace("signUp.html");
});

txtEmail.addEventListener('keyup', function(key){
    // For enter key, ascii value is 13
    if (key.keyCode === 13){
        key.preventDefault();
        btnLogin.click();
    }
});

txtPassword.addEventListener('keyup', function(key){
    // For enter key, ascii value is 13
    if (key.keyCode === 13){
        key.preventDefault();
        btnLogin.click();
    }
});

btnLogin.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const promise = firebase.auth().signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
});
