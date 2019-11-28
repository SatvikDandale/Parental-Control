import 'package:flutter/material.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'dart:async';
import 'package:intl/intl.dart';

class HomePage extends StatefulWidget{
  HomePageState createState() => HomePageState();
}

class HomePageState extends State<HomePage>{
  final DatabaseReference db = FirebaseDatabase.instance.reference();
  FirebaseUser user;
  String currentUser = "";
  String currentUserEmail = "";
  FirebaseAuth auth = FirebaseAuth.instance;
  var usageDict = {};
  var iterationCount = 0;

  void getCurrentUser() async{
    user = await auth.currentUser();
    setState(() {
      currentUserEmail = user.email;
      currentUser = currentUserEmail.replaceAll(RegExp(r'@\w+\.\w+'), "");
    });
  }

  void appendDict(newDict){
    // This function will be called everytime a new usage dict of a particular day is retrieved
    // and the usage is to be added to the global usageDict
    newDict.forEach((key, value){ // key is the website name and the value is the internet usage
      // Check if this key exist in the global Dictionary
      if (usageDict.containsKey(key)){
        // Then add the new time with the existing time
        usageDict[key] += newDict[key];
      }
      else{
        // Else create a new key of the new website in the global dictionary
        usageDict.addAll({key: value});
      }
    });
  }

  void getDictOfDate(date)async {
    // This function will request firebase RTD for the internet usage for this date.
    String dayString = "";
    String monthString = "";
    if (date.day < 10 && date.day > 0){
      // The string will be of single digit.
      // Ex. 4-Nov
      // Make it 04-Nov
      dayString = "0" + date.day.toString();
    }
    else
      dayString = date.day.toString();

    if (date.month > 0 && date.month< 10){
      // Single digit. Same process
      monthString = "0" + date.month.toString();
    }
    else
      monthString = date.month.toString();
    
    DatabaseReference dbTemp = db.child("Internet Usage").child(date.year.toString()).child(monthString).child(dayString);
    await dbTemp.once().then((DataSnapshot data){
      // print("Current date is:" + date.month.toString() + " " + date.day.toString());
      // print(data.value.toString());
      // Once the data is retrived, update the global dictionary
      if (data.value != null)
        appendDict(data.value);
      iterationCount += 1;
    });
  }

  void getData(){
    var date1 = new DateTime.utc(2019, 10, 10);
    var date2 = new DateTime.utc(2019, 10, 14);

    int days = date2.difference(date1).inDays; // The no of days in between.
    // Now for each day in between, get the data from firebase.
    for(int i=0; i < days; i++){
      var iterationDate = date1.add(new Duration(days: i));
      getDictOfDate(iterationDate);
    }
    // After this iteration, the global dict must have been completely updated
    // Set an periodic interval until the dict gets updated.
    Timer.periodic(Duration(seconds: 2), (timer) {
      print(timer.tick);
      if (iterationCount > 0){
        print(usageDict);
        timer.cancel();
      }
    });
    

  }

  @override
  void initState(){
    super.initState();
    getData();
    getCurrentUser();
  }
  DateTime dob,
      _fromDay = new DateTime(DateTime.now().year - 18, DateTime.now().month,
          DateTime.now().day, DateTime.now().hour, DateTime.now().minute);
  
   DateTime 
      _toDay = new DateTime(DateTime.now().year - 18, DateTime.now().month,
          DateTime.now().day, DateTime.now().hour, DateTime.now().minute);
  
  
  @override
  Widget build(BuildContext context){
    // getCurrentUser();
    return Scaffold(
      appBar: AppBar(
        title: Text('Logged In'),
      ),
      drawer: Drawer(
        child: ListView(
          children: <Widget>[
            UserAccountsDrawerHeader(
              accountName: Text(currentUser),
              accountEmail: Text(currentUserEmail),
              currentAccountPicture: CircleAvatar(
                backgroundColor: 
                  Theme.of(context).platform == TargetPlatform.iOS
                    ? Colors.blue
                    : Colors.white,
                  child: Text(
                    currentUser.substring(0, 1),
                    style: TextStyle(fontSize: 40.0),
                    ),
              ),
            ),
          ],
        ),
      ),
      body: Container(
        padding: EdgeInsets.all(20),
        child: Column(
          // We will have three rows.
          // 1. Start Date
          // 2. End Date
          // 3. Submit Button
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
           DateTimePicker(
                  labelText: 'From Date:',
                  selectedDate: _fromDay,
                  
                  selectDate: (DateTime date) {
                    setState(() {
                      _fromDay = date;
                    });
                  },
                  
                ),
                SizedBox(
                  height: 20,
                ),
                DateTimePicker(
                  labelText: 'To Date:',
                  selectedDate: _toDay,
                  
                  selectDate: (DateTime date) {
                    setState(() {
                      _toDay = date;
                    });
                  },
                  
                ),
                SizedBox(  
                  height: 20,
                ),
                 Divider(),
              
                 MaterialButton(
                color: Colors.blue,
                child: Text("Submit"),
                onPressed: (){
                  print(usageDict);
                },
              ),
           
              ],
            ),
          ),
        );
    
  }
}
class DateTimePicker extends StatelessWidget {
  const DateTimePicker({
    Key key,
    this.labelText,
    this.selectedDate,
    
    this.selectDate,
    
  }) : super(key: key);
  final String labelText;
  final DateTime selectedDate;
  
  final ValueChanged<DateTime> selectDate;
  
  Future<void> _selectDate(BuildContext context) async {
    final DateTime picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime(1960, 1),
      lastDate: DateTime(2050),
    );
    if (picked != null && picked != selectedDate) selectDate(picked);
  }

  
  @override
  Widget build(BuildContext context) {
    final TextStyle valueStyle = Theme.of(context).textTheme.title;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: <Widget>[
        Expanded(
          flex: 4,
          child: InputDropdown(
            labelText: labelText,
            valueText: DateFormat.yMMMd().format(selectedDate),
            valueStyle: valueStyle,
            onPressed: () {
              _selectDate(context);
            },
          ),
        ),
        const SizedBox(width: 12.0),
        
        
      ],
    );
  }
}

class InputDropdown extends StatelessWidget {
  const InputDropdown({
    Key key,
    this.child,
    this.labelText,
    this.valueText,
    this.valueStyle,
    this.onPressed,
  }) : super(key: key);
  final String labelText;
  final String valueText;

  final TextStyle valueStyle;
  final VoidCallback onPressed;
  final Widget child;
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onPressed,
      child: InputDecorator(
        decoration: InputDecoration(
          labelText: labelText,
        ),
        baseStyle: valueStyle,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Text(valueText, style: valueStyle),
            Icon(
              Icons.arrow_drop_down,
              color: Theme.of(context).brightness == Brightness.light
                  ? Colors.grey.shade700
                  : Colors.white70,
            ),
          ],
        ),
      ),
    );
  }
}
