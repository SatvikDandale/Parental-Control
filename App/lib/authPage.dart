import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:parental_monitor/homePage.dart';

class AuthPage extends StatefulWidget {
  AuthPageState createState() => AuthPageState();
}

enum FormTypes { logIn, signUp }

class AuthPageState extends State<AuthPage> {
  final formKey = new GlobalKey<FormState>();
  String _email = "";
  String _password = "";
  FormTypes _formType = FormTypes.logIn;
  DatabaseReference db = FirebaseDatabase.instance.reference();

  void shiftToSignUp() {
    // For toggling between pages
    formKey.currentState.reset();
    setState(() {
      _formType = FormTypes.signUp;
    });
  }

  void shiftToLogIn() {
    // For toggling between pages
    formKey.currentState.reset();
    setState(() {
      _formType = FormTypes.logIn;
    });
  }

  bool validateForm() {
    // Local Form Validation.
    var form = formKey.currentState;

    if (!(form.validate())) {
      print("Validation Error");
      print("Email: $_email");
      return false;
    } else {
      form.save();
      print("Validation done");
      print("Email: $_email");
    }
    return true;
  }

  void validateCredentials() async {
    // Firebase credentials validation
    FirebaseUser user;
    try {
      if (_formType == FormTypes.logIn) {
        // Log in with given credentials
        print("Sign In Page");
        user = (await FirebaseAuth.instance
                .signInWithEmailAndPassword(email: _email, password: _password))
            .user;
      } else {
        // Create a user with given credentials
        user = (await FirebaseAuth.instance.createUserWithEmailAndPassword(
                email: _email, password: _password))
            .user;
      }
    } catch (e) {
      print("In catch");
      print(e.toString());
    } finally {
      if (user != null) {
        print("Successful");
        // Go to homePage by passing the current user details.

        String userName = user.email.replaceAll(RegExp(r'@\w+.\w+'), "");
        List<String> childrenList;

        db = db.child("Internet Usage").child(userName).child("Children");
        db.once().then((DataSnapshot childSnapShot) {
          var childrenDict = childSnapShot.value;
          try{
            for (String childNumber in childrenDict.keys) {
              if (childrenList == null) {
                childrenList = [childrenDict[childNumber]];
              } else {
                childrenList.add(childrenDict[childNumber]);
              }
            }
            childrenList.sort((a, b) {
              return a.toLowerCase().compareTo(b.toLowerCase());
            });
          }
          catch(e){
            childrenList = [];
          }
          print(userName);
          print(childrenList);
          Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => new HomePage(user, childrenList)));
        });
      } else {
        print("Error");
        if (_formType == FormTypes.logIn)
          logInErrorBox("EmailId or Password doesn't match with database");
        else
          logInErrorBox("These credentials cannot work.");
      }
    }
  }

  void logInErrorBox(String msg) {
    // Show the error box with the given msg
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text(msg),
            content: Text('Enter valid EmailId or Password'),
          );
        });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Parental Monitor System'),
        backgroundColor: Colors.red,
      ),
      body: Center(
        child: Container(
          padding: EdgeInsets.all(20),
          child: Form(
            key: formKey,
            child: ListView(
              children: singleImage() + inputForms() + buttons(),
            ),
          ),
        ),
      ),
    );
  }

  List<Widget> singleImage(){
    return [
      Image.asset("assets/images/welcome.jpg")
    ];
  }
  
  List<Widget> inputForms() {
    return [
      new TextFormField(
        decoration: InputDecoration(labelText: 'Email'),
        validator: (value) => value.isEmpty ? "Email can't be Empty" : null,
        onSaved: (value) => _email = value,
      ),
      new TextFormField(
          decoration: InputDecoration(labelText: 'Password'),
          validator: (value) =>
              value.isEmpty ? "Password can't be Empty" : null,
          obscureText: true,
          onSaved: (value) => _password = value),
    ];
  }

  List<Widget> buttons() {
    if (_formType == FormTypes.logIn) {
      return [
        new RaisedButton(
          shape: new RoundedRectangleBorder(
              borderRadius: new BorderRadius.circular(30.0)),
          color: Colors.red,
          child: Text('Log In',
              style: TextStyle(fontSize: 20, color: Colors.white)),
          onPressed: () {
            final FirebaseAuth firebaseAuth = FirebaseAuth.instance;

            Future<FirebaseUser> getFirebaseUser() async {
                FirebaseUser user = await firebaseAuth.currentUser();
                print(user != null ? user : null);
                return user != null ? user : null;
            }
            getFirebaseUser().then((value){
              print(value);
            });
            print("Going to validateCredentials");
            if (validateForm()){
              validateCredentials();
            }
          },
        ),
        new RaisedButton(
          shape: new RoundedRectangleBorder(
              borderRadius: new BorderRadius.circular(30.0)),
          color: Colors.red,
          child: Text('Create new User',
              style: TextStyle(fontSize: 20, color: Colors.white)),
          onPressed: () {
            shiftToSignUp();
          },
        ),
      ];
    }
    return [
      new RaisedButton(
        shape: new RoundedRectangleBorder(
            borderRadius: new BorderRadius.circular(30.0)),
        color: Colors.red,
        child: Text('Create New User', style: TextStyle(fontSize: 20)),
        onPressed: () {
          if (FirebaseAuth.instance.currentUser() != null) {
            // signed in
            print(FirebaseAuth.instance.currentUser());
            FirebaseAuth.instance.signOut();
          } else if (validateForm()){
            validateCredentials();
          }
        },
      ),
      new RaisedButton(
        shape: new RoundedRectangleBorder(
            borderRadius: new BorderRadius.circular(30.0)),
        color: Colors.red,
        child: Text('Already a User? Log In', style: TextStyle(fontSize: 20)),
        onPressed: () {
          shiftToLogIn();
        },
      ),
    ];
  }
}
