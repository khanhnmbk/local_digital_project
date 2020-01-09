var s7 = require('./model/s7_module');

var plc_object = {
    name : 'S7-1500',
    address : '192.168.1.21',
    port : 102,
    rack : 0,
    slot : 1
}

var variable_list = {
    Var_1 : 'DB105.DBD0',
    Var_2 : 'DB105.DBD4',
    Var_3 : 'DB105.DBD8',
    Var_4 : 'DB105.DBD12',
    Var_5 : 'DB105.DBD16',
    Var_6 : 'DB105.DBD20'
};

var variable_name = Object.values (variable_list);

s7.initConnection(plc_object.name, plc_object.address, plc_object.port, plc_object.rack, plc_object.slot, function(s7_node){
    if (!s7_node)
    {
        console.log('Cannot connect to PLC ' + plc_object.address);
        return -1;
    }
    else {
        console.log('Connected to PLC ' + plc_object.address);
        variable_list.Var_1 = s7.modifyAddress(variable_list.Var_1, 'Double');
        variable_list.Var_2 = s7.modifyAddress(variable_list.Var_2, 'Double');
        variable_list.Var_3 = s7.modifyAddress(variable_list.Var_3, 'uDInt');
        variable_list.Var_4 = s7.modifyAddress(variable_list.Var_4, 'uDInt');
        variable_list.Var_5 = s7.modifyAddress(variable_list.Var_5, 'uDInt');
        variable_list.Var_6 = s7.modifyAddress(variable_list.Var_6, 'uDInt');
        const arrVarlue = Object.values(variable_list);
        s7.initReadingList(s7_node.s7Node, arrVarlue);
        s7.readAllData(s7_node.s7Node, function(result) {
            console.log (result);
            var result_object = {};
            var array_values = Object.values (result);
            for (var i = 0; i < array_values.length; i++)
            {
                result_object[variable_name[i]] = array_values[i];
            }
            console.log (result_object);
        });
    }

})
