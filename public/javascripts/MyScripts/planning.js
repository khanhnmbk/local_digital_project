var $table_appliedTestAndPacking = $("#appliedPlan .testAndPackingAsset table");
var $table_editTestAndPacking = $("#editPlan .testAndPackingAsset table");
var $table_appliedPunching = $("#appliedPlan .punchingAsset table");
var $table_editPunching = $("#editPlan .punchingAsset table");

var $selectAsset = $('#selectAssetList').val();

var $interval_appliedTestAndPacking = Number($('#appliedPlan .testAndPackingAsset').find('.selectInterval').val());
var $interval_editTestAndPacking = Number($('#editPlan .testAndPackingAsset').find('.selectInterval').val());
var $interval_appliedPunching = Number($('#appliedPlan .punchingAsset').find('.selectInterval').val());
var $interval_editPunching = Number($('#editPlan .punchingAsset').find('.selectInterval').val());

//Table mouse select cell
var table1 = $table_editTestAndPacking;
var isMouseDown1 = false;
var startRowIndex1 = null;
var startCellIndex1 = null;

var table2 = $table_editPunching;
var isMouseDown2 = false;
var startRowIndex2 = null;
var startCellIndex2 = null;

let socket = io({ transports: ['websocket'] });
var currentWeek = moment().format(moment.HTML5_FMT.WEEK);

$(document).ready(function () {
    initView();

    var reqTePaData = {
            week : moment().format(moment.HTML5_FMT.WEEK),
            asset : 'testAndPackingAsset'
        };
    var reqPunData = {
        week : moment().format(moment.HTML5_FMT.WEEK),
        asset : 'punchingAsset'
    };

    socket.emit('/reqPlanning',reqTePaData);
    socket.emit('/reqPlanning',reqPunData);

    socket.on('/resPlanning', function(resData) {
        console.log(resData);
        //Load applied table
        var table = $('#appliedPlan .' + resData.asset).find('table');
        var interval = resData.interval;
        loadTable(table, interval, resData);

        //Load edit table
        var table2 = $('#editPlan .' + resData.asset).find('table');
        loadTable(table2, interval, resData);
        if (resData.asset == 'testAndPackingAsset') {
            activeTable(table2, isMouseDown1, startCellIndex1, startRowIndex1);
        } else {
            activeTable(table2, isMouseDown2, startCellIndex2, startRowIndex2);
        }

    });

    //Change interval
    $('.selectInterval').on('change', function () {
        var $assetDiv = $(this).closest('.row');
        var $table = $assetDiv.find('table');
        
        if ($assetDiv[0].classList[0] == 'testAndPackingAsset') {
            var _interval = Number($(this).val());
            loadIntervalTable($table, _interval);
            activeTable($table, isMouseDown1, startCellIndex1, startRowIndex1);
        } else {
            var _interval = Number($(this).val());
            loadIntervalTable($table, _interval);
            activeTable($table, isMouseDown2, startCellIndex2, startRowIndex2);
        }
    });

    //Change week
    $('.selectWeek').on('change' , function(){
        var asset = $(this).closest('.row')[0].classList[0];
        var week = $(this).val();

        socket.emit('/reqPlanning' , {asset : asset , week : week});
    });

});

//Button Working
$('.btnWorking').click(function () {
    var _table = $(this).closest('.row').find('table');
    _table.find('td.selected').css({
        'background': '#5cb85c'
    });
    _table.find('td.selected').addClass('working');
    _table.find('td.selected').hover(function () {
        $(this).css("opacity", 0.3);
    }, function () {
        $(this).css("opacity", 1);
    });
    _table.find('td.selected').each(function () {
        $(this).prop('planning', {
            date: $(this).closest('table').find('th').eq($(this).closest('td').index()).find('div').text(),
            startTime: $(this).closest('tr').find('td:first').text().split('-')[0],
            stopTime: $(this).closest('tr').find('td:first').text().split('-')[1],
            mode: 'working'
        });
    });
    _table.find('td.selected').removeClass('selected');
});

//Button Break
$('.btnBreak').click(function () {
    var _table = $(this).closest('.row').find('table');
    _table.find('td.selected').css({
        'background': 'gray'
    });
    _table.find('td.selected').addClass('break');
    _table.find('td.selected').hover(function () {
        $(this).css("opacity", 0.3);
    }, function () {
        $(this).css("opacity", 1);
    });
    _table.find('td.selected').each(function () {
        $(this).prop('planning', {
            date: $(this).closest('table').find('th').eq($(this).closest('td').index()).find('div').text(),
            startTime: $(this).closest('tr').find('td:first').text().split('-')[0],
            stopTime: $(this).closest('tr').find('td:first').text().split('-')[1],
            mode: 'break'
        });
    });
    _table.find('td.selected').removeClass('selected');

});

//Button Freetime
$('.btnFreetime').click(function () {
    var _table = $(this).closest('.row').find('table');
    _table.find('td.selected').css({
        'background': '#5bc0de'
    });
    _table.find('td.selected').addClass('freetime');
    _table.find('td.selected').hover(function () {
        $(this).css("opacity", 0.3);
    }, function () {
        $(this).css("opacity", 1);
    });
    _table.find('td.selected').each(function () {
        $(this).prop('planning', {
            date: $(this).closest('table').find('th').eq($(this).closest('td').index()).find('div').text(),
            startTime: $(this).closest('tr').find('td:first').text().split('-')[0],
            stopTime: $(this).closest('tr').find('td:first').text().split('-')[1],
            mode: 'freetime'
        });
    });
    _table.find('td.selected').removeClass('selected');
});

//Button Maintenance
$('.btnMaintenance').click(function () {
    var _table = $(this).closest('.row').find('table');
    _table.find('td.selected').css({
        'background': '#d9534f'
    });
    _table.find('td.selected').addClass('maintenance');
    _table.find('td.selected').hover(function () {
        $(this).css("opacity", 0.3);
    }, function () {
        $(this).css("opacity", 1);
    });
    _table.find('td.selected').each(function () {
        $(this).prop('planning', {
            date: $(this).closest('table').find('th').eq($(this).closest('td').index()).find('div').text(),
            startTime: $(this).closest('tr').find('td:first').text().split('-')[0],
            stopTime: $(this).closest('tr').find('td:first').text().split('-')[1],
            mode: 'maintenance'
        });
    });
    _table.find('td.selected').removeClass('selected');
});

//Button Reset
$('.btnReset').click(function () {
    var _table = $(this).closest('.row').find('table');
    _table.find('td.selected').css({
        'background': ''
    });
    _table.find('td.selected').removeClass('*');
    _table.find('td.selected').addClass('selectable');
    $('.selected').prop('planning', null);
    _table.find('td.selected').hover(function () {
        $(this).css("opacity", 0.3);
    }, function () {
        $(this).css("opacity", 1);
    });
    _table.find('td.selected').removeClass('selected');
});

//Apply button
$('.btnApply').click(function () {
    var assetDiv = $(this).closest('.row')[0];
    var repeatOption;
    if (assetDiv.classList[0] == 'testAndPackingAsset') repeatOption = $('input[name=tePa_repeat]:checked').val();
    else repeatOption = $('input[name=punc_repeat]:checked').val();

    var arrWeek = [];
    var chosenWeek = $(assetDiv).find('input[type=week]')[0].value;
    var endDate;

    switch(repeatOption) {
        case '0' : { //None repeat
            endDate = moment(chosenWeek).endOf('isoWeek').format('YYYY-MM-DD');
            arrWeek = getWeekArray(chosenWeek, endDate);
            break;
        };
        case '1' : { //Monthly repeat
            endDate = moment(chosenWeek).endOf('month').format('YYYY-MM-DD');
            arrWeek = getWeekArray(chosenWeek, endDate);
            break;
        };
        case '2' : { //Quarterly repeat
            endDate = moment(chosenWeek).endOf('quarter').format('YYYY-MM-DD');
            arrWeek = getWeekArray(chosenWeek, endDate);
            break;
        };
        case '3' : {
            endDate = moment(chosenWeek).endOf('year').format('YYYY-MM-DD');
            arrWeek = getWeekArray(chosenWeek, endDate);
            break;
        }
    }
    console.log(arrWeek);

    var planningObject = {
        asset: assetDiv.classList[0],
        week: arrWeek,
        interval: Number($(assetDiv).find('.selectInterval').val()),
        mode: {
            working: [],
            break: [],
            freetime: [],
            maintenance: []
        },
        repeat : repeatOption
    };
    $(assetDiv).find('table tbody td').each(function () {
        if (this.planning) {
            switch (this.planning.mode) {
                case 'working': {
                    planningObject.mode.working.push(this.planning);
                    break;
                };
                case 'break': {
                    planningObject.mode.break.push(this.planning);
                    break;
                };
                case 'freetime': {
                    planningObject.mode.freetime.push(this.planning);
                    break;
                };
                case 'maintenance': {
                    planningObject.mode.maintenance.push(this.planning);
                    break;
                };

            }
        }
    });
    //Emit to socket
    socket.emit('/newPlanning' , planningObject);
    console.log(planningObject);
    $('#spinnerModal').modal('show');
    setTimeout(function(){
        $('#spinnerModal').modal('hide');
        $('#successModal').modal('show');
    },2000);
});

//Load table depend on time interval
function loadIntervalTable($table, interval) {
    var startTime = moment('06:00', 'HH:mm').format('HH:mm');
    var rows = parseInt(24 * 60 / interval, 10);
    //Empty table when first load
    $table.find('tbody').empty();
    for (var i = 0; i < rows; i++) {
        var _startTime = moment(startTime, 'HH:mm').add(i * interval, 'minutes').format('HH:mm');
        var _stopTime = moment(_startTime, 'HH:mm').add(interval, 'minutes').format('HH:mm');
        var _htmlMarkup = `
        <tr>
            <td>` + _startTime + '-' + _stopTime + `</td>
            <td class="selectable"></td>
            <td class="selectable"></td>
            <td class="selectable"></td>
            <td class="selectable"></td>
            <td class="selectable"></td>
            <td class="selectable"></td>
            <td class="selectable"></td>
        </tr>
        `
        $table.find('tbody').append(_htmlMarkup);
    }
    switch(interval) {
        case 60 : {
            $table.addClass('table-60');
            break;
        }
        case 30 : {
            $table.addClass('table-30');
            break;
        }
        case 15 : {
            $table.addClass('table-15');
            break;
        }
    }
}

//Activate table cell click event
function activeTable(table, isMouseDown, startCellIndex, startRowIndex) {
    table.find("td.selectable").mousedown(function (e) {
        isMouseDown = true;
        var cell = $(this);

        table.find(".selected").removeClass("selected"); // deselect everything

        if (e.shiftKey) {
            selectTo(table, cell, startRowIndex + 1, startCellIndex);
        } else {
            cell.addClass("selected");
            startCellIndex = cell.index();
            startRowIndex = cell.parent().index();
        }

        return false; // prevent text selection
    })
        .mouseover(function () {
            if (!isMouseDown) return;
            table.find(".selected").removeClass("selected"); // deselect everything
            selectTo(table, $(this), startRowIndex + 1, startCellIndex);
        })
        .bind("selectstart", function () {
            return false;
        });

    $(document).mouseup(function () {
        isMouseDown = false;
    });
}

function selectTo(table , cell, startRowIndex, startCellIndex) {

    var row = cell.parent();
    var cellIndex = cell.index();
    var rowIndex = row.index() + 1;

    var rowStart, rowEnd, cellStart, cellEnd;

    if (rowIndex < startRowIndex) {
        rowStart = rowIndex;
        rowEnd = startRowIndex;
    } else {
        rowStart = startRowIndex;
        rowEnd = rowIndex;
    }

    if (cellIndex < startCellIndex) {
        cellStart = cellIndex;
        cellEnd = startCellIndex;
    } else {
        cellStart = startCellIndex;
        cellEnd = cellIndex;
    }

    for (var i = rowStart; i <= rowEnd; i++) {
        var rowCells = table.find("tr").eq(i).find("td");
        for (var j = cellStart; j <= cellEnd; j++) {
            rowCells.eq(j).addClass("selected");
        }
    }
}

//Load table with details
function loadTable(_$table, _$interval, _$dataObject) {
    _$table.closest('.row').find('input[type=week]').val(_$dataObject.week);
    _$table.closest('.row').find('.selectInterval').val(_$dataObject.interval);

    var arrHeader = ['Hour', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var arrTime = [];
    var arrWorking = [];
    var arrBreak = [];
    var arrFreetime = [];
    var arrMaintenance = [];

    if (($.isEmptyObject(_$dataObject.mode) || !_$interval)) {
        loadIntervalTable(_$table, 60);
        _$table.closest('.row').find('.selectInterval').val(60);
    } else {    //Having data
        for (var i = 0; i < 24 * 60 / _$interval; i++) {
            var _start = moment('06:00', 'HH:mm').add(i * _$interval, 'minutes').format('HH:mm');
            var _stop = moment(_start, 'HH:mm').add(_$interval, 'minutes').format('HH:mm');
            arrTime.push({ start: _start, stop: _stop });
        }
    
        loadIntervalTable(_$table, _$interval);
    
        if (_$dataObject.mode.working) {
            for (var i = 0; i < _$dataObject.mode.working.length; i++) {
                var columnIndex = arrHeader.indexOf(_$dataObject.mode.working[i].date);
                var rowIndex = null;
        
                for (var j = 0 ; j < arrTime.length; j++) {
                    if (_$dataObject.mode.working[i].startTime == arrTime[j].start) {
                        rowIndex = j;
                        arrWorking.push({columnIndex : columnIndex, rowIndex : rowIndex});
                        break;
                    }
                }
            }
        }
        
    
        if (_$dataObject.mode.break) {
            for (var i = 0; i < _$dataObject.mode.break.length; i++) {
                var columnIndex = arrHeader.indexOf(_$dataObject.mode.break[i].date);
                var rowIndex = null;
        
                for (var j = 0 ; j < arrTime.length; j++) {
                    if (_$dataObject.mode.break[i].startTime == arrTime[j].start) {
                        rowIndex = j;
                        arrBreak.push({columnIndex : columnIndex, rowIndex : rowIndex});
                        break;
                    }
                }
            }
        }
        
    
        if (_$dataObject.mode.freetime) {
            for (var i = 0; i < _$dataObject.mode.freetime.length; i++) {
                var columnIndex = arrHeader.indexOf(_$dataObject.mode.freetime[i].date);
                var rowIndex = null;
        
                for (var j = 0 ; j < arrTime.length; j++) {
                    if (_$dataObject.mode.freetime[i].startTime == arrTime[j].start) {
                        rowIndex = j;
                        arrFreetime.push({columnIndex : columnIndex, rowIndex : rowIndex});
                        break;
                    }
                }
            }
        }
        
    
        if ( _$dataObject.mode.maintenance) {
            for (var i = 0; i < _$dataObject.mode.maintenance.length; i++) {
                var columnIndex = arrHeader.indexOf(_$dataObject.mode.maintenance[i].date);
                var rowIndex = null;
        
                for (var j = 0 ; j < arrTime.length; j++) {
                    if (_$dataObject.mode.maintenance[i].startTime == arrTime[j].start) {
                        rowIndex = j;
                        arrMaintenance.push({columnIndex : columnIndex, rowIndex : rowIndex});
                        break;
                    }
                }
            }
        }
        
    
        for (var i = 0; i < arrWorking.length; i++) {
           var row =  _$table.find('tbody tr').eq(arrWorking[i].rowIndex)[0];
           var cell = row.cells[arrWorking[i].columnIndex];
           $(cell).css({'background' : '#5cb85c'});
        }
    
        for (var i = 0; i < arrBreak.length; i++) {
            var row =  _$table.find('tbody tr').eq(arrBreak[i].rowIndex)[0];
            var cell = row.cells[arrBreak[i].columnIndex];
            $(cell).css({'background' : 'gray'});
        }
    
        for (var i = 0; i < arrFreetime.length; i++) {
            var row =  _$table.find('tbody tr').eq(arrFreetime[i].rowIndex)[0];
            var cell = row.cells[arrFreetime[i].columnIndex];
            $(cell).css({'background' : '#5bc0de'});
        }
    
        for (var i = 0; i < arrMaintenance.length; i++) {
            var row =  _$table.find('tbody tr').eq(arrMaintenance[i].rowIndex)[0];
            var cell = row.cells[arrMaintenance[i].columnIndex];
            $(cell).css({'background' : '#d9534f'});
        }
    }


    
}

//Initialize view
function initView() {
    var currentWeek = moment().format(moment.HTML5_FMT.WEEK);
    $('.selectWeek').val(currentWeek);

    //Load edit table
    loadIntervalTable($table_editTestAndPacking, $interval_editTestAndPacking);
    activeTable($table_editTestAndPacking, isMouseDown1, startCellIndex1, startRowIndex1);

    loadIntervalTable($table_editPunching, $interval_editPunching);
    activeTable($table_editPunching, isMouseDown2, startCellIndex2, startRowIndex2);
    
    //Select asset
    if ($selectAsset == '0') {
        $('.testAndPackingAsset').show();
        $('.punchingAsset').hide()
    } else {
        $('.testAndPackingAsset').hide();
        $('.punchingAsset').show()
    }

    $('#selectAssetList').on('change', function(){
        $selectAsset = $(this).val();
        if ($selectAsset == '0') {
            $('.testAndPackingAsset').show();
            $('.punchingAsset').hide()
        } else {
            $('.testAndPackingAsset').hide();
            $('.punchingAsset').show()
        }
    })
}

//Get week array from the specified week
function getWeekArray(currentWeek, endDate) {
    var startDate = moment(moment(currentWeek).format('YYYY-MM-DD'));
    var endDate = moment(endDate);
    var _tempDate = startDate;
    var arrWeek = [];
    while(_tempDate < endDate) {
        arrWeek.push(moment(_tempDate).format(moment.HTML5_FMT.WEEK));
        _tempDate = moment(_tempDate).add(7, 'days');
    }
    return arrWeek;
}


