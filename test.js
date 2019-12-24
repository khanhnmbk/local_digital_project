var excel = require('xlsx');

var sourceFile1 = './excel/SampleFormat.xlsm';
var sourceFile2 = './excel/Report.xlsx';
var destFile = './excel/Final.xlsm';

var wbSource = excel.readFile(sourceFile1 , {bookVBA : true});
var wbReport = excel.readFile(sourceFile2);
wbSource.Sheets["Sheet1"] = wbReport.Sheets["Sheet1"];

// var wb2 = excel.readFile(sourceFile1);

// wb2.Sheets["Sheet1"] = wb1.Sheets["Sheet1"];
// excel.writeFile(wb2, destFile);

// var index1 = 8, index2 = 9;

// sheet['A14'] = {f : 'B' + index1 + '+B' + index2};
excel.writeFile(wbSource,destFile, {bookVBA : true});

