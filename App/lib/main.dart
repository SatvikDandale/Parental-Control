/*
  At the start of the app, there must be a log in page for firebase authentication.
*/

import 'package:flutter/material.dart';
import 'package:parental_monitor/homePage.dart';  // If successful login
import 'authPage.dart'; // Existing user. Default page always.


void main() => runApp(MyApp());


class MyApp extends StatelessWidget{
  @override
  Widget build(BuildContext context){
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Parental Monitor',
      initialRoute: '/AuthPage',
      // First Screen is AuthPage
      routes: {
        '/AuthPage' : (context) => AuthPage(),
        //'/SignUp' : () => 
        '/HomePage' : (context) => HomePage(),

      },
    );
  }
}