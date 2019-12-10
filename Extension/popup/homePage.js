console.log("homepage.js")

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

firebase.auth().onAuthStateChanged(firebaseUser => {
    var currentUser = firebase.auth().currentUser
    if (firebaseUser){  // If logged in
        // window.location.replace('homePage.html');
        port.postMessage("Logged In");
        console.log(firebaseUser.email);
    }
    else{
        console.log("Not logged in");
        port.postMessage("Logged Out");
        window.location.replace("index.html");
    }
});

var port = chrome.extension.connect({
    name: "Communicate"
});

btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
    port.postMessage("Logged Out")
});

function print_info(tabs_data){
    var initial = "<tr><th>Website</th><th>Time Spent</th></tr>";
    document.getElementById("table").style.width = "100%";
    document.getElementById("table").style.fontSize = "15px";
    document.getElementById("table").insertAdjacentHTML('afterbegin', initial);
    var content = ''
    for (id in tabs_data){
        var time = tabs_data[id];
        console.log(time);
        var hour = time/3600;
        time %= 3600;
        var min = time/60;
        time %= 60;
        var sec = time%60;

        content += "<tr><td><strong>" + id + "</strong></td><td>" 
                + hour.toString().replace(/\.\d+/g, "") 
                + " hours : " + min.toString().replace(/\.\d+/g, "") 
                + " mins : " + sec
                + " secs" + "</td></tr>";
    }
    document.getElementById("table").innerHTML  = content;
}

port.postMessage("Connected");
port.onMessage.addListener(function(tabs_data){
    print_info(tabs_data);
});
