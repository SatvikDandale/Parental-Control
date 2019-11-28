import 'package:flutter/cupertino.dart';
import 'package:charts_flutter/flutter.dart'as charts;
import 'package:flutter/material.dart';
import 'package:parental_monitor/usage.dart';
class Stats extends StatelessWidget
{
  var  usageDict; 
  Stats(usageDict)
    {
      this.usageDict = usageDict;
    }
  
  
  @override
  Widget build(BuildContext context) {
     List<charts.Series<Usage,String>> series=
   [
     charts.Series(
      id: "Subscribers",
      data: usageDict,
      domainFn: (Usage series, _) => series.site,
      measureFn: (Usage series, _) => series.totalUsage,
      
     )
   ];
    return Container(
      height: 400,
      padding: EdgeInsets.all(20),
      child: Card(
        child: Column(
          children: <Widget>[
              Text(
                "Internet usage of child",
                style: Theme.of(context).textTheme.body2,
              ),
              Expanded(
                
                child:
                 charts.BarChart(series, animate: true),
              )
            ],
        ),
      ),
    );
  }
  
}