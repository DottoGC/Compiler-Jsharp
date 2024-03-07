var main = require('../../Instrucciones/main_INST');
var c3d = require("../../Codigo3D/generarCodigoC3D");
var TS = require("../../Arbol/TS");
var c = require("../../Arbol/constants");
const fs = require('fs');


//HANDLER (POST-REQUEST) > PARA PARSEAR UNA CADENA DE ENTRADA MEDIANTE UN POST-REQUEST
exports.parsear = (req, h) => {
    var input = req.payload;//CARGA UTIL 
    
    main.compilar(input);
    
    return true;
}


//HANDLER (GET-REQUEST) > QUE OBTIENE CADENA PARA MOSTRAR EN CONSOLA HLC
exports.getConsola = (req, h) => {
    return main.cadConsolaHLC;
}


//HANDLER (GET-REQUEST) > OBTIENE LA CADENA DE CODIGO 3D PARA MOSTRAR EN EDITOR HLC
exports.getCodigo3D = (req, h) => {
    
    
    if(c3d.codigo!= undefined || c3d.codigo!="" ){
        
        //Preparacion cadena de todos los temporales a declarar
        var varTs="var ";        
        if(c3d.cont_t > 0){
            for(var i = 0; i < c3d.cont_t; i++){
                varTs+="t"+i+",";
            }
            varTs=varTs.substring(0,varTs.length-1);
            varTs=varTs+";\n";

            
            c3d.codigo=varTs+"var Stack[];\n"
            +"var Heap[];\n"
            +"var P = 0;\n"
            +"var H = 0;\n"
            +c3d.codigo;  
        }
        

    }
    
    
    console.log("Codigo 3D: "+c3d.codigo );
    return c3d.codigo;
}


//HANDLER (GET-REQUEST) > OBTIENE LA CADENA PARA MOSTRAR EN CONSOLA 3AC
exports.getConsola3D = (req, h) => {
    return c3d.getConsola();
}


//HANDLER (POST-REQUEST) > QUE LIMPIA OBJETOS NECESARIOS PARA UNA NUEVA CORRIDA
exports.limpiador = (req, h) => {
    var input = req.payload; 
    
    try {
        main.posV = 0; //POSICION RELATIVA DE LAS VARIABLES GLOBALES
        main.posF = 0;
        
        TS.TS_Errores=[];
        TS.TS_global=[];
        TS.TS_locales=[];
        TS.TS_Funciones=[];
        TS.TS_main=[];
        
        TS.ban_archivoActual="";
        TS.ban_main=0;
        TS.ban_entro = false;
        TS.ban_funcion="undefined";
        TS.ban_for=false;
        
        
        c3d.pilaSalida = [];
        c3d.pilaReturn = [];
        c3d.cont_t=0;
        c3d.cont_l=0;
        c3d.codigo="";
        
        
        fs.unlinkSync('./src/images/image0.png');
        fs.unlinkSync('./src/images/image0.dot');
        
        //console.log('Objetos eliminados correctamente. Listo nueva compilacion. ');        
        return true;
    } catch(err) {
         //console.log('No se pudo limpiar objetos necesarios para otra corrida.: '+err);
        return true;
    }
    
    //Por alguna razon al entrar al catch, no llega a mandar este true, xeso los dejamos adentro
    return true;
}


//HANDLER (POST-REQUEST) > QUE RECIBE EL NOMBRE DEL TAB QUE SE ESTA COMPILANDO
exports.nombreTabCompilando = (req, h) => {
    var input = req.payload;    
    //Le avisamos a la tabla de simbolos el nombre del archivo actual q se va a compilar
    //main.nombreArchivoPadreEjecutandose=input;
    TS.ban_archivoActual =input;

    return true;
}


//HANDLER (GET-REQUEST) > OBTIENE TABLA DE ERRORES
exports.getTablaErrores = (req, h) => {
    var bodyTerrores = "<tr><th>Tipo</th><th>Línea</th><th>Columna</th><th>Descripción</th></tr>";

    
    if (TS.TS_Errores != undefined) {//Entra si hay errores
        var json_objeto;
        
        for (i = 0; i <TS.TS_Errores.length; i++) {
            json_objeto = TS.TS_Errores[i];
            
            bodyTerrores += "<tr><td>" + json_objeto.tipo + "</td><td>" + json_objeto.linea + 
            "</td><td>" + json_objeto.columna + "</td><td>"+json_objeto.descripcion+"</td></tr>";
        }
    }
    
    var finbodyTerrores =  "<table>"+ bodyTerrores+ "</table>";
    return finbodyTerrores;
}


//HANDLER (GET-REQUEST) > OBTIENE LA TABLA DE SIMBOLOS
exports.getTS = (req, h) => {
    /*
    var body = "<tr><th>Simbolo</th><th>Identificador</th><th>TipoDato</th><th>Valor</th><th>Dimensión</th><th>Posición</th><th>Ámbito</th><th>No. Parámetros</th><th>Tipo parámetros</th><th>Padre</th></tr>";
    */   
    var body = "<tr><th>Simbolo</th><th>Identificador</th><th>TipoDato</th><th>Dimensión</th><th>Posición</th><th>Ámbito</th><th>No. Parámetros</th><th>Tipo parámetros</th><th>Padre</th></tr>";
    
    var tmp_global;
    var j;            
    if(TS.TS_global != undefined){
        for(j = 0; j < TS.TS_global.length; j++){ //recorrer las declaraciones globales
            tmp_global = TS.TS_global[j];
            //lista de modificadores
            body +="<tr><td>VARIABLE</td>";//Simbolo
            
            body += "<td>"+tmp_global.ID+"</td>";//Identificador
            body += "<td>"+transformar_tipos(tmp_global.tipo)+"</td>";//Tipo de dato
            
            //body += "<td>"+tmp_global.valor+"</td>";//Valor
            
            body += "<td>"+tmp_global.dimen+"</td>";//Dimension
            body += "<td>"+tmp_global.pos+"</td>";//Posicion relativa
            body += "<td>"+transformar_ambito(tmp_global.ambito)+"</td>"; //Ambito
            body += "<td>---</td>;";//No.Parametros
            body += "<td>---</td>;"; //Tipo.Parametros
            body += "<td>"+tmp_global.padre+"</td>";//Padre
            body+= "</tr>";
        }
    }
    
            
    if(TS.TS_Funciones != undefined){
        for(j = 0 ; j < TS.TS_Funciones.length; j++){ //recorrer las funciones globales
            tmp_global = TS.TS_Funciones[j];
            body +="<tr><td>FUNCION</td>";//Simbolo
            
            body += "<td>"+tmp_global.ID+"</td>";//Identificador
            body += "<td>"+transformar_tipos(tmp_global.tipo)+"</td>";//Tipo de dato
            
      //      body += "<td>"+tmp_global.valor+"</td>";//Valor
            
            body += "<td>"+tmp_global.dimen+"</td>";//Dimension
            body += "<td>"+tmp_global.pos+"</td>";//Posicion relativa
            body += "<td>"+transformar_ambito(tmp_global.ambito)+"</td>";//Ambito
            body += "<td>"+tmp_global.no_params+"</td>";//No.Parametros
            body += "<td>"+getTiposParametros(tmp_global)+"</td>";//Tipo.Parametros
            body += "<td>"+tmp_global.padre+"</td>";//Padre
            body += "</tr>";
        }
    }
    

    
    if(TS.TS_locales != undefined){
        for(j = 0; j < TS.TS_locales.length; j++){ //recorrer las declaraciones globales
            tmp_global = TS.TS_locales[j];
            //lista de modificadores
            body +="<tr><td>VARIABLE</td>";//Simbolo
            
            body += "<td>"+tmp_global.ID+"</td>";//Identificador
            body += "<td>"+transformar_tipos(tmp_global.tipo)+"</td>";//Tipo de dato
            
        //    body += "<td>"+tmp_global.valor+"</td>";//Valor
            
            body += "<td>"+tmp_global.dimen+"</td>";//Dimension
            body += "<td>"+tmp_global.pos+"</td>";//Posicion relativa
            body += "<td>"+tmp_global.ambito+"</td>"; //Ambito
            body += "<td>---</td>;";//No.Parametros
            body += "<td>---</td>;"; //Tipo.Parametros
            body += "<td>"+tmp_global.padre+"</td>";//Padre
            body+= "</tr>";
        }
    }
    
    var finbody = "<table>"+body+"</table>";
    
    return finbody;    
}



//TRANSFORMA LOS NUMEROS_DE_TIPODATO A SUS PALABRAS
function transformar_tipos(tipo){
    switch(tipo){
        case c.constantes.T_ENTERO:
            return "Integer";
        case c.constantes.T_DECIMAL:
            return "Double";
        case c.constantes.T_CARACTER:
            return "Char";
        case c.constantes.T_BOOLEANO:
            return "Boolean";
        case c.constantes.T_CADENA:
            return "String";
        default:
            return tipo;
    }
}


//TRANSFORMA LOS NUMEROS_DE_AMBITOS A SUS PALABRAS
function transformar_ambito(ambito){
    if(ambito == c.constantes.T_GLOBAL){
        return "Global";
    }else{
        return "Local";
    }
}


//OBTIENE LISTA DE TIPOS DE LOS PARAMETOS
function getTiposParametros(tmp_global){
    var body = "";
    if(tmp_global.params != undefined){
        for(var k = 0 ; k < tmp_global.params.length; k++){
            body += transformar_tipos(tmp_global.params[k].tipo)+",";
        }
       body = body.substring(0, body.length-1);
    }else{
        body = "---"; 
    }
    return body; 
}




