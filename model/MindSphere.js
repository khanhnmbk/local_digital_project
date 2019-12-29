var request = require("request");
var moment = require('moment');

function getToken(clientID, clientCredential, bodyObject, callback) {
    var xSpaceAuthKey = 'Basic ' + Buffer.from(clientID + ':' + clientCredential).toString('base64');

    var options = {
        method: 'POST',
        url: 'https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token',
        headers:
        {
            'cache-control': 'no-cache',
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-SPACE-AUTH-KEY': xSpaceAuthKey,
        },
        body: bodyObject,
        json: true
    };

    request(options, function (error, response, body) {
        if (error) console.log(error);
        else callback(body.access_token);
    });
}


function getUsers(token, callback) {
    var options = {
        method: 'GET',
        url: 'https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users',
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        json: true
    };
    request(options, function (error, response, body) {
        if (error) console.log(error);
        else callback(body)
    });
}

function getAssetId(token, assetName, callback) {
    var options = {
        method: 'GET',
        url: 'https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets',
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: 'Bearer ' + token,
            Accept: 'application/hal+json',
            'Content-Type': 'application/hal+json'
        }
    };
    request(options, function (error, response, body) {
        var _id = null;
        if (error) console.log(error);
        if (JSON.parse(body)._embedded) {
            var _arrAssets = JSON.parse(body)._embedded.assets;
            if (_arrAssets) {
                for (var _asset of _arrAssets) {
                    if (_asset.name == assetName) {
                        _id = _asset.assetId
                        //callback(_id);
                        break;
                    }
                }
            }
        }
        callback(_id);
    });
}

function getLatestData_old(token, assetId, aspectName, callback) {
    var options = {
        method: 'GET',
        url: 'https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/' + assetId + '/' + aspectName,
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        json: true
    };
    request(options, function (error, response, body) {
        if (error) console.log(error);
        else callback(body[0])
    });
}

function getLatestData(token, assetId, aspectName, callback) {
    var latestTime;
    var returnObject = {};
    getLatestData_old(token, assetId, aspectName, function(data) {
        if (data) {
            latestTime = data._time;
            var preTime = moment(latestTime).subtract(10,'seconds').toISOString();
            getTimeSeriesDataFromTime(token, assetId, aspectName, preTime, latestTime, function(arrData) {
                if (arrData.length > 0) {
                    //returnObject = arrData[arrData.length - 1];
                    for (var i = arrData.length - 1; i >= 0; i--) {
                        for (var item in arrData[i]) {
                            if (!returnObject.hasOwnProperty(item)) returnObject[item] = arrData[i][item];
                        }
                    }
                    callback(returnObject);
                }
            })
        } 

    });
}

function getTimeSeriesDataFromTime(token, assetId, aspectName, startTime, stopTime, callback) {
    var options = {
        method: 'GET',
        url: 'https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/' + assetId + '/' + aspectName + '?from=' + startTime +  '&to=' + stopTime + '&limit=10',
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        json: true
    };
    request(options, function (error, response, body) {
        if (error) console.log(error);
        else callback(body)
    });
}

function putData(token, assetId, aspectName, data, callback) {
    var options = {
        method: 'PUT',
        url: 'https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/' + assetId + '/' + aspectName,
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: 'Bearer ' + token ,
            'Content-Type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error);
            callback(false);
        }
        else callback(true);
    });
}


function getCtrlData(token, assetId, aspectName, callback) {
    var options = {
        method: 'GET',
        url: 'https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/' + assetId + '/' + aspectName,
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: {},
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        callback(body)
    });

}


module.exports.getToken = getToken;
module.exports.getUsers = getUsers;
module.exports.getAssetId = getAssetId;
module.exports.getLatestData = getLatestData;
module.exports.getTimeSeriesDataFromTime = getTimeSeriesDataFromTime;
module.exports.putData = putData;
module.exports.getCtrlData = getCtrlData;