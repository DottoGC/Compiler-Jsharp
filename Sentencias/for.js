var cond = require("../Expresiones/expresion");
var c3d = require("../Codigo3D/generarCodigoC3D");
var c = require("../Arbol/constants");
var inst = require("../Instrucciones/cuerpo_INST");
var declaG = require("../Instrucciones/declaracion_INST");
var assigG = require("../Instrucciones/asignacion_INST");
var ambitos = require("../Arbol/ambitos");
var TS = require("../Arbol/TS");


exports.FOR = function FOR(raiz, TS_local){
    c3d.addCodigo("#empieza el codigo del FOR\n");
    var decla = raiz[1];
    //var res;
    //verifica si es declaración o asignación
    
    if(decla[0] == c.constantes.T_DECLARACION){
        TS.ban_for = true; //bandera que indica que es de tipo for para los ambitos de este ciclo 
        TS.ban_arreglo = true; //verifica si viene de la forma arr[3].length
        declaG.declaraciones_semantica(decla, TS_local);
        TS.ban_arreglo = false; //verifica si viene de la forma arr[3].length
        TS.ban_for = false;
    }else if(decla[0] == c.constantes.T_ASIGNACION){
        assigG.asignaciones_semantica(decla, TS_local);
    }
    //if(res != undefined){
        var tipo_for = raiz[2];
        if(tipo_for.length == 2){ //foreach
            c3d.addCodigo("#inicia el código de FOREACH\n");
            TS.ban_arreglo = true; //verifica si viene de la forma arr[3].length
            var res = cond.expresion(tipo_for[0], TS_local);
            TS.ban_arreglo = false;
            if(res != undefined && res.arreglo){
                logica_FOREACH(res,decla[2], tipo_for[1], TS_local);
            }
        }else if(tipo_for.length == 3){ //for normal
            c3d.addCodigo("#inicia el código de FOR\n");
            var etqv = c3d.getETQ();
            c3d.addCodigo(etqv+": #entra en FOR\n");
            c3d.pilaFor.push(etqv);
    
            //generar etiqueta continue
            var etqC = c3d.getETQ();
            c3d.pilaContinue.push(etqC);
            c3d.addCodigo(etqC+":\n");
            //***************************
            TS.ban_for = true;
            var res_cond = cond.expresion(tipo_for[0], TS_local); //condición del for
            TS.ban_for = false;
            if(res_cond != undefined && res_cond.tipo == c.constantes.T_BOOLEANO){ //si viniera un true/false devuelve un temporal  
                //var etqF = c3d.getETQ();      
               // c3d.addCodigo("ifFalse("+res_cond.valor+" == 1) goto "+etqF+";\n");
               // c3d.pilaETQF.push(etqF);
                        //pasar el tipo de ciclo
                    ambitos.pushAmbito(c.constantes.T_FOR);//vino un for, control para break, continue
                    //crear nuevo ambito agregando solo las variables que son parametro
                    var TS_nuevo = [];
                    for(nuevo_ambito of TS_local){
                       // if(nuevo_ambito.parametro == true){
                            TS_nuevo.push(nuevo_ambito);
                      //  }
                    }

                    inst.recorrer_cuerpo(tipo_for[2],TS_nuevo); //cuerpo del for
                    ambitos.popAmbito();
                    var TS_nuevo = [];


                    if(c3d.pilaSalida.length != 0){ 
                        //c3d.addCodigo("goto "+c3d.pilaSalida.pop()+";\n");
                        c3d.addCodigo(c3d.pilaSalida.pop()+": #sale en FOR\n");
                    }     

                    cond.expresion(tipo_for[1], TS_local);  //actualiza la variable que se declaró, devuelve un valor
                    
                     
                    //verificar si es mayor a 1 es porque vienen más for anidados
                    if(c3d.pilaFor.length > 1){
                        c3d.addCodigo("goto "+c3d.pilaFor.pop()+"; #sale en FOR\n");                        
                    }else if(c3d.pilaFor.length != 0){
                        c3d.addCodigo("goto "+c3d.pilaFor.pop()+"; #sale en FOR\n");
                    }
                
                    if(c3d.pilaContinue.length != 0){
                        c3d.pilaContinue.pop(); //sacar etiqueta para dejar la pila a 0
                    }
                
                    if(c3d.pilaETQF.length != 0){
                        c3d.addCodigo(c3d.pilaETQF.pop()+": #sale en FOR\n");
                    }
                    if(c3d.pilaBreak.length != 0){ //si viene breeak en for
                        c3d.addCodigo(c3d.pilaBreak.pop()+": #sale en FOR\n");
                    }
            }    
        }
}


function logica_FOREACH(ref, foreach, cuerpo, TS_local){

    var variable = TS.getVariable(foreach[0], TS_local); //retorna la variable arreglo o linkedlist
    if(variable != false){
        var tmp1 = c3d.getTMP();
        var cont = c3d.getTMP();
        var val = c3d.getTMP();
        var tmp2 = c3d.getTMP();
        var tmp3 = c3d.getTMP();
        var etq1 = c3d.getETQ();
        var etq2 = c3d.getETQ();

        c3d.addCodigo(tmp1+" = P + "+variable.pos+"; #obtener la posición de la variable del indice\n");
        c3d.addCodigo(cont+" =  "+ref.valor+"; #contador que itera en el heap\n");
        c3d.addCodigo(tmp3+" = "+ref.valor+" - 1; #se obtiene la posición del tamaño guardado\n");
        c3d.addCodigo(tmp2+" = Heap["+tmp3+"]; #obtener el tamaño del vector\n");

        c3d.addCodigo(etq1+":\n");
        c3d.addCodigo("if ("+tmp2+" == 0 ) goto "+etq2+"; #si es 0 se sale\n");
        c3d.addCodigo(val+" = Heap["+cont+"]; #obtiene el valor que esta en el arreglo\n");
        c3d.addCodigo("Stack["+tmp1+"] = "+val+"; #se le pasa el valor del heap\n");
       
        var TS_nuevo = [];
        for(nuevo_ambito of TS_local){
            //if(nuevo_ambito.parametro == true || nuevo_ambito.for){
                TS_nuevo.push(nuevo_ambito);
           // }
        }
        inst.recorrer_cuerpo(cuerpo,TS_nuevo);
        c3d.addCodigo(cont+" = "+cont+" + 1; #se sube en el heap del arreglo\n");
        c3d.addCodigo(tmp2+" = "+tmp2+" - 1; #se resta el iterador\n");
        c3d.addCodigo("goto "+etq1+"; #salta de nuevo al ciclo\n");
        c3d.addCodigo(etq2+":\n");
    }
}

