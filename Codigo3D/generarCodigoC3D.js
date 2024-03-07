exports.pilaSalida = [];
exports.pilaReturn = [];
exports.cont_t = 0;//contador para temporales
exports.cont_l = 0;//contador para etiquetas


exports.codigo = "";//cadena C3D 


//exports.codigodebug = "";//control del debug
exports.pilaETQV = [];
exports.pilaETQF = [];
exports.pilaCasos = [];
exports.pilaContinue = [];
exports.pilaFor = []; //sucede porque se pierden las etiquetas de verdad si viene alguna sentencia dde seleccion
exports.pilaBreak = []; //se confunden con las etiquetas de salidas con if's
pilaExcepciones = [];


var cadenaG = "";//cadena para consola C3D


//DEVUELVE LA CADENA A MOSTRAR EN CONSOLA DE C3D
exports.getConsola = function getConsola(){
    return cadenaG;
}


//CONCATENA EN LA CADENA QUE SE VA A MOSTRAR EN CONSOLA
exports.setConsola = function setConsola(cadena){
    cadenaG += cadena+" ";
}


//RETORNA EL TEMPORAL SIGUIENTE
exports.getTMP = function getTMP(){
    return "t"+(exports.cont_t++);
}


//RETORNA LA ETIQUETA SIGUIENTE
exports.getETQ = function getETQ(){
    return "L"+(exports.cont_l++);
}



//this function return the message of the actual exception
exports.ExceptionChecking = function ExceptionChecking(exception){

    for(var i = 0; i < pilaExcepciones.length-1; i++){
        var obj = pilaExcepciones[i];
        if(obj.tipo == exception){
            return obj.message;
        }
    }

}


//this is a function that store all the exceptions in a runtime error
exports.ExceptionStorage = function ExceptionStorage(){
    var i = 1;
    var obj;
    while( i != 6){
        obj = new Object();
        switch(i){
            case 1:
                obj.type = 1;
                obj.message = "ArithmeticException: esta expresion viola las reglas definidas sobre operaciones aritmeticas";
            break;
            case 2:
                obj.type = 2;
                obj.message = "ArrayStoreException: se intenta almacenar un tipo equivocado dentro de un array de objetos";
            break;
            case 3:
                obj.type = 3;
                obj.message = "NumberFormatException: esta excepcion es dada por casteo explicito el formato de la cadena no es válido";
            break;
            case 4:
                obj.type = 4;
                obj.message = "ArrayIndexOutOfBoundsException: el tamaño del arreglo se sobrepaso al ya definido";
            break;
            case 5:
                obj.type = 5;
                obj.message = "NullPointerException: se esta accediendo a una posicion nula";
            break;
            case 6:
                obj.type = 6;
                obj.message = "UnCaughtException: no existe ningun try-catch para esta excepcion";
            break;
            case 7:
                obj.type = 7;
                obj.message = "ClassCastException: se está realizando una operación cast no soportada";
            break;
        }
        pilaExcepciones.push(obj);
        i++;
    }
}





//agregar código
exports.addCodigo = function addCodigo(codigo){
    exports.codigo += codigo;
    exports.codigodebug += codigo; //control del codigo generado en el debug
}


//agregar codigo de expresiones aritméticas
exports.generarCodigo = function generarCodigo(val1, val2, ope){

    var res = exports.getTMP();
    var tmp = res +" = "+val1+" "+ope+" "+val2+";\n";
    exports.addCodigo(tmp);
    return res;
}


//agregar codigo de expresiones relacionales
exports.generarCodigoRel = function generarCodigoRel(val1, val2, ope){
    var ETQF = exports.getETQ();
    exports.addCodigo("ifFalse("+val1+ope+val2+") goto "+ETQF+";\n");
    exports.pilaETQF.push(ETQF);
    //c3d.pilaETQV(c3d.getETQ());
}


//generar código de pila
exports.asignarStack = function asignarStack(pos, tmp_assig){
    var tmp = exports.getTMP();
    exports.addCodigo(tmp +" = P + "+pos+";\n");
    exports.addCodigo("Stack["+tmp+"] = "+tmp_assig+";\n");
}





