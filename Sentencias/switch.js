var exp = require("../Expresiones/expresion");
var c3d = require("../Codigo3D/generarCodigoC3D");
var c = require("../Arbol/constants");
var inst = require("../Instrucciones/cuerpo_INST");
var ambitos = require("../Arbol/ambitos");
var TS = require("../Arbol/TS");
var json_objeto;


exports.SWITCH = function SWITCH(raiz, TS_Local){
    c3d.addCodigo("#empieza el codigo del SWITCH\n");
    var r_exp = exp.expresion(raiz[1], TS_Local);
    var res; //puede traer un retornar en los switchs
    if(r_exp!=undefined && (r_exp.tipo == c.constantes.T_CARACTER || r_exp.tipo == c.constantes.T_ENTERO 
        || r_exp.tipo == c.constantes.T_DECIMAL || r_exp.tipo == c.constantes.T_BOOLEANO)){
            if(raiz[2] != "}"){
                res = SWITCH_CASES(raiz[2], TS_Local, r_exp);
                if(c3d.pilaSalida.length != 0){
                    c3d.addCodigo(c3d.pilaSalida.pop()+":\n");
                }
                if(c3d.pilaBreak.length != 0){ //si viene breeak en for
                    c3d.addCodigo(c3d.pilaBreak.pop()+":\n");
                }
            }
    }else{
        //error los tipos deben ser primitivos
        json_objeto = new Object();
        json_objeto.tipo = "Semantico";
        json_objeto.linea = raiz.linea;
        json_objeto.columna = raiz.columna;
        json_objeto.descripcion = "Error en SWITCH los tipos deben ser primitivos";
        TS.TS_Errores.push(json_objeto);
    }
    return res;
}

//existen varios cases
function SWITCH_CASES(raiz, TS_Local, t_exp){
    var tmp_casesl;
    var res;
    for(tmp_casesl of raiz){
        c3d.addCodigo("#empieza el codigo de los CASES\n");
        res = case_list(tmp_casesl[0], TS_Local, t_exp);
        if(res != c.constantes.T_ERROR){    
        //crear nuevo ambito agregando solo las variables que son parametro
            var TS_nuevo = [];
            for(nuevo_ambito of TS_Local){
                //if(nuevo_ambito.parametro == true){
                    TS_nuevo.push(nuevo_ambito);
                 //   }
            }    
            ambitos.pushAmbito(c.constantes.T_SWITCH); //vino un caso del switch
            inst.recorrer_cuerpo(tmp_casesl[1], TS_nuevo); //cuerpo del caso
            var tipo_tmp = ambitos.popAmbito();//verificar si está dentro de un ciclo
            if(tipo_tmp == c.constantes.T_WHILE || tipo_tmp == c.constantes.T_DOWHILE || tipo_tmp == c.constantes.T_FOR){
                ambitos.pushAmbito(tipo_tmp);                        
            }else if(tipo_tmp == c.constantes.T_SWITCH){ //si vino solo un switch-case se saca de la pila
                ambitos.popAmbito();
            }

            while(c3d.pilaCasos.length != 0){
                c3d.addCodigo(c3d.pilaCasos.pop()+":\n");
            }
        }else{
            //no se puede generar código porque hubo errores en el switch vino más de un default.
            json_objeto = new Object();
            json_objeto.tipo = "Semantico";
            json_objeto.linea = tmp_casesl.linea;
            json_objeto.columna = tmp_casesl.columna;
            json_objeto.descripcion = "Error no se puede generar código porque hubo errores en el SWITCH vino más de un default";
            TS.TS_Errores.push(json_objeto);
            break;
        }
    }
    
}

//un switch tiene varias listas de expresiones en su cases
function case_list(raiz, TS_Local, t_exp){
    var tmp_casesl ;
    var res ;
    var cont_default = 0;
        for(tmp_casesl of raiz){
            if(tmp_casesl == "default" && cont_default == 0){
                res = c.constantes.T_DEFAULT;
                cont_default = 1;
            }else if(tmp_casesl == "default" && cont_default == 1){
                res = c.constantes.T_ERROR; //error no pueden haber más de un default
                break;
            }else{
                var c_exp = exp.expresion(tmp_casesl, TS_Local);
                if(c_exp!=undefined && (c_exp.tipo == c.constantes.T_CARACTER || c_exp.tipo == c.constantes.T_ENTERO 
                    || c_exp.tipo == c.constantes.T_DECIMAL || c_exp.tipo == c.constantes.T_BOOLEANO) && t_exp.tipo == c_exp.tipo){
                        var etq_f = c3d.getETQ();
                        c3d.addCodigo("if ("+t_exp.valor+" <> "+c_exp.valor+") goto "+etq_f+";\n");
                        c3d.pilaCasos.push(etq_f);    //porque vienen varios casos y para no interrumpir el flujo de las etiquetas falsas
                    }else{
                        //error los tipos deben ser primitivos
                        json_objeto = new Object();
                        json_objeto.tipo = "Semantico";
                        json_objeto.linea = tmp_casesl.linea;
                        json_objeto.columna = tmp_casesl.columna;
                        json_objeto.descripcion = "Error los tipos de un SWITCH deben de ser primitivos";
                        TS.TS_Errores.push(json_objeto);
                    }
            }
        }
        return res;
}

