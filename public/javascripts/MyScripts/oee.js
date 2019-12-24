//Global variable
let $selectAsset = '1';
let $viewMode = '0';
let $oeeMode = '0';
//let $arrGaugeVariable = [gaugePunchingOeeToday, gaugePunchingAvailabilityToday];

let socket = io({ transports: ['websocket'] });

//Set link
if ($selectAsset == '1') { //Punching asset
    $('#reportWeek').attr('href' , '/oee/punching/report/week');
    $('#reportMonth').attr('href' , '/oee/punching/report/month');
    $('#reportQuarter').attr('href' , '/oee/punching/report/quarter');
    $('#reportYear').attr('href' , '/oee/punching/report/year');
} else { //Test and packing asset
    $('#reportWeek').attr('href' , '/oee/testAndPacking/report/week');
    $('#reportMonth').attr('href' , '/oee/testAndPacking/report/month');
    $('#reportQuarter').attr('href' , '/oee/testAndPacking/report/quarter');
    $('#reportYear').attr('href' , '/oee/testAndPacking/report/year');
}

$(document).ready(function () {

    socket.emit('/reqOee', true);
    socket.on('/resOee', function (data) {
        console.log(data);
        //Load gauge, execute when receiving data via socket.io
        $('.gauge').each(function () {
            var _asset = this.parentNode.parentNode.classList[0];
            var _viewMode = this.parentNode.classList[2];
            var _oeeMode = this.classList[1];
            var _id = this.id;
            var _title = viewMode2Name(_viewMode) + firstCharCapitalize(_oeeMode);
            if (_oeeMode == 'oee') _title = viewMode2Name(_viewMode) + 'OEE';

            if (_viewMode == 'today') {
                loadGauge(_id, _title, data[_asset][_viewMode][_oeeMode][0].value);
            } else {
                loadGauge(_id, _title, Number(data[_asset][_viewMode].average[_oeeMode]));
                //Load chart, execute when receiving data via socket.io
                $('.chart').each(function () {
                    var _asset = this.parentNode.parentNode.parentNode.classList[0];
                    var _canvasItem = this;
                    var _oeeMode = this.classList[1];
                    var _viewMode = this.parentNode.parentNode.classList[0];
                    var option = {
                        title: '',
                        xLabel: '',
                        yLabel: '%'
                    }
                    if (_oeeMode == 'oee') option.title = viewMode2Name(_viewMode) + 'OEE';
                    else option.title = viewMode2Name(_viewMode) + firstCharCapitalize(_oeeMode);
                    switch (_viewMode) {
                        case 'currentWeek':
                        case 'currentMonth':
                        case 'currentQuarter' : {
                            option.xLabel = 'Day';
                            break;
                        }
                        default: {
                            option.xLabel = 'Month';
                            break;
                        }
                    }

                    var arrLabel = [];
                    var arrValue = [];
                    var arrDataSource = data[_asset][_viewMode][_oeeMode];

                    if (arrDataSource.length > 0) {
                        for (var i = 0; i < arrDataSource.length; i++) {
                            arrLabel.push(arrDataSource[i].date);
                            arrValue.push(arrDataSource[i].value);
                        }
                    }

                    loadChart(_canvasItem, arrLabel, arrValue, option);
                });
            }



        });
    })
    //Select asset
    $('#selectAssetList').on('change', function () {
        $selectAsset = $(this).val();
        displayControl($selectAsset, $viewMode, $oeeMode);
        
        if ($selectAsset == '1') { //Punching asset
            $('#reportWeek').attr('href' , '/oee/punching/report/week');
            $('#reportMonth').attr('href' , '/oee/punching/report/month');
            $('#reportQuarter').attr('href' , '/oee/punching/report/quarter');
            $('#reportYear').attr('href' , '/oee/punching/report/year');
        } else { //Test and packing asset
            $('#reportWeek').attr('href' , '/oee/testAndPacking/report/week');
            $('#reportMonth').attr('href' , '/oee/testAndPacking/report/month');
            $('#reportQuarter').attr('href' , '/oee/testAndPacking/report/quarter');
            $('#reportYear').attr('href' , '/oee/testAndPacking/report/year');
        }
    });

    $('input[name=viewMode]').on('change', function () {
        $viewMode = $(this).val();
        displayControl($selectAsset, $viewMode, $oeeMode);
    });

    $('input[name=oeeMode]').on('change', function () {
        $oeeMode = $(this).val();
        displayControl($selectAsset, $viewMode, $oeeMode);
    })





    //Initialize view
    displayControl($selectAsset, $viewMode, $oeeMode);

});


//Load gauge
function loadGauge(_id, _title, _value) {
    var _gaugeVariable = new JustGage({
        id: _id,
        value: _value,
        decimals: 2,
        min: 0,
        max: 100,
        // symbol: ' RPM',
        title: _title,
        label: '%',
        donut: true,
        relativeGaugeSize: true,
        valueFontColor: 'white',
        valueFontSize: '10px',
        gaugeColor: 'rgba(255,255,255,0.15)',
        levelColors: [
            '#77dede',
            '#69e0e0',
            '#54e3e3',
            '#44e3e3',
            '#31e3e3',
            '#0fe7e7',
        ],
        pointer: true,
        pointerOptions: {
            toplength: 1,
            bottomlength: -10,
            bottomwidth: 5,
            color: '#50e0e0'
        },
        gaugeWidthScale: 0.2,
        counter: true,
    });
}

//Load chart function. Option is a object containing: title, xLabel, yLabel
function loadChart(canvasItem, labels, data, option) {
    var ctx1 = canvasItem.getContext('2d');
    var chart = new Chart(ctx1, {
        // The type of chart we want to create
        type: 'line',
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
                lineTension: 0,
                pointStyle: 'triangle',
                pointRadius: 5,
                pointHoverRadius: 7,
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

}

//Display control function
//Arguments : asset (0,1), viewModel (0 : today, 1 : currentWeek,...) , oeeMode (0: oee , 1 : availability)
function displayControl(asset, viewMode, oeeMode) {
    if (asset == '0') { //Test and Packing Asset
        $('.testAndPackingAsset').show();
        $('.punchingAsset').hide();
    } else { //Punching Asset
        $('.testAndPackingAsset').hide();
        $('.punchingAsset').show();
    }

    switch (viewMode) {
        case '0': { //Today
            $('.gauge-container').hide();
            $('.today').show();
            $('.currentWeek').hide();
            $('.currentMonth').hide();
            $('.currentQuarter').hide();
            $('.currentYear').hide();
            break;
        }
        case '1': { //Current week
            $('.gauge-container').hide();
            $('.today').hide();
            $('.currentWeek').show();
            $('.currentMonth').hide();
            $('.currentQuarter').hide();
            $('.currentYear').hide();
            break;
        }
        case '2': { //Current month
            $('.gauge-container').hide();
            $('.today').hide();
            $('.currentWeek').hide();
            $('.currentMonth').show();
            $('.currentQuarter').hide();
            $('.currentYear').hide();
            break;
        }
        case '3': { //Current quarter
            $('.gauge-container').hide();
            $('.today').hide();
            $('.currentWeek').hide();
            $('.currentMonth').hide();
            $('.currentQuarter').show();
            $('.currentYear').hide();
            break;
        }
        case '4': { //Current year
            $('.gauge-container').hide();
            $('.today').hide();
            $('.currentWeek').hide();
            $('.currentMonth').hide();
            $('.currentQuarter').hide();
            $('.currentYear').show();
            break;
        }
    }

    switch (oeeMode) {
        case '0': { //Oee
            $('.chart-container').hide();
            $('.chart.oee').closest('.chart-container').show();
            break;
        }
        case '1': { //Availability
            $('.chart-container').hide();
            $('.chart.availability').closest('.chart-container').show();
            break;
        }
        case '2': { //Performance
            $('.chart-container').hide();
            $('.chart.performance').closest('.chart-container').show();
            break;
        }
        case '3': { //Quality
            $('.chart-container').hide();
            $('.chart.quality').closest('.chart-container').show();
            break;
        }
    }
}


//Capitialize first character in a string
function firstCharCapitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

//Return view mode name
function viewMode2Name(viewmode) {
    var arrRaw = ['today', 'currentWeek', 'currentMonth', 'currentQuarter', 'currentYear'];
    var arrRet = ['Today ', 'Current Week ', 'Current Month ', 'Current Quarter ', 'Current Year '];
    return arrRet[arrRaw.indexOf(viewmode)];
}