import 'package:flutter/material.dart';

class SignUp extends StatefulWidget{
  SignUpState createState() => SignUpState();
}

class SignUpState extends State<SignUp>{
  @override
  Widget build(BuildContext context){
    return Scaffold(
      appBar: AppBar(
        title: Text('Sign Up'),
      ),
      body: Container(
        padding: EdgeInsets.all(20),
        child: Form(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              TextFormField(
                decoration: InputDecoration(labelText: 'Email'),
                validator: (value) => value.isEmpty ? "Email can't be Empty": null,
              ),
              new TextFormField(
                decoration: InputDecoration(labelText: 'Password'),
                validator: (value) => value.isEmpty ? "Password can't be Empty": null,
                obscureText: true,
              ),
              new Divider(),
              new RaisedButton(
                child: Text(
                  'Log In',
                  style: TextStyle(fontSize: 20)
                ),
                onPressed: (){
                },
              )
            ],
          ),
        ),
      ),
    );
  }
}