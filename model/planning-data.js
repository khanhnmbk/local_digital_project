var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');

var Schema = mongoose.Schema;
mongoose.Promise = global.Promise; //Error if not declared

var testAndPackingPlanningSchema = new Schema({
    week : String,
    interval : Number,
    mode : String,
    date: String,
    startTime: String,
    stopTime: String,
}, { collection: 'test-and-packing-planning' });

var punchingPlanningSchema = new Schema({
    week : String,
    interval : Number,
    mode : String,
    date: String,
    startTime: String,
    stopTime: String,
}, { collection: 'punching-planning' });

var testAndPackingPlanningModel = mongoose.model('test-and-packing-planning-model' , testAndPackingPlanningSchema);
var punchingPlanningModel = mongoose.model('punching-planning-model' , punchingPlanningSchema);

function createPlanning(dataObject , _week) {
    console.log(_week);
    if (dataObject.asset == 'testAndPackingAsset') {
        for (var item in dataObject.mode) {
            for (var i = 0; i < dataObject.mode[item].length; i++){
                var tePaModel = new testAndPackingPlanningModel({
                    week : _week,
                    interval : dataObject.interval,
                    mode : item,
                    date : moment(_week).isoWeekday( dataObject.mode[item][i].date).format('YYYY-MM-DD'),
                    startTime : dataObject.mode[item][i].startTime,
                    stopTime : dataObject.mode[item][i].stopTime,
                });
                tePaModel.save();
                console.log('Write to TEST AND PACKING');
            }
        }
    } else { //punchingAsset
        for (var item in dataObject.mode) {
            for (var i = 0; i < dataObject.mode[item].length; i++){
                var punchingModel = new punchingPlanningModel({
                    week : _week,
                    interval : dataObject.interval,
                    mode : item,
                    date : moment(_week).isoWeekday( dataObject.mode[item][i].date).format('YYYY-MM-DD'),
                    startTime : dataObject.mode[item][i].startTime,
                    stopTime : dataObject.mode[item][i].stopTime,
                });
                punchingModel.save();
                console.log('Write to PUNCHING');
            }
        }
    }
 }   

//AssetName : String ('testAndPackingAsset' , 'punchingAsset')
function getPlan(week, mongooseModel , assetName,  callback) {
    var returnObject = {
        asset : null,
        week : null,
        interval : null, 
        mode : {}
    };
    var startWeek = moment(week).startOf('isoWeek').format('YYYY-MM-DD');
    var endWeek = moment(week).endOf('isoWeek').format('YYYY-MM-DD');
    mongooseModel.find({
        'date' : {
            $gte: startWeek,
            $lte : endWeek,
        }
    }, function(err, data){
        if (err) throw err;
        else if (data.length > 0) {
            console.log(data)
            returnObject.asset = assetName;
            returnObject.week = week;
            returnObject.interval = data[0].interval;
            for (var i = 0; i < data.length; i++) {
                if (!returnObject.mode.hasOwnProperty(data[i].mode)) { //Not exit property
                    returnObject.mode[data[i].mode] = [{date : moment(data[i].date).format('ddd') , mode: data[i].mode, startTime : data[i].startTime, stopTime : data[i].stopTime}];
                } else { //Exited property
                    returnObject.mode[data[i].mode].push({date : moment(data[i].date).format('ddd') , mode: data[i].mode, startTime : data[i].startTime, stopTime : data[i].stopTime})
                }
            }
            callback(returnObject);
        } else {
            returnObject.asset = assetName;
            returnObject.week = week;
            callback(returnObject);
        }
    });
}

//Find existing setup. Return _id or null
function getExistingItem(mongooseModel, checkData, callback) {
    mongooseModel.findOne({'week' : checkData.week, 'date' : checkData.date, 'startTime' : checkData.startTime, 'stopTime' : checkData.stopTime}, function(err, result) {
        if (err) throw err;
        else {
           callback(result , checkData.mode);
        }
    })

}

//Get planning time 
function getPlanningPeriod(type, mongooseModel, assetName, callback) {
    var returnObject = {
        asset : assetName,
        type : type,
        data : {
            workTime : 420,
            breakTime : 60,
            maintenanceTime : 0
        }
    };

    var _startDate = null;
    var _stopDate =  moment().format('YYYY-MM-DD');
    switch(type) {
        case 'day' : {
            _startDate = moment().format('YYYY-MM-DD');
           // _stopDate = _startDate;
            break;
        };
        case 'week' : {
            _startDate = moment().startOf('isoWeek').format('YYYY-MM-DD');
            //_stopDate = moment().endOf('isoWeek').format('YYYY-MM-DD');
            break;
        }; 
        case 'month' : {
            _startDate = moment().startOf('month').format('YYYY-MM-DD');
            //_stopDate = moment().endOf('month').format('YYYY-MM-DD');
            break;
        }; 
        case 'quarter' : {
            _startDate = moment().startOf('quarter').format('YYYY-MM-DD');
           // _stopDate = moment().endOf('quarter').format('YYYY-MM-DD');
            break;
        }; 
        case 'year' : {
            _startDate = moment().startOf('year').format('YYYY-MM-DD');
           // _stopDate = moment().endOf('year').format('YYYY-MM-DD');
            break;
        }; 
    }
    var numberOfDays = moment(_stopDate).diff(moment(_startDate) , 'days') + 1;
    
    //Edit code here
    if ( (type == 'day') && (moment(_stopDate).isoWeekday() == 7)) {    //Sunday
        numberOfDays = 0;
    }

    console.log(numberOfDays);

    async.parallel([
        //Working
        function(_callback) {
            mongooseModel.find({date : {$gte : _startDate, $lte : _stopDate} , mode : 'working'}, function(err, result) {
                if (err) throw err;
                else if (result.length>0) {
                    returnObject.data.workTime = result.length * result[0].interval;
                } else returnObject.data.workTime = 420 * numberOfDays;
                _callback();
            });
        },
        //Break
        function(_callback) {
            mongooseModel.find({date : {$gte : _startDate, $lte : _stopDate} , mode : 'break'}, function(err, result) {
                console.log(result)
                if (err) throw err;
                else if (result.length>0) {
                    returnObject.data.breakTime = result.length * result[0].interval;
                } else returnObject.data.breakTime = 60 * numberOfDays;
                _callback();
            });
        },
        //Maintenance
        function(_callback) {
            mongooseModel.find({date : {$gte : _startDate, $lte : _stopDate} , mode : 'maintenance'}, function(err, result) {
                if (err) throw err;
                else if (result.length>0) {
                    returnObject.data.maintenanceTime = result.length * result[0].interval;
                } else returnObject.data.maintenanceTime = 0;
                _callback();
            });
        }
    ] , function(err, result) {
        if (err) throw err;
        else callback(returnObject);
    })
}




module.exports.tePaPlanningModel = testAndPackingPlanningModel;
module.exports.punchingPlanningModel = punchingPlanningModel;
module.exports.createNewPlan = createPlanning;
module.exports.getPlanData = getPlan;
module.exports.checkExistingItem = getExistingItem;
module.exports.getPlanningPeriod = getPlanningPeriod;