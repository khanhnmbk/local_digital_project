var express = require('express');
var router = express.Router();
var excel = require('../model/excel');
var moment = require('moment');
var oeeModel = require('../model/oee-data');
var async = require('async');
var excelMacro = require('xlsx');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('navigation');
});

/* GET dashboard page. */
router.get('/dashboard', function(req, res, next) {
  res.render('dashboard');
});

/* GET dashboard page. */
router.get('/oee', function(req, res, next) {
  res.render('oee');
});

/* GET planning page. */
router.get('/planning', function(req, res, next) {
  res.render('planning');
});

/* Export OEE to excel */
router.get('/oee/:asset/report/:mode', function(req, res, next) {
  var startDate, endDate;
  var sampleFile = './excel/SampleFormat.xlsx';
  var destFile = './excel/Report.xlsx';
  var sampleFileWithMacro = './excel/SampleFormat.xlsm';
  var destFileWithMacro = './excel/Report.xlsm';
  
  switch(req.params.mode) {
    case 'week' : {
      startDate = moment().utcOffset(7).startOf('isoWeek').format('YYYY-MM-DD');
      endDate = moment().utcOffset(7).endOf('isoWeek').format('YYYY-MM-DD');
      break;
    };
    case 'month' : {
      startDate = moment().utcOffset(7).startOf('month').format('YYYY-MM-DD');
      endDate = moment().utcOffset(7).endOf('month').format('YYYY-MM-DD');
      break;
    };
    case 'quarter' : {
      startDate = moment().utcOffset(7).startOf('quarter').format('YYYY-MM-DD');
      endDate = moment().utcOffset(7).endOf('quarter').format('YYYY-MM-DD');
      break;
    };
    case 'year' : {
      startDate = moment().utcOffset(7).startOf('year').format('YYYY-MM-DD');
      endDate = moment().utcOffset(7).endOf('year').format('YYYY-MM-DD');
      break;
    };
  }

  if (req.params.asset == 'punching') {
    oeeModel.punchingOeeParamModel.find({date : {$gte : startDate, $lte : endDate}} , function(err, result) {
      if(err) console.log(err);
      else {
        var title = excel.generateTitle(req.params.mode , 'punchingAsset');
        excel.createReport(sampleFile, destFile, title , result, function(status) {
          if (status) {
            excel.modifyReport(destFile, sampleFileWithMacro, destFileWithMacro, function(result) {
              if (result) res.download(destFileWithMacro);
            });

            // async.series([
            //   function(callback) {
            //     var wbReport = excelMacro.readFile(destFile);
            //     var wbMacro = excelMacro.readFile(sampleFileWithMacro , {bookVBA : true});
            //     wbMacro.Sheets["Sheet1"] = wbReport.Sheets["Sheet1"];
            //     excelMacro.writeFile(wbMacro, destFileWithMacro, {bookVBA : true});
            //     callback();
            //   },
            //   function(callback) {
            //     res.download(destFileWithMacro);
            //     callback();
            //   }
            // ])
          }
        });
      }
    });
  } else {  //Test and packing
    oeeModel.tePaOeeParamModel.find({date : {$gte : startDate, $lte : endDate}} , function(err, result) {
      if (err) console.log(err);
      else {
        var title = excel.generateTitle(req.params.mode, 'testAndPackingAsset');
        excel.createReport(sampleFile, destFile, title, result, function(status) {
          if (status) {
            excel.modifyReport(destFile, sampleFileWithMacro, destFileWithMacro, function(result) {
              res.download(destFileWithMacro);
            });
            // async.series([
            //   function(callback) {
            //     var wbReport = excelMacro.readFile(destFile);
            //     var wbMacro = excelMacro.readFile(sampleFileWithMacro , {bookVBA : true});
            //     wbMacro.Sheets["Sheet1"] = wbReport.Sheets["Sheet1"];
            //     excelMacro.writeFile(wbMacro, destFileWithMacro, {bookVBA : true});
            //     callback();
            //   },
            //   function(callback) {
            //     res.download(destFileWithMacro);
            //     callback();
            //   }
            // ])
          }
        })
      }
    });
  }
  
});

module.exports = router;