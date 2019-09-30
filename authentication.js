const auth = firebase.auth();

auth.signInWithEmailAndPassword(email, pass);

auth.createUserWithEmailAndPassword(email, pass);

// After logging in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
  } else {
    // No user is signed in.
  }
});
