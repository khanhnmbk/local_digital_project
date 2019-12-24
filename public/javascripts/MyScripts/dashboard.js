//Global variable
let $selectAsset = '1';
let $viewMode = '0';
let socket = io({ transports: ['websocket'] });
let isTodayChartLoaded = false;

let tePa_cabinetTempChart, tePa_cabinetHumidityChart, tePa_productCounter,
    punc_cabinetTempChart, punc_cabinetHumidityChart, punc_oilPressureChart, punc_oilTempChart, punc_oilLevelChart, punc_productCounter;

$(document).ready(function () {

    //Init View
    initView();

    //Request dashboard data on each connection
    socket.emit('/reqDashboard', true);
    socket.on('/resDashboard', function (data, type) {
        console.log(data);
        switch (type) {
            //Load product counter
            case 'product': {
                $('#testAndPackingAsset').find('.productCounter').text(data.testAndPackingAsset);
                $('#punchingAsset').find('.productCounter').text(data.punchingAsset);
                break;
            };
            case 'today': {
                $('.chart').each(function () {
                    var chartViewMode = $(this).closest('.row')[0].classList[3];
                    var xLabel, yLabel, title, barWidth = 0.8, isLine, isStep;

                    if (chartViewMode == 'today') {
                        var chartVariable = this.classList[1];
                        var chartAsset = $(this).closest('.row')[0].parentNode.id;
                        var dataObject = data[chartAsset][chartViewMode][chartVariable];

                        xLabel = 'Hour';
                        switch (chartVariable) {
                            case 'cabinetTemp':
                            case 'oilTemp': {
                                yLabel = 'oC'
                                break;
                            }
                            case 'cabinetHumidity': {
                                yLabel = '%';
                                break;
                            }
                            case 'oilLevel': {
                                yLabel = '';
                                break;
                            }
                            case 'oilPressure': {
                                yLabel = 'BAR';
                                break;
                            }
                            case 'productCounter': {
                                yLabel = 'Products';
                                break;
                            }
                        }
                        title = var2Title(chartVariable, chartViewMode);
                        if (chartVariable == 'productCounter') isLine = false;
                        else isLine = true;

                        if (chartVariable == 'oilLevel') isStep = true;
                        else isStep = false;

                        if (dataObject.data.length < 8) barWidth = dataObject.data.length / 10 - 0.05;

                        var option = {
                            title: title,
                            xLabel: xLabel,
                            yLabel: yLabel,
                            barWidth: barWidth,
                            isLine: isLine,
                            isStep: isStep
                        }

                        loadTodayChart(this, dataObject.label, dataObject.data, option, chartAsset, chartVariable);
                    }
                });
                isTodayChartLoaded = true;
                break;
            };
            case 'week': {
                $('.chart').each(function () {
                    var chartViewMode = $(this).closest('.row')[0].classList[3];
                    if (chartViewMode == 'currentWeek') {
                        var chartVariable = this.classList[1];
                        var chartAsset = $(this).closest('.row')[0].parentNode.id;
                        var dataObject = data[chartAsset][chartViewMode][chartVariable];
                        var xLabel, yLabel, title, barWidth = 0.8, isLine, isStep;
                        xLabel = 'Day';
                        switch (chartVariable) {
                            case 'cabinetTemp':
                            case 'oilTemp': {
                                yLabel = 'oC'
                                break;
                            }
                            case 'cabinetHumidity': {
                                yLabel = '%';
                                break;
                            }
                            case 'oilLevel': {
                                yLabel = '';
                                break;
                            }
                            case 'oilPressure': {
                                yLabel = 'BAR';
                                break;
                            }
                            case 'productCounter': {
                                yLabel = 'Products';
                                break;
                            }
                        }

                        title = var2Title(chartVariable, chartViewMode);

                        if (chartVariable == 'productCounter') isLine = false;
                        else isLine = true;

                        if (chartVariable == 'oilLevel') isStep = true;
                        else isStep = false;

                        if (dataObject.data.length < 8) barWidth = dataObject.data.length / 10 - 0.05;

                        var option = {
                            title: title,
                            xLabel: xLabel,
                            yLabel: yLabel,
                            barWidth: barWidth,
                            isLine: isLine,
                            isStep: isStep
                        }

                        loadChart(this, dataObject.label, dataObject.data, option);
                    }


                    // if (chartViewMode == 'today') console.log(dataObject)





                });
                break;
            };
            case 'month': {
                $('.chart').each(function () {
                    var chartViewMode = $(this).closest('.row')[0].classList[3];
                    if (chartViewMode == 'currentMonth') {
                        var chartVariable = this.classList[1];
                        var chartAsset = $(this).closest('.row')[0].parentNode.id;
                        var dataObject = data[chartAsset][chartViewMode][chartVariable];
                        var xLabel, yLabel, title, barWidth = 0.8, isLine, isStep;
                        xLabel = 'Day';
                        switch (chartVariable) {
                            case 'cabinetTemp':
                            case 'oilTemp': {
                                yLabel = 'oC'
                                break;
                            }
                            case 'cabinetHumidity': {
                                yLabel = '%';
                                break;
                            }
                            case 'oilLevel': {
                                yLabel = '';
                                break;
                            }
                            case 'oilPressure': {
                                yLabel = 'BAR';
                                break;
                            }
                            case 'productCounter': {
                                yLabel = 'Products';
                                break;
                            }
                        }

                        title = var2Title(chartVariable, chartViewMode);

                        if (chartVariable == 'productCounter') isLine = false;
                        else isLine = true;

                        if (chartVariable == 'oilLevel') isStep = true;
                        else isStep = false;

                        if (dataObject.data.length < 8) barWidth = dataObject.data.length / 10 - 0.05;

                        var option = {
                            title: title,
                            xLabel: xLabel,
                            yLabel: yLabel,
                            barWidth: barWidth,
                            isLine: isLine,
                            isStep: isStep
                        }

                        loadChart(this, dataObject.label, dataObject.data, option);
                    }
                });
                break;
            };
            case 'quarter': {
                $('.chart').each(function () {
                    var chartViewMode = $(this).closest('.row')[0].classList[3];
                    if (chartViewMode == 'currentQuarter') {
                        var chartVariable = this.classList[1];
                        var chartAsset = $(this).closest('.row')[0].parentNode.id;
                        var dataObject = data[chartAsset][chartViewMode][chartVariable];
                        var xLabel, yLabel, title, barWidth = 0.8, isLine, isStep;
                        xLabel = 'Day';
                        switch (chartVariable) {
                            case 'cabinetTemp':
                            case 'oilTemp': {
                                yLabel = 'oC'
                                break;
                            }
                            case 'cabinetHumidity': {
                                yLabel = '%';
                                break;
                            }
                            case 'oilLevel': {
                                yLabel = '';
                                break;
                            }
                            case 'oilPressure': {
                                yLabel = 'BAR';
                                break;
                            }
                            case 'productCounter': {
                                yLabel = 'Products';
                                break;
                            }
                        }

                        title = var2Title(chartVariable, chartViewMode);

                        if (chartVariable == 'productCounter') isLine = false;
                        else isLine = true;

                        if (chartVariable == 'oilLevel') isStep = true;
                        else isStep = false;

                        if (dataObject.data.length < 8) barWidth = dataObject.data.length / 10 - 0.05;

                        var option = {
                            title: title,
                            xLabel: xLabel,
                            yLabel: yLabel,
                            barWidth: barWidth,
                            isLine: isLine,
                            isStep: isStep
                        }

                        loadChart(this, dataObject.label, dataObject.data, option);
                    }
                });
                break;
            };
            case 'year': {
                $('.chart').each(function () {
                    var chartViewMode = $(this).closest('.row')[0].classList[3];
                    if (chartViewMode == 'currentYear') {
                        var chartVariable = this.classList[1];
                        var chartAsset = $(this).closest('.row')[0].parentNode.id;
                        var dataObject = data[chartAsset][chartViewMode][chartVariable];
                        var xLabel, yLabel, title, barWidth = 0.8, isLine, isStep;
                        xLabel = 'Day';
                        switch (chartVariable) {
                            case 'cabinetTemp':
                            case 'oilTemp': {
                                yLabel = 'oC'
                                break;
                            }
                            case 'cabinetHumidity': {
                                yLabel = '%';
                                break;
                            }
                            case 'oilLevel': {
                                yLabel = '';
                                break;
                            }
                            case 'oilPressure': {
                                yLabel = 'BAR';
                                break;
                            }
                            case 'productCounter': {
                                yLabel = 'Products';
                                break;
                            }
                        }

                        title = var2Title(chartVariable, chartViewMode);

                        if (chartVariable == 'productCounter') isLine = false;
                        else isLine = true;

                        if (chartVariable == 'oilLevel') isStep = true;
                        else isStep = false;

                        if (dataObject.data.length < 8) barWidth = dataObject.data.length / 10 - 0.05;

                        var option = {
                            title: title,
                            xLabel: xLabel,
                            yLabel: yLabel,
                            barWidth: barWidth,
                            isLine: isLine,
                            isStep: isStep
                        }

                        loadChart(this, dataObject.label, dataObject.data, option);
                    }
                });
                break;
            };
        }
    });

    socket.on('/dashboard/realtime', function (data) {
        if (data.value.hasOwnProperty('ProductCounter') && isTodayChartLoaded) {
            if (data.asset == 'testAndPackingAsset') {
                $('#testAndPackingAsset').find('.productCounter').text(data.value.ProductCounter);
            } else {
                $('#punchingAsset').find('.productCounter').text(data.value.ProductCounter);
            }
            updateRealtime(data.asset, data.date, data.value);
        }
    })

    //Select asset
    $('#selectAssetList').on('change', function () {
        $selectAsset = $(this).val();
        switch ($selectAsset) {
            case '0': {
                $('#testAndPackingAsset').show();
                $('#punchingAsset').hide();
                break;
            }
            case '1': {
                $('#punchingAsset').show();
                $('#testAndPackingAsset').hide();
                break;
            }
        }

    });

    //View mode
    $('input[name = viewMode]').on('change', function () {
        $viewMode = $(this).val();
        switch ($viewMode) {
            //TODAY
            case '0': {

                $('#testAndPackingAsset').find('.today').show();
                $('#testAndPackingAsset').find('.currentWeek').hide();
                $('#testAndPackingAsset').find('.currentMonth').hide();
                $('#testAndPackingAsset').find('.currentQuarter').hide();
                $('#testAndPackingAsset').find('.currentYear').hide();

                $('#punchingAsset').find('.today').show();
                $('#punchingAsset').find('.currentWeek').hide();
                $('#punchingAsset').find('.currentMonth').hide();
                $('#punchingAsset').find('.currentQuarter').hide();
                $('#punchingAsset').find('.currentYear').hide();

                break;
            }

            //CURRENT WEEK
            case '1': {

                $('#testAndPackingAsset').find('.today').hide();
                $('#testAndPackingAsset').find('.currentWeek').show();
                $('#testAndPackingAsset').find('.currentMonth').hide();
                $('#testAndPackingAsset').find('.currentQuarter').hide();
                $('#testAndPackingAsset').find('.currentYear').hide();

                $('#punchingAsset').find('.today').hide();
                $('#punchingAsset').find('.currentWeek').show();
                $('#punchingAsset').find('.currentMonth').hide();
                $('#punchingAsset').find('.currentQuarter').hide();
                $('#punchingAsset').find('.currentYear').hide();

                break;
            }

            //CURRENT MONTH
            case '2': {

                $('#testAndPackingAsset').find('.today').hide();
                $('#testAndPackingAsset').find('.currentWeek').hide();
                $('#testAndPackingAsset').find('.currentMonth').show();
                $('#testAndPackingAsset').find('.currentQuarter').hide();
                $('#testAndPackingAsset').find('.currentYear').hide();

                $('#punchingAsset').find('.today').hide();
                $('#punchingAsset').find('.currentWeek').hide();
                $('#punchingAsset').find('.currentMonth').show();
                $('#punchingAsset').find('.currentQuarter').hide();
                $('#punchingAsset').find('.currentYear').hide();

                break;
            }

            //CURRENT QUARTER
            case '3': {

                $('#testAndPackingAsset').find('.today').hide();
                $('#testAndPackingAsset').find('.currentWeek').hide();
                $('#testAndPackingAsset').find('.currentMonth').hide();
                $('#testAndPackingAsset').find('.currentQuarter').show();
                $('#testAndPackingAsset').find('.currentYear').hide();

                $('#punchingAsset').find('.today').hide();
                $('#punchingAsset').find('.currentWeek').hide();
                $('#punchingAsset').find('.currentMonth').hide();
                $('#punchingAsset').find('.currentQuarter').show();
                $('#punchingAsset').find('.currentYear').hide();

                break;
            }

            //CURRENT YEAR
            case '4': {

                $('#testAndPackingAsset').find('.today').hide();
                $('#testAndPackingAsset').find('.currentWeek').hide();
                $('#testAndPackingAsset').find('.currentMonth').hide();
                $('#testAndPackingAsset').find('.currentQuarter').hide();
                $('#testAndPackingAsset').find('.currentYear').show();

                $('#punchingAsset').find('.today').hide();
                $('#punchingAsset').find('.currentWeek').hide();
                $('#punchingAsset').find('.currentMonth').hide();
                $('#punchingAsset').find('.currentQuarter').hide();
                $('#punchingAsset').find('.currentYear').show();

                break;
            }
        }

    });


})


//Init view for the first load
function initView() {
    $('#punchingAsset').show();
    $('#punchingAsset').find('.today').show();
    $('#punchingAsset').find('.currentWeek').hide();
    $('#punchingAsset').find('.currentMonth').hide();
    $('#punchingAsset').find('.currentQuarter').hide();
    $('#punchingAsset').find('.currentYear').hide();

    $('#testAndPackingAsset').hide();
    $('#testAndPackingAsset').find('.today').show();
    $('#testAndPackingAsset').find('.currentWeek').hide();
    $('#testAndPackingAsset').find('.currentMonth').hide();
    $('#testAndPackingAsset').find('.currentQuarter').hide();
    $('#testAndPackingAsset').find('.currentYear').hide();
}


//Load chart
function loadChart(canvasItem, labels, data, option) {
    var ctx1 = canvasItem.getContext('2d');
    if (option.isLine) {
        var chart = new Chart(ctx1, {
            // The type of chart we want to create
            type: 'line',
            // The data for our dataset
            data: {
                labels: labels,
                datasets: [{
                    steppedLine: option.isStep,
                    backgroundColor: 'rgba(57,172,180 , 0.1)',
                    hoverBackgroundColor: 'rgba(57,172,180 , 0.3)',
                    data: data,
                    label: 'Value',
                    // backgroundColor: 'rgb(255, 255, 255, 0.2)',
                    borderColor: 'rgb(0,102,10)',
                    borderWidth: 2,
                    pointRadius: 0,
                }]
            },

            // Configuration options go here
            options: {
                legend: false,
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: option.title,
                    fontColor: 'white',
                    fontSize: 20
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    titleFontSize: 16,
                    bodyFontSize: 16
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                // pan: {
                //     enabled: false,
                //     mode: 'x',
                //     // rangeMax: {
                //     //     x: 60000
                //     // },
                //     // rangeMin: {
                //     //     x: 0
                //     // }
                // },
                // zoom: {
                //     enabled: true,
                //     mode: 'x',

                //     // rangeMax: {
                //     //     x: 3600000000
                //     // },
                //     // rangeMin: {
                //     //     x: 1800000000
                //     // }
                // },
                scales: {
                    xAxes: [{
                        display: false,
                        // type : 'realtime',
                        scaleLabel: {
                            display: true,
                            labelString: option.xLabel
                        },
                        //barPercentage : option.barWidth,
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        display: true,
                        gridLines: {
                            color: '#282525'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: option.yLabel
                        }
                    }]
                }
            }
        });
    } else {
        var chart = new Chart(ctx1, {
            // The type of chart we want to create
            type: 'bar',
            // The data for our dataset
            data: {
                labels: labels,
                datasets: [{
                    backgroundColor: 'rgba(57,172,180 , 1)',
                    hoverBackgroundColor: 'rgba(57,172,180 , 0.5)',
                    data: data,
                    label: 'Value',
                    // backgroundColor: 'rgb(255, 255, 255, 0.2)',
                    borderColor: 'rgba(57,172,180 , 1)',
                    borderWidth: 2,
                }]
            },

            // Configuration options go here
            options: {
                legend: false,
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: option.title,
                    fontColor: 'white',
                    fontSize: 20
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    titleFontSize: 16,
                    bodyFontSize: 16
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                // pan: {
                //     enabled: true,
                //     mode: 'x',
                //     rangeMax: {
                //         x: 60000
                //     },
                //     rangeMin: {
                //         x: 0
                //     }
                // },
                // zoom: {
                //     enabled: true,
                //     mode: 'x',
                //     rangeMax: {
                //         x: 600000
                //     },
                //     rangeMin: {
                //         x: 1000
                //     }
                // },
                scales: {
                    xAxes: [{
                        display: true,
                        // type : 'realtime',
                        scaleLabel: {
                            display: true,
                            labelString: option.xLabel
                        },
                        barPercentage: option.barWidth,
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        display: true,
                        gridLines: {
                            color: '#282525'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: option.yLabel
                        }
                    }]
                }
            }
        });
    }
}

//Load average value
function loadAverageValue(divItem, objData) {
    var variableName = divItem.classList[1];
    var viewMode = $(divItem).closest('.row')[0].classList[3];
    var asset = $(divItem).closest('.row')[0].parentNode.id;

    //console.log(variableName + ' - ' + viewMode + ' - ' + asset)

    $(divItem).text(average(objData[asset][viewMode][variableName].data));
}

//Return variable name to title chart
function var2Title(variableName) {
    var arrVariable = ['cabinetTemp', 'cabinetHumidity', 'oilPressure', 'oilTemp', 'oilLevel', 'productCounter'];
    var arrTitle = ['Cabinet Temp', 'Cabinet Humidity', 'Oil Pressure', 'Oil Temp', 'Low Oil Level Alarm', 'Product Counter'];
    // var arrViewModeVariable = ['today' , 'currentWeek' , 'currentMonth' , 'currentQuarter' , 'currentYear'];
    // var arrViewMode = ['Today ' , 'Current Week ' , 'Current Month ' , 'Current Quarter ' , 'Current Year '];
    return arrTitle[arrVariable.indexOf(variableName)];
}

//Calculate avarage value
function calculateAvarage(arrData) {

    var dataSchema = {
        testAndPackingAsset: {
            cabinetTemp: {
                averageToday: null,
                averageWeek: null,
                averageMonth: null,
                averageQuarter: null,
                averageYear: null
            },
            cabinetHumidity: {
                averageToday: null,
                averageWeek: null,
                averageMonth: null,
                averageQuarter: null,
                averageYear: null
            },
        },

        punchingAsset: {
            cabinetTemp: {
                averageToday: null,
                averageWeek: null,
                averageMonth: null,
                averageQuarter: null,
                averageYear: null
            },
            cabinetHumidity: {
                averageToday: null,
                averageWeek: null,
                averageMonth: null,
                averageQuarter: null,
                averageYear: null
            },
            oilPressure: {
                averageToday: null,
                averageWeek: null,
                averageMonth: null,
                averageQuarter: null,
                averageYear: null
            },
            oilTemp: {
                averageToday: null,
                averageWeek: null,
                averageMonth: null,
                averageQuarter: null,
                averageYear: null
            },
            oilLevel: {
                averageToday: null,
                averageWeek: null,
                averageMonth: null,
                averageQuarter: null,
                averageYear: null
            },
        }
    }

    //Test and packing asset
    dataSchema.testAndPackingAsset.cabinetTemp.avarageToday = average(arrData.testAndPackingAsset.today.cabinetTemp.data);
    dataSchema.testAndPackingAsset.cabinetTemp.averageWeek = average(arrData.testAndPackingAsset.currentWeek.cabinetTemp.data);
    dataSchema.testAndPackingAsset.cabinetTemp.averageMonth = average(arrData.testAndPackingAsset.currentMonth.cabinetTemp.data);
    dataSchema.testAndPackingAsset.cabinetTemp.averageQuarter = average(arrData.testAndPackingAsset.currentQuarter.cabinetTemp.data);
    dataSchema.testAndPackingAsset.cabinetTemp.averageYear = average(arrData.testAndPackingAsset.currentYear.cabinetTemp.data);

    dataSchema.testAndPackingAsset.cabinetHumidity.avarageToday = average(arrData.testAndPackingAsset.today.cabinetHumidity.data);
    dataSchema.testAndPackingAsset.cabinetHumidity.averageWeek = average(arrData.testAndPackingAsset.currentWeek.cabinetHumidity.data);
    dataSchema.testAndPackingAsset.cabinetHumidity.averageMonth = average(arrData.testAndPackingAsset.currentMonth.cabinetHumidity.data);
    dataSchema.testAndPackingAsset.cabinetHumidity.averageQuarter = average(arrData.testAndPackingAsset.currentQuarter.cabinetHumidity.data);
    dataSchema.testAndPackingAsset.cabinetHumidity.averageYear = average(arrData.testAndPackingAsset.currentYear.cabinetHumidity.data);

    //Punching asset
    dataSchema.punchingAsset.cabinetTemp.avarageToday = average(arrData.punchingAsset.today.cabinetTemp.data);
    dataSchema.punchingAsset.cabinetTemp.averageWeek = average(arrData.punchingAsset.currentWeek.cabinetTemp.data);
    dataSchema.punchingAsset.cabinetTemp.averageMonth = average(arrData.punchingAsset.currentMonth.cabinetTemp.data);
    dataSchema.punchingAsset.cabinetTemp.averageQuarter = average(arrData.punchingAsset.currentQuarter.cabinetTemp.data);
    dataSchema.punchingAsset.cabinetTemp.averageYear = average(arrData.punchingAsset.currentYear.cabinetTemp.data);

    dataSchema.punchingAsset.cabinetHumidity.avarageToday = average(arrData.punchingAsset.today.cabinetHumidity.data);
    dataSchema.punchingAsset.cabinetHumidity.averageWeek = average(arrData.punchingAsset.currentWeek.cabinetHumidity.data);
    dataSchema.punchingAsset.cabinetHumidity.averageMonth = average(arrData.punchingAsset.currentMonth.cabinetHumidity.data);
    dataSchema.punchingAsset.cabinetHumidity.averageQuarter = average(arrData.punchingAsset.currentQuarter.cabinetHumidity.data);
    dataSchema.punchingAsset.cabinetHumidity.averageYear = average(arrData.punchingAsset.currentYear.cabinetHumidity.data);

    dataSchema.punchingAsset.oilPressure.avarageToday = average(arrData.punchingAsset.today.oilPressure.data);
    dataSchema.punchingAsset.oilPressure.averageWeek = average(arrData.punchingAsset.currentWeek.oilPressure.data);
    dataSchema.punchingAsset.oilPressure.averageMonth = average(arrData.punchingAsset.currentMonth.oilPressure.data);
    dataSchema.punchingAsset.oilPressure.averageQuarter = average(arrData.punchingAsset.currentQuarter.oilPressure.data);
    dataSchema.punchingAsset.oilPressure.averageYear = average(arrData.punchingAsset.currentYear.oilPressure.data);

    dataSchema.punchingAsset.oilTemp.avarageToday = average(arrData.punchingAsset.today.oilTemp.data);
    dataSchema.punchingAsset.oilTemp.averageWeek = average(arrData.punchingAsset.currentWeek.oilTemp.data);
    dataSchema.punchingAsset.oilTemp.averageMonth = average(arrData.punchingAsset.currentMonth.oilTemp.data);
    dataSchema.punchingAsset.oilTemp.averageQuarter = average(arrData.punchingAsset.currentQuarter.oilTemp.data);
    dataSchema.punchingAsset.oilTemp.averageYear = average(arrData.punchingAsset.currentYear.oilTemp.data);

    dataSchema.punchingAsset.oilLevel.avarageToday = average(arrData.punchingAsset.today.oilLevel.data);
    dataSchema.punchingAsset.oilLevel.averageWeek = average(arrData.punchingAsset.currentWeek.oilLevel.data);
    dataSchema.punchingAsset.oilLevel.averageMonth = average(arrData.punchingAsset.currentMonth.oilLevel.data);
    dataSchema.punchingAsset.oilLevel.averageQuarter = average(arrData.punchingAsset.currentQuarter.oilLevel.data);
    dataSchema.punchingAsset.oilLevel.averageYear = average(arrData.punchingAsset.currentYear.oilLevel.data);

    return dataSchema;
}


function average(_arrData) {
    // console.log(_arrData);
    var sum = 0;
    for (var i = 0; i < _arrData.length; i++) {
        if (!isNaN(Number(_arrData[i]))) sum += Number(_arrData[i]);
    }
    return Number(sum / _arrData.length).toFixed(2);
}


function loadTodayChart(canvasItem, labels, data, option, assetId, chartVariable) {
    if (assetId == 'testAndPackingAsset') {
        switch (chartVariable) {
            case 'cabinetTemp': {
                var ctx1 = canvasItem.getContext('2d');
                if (option.isLine) {
                    tePa_cabinetTempChart = new Chart(ctx1, {
                        // The type of chart we want to create
                        type: 'line',
                        // The data for our dataset
                        data: {
                            labels: labels,
                            datasets: [{
                                steppedLine: false,
                                backgroundColor: 'rgba(57,172,180 , 0.1)',
                                hoverBackgroundColor: 'rgba(57,172,180 , 0.3)',
                                data: data,
                                label: 'Value',
                                // backgroundColor: 'rgb(255, 255, 255, 0.2)',
                                borderColor: 'rgb(0,102,10)',
                                borderWidth: 2,
                                pointRadius: 0,
                            }]
                        },

                        // Configuration options go here
                        options: {
                            legend: false,
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: option.title,
                                fontColor: 'white',
                                fontSize: 20
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                                titleFontSize: 16,
                                bodyFontSize: 16
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            // pan: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 0
                            //     }
                            // },
                            // zoom: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 1000
                            //     }
                            // },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    // type : 'realtime',
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.xLabel
                                    },
                                    barPercentage: option.barWidth,
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    display: true,
                                    gridLines: {
                                        color: '#282525'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.yLabel
                                    }
                                }]
                            }
                        }
                    });
                } else {
                    tePa_cabinetTempChart = new Chart(ctx1, {
                        // The type of chart we want to create
                        type: 'bar',
                        // The data for our dataset
                        data: {
                            labels: labels,
                            datasets: [{
                                backgroundColor: 'rgba(57,172,180 , 0.1)',
                                hoverBackgroundColor: 'rgba(57,172,180 , 0.3)',
                                data: data,
                                label: 'Value',
                                // backgroundColor: 'rgb(255, 255, 255, 0.2)',
                                borderColor: 'rgb(0,102,10)',
                                borderWidth: 2,
                            }]
                        },

                        // Configuration options go here
                        options: {
                            legend: false,
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: option.title,
                                fontColor: 'white',
                                fontSize: 20
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                                titleFontSize: 16,
                                bodyFontSize: 16
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            // pan: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 0
                            //     }
                            // },
                            // zoom: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 1000
                            //     }
                            // },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    // type : 'realtime',
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.xLabel
                                    },
                                    barPercentage: option.barWidth,
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    display: true,
                                    gridLines: {
                                        color: '#282525'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.yLabel
                                    }
                                }]
                            }
                        }
                    });
                }
                break;
            };
            case 'cabinetHumidity': {
                var ctx1 = canvasItem.getContext('2d');
                if (option.isLine) {
                    tePa_cabinetHumidityChart = new Chart(ctx1, {
                        // The type of chart we want to create
                        type: 'line',
                        // The data for our dataset
                        data: {
                            labels: labels,
                            datasets: [{
                                steppedLine: false,
                                backgroundColor: 'rgba(57,172,180 , 0.1)',
                                hoverBackgroundColor: 'rgba(57,172,180 , 0.3)',
                                data: data,
                                label: 'Value',
                                // backgroundColor: 'rgb(255, 255, 255, 0.2)',
                                borderColor: 'rgb(0,102,10)',
                                borderWidth: 2,
                                pointRadius: 0,
                            }]
                        },

                        // Configuration options go here
                        options: {
                            legend: false,
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: option.title,
                                fontColor: 'white',
                                fontSize: 20
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                                titleFontSize: 16,
                                bodyFontSize: 16
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            // pan: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 0
                            //     }
                            // },
                            // zoom: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 1000
                            //     }
                            // },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    // type : 'realtime',
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.xLabel
                                    },
                                    barPercentage: option.barWidth,
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    display: true,
                                    gridLines: {
                                        color: '#282525'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.yLabel
                                    }
                                }]
                            }
                        }
                    });
                } else {
                    tePa_cabinetHumidityChart = new Chart(ctx1, {
                        // The type of chart we want to create
                        type: 'bar',
                        // The data for our dataset
                        data: {
                            labels: labels,
                            datasets: [{
                                backgroundColor: 'rgba(57,172,180 , 0.1)',
                                hoverBackgroundColor: 'rgba(57,172,180 , 0.3)',
                                data: data,
                                label: 'Value',
                                // backgroundColor: 'rgb(255, 255, 255, 0.2)',
                                borderColor: 'rgb(0,102,10)',
                                borderWidth: 2,
                            }]
                        },

                        // Configuration options go here
                        options: {
                            legend: false,
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: option.title,
                                fontColor: 'white',
                                fontSize: 20
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                                titleFontSize: 16,
                                bodyFontSize: 16
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            // pan: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 0
                            //     }
                            // },
                            // zoom: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 1000
                            //     }
                            // },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    // type : 'realtime',
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.xLabel
                                    },
                                    barPercentage: option.barWidth,
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    display: true,
                                    gridLines: {
                                        color: '#282525'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.yLabel
                                    }
                                }]
                            }
                        }
                    });
                }
                break;
            };
        }
    } else { //Punching
        switch (chartVariable) {
            case 'cabinetTemp': {
                var ctx1 = canvasItem.getContext('2d');
                if (option.isLine) {
                    punc_cabinetTempChart = new Chart(ctx1, {
                        // The type of chart we want to create
                        type: 'line',
                        // The data for our dataset
                        data: {
                            labels: labels,
                            datasets: [{
                                steppedLine: false,
                                backgroundColor: 'rgba(57,172,180 , 0.1)',
                                hoverBackgroundColor: 'rgba(57,172,180 , 0.3)',
                                data: data,
                                label: 'Value',
                                // backgroundColor: 'rgb(255, 255, 255, 0.2)',
                                borderColor: 'rgb(0,102,10)',
                                borderWidth: 2,
                                pointRadius: 0,
                            }]
                        },

                        // Configuration options go here
                        options: {
                            legend: false,
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: option.title,
                                fontColor: 'white',
                                fontSize: 20
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                                titleFontSize: 16,
                                bodyFontSize: 16
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            // pan: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 0
                            //     }
                            // },
                            // zoom: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 1000
                            //     }
                            // },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    // type : 'realtime',
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.xLabel
                                    },
                                    barPercentage: option.barWidth,
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    display: true,
                                    gridLines: {
                                        color: '#282525'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.yLabel
                                    }
                                }]
                            }
                        }
                    });
                } else {
                    punc_cabinetTempChart = new Chart(ctx1, {
                        // The type of chart we want to create
                        type: 'bar',
                        // The data for our dataset
                        data: {
                            labels: labels,
                            datasets: [{
                                backgroundColor: 'rgba(57,172,180 , 0.1)',
                                hoverBackgroundColor: 'rgba(57,172,180 , 0.3)',
                                data: data,
                                label: 'Value',
                                // backgroundColor: 'rgb(255, 255, 255, 0.2)',
                                borderColor: 'rgb(0,102,10)',
                                borderWidth: 2,
                            }]
                        },

                        // Configuration options go here
                        options: {
                            legend: false,
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: option.title,
                                fontColor: 'white',
                                fontSize: 20
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                                titleFontSize: 16,
                                bodyFontSize: 16
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            // pan: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 0
                            //     }
                            // },
                            // zoom: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 1000
                            //     }
                            // },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    // type : 'realtime',
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.xLabel
                                    },
                                    barPercentage: option.barWidth,
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    display: true,
                                    gridLines: {
                                        color: '#282525'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.yLabel
                                    }
                                }]
                            }
                        }
                    });
                }
                break;
            };
            case 'cabinetHumidity': {
                var ctx1 = canvasItem.getContext('2d');
                if (option.isLine) {
                    punc_cabinetHumidityChart = new Chart(ctx1, {
                        // The type of chart we want to create
                        type: 'line',
                        // The data for our dataset
                        data: {
                            labels: labels,
                            datasets: [{
                                steppedLine: false,
                                backgroundColor: 'rgba(57,172,180 , 0.1)',
                                hoverBackgroundColor: 'rgba(57,172,180 , 0.3)',
                                data: data,
                                label: 'Value',
                                // backgroundColor: 'rgb(255, 255, 255, 0.2)',
                                borderColor: 'rgb(0,102,10)',
                                borderWidth: 2,
                                pointRadius: 0,
                            }]
                        },

                        // Configuration options go here
                        options: {
                            legend: false,
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: option.title,
                                fontColor: 'white',
                                fontSize: 20
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                                titleFontSize: 16,
                                bodyFontSize: 16
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            // pan: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 0
                            //     }
                            // },
                            // zoom: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 1000
                            //     }
                            // },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    // type : 'realtime',
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.xLabel
                                    },
                                    barPercentage: option.barWidth,
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    display: true,
                                    gridLines: {
                                        color: '#282525'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.yLabel
                                    }
                                }]
                            }
                        }
                    });
                } else {
                    punc_cabinetHumidityChart = new Chart(ctx1, {
                        // The type of chart we want to create
                        type: 'bar',
                        // The data for our dataset
                        data: {
                            labels: labels,
                            datasets: [{
                                backgroundColor: 'rgba(57,172,180 , 0.1)',
                                hoverBackgroundColor: 'rgba(57,172,180 , 0.3)',
                                data: data,
                                label: 'Value',
                                // backgroundColor: 'rgb(255, 255, 255, 0.2)',
                                borderColor: 'rgb(0,102,10)',
                                borderWidth: 2,
                            }]
                        },

                        // Configuration options go here
                        options: {
                            legend: false,
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: option.title,
                                fontColor: 'white',
                                fontSize: 20
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                                titleFontSize: 16,
                                bodyFontSize: 16
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            // pan: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 0
                            //     }
                            // },
                            // zoom: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 1000
                            //     }
                            // },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    // type : 'realtime',
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.xLabel
                                    },
                                    barPercentage: option.barWidth,
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    display: true,
                                    gridLines: {
                                        color: '#282525'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.yLabel
                                    }
                                }]
                            }
                        }
                    });
                }
                break;
            };
            case 'oilPressure': {
                var ctx1 = canvasItem.getContext('2d');
                if (option.isLine) {
                    punc_oilPressureChart = new Chart(ctx1, {
                        // The type of chart we want to create
                        type: 'line',
                        // The data for our dataset
                        data: {
                            labels: labels,
                            datasets: [{
                                steppedLine: false,
                                backgroundColor: 'rgba(57,172,180 , 0.1)',
                                hoverBackgroundColor: 'rgba(57,172,180 , 0.3)',
                                data: data,
                                label: 'Value',
                                // backgroundColor: 'rgb(255, 255, 255, 0.2)',
                                borderColor: 'rgb(0,102,10)',
                                borderWidth: 2,
                                pointRadius: 0,
                            }]
                        },

                        // Configuration options go here
                        options: {
                            legend: false,
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: option.title,
                                fontColor: 'white',
                                fontSize: 20
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                                titleFontSize: 16,
                                bodyFontSize: 16
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            // pan: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 0
                            //     }
                            // },
                            // zoom: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 1000
                            //     }
                            // },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    // type : 'realtime',
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.xLabel
                                    },
                                    barPercentage: option.barWidth,
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    display: true,
                                    gridLines: {
                                        color: '#282525'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.yLabel
                                    }
                                }]
                            }
                        }
                    });
                } else {
                    punc_oilPressureChart = new Chart(ctx1, {
                        // The type of chart we want to create
                        type: 'bar',
                        // The data for our dataset
                        data: {
                            labels: labels,
                            datasets: [{
                                backgroundColor: 'rgba(57,172,180 , 0.1)',
                                hoverBackgroundColor: 'rgba(57,172,180 , 0.3)',
                                data: data,
                                label: 'Value',
                                // backgroundColor: 'rgb(255, 255, 255, 0.2)',
                                borderColor: 'rgb(0,102,10)',
                                borderWidth: 2,
                            }]
                        },

                        // Configuration options go here
                        options: {
                            legend: false,
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: option.title,
                                fontColor: 'white',
                                fontSize: 20
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                                titleFontSize: 16,
                                bodyFontSize: 16
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            // pan: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 0
                            //     }
                            // },
                            // zoom: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 1000
                            //     }
                            // },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    // type : 'realtime',
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.xLabel
                                    },
                                    barPercentage: option.barWidth,
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    display: true,
                                    gridLines: {
                                        color: '#282525'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.yLabel
                                    }
                                }]
                            }
                        }
                    });
                }
                break;
            };
            case 'oilTemp': {
                var ctx1 = canvasItem.getContext('2d');
                if (option.isLine) {
                    punc_oilTempChart = new Chart(ctx1, {
                        // The type of chart we want to create
                        type: 'line',
                        // The data for our dataset
                        data: {
                            labels: labels,
                            datasets: [{
                                steppedLine: false,
                                backgroundColor: 'rgba(57,172,180 , 0.1)',
                                hoverBackgroundColor: 'rgba(57,172,180 , 0.3)',
                                data: data,
                                label: 'Value',
                                // backgroundColor: 'rgb(255, 255, 255, 0.2)',
                                borderColor: 'rgb(0,102,10)',
                                borderWidth: 2,
                                pointRadius: 0,
                            }]
                        },

                        // Configuration options go here
                        options: {
                            legend: false,
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: option.title,
                                fontColor: 'white',
                                fontSize: 20
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                                titleFontSize: 16,
                                bodyFontSize: 16
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            // pan: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 0
                            //     }
                            // },
                            // zoom: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 1000
                            //     }
                            // },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    // type : 'realtime',
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.xLabel
                                    },
                                    barPercentage: option.barWidth,
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    display: true,
                                    gridLines: {
                                        color: '#282525'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.yLabel
                                    }
                                }]
                            }
                        }
                    });
                } else {
                    punc_oilTempChart = new Chart(ctx1, {
                        // The type of chart we want to create
                        type: 'bar',
                        // The data for our dataset
                        data: {
                            labels: labels,
                            datasets: [{
                                backgroundColor: 'rgba(57,172,180 , 0.1)',
                                hoverBackgroundColor: 'rgba(57,172,180 , 0.3)',
                                data: data,
                                label: 'Value',
                                // backgroundColor: 'rgb(255, 255, 255, 0.2)',
                                borderColor: 'rgb(0,102,10)',
                                borderWidth: 2,
                            }]
                        },

                        // Configuration options go here
                        options: {
                            legend: false,
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: option.title,
                                fontColor: 'white',
                                fontSize: 20
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                                titleFontSize: 16,
                                bodyFontSize: 16
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            // pan: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 0
                            //     }
                            // },
                            // zoom: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 1000
                            //     }
                            // },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    // type : 'realtime',
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.xLabel
                                    },
                                    barPercentage: option.barWidth,
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    display: true,
                                    gridLines: {
                                        color: '#282525'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.yLabel
                                    }
                                }]
                            }
                        }
                    });
                }
                break;
            };
            case 'oilLevel': {
                var ctx1 = canvasItem.getContext('2d');
                if (option.isLine) {
                    punc_oilLevelChart = new Chart(ctx1, {
                        // The type of chart we want to create
                        type: 'line',
                        // The data for our dataset
                        data: {
                            labels: labels,
                            datasets: [{
                                steppedLine: true,
                                backgroundColor: 'rgba(57,172,180 , 0.1)',
                                hoverBackgroundColor: 'rgba(57,172,180 , 0.3)',
                                data: data,
                                label: 'Value',
                                // backgroundColor: 'rgb(255, 255, 255, 0.2)',
                                borderColor: 'rgb(0,102,10)',
                                borderWidth: 2,
                                pointRadius: 0,
                            }]
                        },

                        // Configuration options go here
                        options: {
                            legend: false,
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: option.title,
                                fontColor: 'white',
                                fontSize: 20
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                                titleFontSize: 16,
                                bodyFontSize: 16
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            // pan: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 0
                            //     }
                            // },
                            // zoom: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 1000
                            //     }
                            // },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    // type : 'realtime',
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.xLabel
                                    },
                                    barPercentage: option.barWidth,
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    display: true,
                                    gridLines: {
                                        color: '#282525'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.yLabel
                                    }
                                }]
                            }
                        }
                    });
                } else {
                    punc_oilLevelChart = new Chart(ctx1, {
                        // The type of chart we want to create
                        type: 'bar',
                        // The data for our dataset
                        data: {
                            labels: labels,
                            datasets: [{
                                backgroundColor: 'rgba(57,172,180 , 0.1)',
                                hoverBackgroundColor: 'rgba(57,172,180 , 0.3)',
                                data: data,
                                label: 'Value',
                                // backgroundColor: 'rgb(255, 255, 255, 0.2)',
                                borderColor: 'rgb(0,102,10)',
                                borderWidth: 2,
                            }]
                        },

                        // Configuration options go here
                        options: {
                            legend: false,
                            responsive: true,
                            maintainAspectRatio: false,
                            title: {
                                display: true,
                                text: option.title,
                                fontColor: 'white',
                                fontSize: 20
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                                titleFontSize: 16,
                                bodyFontSize: 16
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            // pan: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 0
                            //     }
                            // },
                            // zoom: {
                            //     enabled: true,
                            //     mode: 'x',
                            //     rangeMax: {
                            //         x: 60000
                            //     },
                            //     rangeMin: {
                            //         x: 1000
                            //     }
                            // },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    // type : 'realtime',
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.xLabel
                                    },
                                    barPercentage: option.barWidth,
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    display: true,
                                    gridLines: {
                                        color: '#282525'
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: option.yLabel
                                    }
                                }]
                            }
                        }
                    });
                }
                break;
            };
        }
    }
}


function updateRealtime(asset, date, data) {
    if (asset == 'testAndPackingAsset') {
        if (data.hasOwnProperty('CabinetTemp')) {
            $('#testAndPackingAsset').find('.content.cabinetTemp').text(data.CabinetTemp.toFixed(3));
            addChartData(tePa_cabinetTempChart, moment(date).format('HH:mm'), data.CabinetTemp);
        }
        if (data.hasOwnProperty('CabinetHumidity')) {
            $('#testAndPackingAsset').find('.content.cabinetHumidity').text(data.CabinetHumidity.toFixed(3));
            addChartData(tePa_cabinetHumidityChart, moment(date).format('HH:mm'), data.CabinetHumidity);
        }
    } else { //Punching asset
        if (data.hasOwnProperty('CabinetTemp')) {
            $('#punchingAsset').find('.content.cabinetTemp').text(data.CabinetTemp.toFixed(3));
            addChartData(punc_cabinetTempChart, moment(date).format('HH:mm'), data.CabinetTemp);
        }
        if (data.hasOwnProperty('CabinetHumidity')) {
            $('#punchingAsset').find('.content.cabinetHumidity').text(data.CabinetHumidity.toFixed(3));
            addChartData(punc_cabinetHumidityChart, moment(date).format('HH:mm'), data.CabinetHumidity);
        }
        if (data.hasOwnProperty('OilPressure')) {
            $('#punchingAsset').find('.content.oilPressure').text(data.OilPressure.toFixed(3));
            addChartData(punc_oilPressureChart, moment(date).format('HH:mm'), data.OilPressure);
        }
        if (data.hasOwnProperty('OilTemp')) {
            $('#punchingAsset').find('.content.oilTemp').text(data.OilTemp.toFixed(3));
            addChartData(punc_oilTempChart, moment(date).format('HH:mm'), data.OilTemp);
        }
        if (data.hasOwnProperty('OilLevel')) {
            $('#punchingAsset').find('.content.oilLevel').text(Number(data.OilLevel));
            addChartData(punc_oilLevelChart, moment(date).format('HH:mm'), data.OilLevel);
        }
    }
}




function addChartData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data);
    chart.update();
}

