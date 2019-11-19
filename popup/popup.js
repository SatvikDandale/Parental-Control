
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
var app = firebase.initializeApp(config);
firebase.auth().signOut();
var currentUser = firebase.auth().currentUser
console.log("Current user is: " + currentUser);

const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignUp');
const btnLogout = document.getElementById('btnLogout');

btnSignUp.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const promise = firebase.auth().createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
});

btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
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


firebase.auth().onAuthStateChanged(firebaseUser => {
    
    var currentUser = firebase.auth().currentUser
    if (firebaseUser){
        console.log(firebaseUser.email);
        txtEmail.style.visibility = 'hidden';
        txtPassword.style.visibility = 'hidden';
        btnLogin.style.visibility = 'hidden';
        btnSignUp.style.visibility = 'hidden';
        btnLogout.style.visibility = 'hidden';
    }
    else{
        console.log("Not logged in");
    }
})


var port = chrome.extension.connect({
    name: "Communicate"
});


function print_info(tabs_data){
    var initial = "<tr><th>Website</th><th>Time Spent</th></tr>";
    document.getElementById("table").style.width = "100%";
    document.getElementById("table").style.fontSize = "15px";
    document.getElementById("table").insertAdjacentHTML('afterbegin', initial);
    var content = ''
    for (id in tabs_data){
        var time = tabs_data[id] / 1000;
        console.log(time);
        var sec = time%60;
        var min = (time/60)%60;
        var hour = time/3600;
        //var content = "<strong>" + id + "</strong>: " + + hour.toFixed(0) + " hours : " + min.toFixed(0) + " mins : " + sec + " secs<br />";

        content += "<tr><td><strong>" + id + "</strong></td><td>" + hour.toFixed(0) + " hours : " + min.toFixed(0) + " mins : " + sec*1000/*(secs are in msec)*/ + " secs" + "</td></tr>";
    }
    document.getElementById("table").innerHTML  = content;
}

port.postMessage("Connected");
port.onMessage.addListener(function(tabs_data){
    console.log(currentUser)
    if (currentUser !== null)
        print_info(tabs_data);
});
