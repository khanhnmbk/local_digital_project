var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var mindsphere = require('./MindSphere');
var planning = require('./planning-data');

var $fixedPrepareTime = 0.5;

var Schema = mongoose.Schema;
mongoose.Promise = global.Promise; //Error if not declared

var oeeTePaSchema = new Schema({
    type: String,
    date: String,
    oee: Number,
    availability: Number,
    performance: Number,
    quality: Number,
    timestamp: String,
}, { collection: 'test-and-packing-OEE' });

var oeePunchingSchema = new Schema({
    type: String,
    date: String,
    oee: Number,
    availability: Number,
    performance: Number,
    quality: Number,
    timestamp: String,
}, { collection: 'punching-OEE' });

//OEE parameter schemas
var oeeTePaParameterSchema = new Schema({
    date: String,
    plannedWorkingTime: Number, //Sum ->  total time
    plannedBreakTime: Number, //Sum -> total time
    goodProduct: Number,
    failProduct: Number,
    productiveTime: Number,
    standbyTime: Number,
    setupTime: Number,
    maintenanceTime: Number,
    repairTime: Number,
    realRunningTime : Number
}, { collection: 'test-and-packing-OEE-parameters' });

var oeePunchingParameterSchema = new Schema({
    date: String,
    plannedWorkingTime: Number, //Sum ->  total time
    plannedBreakTime: Number, //Sum -> total time
    goodProduct: Number,
    failProduct: Number,
    productiveTime: Number,
    standbyTime: Number,
    setupTime: Number,
    maintenanceTime: Number,
    repairTime: Number,
    realRunningTime : Number
}, { collection: 'punching-OEE-parameters' });

var tePaOeeModel = mongoose.model('test-and-packing-oee', oeeTePaSchema);
var punchingOeeModel = mongoose.model('punching-oee', oeePunchingSchema);
var tePaOeeParamModel = mongoose.model('test-and-packing-oee-parameter', oeeTePaParameterSchema);
var punchingOeeParamModel = mongoose.model('punching-oee-parameter', oeePunchingParameterSchema);


//Create new log, called once a day, after calculating OEE
//data {date : '2019-04-05' , value : {oee : 50, availability: 70, performance : 60, quality : 90}, }
function createNewData(assetName, data, type) {
    if (assetName == 'testAndPackingAsset') {
        var model = new tePaOeeModel({
            type: type,
            date: data.date,
            oee: data.value.oee,
            availability: data.value.availability,
            performance: data.value.performance,
            quality: data.value.quality,
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
        });
        model.save();
    } else { //Punching asset
        var model = new punchingOeeModel({
            type: type,
            date: data.date,
            oee: data.value.oee,
            availability: data.value.availability,
            performance: data.value.performance,
            quality: data.value.quality,
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
        });
        model.save();
    }
    console.log('Saved to database');
}

//Data: ProductCounter, FailProduct, Runtime, PrepareTime, MaintenanceTime, RepairTime, LowerSpeed
function createOeeParam(mongooseModel) {
    mongooseModel.save();
    console.log('Saved successfully');
}

//Get today data. Return null or result object
function getToday(mongooseModel, callback) {
    var returnObject = {
        oee: [],
        availability: [],
        performance: [],
        quality: []
    };
    mongooseModel.findOne({ date: moment().format('YYYY-MM-DD'), type: 'day' }, function (err, result) {
        if (err) console.log(err);
        else if (result) {
            returnObject.oee.push({
                date: result.date,
                value: result.oee
            });
            returnObject.availability.push({
                date: result.date,
                value: result.availability
            });
            returnObject.performance.push({
                date: result.date,
                value: result.performance
            });
            returnObject.quality.push({
                date: result.date,
                value: result.quality
            });
            callback(returnObject);
        } else {    //Not found
            var _date = moment().format('YYYY-MM-DD');
            returnObject.oee.push({
                date: _date,
                value: 0
            });
            returnObject.availability.push({
                date: _date,
                value: 0
            });
            returnObject.performance.push({
                date: _date,
                value: 0
            });
            returnObject.quality.push({
                date: _date,
                value: 0
            });
            callback(returnObject);
        };
    });
}

//Get current week
function getWeek(mongooseModel, callback) {
    var startWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
    var endWeek = moment().endOf('isoWeek').format('YYYY-MM-DD');
    var returnObject = {
        oee: [],
        availability: [],
        performance: [],
        quality: [],
        average: {
            oee: null,
            availability: null,
            performance: null,
            quality: null
        }
    };
    async.parallel([
        //Get weekday oee value
        function (_callback) {
            mongooseModel.find({ date: { $gte: startWeek, $lte: endWeek }, type: 'day' }, function (err, result) {
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        returnObject.oee.push({
                            date: result[i].date,
                            value: result[i].oee
                        });
                        returnObject.availability.push({
                            date: result[i].date,
                            value: result[i].availability
                        });
                        returnObject.performance.push({
                            date: result[i].date,
                            value: result[i].performance
                        });
                        returnObject.quality.push({
                            date: result[i].date,
                            value: result[i].quality
                        });
                    }
                }
                _callback();
            });
        },
        //Find weekly oee value
        function (_callback) {
            mongooseModel.findOne({ type: 'week', date: moment().format(moment.HTML5_FMT.WEEK) }, function (err, result1) {
                if (err) console.log(err);
                else if (result1) {
                    returnObject.average.oee = result1.oee;
                    returnObject.average.availability = result1.availability;
                    returnObject.average.performance = result1.performance;
                    returnObject.average.quality = result1.quality;
                }
                _callback();
            });
        }
    ], function (err, result) {
        if (err) console.log(err);
        else callback(returnObject)
    })

}

//Get current month 
function getMonth(mongooseModel, callback) {
    var startMonth = moment().startOf('month').format('YYYY-MM-DD');
    var endMonth = moment().endOf('month').format('YYYY-MM-DD');
    var returnObject = {
        oee: [],
        availability: [],
        performance: [],
        quality: [],
        average: {
            oee: null,
            availability: null,
            performance: null,
            quality: null
        }
    };

    async.parallel([
        //Get days of week oee value
        function (_callback) {
            mongooseModel.find({ date: { $gte: startMonth, $lte: endMonth }, type: 'day' }, function (err, result) {
                if (err) console.log(err);
                else {
                    if (result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            returnObject.oee.push({
                                date: result[i].date,
                                value: result[i].oee
                            });
                            returnObject.availability.push({
                                date: result[i].date,
                                value: result[i].availability
                            });
                            returnObject.performance.push({
                                date: result[i].date,
                                value: result[i].performance
                            });
                            returnObject.quality.push({
                                date: result[i].date,
                                value: result[i].quality
                            });
                        }
                    };
                    _callback();
                }
            });
        },
        //Get monthly oee value
        function (_callback) {
            mongooseModel.findOne({ type: 'month', date: moment().format('YYYY-MM') }, function (err, result1) {
                if (err) console.log(err);
                else if (result1) {
                    returnObject.average.oee = result1.oee;
                    returnObject.average.availability = result1.availability;
                    returnObject.average.performance = result1.performance;
                    returnObject.average.quality = result1.quality;
                }
                _callback();
            });
        }
    ], function (err, result) {
        if (err) console.log(err);
        else callback(returnObject);
    })

}

//Get current quarter
function getQuarter(mongooseModel, callback) {
    var startMonth = moment().startOf('quarter').format('YYYY-MM-DD');
    var endMonth = moment().endOf('quarter').format('YYYY-MM-DD');
    console.log(startMonth + ' - ' + endMonth)
    var returnObject = {
        oee: [],
        availability: [],
        performance: [],
        quality: [],
        average: {
            oee: null,
            availability: null,
            performance: null,
            quality: null
        }
    };

    async.parallel([
        //Get days of quarter oee value
        function (_callback) {
            mongooseModel.find({ type: 'day', date: { $gte: startMonth, $lte: endMonth } }, function (err, result) {
                if (err) console.log(err);
                else if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        returnObject.oee.push({
                            date: result[i].date,
                            value: result[i].oee
                        });
                        returnObject.availability.push({
                            date: result[i].date,
                            value: result[i].availability
                        });
                        returnObject.performance.push({
                            date: result[i].date,
                            value: result[i].performance
                        });
                        returnObject.quality.push({
                            date: result[i].date,
                            value: result[i].quality
                        });
                    }
                }
                _callback();
            })
        },
        //Get quarterly oee value
        function (_callback) {
            mongooseModel.findOne({ type: 'quarter', date: moment().format('YYYY qQ') }, function (err, result1) {
                if (err) console.log(err);
                else if (result1) {
                    returnObject.average.oee = result1.oee;
                    returnObject.average.availability = result1.availability;
                    returnObject.average.performance = result1.performance;
                    returnObject.average.quality = result1.quality;
                }
                _callback();
            });
        }
    ], function (err, result) {
        if (err) console.log(err);
        else callback(returnObject);
    })

}

//Get current year
function getYear(mongooseModel, callback) {
    var startMonth = moment().startOf('year').format('YYYY-MM');
    var currentMonth = moment().format('YYYY-MM');

    var returnObject = {
        oee: [],
        availability: [],
        performance: [],
        quality: [],
        average: {
            oee: null,
            availability: null,
            performance: null,
            quality: null
        }
    };

    async.parallel([
        //Get months of year oee value
        function (_callback) {
            mongooseModel.find({ type: 'month', date: { $gte: startMonth, $lte: currentMonth } }, function (err, result) {
                if (err) console.log(err);
                else if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        returnObject.oee.push({
                            date: result[i].date,
                            value: result[i].oee
                        });
                        returnObject.availability.push({
                            date: result[i].date,
                            value: result[i].availability
                        });
                        returnObject.performance.push({
                            date: result[i].date,
                            value: result[i].performance
                        });
                        returnObject.quality.push({
                            date: result[i].date,
                            value: result[i].quality
                        });
                    }
                }
                _callback();
            })
        }, function (_callback) { //Get yearly oee value
            mongooseModel.findOne({ type: 'year', date: moment().format('YYYY') }, function (err, result1) {
                if (err) console.log(err);
                else if (result1) {
                    returnObject.average.oee = result1.oee;
                    returnObject.average.availability = result1.availability;
                    returnObject.average.performance = result1.performance;
                    returnObject.average.quality = result1.quality;
                }
                _callback();
            });
        }
    ], function (err, result) {
        if (err) console.log(err);
        else callback(returnObject);
    })

}

//Get all data
function getData(tePaModel, punchingModel, callback) {
    var returnObject = {
        testAndPackingAsset: {
            today: {},
            currentWeek: {},
            currentMonth: {},
            currentQuarter: {},
            currentYear: {}
        },
        punchingAsset: {
            today: {},
            currentWeek: {},
            currentMonth: {},
            currentQuarter: {},
            currentYear: {}
        }
    }
    async.parallel([
        //Test and Packing Asset
        function (_callback) {
            getToday(tePaModel, function (result) {
                if (result) returnObject.testAndPackingAsset.today = result;
                _callback();
            });
        },
        function (_callback) {
            getWeek(tePaModel, function (result) {
                if (result) returnObject.testAndPackingAsset.currentWeek = result;
                _callback();
            });
        },
        function (_callback) {
            getMonth(tePaModel, function (result) {
                if (result) returnObject.testAndPackingAsset.currentMonth = result;
                _callback();
            });
        },
        function (_callback) {
            getQuarter(tePaModel, function (result) {
                if (result) returnObject.testAndPackingAsset.currentQuarter = result;
                _callback();
            });
        },
        function (_callback) {
            getYear(tePaModel, function (result) {
                if (result) returnObject.testAndPackingAsset.currentYear = result;
                _callback();
            });
        },
        //Punching asset
        function (_callback) {
            getToday(punchingModel, function (result) {
                if (result) returnObject.punchingAsset.today = result;
                _callback();
            });
        },
        function (_callback) {
            getWeek(punchingModel, function (result) {
                if (result) returnObject.punchingAsset.currentWeek = result;
                _callback();
            });
        },
        function (_callback) {
            getMonth(punchingModel, function (result) {
                if (result) returnObject.punchingAsset.currentMonth = result;
                _callback();
            });
        },
        function (_callback) {
            getQuarter(punchingModel, function (result) {
                if (result) returnObject.punchingAsset.currentQuarter = result;
                _callback();
            });
        },
        function (_callback) {
            getYear(punchingModel, function (result) {
                if (result) returnObject.punchingAsset.currentYear = result;
                _callback();
            });
        },


    ], function (err, result) {
        if (err) console.log(err);
        else {
            callback(returnObject);
        }
    })
}

//Calculate OEE
//Data is an object with properties: 
//          plannedWorkingTime = totalTime - breakTime
//          productiveTime = Runtime + circleCounter * 0.5min
//          goodProduct
//          totalProduct = goodProduct + failProduct
//          realRunningTime = productiveTime + prepareTime + maintenanceTime + repairTime
function calculateOEE(data) {
    var isOutput = (data.totalProduct > 0) ? 1 : 0;

    //Oee
    var oee;
    if (data.plannedWorkingTime != 0) oee = (data.productiveTime * isOutput / data.plannedWorkingTime * 100).toFixed(3);
    else oee = 0;

    //Performance
    var perf;
    if (data.realRunningTime != 0) perf = (data.productiveTime * isOutput / data.realRunningTime * 100).toFixed(3);
    else perf = 0;

    //Availability
    var avail;
    if (data.plannedWorkingTime != 0) avail = (data.realRunningTime / data.plannedWorkingTime * 100).toFixed(3);
    else avail = 0;

    //Quality
    var qual;
    if (data.totalProduct != 0) qual = (data.goodProduct / data.totalProduct * 100).toFixed(3);
    else qual = 0;

    if (isNaN(oee)) oee = 0;
    if (isNaN(avail)) avail = 0;
    if (isNaN(perf)) perf = 0;
    if (isNaN(qual)) qual = 0;

    return {
        oee: Number(oee),
        availability: Number(avail),
        performance: Number(perf),
        quality: Number(qual)
    }
}


//OEE today
function todayOEE(mindsphereData, assetName) {
    var planningModel;
    if (assetName == 'testAndPackingAsset') planningModel = planning.tePaPlanningModel;
    else planningModel = planning.punchingPlanningModel;

    planning.getPlanningPeriod('day', planningModel, assetName, function (planningObject) {
        var plannedWorkingTime = planningObject.data.workTime;
        var productiveTime = mindsphereData.Runtime + mindsphereData.CircleCounter * $fixedPrepareTime;
        var totalProduct = mindsphereData.ProductCounter;
        var goodProduct = mindsphereData.ProductCounter - mindsphereData.FailProduct;
        var realRunningTime = productiveTime + mindsphereData.PrepareTime + mindsphereData.MaintenanceTime + mindsphereData.RepairTime;


        //Write to OEE params 
        var model;
        if (assetName == 'testAndPackingAsset') {
            model = tePaOeeParamModel;
        } else {
            model = punchingOeeParamModel;
        };
        var newModel = new model({
            date: moment().format('YYYY-MM-DD'),
            plannedWorkingTime :plannedWorkingTime,
            plannedBreakTime : planningObject.data.breakTime,
            realRunningTime : realRunningTime,
            goodProduct : goodProduct,
            failProduct : mindsphereData.FailProduct,
            productiveTime : productiveTime,
            standbyTime : plannedWorkingTime - productiveTime - mindsphereData.SetupTime - mindsphereData.MaintenanceTime - mindsphereData.RepairTime,
            setupTime : mindsphereData.SetupTime,
            maintenanceTime : mindsphereData.MaintenanceTime,
            repairTime : mindsphereData.RepairTime
        });
        createOeeParam(newModel);

        //Calculate OEE today
        var oeeObject = calculateOEE({
            plannedWorkingTime: plannedWorkingTime,
            productiveTime: productiveTime,
            goodProduct: goodProduct,
            totalProduct: totalProduct,
            realRunningTime: realRunningTime
        });
        createNewData(assetName, { date: moment().format('YYYY-MM-DD'), value: oeeObject }, 'day');
    });
}

//OEE week, month, quarter, year
function longPeriodOEE(oeeParamModel, assetName, type) {
    //var planningModel;
    var oeeModel;
    var plannedWorkingTime = 0, productiveTime = 0, realRunningTime = 0, goodProduct = 0, totalProduct = 0;
    //var oeeObject;
    var startTime;
    var stopTime = moment().add(1,'days').format('YYYY-MM-DD');

    switch (type) {
        case 'week': {
            startTime = moment().startOf('isoWeek').format('YYYY-MM-DD');
            break;
        }
        case 'month': {
            startTime = moment().startOf('month').format('YYYY-MM-DD');
            break;
        }
        case 'quarter': {
            startTime = moment().startOf('quarter').format('YYYY-MM-DD');
            break;
        }
        case 'year': {
            startTime = moment().startOf('year').format('YYYY-MM-DD');
            break;
        }
    }

    // if (assetName == 'testAndPackingAsset') planningModel = planning.tePaPlanningModel;
    // else planningModel = planning.punchingPlanningModel;

    if (assetName == 'testAndPackingAsset') oeeModel = tePaOeeModel;
    else oeeModel = punchingOeeModel;

    async.series([
        function (_callback) {
            oeeParamModel.find({ date: { $gte: startTime, $lte: stopTime } }, function (err, result) {
                if (err) console.log(err);
                else if (result.length > 0) {
                    console.log(result);
                    for (var i = 0; i < result.length; i++) {
                        plannedWorkingTime += result[i].plannedWorkingTime;
                        productiveTime += result[i].productiveTime;
                        realRunningTime += result[i].realRunningTime;
                        goodProduct += result[i].goodProduct;
                        totalProduct += result[i].goodProduct + result[i].failProduct;
                    }
                }
                _callback();
            });
        },
        function (_callback) {

            //Calculate OEE
            var oeeObject = calculateOEE({
                plannedWorkingTime: plannedWorkingTime,
                productiveTime: productiveTime,
                goodProduct: goodProduct,
                totalProduct: totalProduct,
                realRunningTime: realRunningTime
            });

            //Update mongo
            var _time;
            switch (type) {
                case 'week': {
                    _time = moment().format(moment.HTML5_FMT.WEEK);
                    break;
                }
                case 'month': {
                    _time = moment().format('YYYY-MM');
                    break;
                }
                case 'quarter': {
                    _time = moment().format('YYYY qQ');
                    break;
                }
                case 'year': {
                    _time = moment().format('YYYY');
                    break;
                }
            }

            oeeModel.findOne({ type: type, date: _time }, function (err, result) {
                if (err) console.log(err);
                else {
                    if (result) {
                        result.oee = oeeObject.oee;
                        result.availability = oeeObject.availability;
                        result.performance = oeeObject.performance;
                        result.quality = oeeObject.quality;
                        result.timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
                        result.save();
                        console.log('Updated data');
                    } else {
                        createNewData(assetName, { date: _time, value: oeeObject }, type);
                    }
                }
                _callback();
            })


            // planning.getPlanningPeriod(type, planningModel, assetName, function (planningObject) {
            //     console.log(planningObject);
            //     oeeObject = calculateOEE({
            //         isOutput: isOutput,
            //         realtimeMachine: realtimeMachine,
            //         plannedTimeMachine: planningObject.data.workTime,
            //         goodProduct: goodProduct,
            //         totalProduct: totalProduct
            //     });
            //     var _time;
            //     switch (type) {
            //         case 'week': {
            //             _time = moment().format(moment.HTML5_FMT.WEEK);
            //             break;
            //         }
            //         case 'month': {
            //             _time = moment().format('YYYY-MM');
            //             break;
            //         }
            //         case 'quarter': {
            //             _time = moment().format('YYYY qQ');
            //             break;
            //         }
            //         case 'year': {
            //             _time = moment().format('YYYY');
            //             break;
            //         }
            //     }
            //     oeeModel.findOne({ type: type, date: _time }, function (err, result) {
            //         if (err) console.log(err);
            //         else {
            //             if (result) {
            //                 result.oee = oeeObject.oee;
            //                 result.availability = oeeObject.availability;
            //                 result.performance = oeeObject.performance;
            //                 result.quality = oeeObject.quality;
            //                 result.timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
            //                 result.save();
            //                 console.log('Updated data');
            //             } else {
            //                 createNewData(assetName, { date: _time, value: oeeObject }, type);
            //             }
            //         }
            //         _callback();
            //     })
            // });
        }
    ])


}



module.exports.tePaModel = tePaOeeModel;
module.exports.punchingModel = punchingOeeModel;
module.exports.tePaOeeParamModel = tePaOeeParamModel;
module.exports.punchingOeeParamModel = punchingOeeParamModel;
module.exports.createNewData = createNewData;
module.exports.createOeeParam = createOeeParam;
module.exports.getToday = getToday;
module.exports.getWeek = getWeek;
module.exports.getMonth = getMonth;
module.exports.getQuarter = getQuarter;
module.exports.getYear = getYear;
module.exports.getData = getData;
module.exports.calculateOEE = calculateOEE;

module.exports.todayOEE = todayOEE;
module.exports.longPeriodOEE = longPeriodOEE;