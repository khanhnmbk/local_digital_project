var Excel = require('exceljs');
var async = require('async');
var moment = require('moment');
var ExcelMacro = require('xlsx');


var startRow = 7;


//sheetName: Punching, Test and Packing
function createReport(sampleFormatPath, destFilePath, title ,data , callback) {
    var nextRow;
    var wb = new Excel.Workbook();
    wb.xlsx.readFile(sampleFormatPath).then(function() {
        var sheet = wb.getWorksheet('Sheet1');
        var i = 0;
        if (data.length > 0) {
            async.whilst(
                //Check condition
                function() {
                    return i < data.length;
                },
                //Executing 
                function(_callback) {
                    sheet.getRow(startRow + i).getCell(1).value = data[i].date; //Date
                    sheet.getRow(startRow + i).getCell(2).value = data[i].plannedWorkingTime + data[i].plannedBreakTime; //Total
                    sheet.getRow(startRow + i).getCell(3).value = data[i].goodProduct;  //Good product
                    sheet.getRow(startRow + i).getCell(4).value = data[i].failProduct;  //Fail product
                    sheet.getRow(startRow + i).getCell(5).value = data[i].productiveTime; //Executing time
                    sheet.getRow(startRow + i).getCell(6).value = data[i].standbyTime;  //Standby time
                    sheet.getRow(startRow + i).getCell(7).value = data[i].setupTime;    //Setup time
                    sheet.getRow(startRow + i).getCell(8).value = data[i].maintenanceTime;  //Maintenance time
                    sheet.getRow(startRow + i).getCell(9).value = data[i].repairTime;   //Repair time
                    sheet.getRow(startRow + i).getCell(10).value = data[i].plannedBreakTime; //Break time

                    //Another table
                    sheet.getRow(startRow + i).getCell(12).value = data[i].date; //Date
                    sheet.getRow(startRow + i).getCell(13).value =  {formula : '=B' + (startRow + i) + '-J' + (startRow + i)}; //Available time = Total - Break
                    sheet.getRow(startRow + i).getCell(14).value =  {formula : '=E' + (startRow + i)}; //Productive time
                    sheet.getRow(startRow + i).getCell(15).value =  {formula : '=F' + (startRow + i) + '+G' + (startRow + i)}; //Idle + Engineering = Standby + Setup 
                    sheet.getRow(startRow + i).getCell(16).value =  {formula : '=H' + (startRow + i) + '+I' + (startRow + i)}; //Downtime = Maint + Repair



                    i++;
                    nextRow = startRow + i;
                    _callback();
                },
                //Finish: Write file
                function(err) {
                    //Write title
                    sheet.getRow(1).getCell(1).value = title;
                    //Calculate sum
                    sheet.getRow(nextRow).getCell(1).value = 'Grand total';
                    sheet.getRow(nextRow).getCell(2).value =  {formula : '=SUM(B7:B' + (nextRow-1) + ')'}; //Total
                    sheet.getRow(nextRow).getCell(3).value =  {formula : '=SUM(C7:C' + (nextRow-1) + ')'}; //Good product
                    sheet.getRow(nextRow).getCell(4).value =  {formula : '=SUM(D7:D' + (nextRow-1) + ')'}; //Fail product
                    sheet.getRow(nextRow).getCell(5).value =  {formula : '=SUM(E7:E' + (nextRow-1) + ')'}; //Excecuting time
                    sheet.getRow(nextRow).getCell(6).value =  {formula : '=SUM(F7:F' + (nextRow-1) + ')'}; //Standby time
                    sheet.getRow(nextRow).getCell(7).value =  {formula : '=SUM(G7:G' + (nextRow-1) + ')'}; //Setup time
                    sheet.getRow(nextRow).getCell(8).value =  {formula : '=SUM(H7:H' + (nextRow-1) + ')'}; //Maintenance time
                    sheet.getRow(nextRow).getCell(9).value =  {formula : '=SUM(I7:I' + (nextRow-1) + ')'}; //Repair time
                    sheet.getRow(nextRow).getCell(10).value =  {formula : '=SUM(J7:J' + (nextRow-1) + ')'}; //Break time

                    sheet.getCell('K1').value = nextRow - 1;

                    //Calculate OEE
                    sheet.getCell('M2').value = {formula : '=B' + nextRow + '-J' + nextRow};   //Operation Time
                    sheet.getCell('M3').value = {formula: '=E' + nextRow + '+F' + nextRow + '+G' + nextRow}; //Uptime
                    sheet.getCell('M4').value = {formula : '=E' + nextRow}; //Executing time
                    sheet.getCell('Q3').value = {formula: '=M3/M2'};    //Uptime Ratio
                    sheet.getCell('Q4').value = {formula : '=M4/M2'};

                    wb.xlsx.writeFile(destFilePath).then(() => {
                        console.log('Write file success');
                        callback(true);
                    });

                }
            )
        } else {
            wb.xlsx.writeFile(destFilePath).then(() => callback(true));
        }

    })  
} 

//Modify xlsx to xlsm for macro enable
function modifyReport(reportFile, sampleMacroFile, destFile, callback) {
    var wbReport = ExcelMacro.readFile(reportFile);
    var wbSample = ExcelMacro.readFile(sampleMacroFile, {bookVBA : true});

    async.series([
        function(_callback) {
            wbSample.Sheets['Sheet1'] = wbReport.Sheets['Sheet1'];
            var sheet = wbSample.Sheets['Sheet1'];
            //Calculate average again
            if (!sheet['K1']) sheet['K1'] = {};
            var latestRow = sheet['K1'].v;
            var totalRow = Number(latestRow) + 1;

            if (!sheet['B' + totalRow]) sheet['B' + totalRow] = {};
            if (!sheet['C' + totalRow]) sheet['C' + totalRow] = {};
            if (!sheet['D' + totalRow]) sheet['D' + totalRow] = {};
            if (!sheet['E' + totalRow]) sheet['E' + totalRow] = {};
            if (!sheet['F' + totalRow]) sheet['F' + totalRow] = {};
            if (!sheet['G' + totalRow]) sheet['G' + totalRow] = {};
            if (!sheet['H' + totalRow]) sheet['H' + totalRow] = {};
            if (!sheet['I' + totalRow]) sheet['I' + totalRow] = {};
            if (!sheet['J' + totalRow]) sheet['J' + totalRow] = {};

            sheet['B' + totalRow] = {f : 'SUM(B7:B' + latestRow + ')'}; //Total time
            sheet['C' + totalRow] = {f : 'SUM(C7:C' + latestRow + ')'}; //Good products
            sheet['D' + totalRow] = {f : 'SUM(D7:D' + latestRow + ')'}; //Fail products
            sheet['E' + totalRow] = {f : 'SUM(E7:E' + latestRow + ')'}; //Productive time
            sheet['F' + totalRow] = {f : 'SUM(F7:F' + latestRow + ')'}; //Standby time
            sheet['G' + totalRow] = {f : 'SUM(G7:G' + latestRow + ')'}; //Setup time
            sheet['H' + totalRow] = {f : 'SUM(H7:H' + latestRow + ')'}; //Maintenance time
            sheet['I' + totalRow] = {f : 'SUM(I7:I' + latestRow + ')'}; //Repair time
            sheet['J' + totalRow] = {f : 'SUM(J7:J' + latestRow + ')'}; //Break time

            //Table for drawing chart
            for (var i = 7; i < totalRow; i++) {
                sheet['M' + i] = {f : 'B' + i + '-J' + i};  //Available = Total - Break
                sheet['N' + i] = {f : 'E' + i}; //Productive = Productive
                sheet['O' + i] = {f : 'F' + i + '+G' + i};  //Idle + Engineering = Standby + Setup
                sheet['P' + i] = {f : 'H' + i + '+I' + i};  //Downtime = Maint + Repair
            }
            
            //Calculate OEE again
            if (!sheet['M2']) sheet['M2'] = {};
            if (!sheet['M3']) sheet['M3'] = {};
            if (!sheet['M4']) sheet['M4'] = {};
            if (!sheet['Q3']) sheet['Q3'] = {};
            if (!sheet['Q4']) sheet['Q4'] = {};

            sheet['M2'] = {f : 'B' + totalRow + '-J' + totalRow};
            sheet['M3'] = {f : 'E' + totalRow + '+F' + totalRow + '+G' + totalRow};
            sheet['M4'] = {f : 'E' + totalRow};
            sheet['Q3'] = {f : 'M3/M2'};
            sheet['Q4'] = {f : 'M4/M2'};
            
            _callback();
        },
    ], function(err,res) {
        ExcelMacro.writeFile(wbSample, destFile, {bookVBA : true});
        callback(true);
    })
    

}


//Create report V2
// function createReport(sampleFormatPath, destFilePath, title, data, callback) {
//     var nextRow;
//     var wb = excel.readFile(sampleFormatPath);
//     var sheet = wb.Sheets['Sheet1'];
//     var i = 0;
//     if (data.length > 0) {
//         async.whilst(
//             //Check condition
//             function () {
//                 return i < data.length;
//             },
//             //Executing 
//             function (_callback) {
//                 if (!sheet['A' + (nextRow + i)]) sheet['A' + (nextRow + i)] = {};
//                 sheet['A' + (nextRow + i)].v = data[i].date; //Date

//                 if (!sheet['B' + (nextRow + i)]) sheet['B' + (nextRow + i)] = {};
//                 sheet['B' + (nextRow + i)].v = data[i].plannedWorkingTime + data[i].plannedBreakTime; //Total

//                 if (!sheet['C' + (nextRow + i)]) sheet['C' + (nextRow + i)] = {};
//                 sheet['C' + (nextRow + i)].v = data[i].goodProduct;  //Good product

//                 if (!sheet['D' + (nextRow + i)]) sheet['D' + (nextRow + i)] = {};
//                 sheet['D' + (nextRow + i)].v = data[i].failProduct;  //Fail product

//                 if (!sheet['E' + (nextRow + i)]) sheet['E' + (nextRow + i)] = {};
//                 sheet['E' + (nextRow + i)].v = data[i].productiveTime; //Executing time

//                 if (!sheet['F' + (nextRow + i)]) sheet['F' + (nextRow + i)] = {};
//                 sheet['F' + (nextRow + i)].v = data[i].standbyTime;  //Standby time

//                 if (!sheet['G' + (nextRow + i)]) sheet['G' + (nextRow + i)] = {};
//                 sheet['G' + (nextRow + i)].v = data[i].setupTime;    //Setup time

//                 if (!sheet['H' + (nextRow + i)]) sheet['H' + (nextRow + i)] = {};
//                 sheet['H' + (nextRow + i)].v = data[i].maintenanceTime;  //Maintenance time

//                 if (!sheet['I' + (nextRow + i)]) sheet['I' + (nextRow + i)] = {};
//                 sheet['I' + (nextRow + i)].v = data[i].repairTime;   //Repair time

//                 if (!sheet['J' + (nextRow + i)]) sheet['J' + (nextRow + i)] = {};
//                 sheet['J' + (nextRow + i)].v = data[i].plannedBreakTime; //Break time

//                 //Another table
//                 if (!sheet['L' + (nextRow + i)]) sheet['L' + (nextRow + i)] = {};
//                 sheet['L' + (nextRow + i)].v = data[i].date; //Date

//                 if (!sheet['M' + (nextRow + i)]) sheet['M' + (nextRow + i)] = {};
//                 sheet['M' + (nextRow + i)].v = { f: 'B' + (startRow + i) + '-J' + (startRow + i) }; //Available time = Total - Break
                
//                 if (!sheet['N' + (nextRow + i)]) sheet['N' + (nextRow + i)] = {};
//                 sheet['N' + (nextRow + i)].v = { f: 'E' + (startRow + i) }; //Productive time

//                 if (!sheet['O' + (nextRow + i)]) sheet['O' + (nextRow + i)] = {};
//                 sheet['O' + (nextRow + i)].v = { f: 'F' + (startRow + i) + '+G' + (startRow + i) }; //Idle + Engineering = Standby + Setup 
                
//                 if (!sheet['P' + (nextRow + i)]) sheet['P' + (nextRow + i)] = {};
//                 sheet['P' + (nextRow + i)].v = { f: 'H' + (startRow + i) + '+I' + (startRow + i) }; //Downtime = Maint + Repair

//                 i++;
//                 nextRow = startRow + i;
//                 _callback();
//             },
//             //Finish: Write file
//             function (err) {
//                 //Write title
//                 if (!sheet['A1']) sheet['A1'] = {};
//                 sheet['A1'].v = title;
//                 //Calculate sum
//                 if (!sheet['A' + nextRow]) sheet['A' + nextRow] = {};
//                 sheet['A' + nextRow].v = 'Grand total';

//                 if (!sheet['B' + nextRow]) sheet['B' + nextRow] = {};
//                 //sheet['B' + nextRow].v = { f: '=SUM(B7:B' + (nextRow - 1) + ')' }; //Total
//                 sheet['B' + nextRow].v = { f: 'B7+B8' }; //Total

//                 if (!sheet['C' + nextRow]) sheet['C' + nextRow] = {};
//                 sheet['C' + nextRow].v = { f: 'SUM(C7:C' + (nextRow - 1) + ')' }; //Good product

//                 if (!sheet['D' + nextRow]) sheet['D' + nextRow] = {};
//                 sheet['D' + nextRow].v = { f: 'SUM(D7:D' + (nextRow - 1) + ')' }; //Fail product

//                 if (!sheet['E' + nextRow]) sheet['E' + nextRow] = {};
//                 sheet['E' + nextRow].v = { f: 'SUM(E7:E' + (nextRow - 1) + ')' }; //Excecuting time

//                 if (!sheet['F' + nextRow]) sheet['F' + nextRow] = {};
//                 sheet['F' + nextRow].v = { f: 'SUM(F7:F' + (nextRow - 1) + ')' }; //Standby time

//                 if (!sheet['G' + nextRow]) sheet['G' + nextRow] = {};
//                 sheet['G' + nextRow].v = { f: 'SUM(G7:G' + (nextRow - 1) + ')' }; //Setup time

//                 if (!sheet['H' + nextRow]) sheet['H' + nextRow] = {};
//                 sheet['H' + nextRow].v = { f: 'SUM(H7:H' + (nextRow - 1) + ')' }; //Maintenance time

//                 if (!sheet['I' + nextRow]) sheet['I' + nextRow] = {};
//                 sheet['I' + nextRow].v = { f: 'SUM(I7:I' + (nextRow - 1) + ')' }; //Repair time

//                 if (!sheet['J' + nextRow]) sheet['J' + nextRow] = {};
//                 sheet['J' + nextRow].v = { f: 'SUM(J7:J' + (nextRow - 1) + ')' }; //Break time

//                 if (!sheet['K1']) sheet['K1'] = {};
//                 sheet['K1'].v = 'P' + (nextRow - 1);

//                 //Calculate OEE
//                 if (!sheet['M2']) sheet['M2'] = {};
//                 sheet['M2'].v = { f: 'B' + nextRow + '-J' + nextRow };   //Operation Time

//                 if (!sheet['M3']) sheet['M3'] = {};
//                 sheet['M3'].v = { f: 'E' + nextRow + '+F' + nextRow + '+G' + nextRow }; //Uptime

//                 if (!sheet['M4']) sheet['M4'] = {};
//                 sheet['M4'].v = { f: 'E' + nextRow }; //Executing time

//                 if (!sheet['Q3']) sheet['Q3'] = {};
//                 sheet['Q3'].v = { f: 'M3/M2' };    //Uptime Ratio

//                 if (!sheet['Q4']) sheet['Q4'] = {};
//                 sheet['Q4'].v = { f: 'M4/M2' };

//                 async.series([
//                     function(__callback) {
//                         excel.writeFile(wb, destFilePath);
//                         __callback();
//                     },
//                     function(__callback) {
//                         console.log('Write file success');
//                         callback(true);
//                         __callback();
//                     }
//                 ])
                
                
//             }
//         )
//     } else {
//         excel.writeFile(wb, destFilePath);
//         callback(true);
//         //wb.xlsx.writeFile(destFilePath).then(() => callback(true));
//     }
// }







//Mode : week, month, quarter, year
//Asset: punchingAsset, testAndPackingAsset
function generateTitle(mode, asset) {
    var title;
    if (asset == 'testAndPackingAsset') title = 'TEST AND PACKING MACHINE: OEE REPORT IN ';
    else title = 'PUNCHING MACHINE: OEE REPORT IN '
    switch (mode.toLowerCase()) {
        case 'week': {
            title += moment().utcOffset(7).format(moment.HTML5_FMT.WEEK) + ' (' + moment().utcOffset(7).startOf('isoWeek').format('YYYY-MM-DD') + ' to ' + moment().utcOffset(7).endOf('isoWeek').format('YYYY-MM-DD') + ')';
            break;
        }
        case 'month': {
            title += moment().utcOffset(7).format('MMM YYYY').toUpperCase();
            break;
        }
        case 'quarter': {
            title += 'QUARTER ' + moment().utcOffset(7).format('Q YYYY');
            break;
        }
        case 'year': {
            title += moment().utcOffset(7).format('YYYY');
            break;
        }
    }
    return title;
}

module.exports.createReport = createReport;
module.exports.generateTitle = generateTitle;
module.exports.modifyReport = modifyReport;