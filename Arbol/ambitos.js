
var ambito = [];

//hace push al ambito actual
exports.pushAmbito = function pushAmbito(ts){
    ambito.push(ts);
}

//hace pop cuando sale del ambito anterior
exports.popAmbito = function popAmbito(){
    return ambito.pop();
}
