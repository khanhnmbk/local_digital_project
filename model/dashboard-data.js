var moment = require('moment');
var mongoose = require('mongoose');
var mindsphere = require('./MindSphere');
var async = require('async');

var Schema = mongoose.Schema;
mongoose.Promise = global.Promise; //Error if not declared



var testAndPackingAssetSchema = new Schema({
    name: String,
    value: Number,
    unit: String,
    timestamp: String,
}, { collection: 'test-and-packing-dashboard' });

var punchingAssetSchema = new Schema({
    name: String,
    value: Number,
    unit: String,
    timestamp: String,
}, { collection: 'punching-dashboard' });

var testAndPackingAssetModel = mongoose.model('test-and-packing', testAndPackingAssetSchema);
var punchingAssetModel = mongoose.model('pungching', punchingAssetSchema);

//Write new dashboard data to Mongo
function createNewData(mongooseModel) {
    mongooseModel.save();
    console.log('Write to mongo successfully');
}

function getData(testAndPackingModel, punchingModel, callback) {
    var dataSchema = {
        testAndPackingAsset: {
            today: {
                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentWeek: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentMonth: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentQuarter: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentYear: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },
        },
        punchingAsset: {
            today: {
                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentWeek: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentMonth: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentQuarter: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentYear: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },
        }
    }


    var testAndPackingAsset_today = '', testAndPackingAsset_currentWeek = '', testAndPackingAsset_currentMonth = '',
        testAndPackingAsset_currentQuarter = '', testAndPackingAsset_currentYear = '',
        punchingAsset_today = '', punchingAsset_currentWeek = '', punchingAsset_currentMonth = '',
        punchingAsset_currentQuarter = '', punchingAsset_currentYear = '';

    async.parallel([
        //TEST AND PACKING ASSET
        function (callback_) {
            getToday(testAndPackingModel, 'testAndPackingAsset', dataSchema, function (data) {
                testAndPackingAsset_today = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
        function (callback_) {
            getWeek(testAndPackingModel, 'testAndPackingAsset', dataSchema, function (data) {
                testAndPackingAsset_currentWeek = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
        function (callback_) {
            getMonth(moment().format('YYYY-MM'), testAndPackingModel, 'testAndPackingAsset', dataSchema, function (data) {
                testAndPackingAsset_currentMonth = JSON.stringify(data, null, 4);
                callback_();
            });
        },
        function (callback_) {
            getQuarter(testAndPackingAssetModel, 'testAndPackingAsset', dataSchema, function (data) {
                testAndPackingAsset_currentQuarter = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
        function (callback_) {
            getYear(testAndPackingModel, 'testAndPackingAsset', dataSchema, function (data) {
                testAndPackingAsset_currentYear = JSON.stringify(data, null, 4);;
                callback_();
            });
        },

        //PUNCHING
        function (callback_) {
            getToday(punchingModel, 'punchingAsset', dataSchema, function (data) {
                punchingAsset_today = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
        function (callback_) {
            getWeek(punchingModel, 'punchingAsset', dataSchema, function (data) {
                punchingAsset_currentWeek = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
        function (callback_) {
            getMonth(moment().format('YYYY-MM'), punchingModel, 'punchingAsset', dataSchema, function (data) {
                punchingAsset_currentMonth = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
        function (callback_) {
            getQuarter(punchingModel, 'punchingAsset', dataSchema, function (data) {
                punchingAsset_currentQuarter = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
        function (callback_) {
            getYear(punchingModel, 'punchingAsset', dataSchema, function (data) {
                punchingAsset_currentYear = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
    ], function (err, result) {
        if (err) console.log(err);
        else {
            var returnData = {
                testAndPackingAsset: {
                    today: JSON.parse(testAndPackingAsset_today),
                    currentWeek: JSON.parse(testAndPackingAsset_currentWeek),
                    currentMonth: JSON.parse(testAndPackingAsset_currentMonth),
                    currentQuarter: JSON.parse(testAndPackingAsset_currentQuarter),
                    currentYear: JSON.parse(testAndPackingAsset_currentYear),
                },
                punchingAsset: {
                    today: JSON.parse(punchingAsset_today),
                    currentWeek: JSON.parse(punchingAsset_currentWeek),
                    currentMonth: JSON.parse(punchingAsset_currentMonth),
                    currentQuarter: JSON.parse(punchingAsset_currentQuarter),
                    currentYear: JSON.parse(punchingAsset_currentYear),
                }
            }
            callback(returnData);
        }

    });
}

//Return today object. REMOVE SUBSTRACT WHEN REAL
function getToday(mongoModel, assetName, _dataSchema, callback) {
    var today = moment().format('YYYY-MM-DD');
    mongoModel.find({
        'timestamp': {
            $gte: today,
            $lt: moment(today).add(1, 'days').format('YYYY-MM-DD'),
        }
    }, function (err, data) {
        if (err) console.log(err);
        else {
            for (var i = 0; i < data.length; i++) {
                switch (data[i].name) {
                    case 'cabinetTemp': {
                        _dataSchema[assetName].today.cabinetTemp.label.push(moment(data[i].timestamp).format('HH:mm'));
                        _dataSchema[assetName].today.cabinetTemp.data.push(data[i].value);
                        break;
                    }
                    case 'cabinetHumidity': {
                        _dataSchema[assetName].today.cabinetHumidity.label.push(moment(data[i].timestamp).format('HH:mm'));
                        _dataSchema[assetName].today.cabinetHumidity.data.push(data[i].value);
                        break;
                    }
                    case 'oilPressure': {
                        _dataSchema[assetName].today.oilPressure.label.push(moment(data[i].timestamp).format('HH:mm'));
                        _dataSchema[assetName].today.oilPressure.data.push(data[i].value);
                        break;
                    }
                    case 'oilTemp': {
                        _dataSchema[assetName].today.oilTemp.label.push(moment(data[i].timestamp).format('HH:mm'));
                        _dataSchema[assetName].today.oilTemp.data.push(data[i].value);
                        break;
                    }
                    case 'oilLevel': {
                        _dataSchema[assetName].today.oilLevel.label.push(moment(data[i].timestamp).format('HH:mm'));
                        _dataSchema[assetName].today.oilLevel.data.push(data[i].value);
                        break;
                    }
                }
            }
            callback(_dataSchema[assetName].today);
        }
    });
}

//Return current week object
function getWeek(mongoModel, assetName, _dataSchema, callback) {
    var startWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
    var endWeek = moment().endOf('isoWeek').add(1,'days').format('YYYY-MM-DD');

    console.log('Start of week: ' , startWeek);
    console.log('End of week: ', endWeek);

    var _arrWeek = [];
    for (var i = 0; i < 7; i++) {
        _arrWeek.push(moment().startOf('isoWeek').add(i, 'days').format('YYYY-MM-DD'));
    }

    console.log('Array of week: ');
    console.log(_arrWeek);


    mongoModel.find({
        'timestamp': {
            $gte: startWeek,
            $lt: endWeek
        }
    }, function (err, data) {
        
        console.log(data);

        if (err) console.log(err);
        else {
            var arrCabinetTemp = {
                label: [],
                data: []
            };


            var arrCabinetHumidity = {
                label: [],
                data: []
            };

            var arroilPressure = {
                label: [],
                data: []
            };

            var arrOilTemp = {
                label: [],
                data: []
            };

            var arrOilLevel = {
                label: [],
                data: []
            };
            var arrProductCounter = {
                label : [],
                data : []
            }

            for (var i = 0; i < data.length; i++) {
                var _date = moment(data[i].timestamp).format('YYYY-MM-DD HH:mm:ss');
                if (assetName == 'testAndPackingAsset') {
                    switch (data[i].name) {
                        case 'productCounter': {
                            var _date1 = moment(_date).format('YYYY-MM-DD');
                            if (arrProductCounter.label.includes(_date1)) { //Date existing
                                if (data[i].value > arrProductCounter.data[arrProductCounter.label.indexOf(_date1)]) {
                                    arrProductCounter.data[arrProductCounter.label.indexOf(_date1)] = data[i].value;
                                }
                            } else { //Date not existing
                                arrProductCounter.label.push(_date1);
                                arrProductCounter.data.push(data[i].value);
                            }
                            break;
                        }

                        case 'cabinetTemp': {
                            arrCabinetTemp.label.push(_date);
                            arrCabinetTemp.data.push(data[i].value);
                            break;
                        }

                        case 'cabinetHumidity': {
                            arrCabinetHumidity.label.push(_date);
                            arrCabinetHumidity.data.push(data[i].value);
                            break;
                        }
                    }
                } else {
                    switch (data[i].name) {
                        case 'productCounter': {
                            var _date1 = moment(_date).format('YYYY-MM-DD');
                            if (arrProductCounter.label.includes(_date1)) { //Date existing
                                if (data[i].value > arrProductCounter.data[arrProductCounter.label.indexOf(_date1)]) {
                                    arrProductCounter.data[arrProductCounter.label.indexOf(_date1)] = data[i].value;
                                }
                            } else { //Date not existing
                                arrProductCounter.label.push(_date1);
                                arrProductCounter.data.push(data[i].value);
                            }
                            break;
                        }

                        case 'cabinetTemp': {
                            arrCabinetTemp.label.push(_date);
                            arrCabinetTemp.data.push(data[i].value);
                            break;
                        }

                        case 'cabinetHumidity': {
                            arrCabinetHumidity.label.push(_date);
                            arrCabinetHumidity.data.push(data[i].value);
                            break;
                        }
                        case 'oilPressure': {
                            arroilPressure.label.push(_date);
                            arroilPressure.data.push(data[i].value);
                            break;
                        }
                        case 'oilTemp': {
                            arrOilTemp.label.push(_date);
                            arrOilTemp.data.push(data[i].value);
                            break;
                        }
                        case 'oilLevel': {
                            arrOilLevel.label.push(_date);
                            arrOilLevel.data.push(data[i].value);
                            break;
                        }
                    }
                }
            }

            console.log(arrProductCounter.data);

            _dataSchema[assetName].currentWeek.productCounter.label = arrProductCounter.label;
            _dataSchema[assetName].currentWeek.productCounter.data = arrProductCounter.data;

            _dataSchema[assetName].currentWeek.cabinetTemp.label = arrCabinetTemp.label;
            _dataSchema[assetName].currentWeek.cabinetTemp.data = arrCabinetTemp.data;

            _dataSchema[assetName].currentWeek.cabinetHumidity.label = arrCabinetHumidity.label;
            _dataSchema[assetName].currentWeek.cabinetHumidity.data = arrCabinetHumidity.data;

            if (assetName == 'punchingAsset') {
                _dataSchema[assetName].currentWeek.oilPressure.label = arroilPressure.label;
                _dataSchema[assetName].currentWeek.oilPressure.data = arroilPressure.data;

                _dataSchema[assetName].currentWeek.oilTemp.label = arrOilTemp.label;
                _dataSchema[assetName].currentWeek.oilTemp.data = arrOilTemp.data;

                _dataSchema[assetName].currentWeek.oilLevel.label = arrOilLevel.label;
                _dataSchema[assetName].currentWeek.oilLevel.data = arrOilLevel.data;
            }
        }
        callback(_dataSchema[assetName].currentWeek);
    });
}

//Return  month object
function getMonth(month, mongoModel, assetName, _dataSchema, callback) {
    var startMonth = moment(month).startOf('month').format('YYYY-MM-DD');
    var endMonth = moment(month).endOf('month').add(1, 'days').format('YYYY-MM-DD');

    mongoModel.find({
        'timestamp': {
            $gte: startMonth,
            $lt: endMonth,
        }
    }, function (err, data) {
        if (err) console.log(err);
        else {
            var arrCabinetTemp = {
                label: [],
                data: []
            };

            var arrCabinetHumidity = {
                label: [],
                data: []
            };

            var arroilPressure = {
                label: [],
                data: []
            };

            var arrOilTemp = {
                label: [],
                data: []
            };

            var arrOilLevel = {
                label: [],
                data: []
            };

            var arrProductCounter = {
                label : [],
                data : []
            }

            for (var i = 0; i < data.length; i++) {
                var _date = moment(data[i].timestamp).format('YYYY-MM-DD HH:mm:ss');

                if (assetName == 'testAndPackingAsset') {
                    switch (data[i].name) {
                        case 'productCounter': {
                            var _date1 = moment(_date).format('YYYY-MM-DD');
                            if (arrProductCounter.label.includes(_date1)) { //Date existing, only get the latest (largest) data
                                if (data[i].value > arrProductCounter.data[arrProductCounter.label.indexOf(_date1)]) {
                                    arrProductCounter.data[arrProductCounter.label.indexOf(_date1)] = data[i].value;
                                }
                            } else { //Date not existing
                                arrProductCounter.label.push(_date1);
                                arrProductCounter.data.push(data[i].value);
                            }
                            break;
                        }

                        case 'cabinetTemp': {
                            arrCabinetTemp.label.push(_date);
                            arrCabinetTemp.data.push(data[i].value);
                            break;
                        }

                        case 'cabinetHumidity': {
                            arrCabinetHumidity.label.push(_date);
                            arrCabinetHumidity.data.push(data[i].value);
                            break;
                        }
                    }
                } else { //Punching asset
                    switch (data[i].name) {
                        case 'productCounter': {
                            var _date1 = moment(_date).format('YYYY-MM-DD');
                            if (arrProductCounter.label.includes(_date1)) { //Date existing, only get the latest (largest) data
                                if (data[i].value > arrProductCounter.data[arrProductCounter.label.indexOf(_date1)]) {
                                    arrProductCounter.data[arrProductCounter.label.indexOf(_date1)] = data[i].value;
                                }
                            } else { //Date not existing
                                arrProductCounter.label.push(_date1);
                                arrProductCounter.data.push(data[i].value);
                            }
                            break;
                        }

                        case 'cabinetTemp': {
                            arrCabinetTemp.label.push(_date);
                            arrCabinetTemp.data.push(data[i].value);
                            break;
                        }

                        case 'cabinetHumidity': {
                            arrCabinetHumidity.label.push(_date);
                            arrCabinetHumidity.data.push(data[i].value);
                            break;
                        }
                        case 'oilPressure': {
                            arroilPressure.label.push(_date);
                            arroilPressure.data.push(data[i].value);
                            break;
                        }
                        case 'oilTemp': {
                            arrOilTemp.label.push(_date);
                            arrOilTemp.data.push(data[i].value);
                            break;
                        }
                        case 'oilLevel': {
                            arrOilLevel.label.push(_date);
                            arrOilLevel.data.push(data[i].value);
                            break;
                        }
                    }
                }


            }

            _dataSchema[assetName].currentMonth.productCounter.label = arrProductCounter.label;
            _dataSchema[assetName].currentMonth.productCounter.data = arrProductCounter.data;

            _dataSchema[assetName].currentMonth.cabinetTemp.label = arrCabinetTemp.label;
            _dataSchema[assetName].currentMonth.cabinetTemp.data = arrCabinetTemp.data;


            _dataSchema[assetName].currentMonth.cabinetHumidity.label = arrCabinetHumidity.label;
            _dataSchema[assetName].currentMonth.cabinetHumidity.data = arrCabinetHumidity.data;

            if (assetName == 'punchingAsset') {
                _dataSchema[assetName].currentMonth.oilPressure.label = arroilPressure.label;
                _dataSchema[assetName].currentMonth.oilPressure.data = arroilPressure.data;

                _dataSchema[assetName].currentMonth.oilTemp.label = arrOilTemp.label;
                _dataSchema[assetName].currentMonth.oilTemp.data = arrOilTemp.data;

                _dataSchema[assetName].currentMonth.oilLevel.label = arrOilLevel.label;
                _dataSchema[assetName].currentMonth.oilLevel.data = arrOilLevel.data;
            }
        }
        callback(_dataSchema[assetName].currentMonth);
    });
}

//Return quarter object
function getQuarter( mongoModel, assetName, _dataSchema, callback) {
    var startQuarter = moment().startOf('quarter').format('YYYY-MM-DD');
    var endQuarter = moment().endOf('quarter').add(1, 'days').format('YYYY-MM-DD');

    mongoModel.find({
        'timestamp': {
            $gte: startQuarter,
            $lt: endQuarter,
        }
    }, function (err, data) {
        if (err) console.log(err);
        else {
            var arrCabinetTemp = {
                label: [],
                data: []
            };

            var arrCabinetHumidity = {
                label: [],
                data: []
            };

            var arroilPressure = {
                label: [],
                data: []
            };

            var arrOilTemp = {
                label: [],
                data: []
            };

            var arrOilLevel = {
                label: [],
                data: []
            };

            var arrProductCounter = {
                label : [],
                data : []
            }

            for (var i = 0; i < data.length; i++) {
                var _date = moment(data[i].timestamp).format('YYYY-MM-DD HH:mm:ss');

                if (assetName == 'testAndPackingAsset') {
                    switch (data[i].name) {
                        case 'productCounter': {
                            var _date1 = moment(_date).format('YYYY-MM-DD');
                            if (arrProductCounter.label.includes(_date1)) { //Date existing, only get the latest (largest) data
                                if (data[i].value > arrProductCounter.data[arrProductCounter.label.indexOf(_date1)]) {
                                    arrProductCounter.data[arrProductCounter.label.indexOf(_date1)] = data[i].value;
                                }
                            } else { //Date not existing
                                arrProductCounter.label.push(_date1);
                                arrProductCounter.data.push(data[i].value);
                            }
                            break;
                        }

                        case 'cabinetTemp': {
                            if (arrCabinetTemp.label.length < 1000) {
                                arrCabinetTemp.label.push(_date);
                                arrCabinetTemp.data.push(data[i].value);
                            }
                            break;
                        }

                        case 'cabinetHumidity': {
                            if (arrCabinetHumidity.label.length < 1000) {
                                arrCabinetHumidity.label.push(_date);
                                arrCabinetHumidity.data.push(data[i].value);
                            }
                            break;
                        }
                    }
                } else { //Punching asset
                    switch (data[i].name) {
                        case 'productCounter': {
                            var _date1 = moment(_date).format('YYYY-MM-DD');
                            if (arrProductCounter.label.includes(_date1)) { //Date existing, only get the latest (largest) data
                                if (data[i].value > arrProductCounter.data[arrProductCounter.label.indexOf(_date1)]) {
                                    arrProductCounter.data[arrProductCounter.label.indexOf(_date1)] = data[i].value;
                                }
                            } else { //Date not existing
                                arrProductCounter.label.push(_date1);
                                arrProductCounter.data.push(data[i].value);
                            }
                            break;
                        }

                        case 'cabinetTemp': {
                            if (arrCabinetTemp.label.length < 1000) {
                                arrCabinetTemp.label.push(_date);
                                arrCabinetTemp.data.push(data[i].value);
                            }
                            break;
                        }

                        case 'cabinetHumidity': {
                            if (arrCabinetHumidity.label.length < 1000) {
                                arrCabinetHumidity.label.push(_date);
                                arrCabinetHumidity.data.push(data[i].value);
                            }
                            break;
                        }
                        case 'oilPressure': {
                            if (arroilPressure.label.length < 1000) {
                                arroilPressure.label.push(_date);
                                arroilPressure.data.push(data[i].value);
                            }
                            break;
                        }
                        case 'oilTemp': {
                            if (arrOilTemp.label.length < 1000) {
                                arrOilTemp.label.push(_date);
                                arrOilTemp.data.push(data[i].value);
                            }
                            break;
                        }
                        case 'oilLevel': {
                            if (arrOilLevel.label.length < 1000) {
                                arrOilLevel.label.push(_date);
                                arrOilLevel.data.push(data[i].value);
                            }
                            break;
                        }
                    }
                }


            }

            _dataSchema[assetName].currentQuarter.productCounter.label = arrProductCounter.label;
            _dataSchema[assetName].currentQuarter.productCounter.data = arrProductCounter.data;

            _dataSchema[assetName].currentQuarter.cabinetTemp.label = arrCabinetTemp.label;
            _dataSchema[assetName].currentQuarter.cabinetTemp.data = arrCabinetTemp.data;


            _dataSchema[assetName].currentQuarter.cabinetHumidity.label = arrCabinetHumidity.label;
            _dataSchema[assetName].currentQuarter.cabinetHumidity.data = arrCabinetHumidity.data;

            if (assetName == 'punchingAsset') {
                _dataSchema[assetName].currentQuarter.oilPressure.label = arroilPressure.label;
                _dataSchema[assetName].currentQuarter.oilPressure.data = arroilPressure.data;

                _dataSchema[assetName].currentQuarter.oilTemp.label = arrOilTemp.label;
                _dataSchema[assetName].currentQuarter.oilTemp.data = arrOilTemp.data;

                _dataSchema[assetName].currentQuarter.oilLevel.label = arrOilLevel.label;
                _dataSchema[assetName].currentQuarter.oilLevel.data = arrOilLevel.data;
            }
        }
        callback(_dataSchema[assetName].currentQuarter);
    });
}

//Return year object
function getYear( mongoModel, assetName, _dataSchema, callback) {
    var startYear = moment().startOf('year').format('YYYY-MM-DD');
    var endYear = moment().endOf('year').format('YYYY-MM-DD');

    mongoModel.find({
        'timestamp': {
            $gte: startYear,
            $lt: endYear,
        }
    }, function (err, data) {
        if (err) console.log(err);
        else {
            var arrCabinetTemp = {
                label: [],
                data: []
            };

            var arrCabinetHumidity = {
                label: [],
                data: []
            };

            var arroilPressure = {
                label: [],
                data: []
            };

            var arrOilTemp = {
                label: [],
                data: []
            };

            var arrOilLevel = {
                label: [],
                data: []
            };

            var arrProductCounter = {
                label : [],
                data : []
            }

            for (var i = 0; i < data.length; i++) {
                var _date = moment(data[i].timestamp).format('YYYY-MM-DD HH:mm:ss');

                if (assetName == 'testAndPackingAsset') {
                    switch (data[i].name) {
                        case 'productCounter': {
                            var _date1 = moment(_date).format('YYYY-MM-DD');
                            if (arrProductCounter.label.includes(_date1)) { //Date existing, only get the latest (largest) data
                                if (data[i].value > arrProductCounter.data[arrProductCounter.label.indexOf(_date1)]) {
                                    arrProductCounter.data[arrProductCounter.label.indexOf(_date1)] = data[i].value;
                                }
                            } else { //Date not existing
                                arrProductCounter.label.push(_date1);
                                arrProductCounter.data.push(data[i].value);
                            }
                            break;
                        }

                        case 'cabinetTemp': {
                            if (arrCabinetTemp.label.length < 1000) {
                                arrCabinetTemp.label.push(_date);
                                arrCabinetTemp.data.push(data[i].value);
                            }
                            break;
                        }

                        case 'cabinetHumidity': {
                            if (arrCabinetHumidity.label.length < 1000) {
                                arrCabinetHumidity.label.push(_date);
                                arrCabinetHumidity.data.push(data[i].value);
                            }
                            break;
                        }
                    }
                } else { //Punching asset
                    switch (data[i].name) {
                        case 'productCounter': {
                            var _date1 = moment(_date).format('YYYY-MM-DD');
                            if (arrProductCounter.label.includes(_date1)) { //Date existing, only get the latest (largest) data
                                if (data[i].value > arrProductCounter.data[arrProductCounter.label.indexOf(_date1)]) {
                                    arrProductCounter.data[arrProductCounter.label.indexOf(_date1)] = data[i].value;
                                }
                            } else { //Date not existing
                                arrProductCounter.label.push(_date1);
                                arrProductCounter.data.push(data[i].value);
                            }
                            break;
                        }
                        
                        case 'cabinetTemp': {
                            if (arrCabinetTemp.label.length < 1000) {
                                arrCabinetTemp.label.push(_date);
                                arrCabinetTemp.data.push(data[i].value);
                            }
                            break;
                        }

                        case 'cabinetHumidity': {
                            if (arrCabinetHumidity.label.length < 1000) {
                                arrCabinetHumidity.label.push(_date);
                                arrCabinetHumidity.data.push(data[i].value);
                            }
                            break;
                        }
                        case 'oilPressure': {
                            if (arroilPressure.label.length < 1000) {
                                arroilPressure.label.push(_date);
                                arroilPressure.data.push(data[i].value);
                            }
                            break;
                        }
                        case 'oilTemp': {
                            if (arrOilTemp.label.length < 1000) {
                                arrOilTemp.label.push(_date);
                                arrOilTemp.data.push(data[i].value);
                            }
                            break;
                        }
                        case 'oilLevel': {
                            if (arrOilLevel.label.length < 1000) {
                                arrOilLevel.label.push(_date);
                                arrOilLevel.data.push(data[i].value);
                            }
                            break;
                        }
                    }
                }


            }

            _dataSchema[assetName].currentYear.productCounter.label = arrProductCounter.label;
            _dataSchema[assetName].currentYear.productCounter.data = arrProductCounter.data;

            _dataSchema[assetName].currentYear.cabinetTemp.label = arrCabinetTemp.label;
            _dataSchema[assetName].currentYear.cabinetTemp.data = arrCabinetTemp.data;


            _dataSchema[assetName].currentYear.cabinetHumidity.label = arrCabinetHumidity.label;
            _dataSchema[assetName].currentYear.cabinetHumidity.data = arrCabinetHumidity.data;

            if (assetName == 'punchingAsset') {
                _dataSchema[assetName].currentYear.oilPressure.label = arroilPressure.label;
                _dataSchema[assetName].currentYear.oilPressure.data = arroilPressure.data;

                _dataSchema[assetName].currentYear.oilTemp.label = arrOilTemp.label;
                _dataSchema[assetName].currentYear.oilTemp.data = arrOilTemp.data;

                _dataSchema[assetName].currentYear.oilLevel.label = arrOilLevel.label;
                _dataSchema[assetName].currentYear.oilLevel.data = arrOilLevel.data;
            }
        }
        callback(_dataSchema[assetName].currentYear);
    });
}


//Return quarter object AVERAGE version
// function getQuarter(mongoModel, assetName, _dataSchema, _callback) {
//     var startMonth = moment().startOf('quarter').format('YYYY-MM');
//     var middleMonth = moment(startMonth).add(1, 'months').format('YYYY-MM');
//     var endMonth = moment().endOf('quarter').format('YYYY-MM');

//     var _label = [startMonth, middleMonth, endMonth];

//     var cabinetTemp = {
//         label: _label,
//         data: []
//     };

//     var cabinetHumidity = {
//         label: _label,
//         data: []
//     }
//     var oilPressure = {
//         label: _label,
//         data: []
//     }
//     var oilTemp = {
//         label: _label,
//         data: []
//     }
//     var oilLevel = {
//         label: _label,
//         data: []
//     }


//     async.series([
//         //Start month
//         function (callback) {
//             getMonth(startMonth, mongoModel, assetName, _dataSchema, function (_data) {
//                 for (var _variable in _data) {

//                     if (assetName == 'testAndPackingAsset') {
//                         switch (_variable) {
//                             case 'cabinetTemp': {
//                                 cabinetTemp.data.push(average(_data[_variable].data));
//                                 break;
//                             }

//                             case 'cabinetHumidity': {
//                                 cabinetHumidity.data.push(average(_data[_variable].data));
//                                 break;
//                             }
//                         }
//                     } else {
//                         switch (_variable) {
//                             case 'cabinetTemp': {
//                                 cabinetTemp.data.push(average(_data[_variable].data));
//                                 break;
//                             }

//                             case 'cabinetHumidity': {
//                                 cabinetHumidity.data.push(average(_data[_variable].data));
//                                 break;
//                             }
//                             case 'oilPressure': {
//                                 oilPressure.data.push(average(_data[_variable].data));
//                                 break;
//                             }
//                             case 'oilTemp': {
//                                 oilTemp.data.push(average(_data[_variable].data));
//                                 break;
//                             }
//                             case 'oilLevel': {
//                                 oilLevel.data.push(average(_data[_variable].data));
//                                 break;
//                             }
//                         }
//                     }


//                 }
//                 callback();
//             });
//         },
//         //Middle month
//         function (callback) {
//             getMonth(middleMonth, mongoModel, assetName, _dataSchema, function (_data) {
//                 for (var _variable in _data) {

//                     if (assetName == 'testAndPackingAsset') {
//                         switch (_variable) {
//                             case 'cabinetTemp': {
//                                 cabinetTemp.data.push(average(_data[_variable].data));
//                                 break;
//                             }

//                             case 'cabinetHumidity': {
//                                 cabinetHumidity.data.push(average(_data[_variable].data));
//                                 break;
//                             }
//                         }
//                     } else {
//                         switch (_variable) {
//                             case 'cabinetTemp': {
//                                 cabinetTemp.data.push(average(_data[_variable].data));
//                                 break;
//                             }

//                             case 'cabinetHumidity': {
//                                 cabinetHumidity.data.push(average(_data[_variable].data));
//                                 break;
//                             }
//                             case 'oilPressure': {
//                                 oilPressure.data.push(average(_data[_variable].data));
//                                 break;
//                             }
//                             case 'oilTemp': {
//                                 oilTemp.data.push(average(_data[_variable].data));
//                                 break;
//                             }
//                             case 'oilLevel': {
//                                 oilLevel.data.push(average(_data[_variable].data));
//                                 break;
//                             }
//                         }
//                     }
//                 }
//                 callback();
//             });

//         },
//         //End month
//         function (callback) {
//             getMonth(endMonth, mongoModel, assetName, _dataSchema, function (_data) {
//                 for (var _variable in _data) {

//                     if (assetName == 'testAndPackingAsset') {
//                         switch (_variable) {
//                             case 'cabinetTemp': {
//                                 cabinetTemp.data.push(average(_data[_variable].data));
//                                 break;
//                             }

//                             case 'cabinetHumidity': {
//                                 cabinetHumidity.data.push(average(_data[_variable].data));
//                                 break;
//                             }
//                         }
//                     } else {
//                         switch (_variable) {
//                             case 'cabinetTemp': {
//                                 cabinetTemp.data.push(average(_data[_variable].data));
//                                 break;
//                             }

//                             case 'cabinetHumidity': {
//                                 cabinetHumidity.data.push(average(_data[_variable].data));
//                                 break;
//                             }
//                             case 'oilPressure': {
//                                 oilPressure.data.push(average(_data[_variable].data));
//                                 break;
//                             }
//                             case 'oilTemp': {
//                                 oilTemp.data.push(average(_data[_variable].data));
//                                 break;
//                             }
//                             case 'oilLevel': {
//                                 oilLevel.data.push(average(_data[_variable].data));
//                                 break;
//                             }
//                         }
//                     }

//                 }
//                 callback();
//             });

//         }
//     ], function (err, result) {
//         if (err) console.log(err);
//         else {
//             if (assetName == 'punchingAsset') _callback({ cabinetTemp, cabinetHumidity, oilPressure, oilTemp, oilLevel })
//             else _callback({ cabinetTemp, cabinetHumidity })
//         }


//     })

//     function average(arrData) {
//         var sum = 0;
//         for (var i = 0; i < arrData.length; i++) {
//             sum += Number(arrData[i]);
//         }
//         return Number((sum / arrData.length)).toFixed(3);
//     }
// }

//Return year object AVERAGE version
// function getYear(mongoModel, assetName, _dataSchema, _callback) {
//     var startMonth = moment().startOf('year').format('YYYY-MM');
//     var currentMonth = moment().format('YYYY-MM');

//     var arrMonth = [];
//     var objValue = {};
//     var objReturn = {};

//     for (var _month = moment(startMonth).format('YYYY-MM');
//         moment(_month) <= moment(currentMonth); _month = moment(_month).add(1, 'months').format('YYYY-MM')) {
//         arrMonth.push(_month);
//     }

//     async.series([
//         function(callback) {
//             for (var i = 0; i < arrMonth.length; i++) {
//                 getMonth(arrMonth[i], mongoModel, assetName, _dataSchema, function (monthObj) {
//                     if(monthObj.cabinetTemp.label.length > 0) {
//                         for (var _variable in monthObj) {
//                             if (!objValue.hasOwnProperty(_variable)) { //Not existing
//                                 objValue[_variable] = [{month : moment(monthObj[_variable].label[0]).format('YYYY-MM'), value : average(monthObj[_variable].data)}];
//                             } else { //Existed variable
//                                 objValue[_variable].push({month : moment(monthObj[_variable].label[0]).format('YYYY-MM'), value: average(monthObj[_variable].data)});
//                             }
//                         }
//                     } else {
//                         for (var _variable in monthObj) {
//                             if (!objValue.hasOwnProperty(_variable)) { //Not existing
//                                 objValue[_variable] = [{month : arrMonth[i], value : 0}];
//                             } else { //Existed variable
//                                 objValue[_variable].push({month : arrMonth[i], value: 0});
//                             }
//                         }
//                     }
//                     if (objValue.cabinetTemp) {
//                         if (objValue.cabinetTemp.length == arrMonth.length) callback();
//                     }
//                 });
//             }
            
//         },
//         function(callback){
//             for (var _item in objValue) { 
//                 objReturn[_item] = {
//                     label : arrMonth,
//                     data : []
//                 }
//             }
//             for (var i = 0; i < arrMonth.length; i++) {
//                 for (var _item in objValue) {

//                     for (var j = 0; j < objValue[_item].length ; j++) {
//                         if (objValue[_item][j].month == arrMonth[i]) {
//                             objReturn[_item].data[i] = objValue[_item][j].value
//                         }
//                     }   
                    
//                 }
//                 if (i == arrMonth.length - 1) {
//                     callback();
//                 }
                
//             }
//         }
//     ], function(err, result) {
//         if (err) console.log(err);
//         else _callback(objReturn);
//     });

   

    

//     // async.series([
//     //     function(callback) {
//     //         var i = 0;
//     //         while (i<arrMonth.length) {
//     //             console.log(i);
//     //             getMonth(arrMonth[i] , mongoModel , assetName , _dataSchema , function(monthObj){
//     //                // console.log(monthObj);
//     //                 for (var _variable in monthObj) {
//     //                     if (!objValue.hasOwnProperty(_variable)) { //Not existing
//     //                         objValue[_variable] = [average(monthObj[_variable].data)];
//     //                     } else { //Existed variable
//     //                         objValue[_variable].push(average(monthObj[_variable].data));
//     //                     }
//     //                 }
//     //                 i++;
//     //             });
//     //         }
//     //         if (i > arrMonth.length) callback();

//     //     }
//     // ], function(err,result) {
//     //     if (err) console.log(err);
//     //     else {
//     //         console.log(objValue)
//     //         if (objValue['cabinetTemp'].length == arrMonth.length) {
//                 // for (var _item in objValue) {
//                 //     objReturn[_item] = {
//                 //         label : arrMonth,
//                 //         data : objValue[_item]
//                 //     }
//                 // }
//     //             _callback(objReturn);
//     //         }
//     //     }
//     // })




//     // while( i < arrMonth.length ) {
//     //     async.series([
//     //         function(callback) {
//     //             getMonth(arrMonth[i] , mongoModel , assetName , _dataSchema , function(monthObj) {
//     //                 i++;
//     //                 for (var _variable in monthObj) {
//     //                     if (!objValue.hasOwnProperty(_variable)) { //Not existing
//     //                         objValue[_variable] = [average(monthObj[_variable].data)];
//     //                     } else { //Existed variable
//     //                         objValue[_variable].push(average(monthObj[_variable].data));
//     //                     }
//     //                 }
//     //                 callback();
//     //             });
//     //         }
//     //     ] , function(err, result) {
//     //         if (err) console.log(err);
//     //         else if (objValue['cabinetTemp'].length == arrMonth.length) {
//     //             for (var _item in objValue) {
//     //                 objReturn[_item] = {
//     //                     label : arrMonth,
//     //                     data : objValue[_item]
//     //                 }
//     //             }
//     //             _callback(objReturn);
//     //         }
//     //     })
//     // };

//     function average(arrData) {
//         var sum = 0;
//         for (var i = 0; i < arrData.length; i++) {
//             sum += Number(arrData[i]);
//         }
//         return Number((sum / arrData.length)).toFixed(3);
//     }




// }


function calAverage(objData) {
    var returnArr = [];
    for (var i = 0; i < objData.value.length; i++) {
        returnArr.push((objData.value[i] / objData.count[i]).toFixed(3));
    }
    return returnArr;
}


function getTodayData(testAndPackingModel, punchingModel, callback) {
    var dataSchema = {
        testAndPackingAsset: {
            today: {
                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentWeek: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentMonth: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentQuarter: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentYear: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },
        },
        punchingAsset: {
            today: {
                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentWeek: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentMonth: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentQuarter: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentYear: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },
        }
    }
    var testAndPackingAsset_today = '', punchingAsset_today = '';
    async.parallel([
        //Test and packing
        function(callback_) {
            getToday(testAndPackingModel, 'testAndPackingAsset', dataSchema, function (data) {
                testAndPackingAsset_today = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
        //Punching
        function (callback_) {
            getToday(punchingModel, 'punchingAsset', dataSchema, function (data) {
                punchingAsset_today = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
    ], function(err, result) {
        if (err) console.log(err);
        else {
            var returnData = {
                testAndPackingAsset: {
                    today: JSON.parse(testAndPackingAsset_today),
                },
                punchingAsset: {
                    today: JSON.parse(punchingAsset_today),
                }
            }
            callback(returnData);
        }
    })
}

function getWeekData(testAndPackingModel, punchingModel, callback) {
    var dataSchema = {
        testAndPackingAsset: {
            today: {
                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentWeek: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentMonth: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentQuarter: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentYear: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },
        },
        punchingAsset: {
            today: {
                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentWeek: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentMonth: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentQuarter: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentYear: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },
        }
    }
    var testAndPackingAsset_currentWeek = '', punchingAsset_currentWeek = '';
    async.parallel([
        //Test and packing
        function(callback_) {
            getWeek(testAndPackingModel, 'testAndPackingAsset', dataSchema, function (data) {
                testAndPackingAsset_currentWeek = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
        //Punching
        function (callback_) {
            getWeek(punchingModel, 'punchingAsset', dataSchema, function (data) {
                punchingAsset_currentWeek = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
    ], function(err, result) {
        if (err) console.log(err);
        else {
            var returnData = {
                testAndPackingAsset: {
                    currentWeek: JSON.parse(testAndPackingAsset_currentWeek),
                },
                punchingAsset: {
                    currentWeek: JSON.parse(punchingAsset_currentWeek),
                }
            }
            callback(returnData);
        }
    })
}

function getMonthData(testAndPackingModel, punchingModel, callback) {
    var dataSchema = {
        testAndPackingAsset: {
            today: {
                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentWeek: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentMonth: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentQuarter: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentYear: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },
        },
        punchingAsset: {
            today: {
                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentWeek: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentMonth: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentQuarter: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentYear: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },
        }
    }
    var testAndPackingAsset_currentMonth = '', punchingAsset_currentMonth = '';
    async.parallel([
        //Test and packing
        function(callback_) {
            getMonth(moment().format('YYYY-MM'), testAndPackingModel, 'testAndPackingAsset', dataSchema, function (data) {
                testAndPackingAsset_currentMonth = JSON.stringify(data, null, 4);
                callback_();
            });
        },
        //Punching
        function (callback_) {
            getMonth(moment().format('YYYY-MM'), punchingModel, 'punchingAsset', dataSchema, function (data) {
                punchingAsset_currentMonth = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
    ], function(err, result) {
        if (err) console.log(err);
        else {
            var returnData = {
                testAndPackingAsset: {
                    currentMonth: JSON.parse(testAndPackingAsset_currentMonth),
                },
                punchingAsset: {
                    currentMonth: JSON.parse(punchingAsset_currentMonth),
                }
            }
            callback(returnData);
        }
    })
}

function getQuarterData(testAndPackingModel, punchingModel, callback) {
    var dataSchema = {
        testAndPackingAsset: {
            today: {
                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentWeek: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentMonth: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentQuarter: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentYear: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },
        },
        punchingAsset: {
            today: {
                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentWeek: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentMonth: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentQuarter: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentYear: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },
        }
    }
    var testAndPackingAsset_currentQuarter = '', punchingAsset_currentQuarter = '';
    async.parallel([
        //Test and packing
        function(callback_) {
            getQuarter(testAndPackingModel, 'testAndPackingAsset', dataSchema, function (data) {
                testAndPackingAsset_currentQuarter = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
        //Punching
        function (callback_) {
            getQuarter(punchingModel, 'punchingAsset', dataSchema, function (data) {
                punchingAsset_currentQuarter = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
    ], function(err, result) {
        if (err) console.log(err);
        else {
            var returnData = {
                testAndPackingAsset: {
                    currentQuarter: JSON.parse(testAndPackingAsset_currentQuarter),
                },
                punchingAsset: {
                    currentQuarter: JSON.parse(punchingAsset_currentQuarter),
                }
            }
            callback(returnData);
        }
    })
}


function getYearData(testAndPackingModel, punchingModel, callback) {
    var dataSchema = {
        testAndPackingAsset: {
            today: {
                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentWeek: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentMonth: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentQuarter: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },

            currentYear: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                }
            },
        },
        punchingAsset: {
            today: {
                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentWeek: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentMonth: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentQuarter: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },

            currentYear: {
                productCounter : {
                    label : [],
                    data : [],
                },

                cabinetTemp: {
                    label: [],
                    data: []
                },

                cabinetHumidity: {
                    label: [],
                    data: []
                },
                oilPressure: {
                    label: [],
                    data: []
                },
                oilTemp: {
                    label: [],
                    data: []
                },
                oilLevel: {
                    label: [],
                    data: []
                },
            },
        }
    }
    var testAndPackingAsset_currentYear = '', punchingAsset_currentYear = '';
    async.parallel([
        //Test and packing
        function(callback_) {
            getYear(testAndPackingModel, 'testAndPackingAsset', dataSchema, function (data) {
                testAndPackingAsset_currentYear = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
        //Punching
        function (callback_) {
            getYear(punchingModel, 'punchingAsset', dataSchema, function (data) {
                punchingAsset_currentYear = JSON.stringify(data, null, 4);;
                callback_();
            });
        },
    ], function(err, result) {
        if (err) console.log(err);
        else {
            var returnData = {
                testAndPackingAsset: {
                    currentYear: JSON.parse(testAndPackingAsset_currentYear),
                },
                punchingAsset: {
                    currentYear: JSON.parse(punchingAsset_currentYear),
                }
            }
            callback(returnData);
        }
    })
}

module.exports.testAndPackingAssetModel = testAndPackingAssetModel;
module.exports.punchingAssetModel = punchingAssetModel;
module.exports.getData = getData;
module.exports.createNewData = createNewData;
module.exports.getTodayData = getTodayData;
module.exports.getWeekData = getWeekData;
module.exports.getMonthData = getMonthData;
module.exports.getQuarterData = getQuarterData;
module.exports.getYearData = getYearData;

// module.exports.getWeek = getWeek;
// module.exports.getMonth= getMonth;
// module.exports.getQuarter = getQuarter;
// module.exports.getYear = getYear;