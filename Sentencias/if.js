var if_cond = require("../Expresiones/expresion");
var c3d = require("../Codigo3D/generarCodigoC3D");
var c = require("../Arbol/constants");
var inst = require("../Instrucciones/cuerpo_INST");
var ambitos = require("../Arbol/ambitos");
var TS = require("../Arbol/TS");

var ban_ifelse = false;

exports.IF = function IF(raiz ,TS_local){
    c3d.addCodigo("#empieza el codigo del IF\n");
    var res_cond = if_cond.expresion(raiz[1], TS_local);

    if(res_cond != undefined && res_cond.tipo == c.constantes.T_BOOLEANO){ //si viniera un true/false devuelve un temporal  
        var etqF = c3d.getETQ();      
        c3d.addCodigo("if ("+res_cond.valor+" <> 1) goto "+etqF+";\n");
        c3d.pilaETQF.push(etqF);
    }
    //crear nuevo ambito agregando solo las variables que son parametro
    var TS_nuevo = [];
    for(nuevo_ambito of TS_local){
        //if(nuevo_ambito.parametro == true){
            TS_nuevo.push(nuevo_ambito);
        //}
    }
    //si vienen etiquetas verdaderas se generan en el OR
    while(c3d.pilaETQV.length != 0){
        c3d.addCodigo(c3d.pilaETQV.pop()+": #sale en IF\n");
    }

    inst.recorrer_cuerpo(raiz[2], TS_nuevo, TS.ban_funcion);
    var tmp_tipo = ambitos.popAmbito(); //verificar si el tipo de la pila es un ciclo
    if(tmp_tipo != undefined &&(tmp_tipo == c.constantes.T_FOR || tmp_tipo == c.constantes.T_WHILE || tmp_tipo == c.constantes.T_DOWHILE)){
        ambitos.pushAmbito(tmp_tipo);
        //entonces sacar las etiquetas de salida
       /* if(c3d.pilaSalida != undefined && c3d.pilaSalida.length != 0){

            c3d.addCodigo(c3d.pilaSalida.pop()+": //sale en IF;\n");
        }*/
    }

    var etSalida = c3d.getETQ();
    c3d.addCodigo("goto "+etSalida+"; #entra en IF\n");
    c3d.pilaSalida.push(etSalida);
    
    if(c3d.pilaETQF.length != 0){ // && !ban_ifelse){ //que no saque etiquetas falsas si viene un else if
        c3d.addCodigo(c3d.pilaETQF.pop()+": #sale en IF\n");
    }
    if(raiz[3] != "}"){ //verificar si viene si o sino
        IFELSE(raiz[3], TS_local);
    }
    
    if(c3d.pilaSalida != undefined && c3d.pilaSalida.length != 0){
        c3d.addCodigo(c3d.pilaSalida.pop()+": #sale en IF\n");
    }

}

function IFELSE(raiz, TS_local){

    if(raiz[0] == c.constantes.T_ELSE){ //solo viene else
        c3d.addCodigo("#empieza el codigo del ELSE\n");

        /*if(c3d.pilaETQF.length != 0){// && ban_ifelse){ //pueden venir más else if como padre y if y else como hijos
            c3d.addCodigo(c3d.pilaETQF.pop()+": //sale en ELSE\n");
        }*/
        //crear nuevo ambito agregando solo las variables que son parametro
        var TS_nuevo = [];
        for(nuevo_ambito of TS_local){
            //if(nuevo_ambito.parametro == true){
                TS_nuevo.push(nuevo_ambito);
            //}
        }
        inst.recorrer_cuerpo(raiz[1], TS_nuevo, TS.ban_funcion);           
        var tmp_tipo = ambitos.popAmbito(); //verificar si el tipo de la pila es un ciclo
        if(tmp_tipo != undefined &&(tmp_tipo == c.constantes.T_FOR || tmp_tipo == c.constantes.T_WHILE || tmp_tipo == c.constantes.T_DOWHILE)){
            ambitos.pushAmbito(tmp_tipo);
            //entonces sacar las etiquetas de salida
           // if(c3d.pilaSalida != undefined && c3d.pilaSalida.length != 0){
            //    c3d.addCodigo(c3d.pilaSalida.pop()+": //sale en ELSE\n");
           // }
        }    
        /*var etSalida = c3d.getETQ();
        c3d.addCodigo("goto "+etSalida+"; //entra en IF\n");
        c3d.pilaSalida.push(etSalida);*/
            
    }else if(raiz[0] == c.constantes.T_IFELSE){ //viene else if
        c3d.addCodigo("#empieza el codigo del IFELSE\n");

       /* if(c3d.pilaETQF.length != 0){ //pueden venir más else if
            c3d.addCodigo(c3d.pilaETQF.shift()+":\n");
        }*/
        ban_ifelse = true;
        exports.IF(raiz,TS_local);   
        ban_ifelse = false;
        //sacar etiquetas falsas
        //if(c3d.pilaETQF.length != 0){ //sacar las etiquetas que generó el else if
        //    c3d.addCodigo(c3d.pilaETQF.pop()+":\n");
       // }
    }
}
