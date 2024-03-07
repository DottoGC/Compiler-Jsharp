var if_cond = require("../Expresiones/expresion");
var c3d = require("../Codigo3D/generarCodigoC3D");
var c = require("../Arbol/constants");
var inst = require("../Instrucciones/cuerpo_INST");
var ambitos = require("../Arbol/ambitos");


exports.WHILE = function WHILE(raiz ,TS_local){
    c3d.addCodigo("#empieza el codigo del WHILE\n");
    var etqV = c3d.getETQ();
    c3d.addCodigo(etqV+":\n");
    c3d.pilaETQV.push(etqV);
    
    //generar etiqueta continue
    var etqC = c3d.getETQ();
    c3d.pilaContinue.push(etqC);
    c3d.addCodigo(etqC+":\n");
    //***************************

    var res_cond = if_cond.expresion(raiz[1], TS_local);
    if(res_cond != undefined && res_cond.tipo == c.constantes.T_BOOLEANO){ //si viniera un true/false devuelve un temporal  
        var etqF = c3d.getETQ();  
        c3d.pilaETQF.push(etqF);    
        c3d.addCodigo("if ("+res_cond.valor+" <> 1) goto "+etqF+";\n");
    }
    ambitos.pushAmbito(c.constantes.T_WHILE);//control para break, continue
    //crear nuevo ambito agregando solo las variables que son parametro
    var TS_nuevo = [];
    for(nuevo_ambito of TS_local){
        //if(nuevo_ambito.parametro == true){
            TS_nuevo.push(nuevo_ambito);
        //}
    }
    inst.recorrer_cuerpo(raiz[2], TS_nuevo);
    ambitos.popAmbito(); //saca su tipo en la pila
    
    if(c3d.pilaSalida.length != 0){ //por si viene if's en su cuerpo
        c3d.addCodigo("goto "+c3d.pilaSalida.pop()+"; #sale en el while\n");
    }

    if(c3d.pilaContinue.length != 0){
        c3d.pilaContinue.pop(); //sacar etiqueta para dejar la pila a 0
    }

    c3d.addCodigo("goto "+c3d.pilaETQV.pop()+";\n");
    if(c3d.pilaETQF.length != 0){
        c3d.addCodigo(c3d.pilaETQF.pop()+": #ETQF sale en el while\n");
    }
    if(c3d.pilaBreak.length != 0){ //si viene breeak en for
        c3d.addCodigo(c3d.pilaBreak.pop()+": #break sale en el while\n");
    }
}

