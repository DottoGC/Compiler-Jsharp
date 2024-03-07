var c = require("../Arbol/constants");
var TS = require("../Arbol/TS");
var exp  = require("../Expresiones/expresion");
var c3d = require("../Codigo3D/generarCodigoC3D");
var llamada = require("../Instrucciones/llamada_INST");
var cuerpo = require("../Instrucciones/cuerpo_INST");

var json_objeto;

exports.accesos = function accesos(l_accesos, TS_local){

    var id = TS.getVariable(l_accesos[1], TS_local);
    if(id != false && id.esLista == true){
        var obj  = l_accesos[2];
        for(objeto of obj){ //porque son accesos
            switch(objeto[0]){
                case c.constantes.T_ADD:
                    linkedlist_add(id, objeto[1], TS_local);
                break;
                case c.constantes.T_CLEAR:
                    linkedlist_clear(id);
                break;
                case c.constantes.T_REMOVE:
                    exports.linkedlist_get(id, objeto[1], 0, TS_local, c.constantes.T_REMOVE);
                break;
                case c.constantes.T_SET:
                    exports.linkedlist_get(id, objeto[1], objeto[2], TS_local, c.constantes.T_SET);
                break;
            }
        }
    }else if(id != false){ //es una variable que no es lista
        //esta bandera me indica que el objeto que va ser utilizando viene como parámetro
        if(id.parametro && id.referencia){
            llamada.ban_esparametro = true;
        }
        var resultado = exports.accesos_llamadas(l_accesos, TS_local, false);
        llamada.ban_esparametro = false;
        return resultado;
    }else{
        //es otro tipo de acceso
            var existe_clase = TS.existe_clase(l_accesos[1], false);//verificar si existe la clase.
            if(existe_clase != false){
                var padre;
                var l_global, l_funciones;
                var vino_super = false;
                var json_objeto;
                for(objeto of l_accesos[2]){
                    switch(objeto[0]){
                        case c.constantes.T_ID:
                            if(vino_super){
                                vino_super = false;
                                var existe_global = TS.existe_clase(objeto[1], l_global);
                                if(existe_global !=undefined){
                                    if(existe_global.tipo != c.constantes.T_ID){
                                        if(existe_global.valor != undefined){
                                            var tmp1 = c3d.getTMP();
                                            c3d.addCodigo(tmp1+" = "+existe_global.valor+"; //se le setea el valor a este temporal\n");
                                            json_objeto = new Object();
                                            json_objeto.tipo = existe_global.tipo;
                                            json_objeto.valor = tmp1;
                                            return json_objeto;
                                        }else{//null pointer exception
                                            c3d.addCodigo("exception = 5; //nullpointerexception");
                                            break;
                                        }
                                    }else{
                                        //es un objeto en la superclase
                                        l_global = existe_global.l_global;
                                    }
                                }else{
                                    //esta variable del super no existe.
                                    json_objeto = new Object();
                                    json_objeto.tipo = "semantico";
                                    json_objeto.linea = objeto.linea;
                                    json_objeto.columna = objeto.columna;
                                    json_objeto.descripcion = "La variable del super no existe";
                                    TS.TS_Errores(json_objeto);
                                }
                            }else{  
                                //acceso al objeto actual
                                var existe_variable = TS.getVariable(objeto[1], existe_clase.l_global);
                                if(existe_variable != false){
                                    //verificar si es estatico
                                    if(existe_variable.modificador == c.constantes.T_STATIC){
                                        var tmp1 = c3d.getTMP();
                                        var tmp3 = c3d.getTMP();

                                        if(existe_variable.ambito == c.constantes.T_GLOBAL){
                                            var tmp2 = c3d.getTMP();
                                            c3d.addCodigo(tmp1+" = P + "+existe_variable.pos+"; //obtener la posición de la variable\n");
                                            c3d.addCodigo(tmp2+" = Stack["+tmp1+"]; //obtener referencia de la variable estática\n");
                                            c3d.addCodigo(tmp3+" = Heap["+tmp2+"]; //valor de la variable estatica global\n");
                                        }else{
                                            c3d.addCodigo(tmp1+" = P + "+existe_variable.pos+"; //obtener la posición de la variable\n");
                                            c3d.addCodigo(tmp3+" = Stack["+tmp1+"]; //obtener valor de la variable estática\n");
                                        }
                                        json_objeto = new Object();
                                        json_objeto.tipo = existe_variable.tipo;
                                        json_objeto.valor = tmp3;
                                        return json_objeto;
                                    }
                                }
                            }
                        break;
                        case c.constantes.T_SUPER:
                            padre = TS.existe_clase(existe_clase.padre, false);//buscar el padre
                            if(padre != undefined){
                                l_global = padre.l_global; //obtiene la lista de globales de esta clase
                                l_funciones = padre.l_funciones; //obtiene la lista de funciones de esta clase
                                vino_super = true;
                            }else{
                                // error no tiene super clase
                                json_objeto = new Object();
                                json_objeto.tipo = "semantico";
                                json_objeto.linea = objeto.linea;
                                json_objeto.columna = objeto.columna;
                                json_objeto.descripcion = "La variable del super no existe";
                                TS.TS_Errores(json_objeto);

                                break;
                            }
                        break;
                        case c.constantes.T_LLAMADA:
                            if(vino_super){
                                vino_super = false;
                                var res_llamada= llamada.generarLlamada(objeto, TS_local, true);
                                if(res_llamada != undefined && res_llamada != c.constantes.T_ID){
                                    return res_llamada;
                                }else{ //es referencia
                                    continue;
                                }
                            }else{
                                //accesos a funcion del objeto actual
                                //TODO falta el acceso a funciones normales
                                var res_ll = llamada.generarLlamada(objeto, TS_local, true);
                                if(res_ll != undefined){
                                    return res_ll;
                                }else{
                                    continue;
                                }
                            }
                        default:
                            // este acceso no es permitido
                            json_objeto = new Object();
                            json_objeto.tipo = "semantico";
                            json_objeto.linea = objeto.linea;
                            json_objeto.columna = objeto.columna;
                            json_objeto.descripcion = "Este acceso no es permitido";
                            TS.TS_Errores(json_objeto);

                        break;
                    }
                }
            }
    }
}


exports.accesos_llamadas = function accesos_llamadas(l_accesos, TS_local, retorna){
    var existe_var = TS.getVariable(l_accesos[1], TS_local);//buscar variable objeto
    var tmp_llamada;
    if(existe_var != false && existe_var.referencia == true ||
        existe_var != false && existe_var.tipo == c.constantes.T_ID){
        for(acc of l_accesos[2]){
            if(acc[0].length > 0){
                    acc = acc[0];
            }
            switch(acc[0]){
                case c.constantes.T_LLAMADA:
                //verifica si se está accediendo a una variable que es parametro y es referencia
                    if(existe_var.referencia && existe_var.parametro){
                        llamada.ban_esparametro = true;
                    }
                    tmp_llamada = llamada.generarLlamada(acc, TS_local, retorna, existe_var);
                    llamada.ban_esparametro = false;
                break;
                case c.constantes.T_ID:
                    var existe = TS.getVariable(acc[1], TS_local);
                    if(existe != false && existe.ambito == c.constantes.T_GLOBAL){
                        json_objeto = new Object();
                        if(TS.ban_analisis == false){
                            var tmp1 = c3d.getTMP();
                                //verificar si su padre es parámetro 
                                if(existe_var.parametro && existe_var.referencia){
                                    var tmp1_p = c3d.getTMP();
                                    var tmp2_p = c3d.getTMP();
                                    c3d.addCodigo(tmp1_p+" = P + "+existe_var.pos+"; //posicion del parámetro\n");
                                    c3d.addCodigo(tmp2_p+" = Stack["+tmp1_p+"]; //obtener la referencia de este objeto\n");
                                    c3d.addCodigo(tmp1+" = "+tmp2_p +" + "+existe.pos+"; //posición de la variable global\n");
                                    //verificar si viene en asignacion se retorna un valor
                                        //verificar si es objeto se retorna una ref
                                        
                                    //sino viene en asignacion se retorna la referencia
                                        //si es objeto
                                }else{
                                    c3d.addCodigo(tmp1+" = "+existe_var.valor+" + "+existe.pos+"; //posición de la variable global\n");
                                }
                            json_objeto.valor = tmp1;
                        }
                        json_objeto.tipo = existe.tipo;
                        tmp_llamada = json_objeto;
                    }
                break;
            }
        }
        //verificar si es con asignacion obj.ob.var = EXP
        if(l_accesos[3] != undefined){
            var es_expresion = exp.expresion(l_accesos[3], TS_local);
            if(es_expresion != undefined && tmp_llamada != undefined){
                if(es_expresion.tipo == tmp_llamada.tipo){
                    c3d.addCodigo("Heap["+tmp_llamada.valor+"] = "+es_expresion.valor+"; //se le setea el valor\n");
                }
            }
        }
        llamada.ban_parametros = false;
        return tmp_llamada;
    }else{
        json_objeto = new Object();
        json_objeto.tipo = "semantico";
        json_objeto.linea = l_accesos[2].linea;
        json_objeto.columna = l_accesos[2].columna;
        json_objeto.descripcion = "Esta variable no existe "+l_accesos[1];
        TS.TS_Errores.push(json_objeto);
    }

}


//funcion que agrega datos a la lista 
function linkedlist_add(variable, cuerpo, TS_local){

    var res_exp = exp.expresion(cuerpo, TS_local);
    if(res_exp != undefined && res_exp.tipo == variable.tipo){
        var tmp1 = c3d.getTMP();
        var tmp2 = c3d.getTMP();
        var tmp3 = c3d.getTMP();
        var tmp4 = c3d.getTMP();
        var tmp5 = c3d.getTMP();
        var tmp6 = c3d.getTMP();
        var tmp7 = c3d.getTMP();
        var tmp8 = c3d.getTMP();
        var tmp9 = c3d.getTMP();

        var etq1 = c3d.getETQ();
        var etq2 = c3d.getETQ();
        var etq3 = c3d.getETQ();

        c3d.addCodigo(tmp1+" = P + "+variable.pos+"; //posicionarse en la referencia del objeto creado\n");//posicionarse en la referencia del objeto se creo
        c3d.addCodigo(tmp2+" = Stack["+tmp1+"]; //obtener la referencia\n");
        c3d.addCodigo(tmp3+" = Heap["+tmp2+"]; //posicion de la referencia al siguiente dato\n");

        c3d.addCodigo(etq3+":\n");
        c3d.addCodigo(tmp4+" = "+tmp2+" + 2; //posicion del indice de la lista\n");
        c3d.addCodigo("ifFalse("+tmp3+" == 0) goto "+etq1+"; //sino es 0 entonces se pasa a la siguiente referencia\n");
        c3d.addCodigo(tmp5+" = "+tmp2+" + 1; //posicion del valor a agregar\n");
        c3d.addCodigo("Heap["+tmp5+"] = "+res_exp.valor+"; //se agrega el valor en la lista\n");
        c3d.addCodigo(tmp6+" = H; //puntero de heap libre\n");
        c3d.addCodigo("H = H + 3; //se reservan 3 posiciones de memoria en el heap\n");
        c3d.addCodigo("Heap["+tmp2+"] = "+tmp6+"; //es un apuntador al siguiente espacio reservado en el heap\n");
        c3d.addCodigo(tmp7 +" = Heap["+tmp4+"]; //obtener el valor del indice \n");
        c3d.addCodigo(tmp8 +" = "+tmp7+" + 1; //se suma el indice para almacenarlo en la siguiente posición vacia\n");
        c3d.addCodigo(tmp9+" = "+tmp6+" + 2; //esta en la nueva posicion del indice\n");
        c3d.addCodigo("Heap["+tmp9+"] = "+tmp8+"; //se almacena la sumatoria del indice\n");
        c3d.addCodigo("goto "+etq2+"; //etiqueta de salida\n");
        c3d.addCodigo(etq1+":\n");
        c3d.addCodigo(tmp2+" = "+tmp3+"; //se obtiene el puntero del heap actual\n");
        c3d.addCodigo(tmp3+" = Heap["+tmp3+"]; //si no es 0 significa que existe otra referencia en este espacio\n");
        c3d.addCodigo("goto "+etq3+";//regresa al ciclo a verificar si existe una posición vacía\n");
        c3d.addCodigo(etq2+":\n");
    }else{
        // error no se puede almacenar un elemento que no es del mismo tipo de la lista linkedlist
        json_objeto = new Object();
        json_objeto.tipo = "semantico";
        json_objeto.linea = assig.linea;
        json_objeto.columna = assig.columna;
        json_objeto.descripcion = "Error no se puede almacenar un elemento que no es el mismo tipo de la lista linkelist.";
        TS.TS_Errores.push(json_objeto);

    }

}

//funcion que recorre los accesos a un objeto
exports.obj_accesos_this = function obj_accesos_this(nombre_clase,l_accesos, assig, TS_local){
    var clase = TS.existe_clase(nombre_clase, false);
    var etq2;
    var tmp_salida = [];
    if(clase != false){
        var tam_clase = clase.l_global; //obtener la lista de globales de la clase
        var existe_var;
        var v= l_accesos[0];
            switch(v[0]){
                case c.constantes.T_ID: //verificar si existe en lo global
                    existe_var = TS.getVariable(v[1], tam_clase);
                    var tmp_cadena = ""; //se llevará una cadena temporal para los accesos.
                    var cont_acc = 0; //se contaran cuantos accesos existieron.
                    if(existe_var != false){ 
                        if(existe_var.tipo != c.constantes.T_ID){ //si es un ID es un objeto

                            cont_var = 0;
    
                        }else{ //recorrer sus accesos
                            var acc;
                            var cont_var = 0;
                            var vino_llamada = false;
                            var ret_llamada;
                            for(acc of l_accesos){
                                switch(acc[0]){
                                    case c.constantes.T_ID: //puede ser una variable o otro objeto
                                        existe_var = TS.getVariable(acc[1], tam_clase);
                                        if(existe_var != false && vino_llamada == false){ 
                                            if(existe_var.tipo != c.constantes.T_ID && cont_var == 0){ //si es un ID es un objeto
                                                var assig_res = exp.expresion(assig, TS_local);
                                                if(assig_res != undefined){
                                                    var tmp5 = c3d.getTMP();
                                                    var tmp6 = c3d.getTMP();
                                                    var tmp7 = c3d.getTMP();
                                                    c3d.addCodigo(tmp5+" = P + 0; //paso de la referencia del objeto\n");
                                                    c3d.addCodigo(tmp6+" = Stack["+tmp5+"]; //obtener el valor de la referencia\n");
                                                    c3d.addCodigo(tmp7+" = "+tmp6+" + "+existe_var.pos+"; //se suma la referencia más la posición de la variable\n");
                                                    c3d.addCodigo("Heap["+tmp7+"] = "+assig_res.valor+"; //asignar el valor a esta posición global en el heap\n");
                                                    c3d.addCodigo(tmp_salida.pop()+":\n");
                                                    cont_var = 1;
                                                }
                                            }else{ //es objeto
                                                if(cont_var > 0){
                                                    //error no puede venir más accesos a variables
                                                    json_objeto = new Object();
                                                    json_objeto.tipo = "semantico";
                                                    json_objeto.linea = l_accesos[0].linea;
                                                    json_objeto.columna = l_accesos[0].columna;
                                                    json_objeto.descripcion = "Error no pueden venir más accesos a variable.";
                                                    TS.TS_Errores.push(json_objeto);
                            
                                                    c3d.addCodigo(tmp_salida.pop()+":\n");
                                                    break;
                                                }
                                                cont_var = 0;
                                                var tmp1 = c3d.getTMP();
                                                var tmp2 = c3d.getTMP();
                                                var tmp3 = c3d.getTMP();
                                                var tmp4 = c3d.getTMP();
                                                var etq1 = c3d.getETQ();
                                                etq2 = c3d.getETQ();

                                                tmp_cadena += tmp1+" = P + 0; //paso de la referencia del objeto\n";
                                                tmp_cadena += tmp2+" = Stack["+tmp1+"]; //obtener el valor de la referencia\n";
                                                tmp_cadena += tmp3+" = "+tmp2+" + "+existe_var.pos+"; //se suma la referencia más la posición de la variable\n";
                                                tmp_cadena += tmp4+" = Heap["+tmp3+"]; //obtiene su valor\n";
                                                tmp_cadena += "ifFalse("+tmp4+" == 00) goto "+etq1+"; //verifica si es null el valor\n";
                                                tmp_cadena += "exception = 5; //NullPointerException\n";
                                                tmp_cadena += "goto "+etq2+"; //salta a la salida\n";
                                                tmp_cadena += etq1+":\n";
                                                tmp_salida.push(etq2);
                                                cont_acc++;
                                                clase = TS.existe_clase(existe_var.padre, false);
                                                if(clase != false){
                                                    tam_clase = clase.l_global; //obtener la lista de globales del objeto nuevo
                                                }else{
                                                    //esta clase no existe.
                                                    json_objeto = new Object();
                                                    json_objeto.tipo = "semantico";
                                                    json_objeto.linea = l_accesos[0].linea;
                                                    json_objeto.columna = l_accesos[0].columna;
                                                    json_objeto.descripcion = "Error esta clase no existe.";
                                                    TS.TS_Errores.push(json_objeto);
                            
                                                    break;
                                                }
                                                continue;
                                            }
                                        }else if(vino_llamada && ret_llamada!= undefined && ret_llamada.tipo != "void"){ 
                                            if(ret_llamada.tipo == c.constantes.T_ID){ //es una referencia.
                                                var assig_res = exp.expresion(assig, TS_local);
                                                if(assig_res != undefined){
                                                    var tmp8 = c3d.getTMP();
                                                    c3d.addCodigo(tmp8+" = "+ret_llamada.valor+" + "+existe_var.pos+"; //se suma la referencia más la posición de la variable\n");
                                                    c3d.addCodigo("Heap["+tmp8+"] = "+assig.valor+"; //asignar el valor a esta posición global en el heap\n");
                                                    cont_var = 1;
                                                }
                                            }else{
                                                //error no se puede enviar el valor a un acceso que retorna un valor
                                                json_objeto = new Object();
                                                json_objeto.tipo = "semantico";
                                                json_objeto.linea = l_accesos[0].linea;
                                                json_objeto.columna = l_accesos[0].columna;
                                                json_objeto.descripcion = "Error no se puede enviar el valor a un acceso que retorna un valor.";
                                                TS.TS_Errores.push(json_objeto);
                        
                                                break;
                                            }
                                        }else{
                                            //existió errores en los accesos
                                            json_objeto = new Object();
                                            json_objeto.tipo = "semantico";
                                            json_objeto.linea = l_accesos[0].linea;
                                            json_objeto.columna = l_accesos[0].columna;
                                            json_objeto.descripcion = "Error existió en los accesos.";
                                            TS.TS_Errores.push(json_objeto);
                    
                                            break;
                                        }                    
                                    break;
                                    case c.constantes.T_LLAMADA: //puede ser un método primitivo propio de objetos
                                        ret_llamada = exp.expresion(acc, TS_local);
                                        if(ret_llamada != undefined && ret_llamada.tipo != "void"){
                                            if(ret_llamada.tipo == c.constantes.T_ID){
                                                cont_var = 0;
                                                vino_llamada = true;
                                                if(clase != false){
                                                    tam_clase = clase.l_global; //obtener la lista de globales del objeto nuevo
                                                }else{
                                                    //esta clase no existe.
                                                    json_objeto = new Object();
                                                    json_objeto.tipo = "semantico";
                                                    json_objeto.linea = l_accesos[0].linea;
                                                    json_objeto.columna = l_accesos[0].columna;
                                                    json_objeto.descripcion = "Error esta clase no existe.";
                                                    TS.TS_Errores.push(json_objeto);
                            
                                                    break;
                                                }
                                                continue;
                                            }
                                        }
                                    break;
                                    default:
                                        //error esta función no es permitida en THIS
                                        json_objeto = new Object();
                                        json_objeto.tipo = "semantico";
                                        json_objeto.linea = l_accesos[0].linea;
                                        json_objeto.columna = l_accesos[0].columna;
                                        json_objeto.descripcion = "Error esta función no es permitida en el THIS.";
                                        TS.TS_Errores.push(json_objeto);
                
                                    break;
                                }
                            }
                        }
                        if(cont_var == 0){
                            var assig_res = exp.expresion(assig, TS_local);
                            if(assig_res != undefined){
                                if(cont_acc > 1){
                                    c3d.addCodigo(tmp_cadena); //si vienen más accesos y son objetos
                                }
                                var tmp1 = c3d.getTMP();
                                var tmp2 = c3d.getTMP();
                                var tmp3 = c3d.getTMP();
                                c3d.addCodigo(tmp1+" = P + 0; //paso de la referencia del objeto\n");
                                c3d.addCodigo(tmp2+" = Stack["+tmp1+"]; //obtener el valor de la referencia\n");
                                c3d.addCodigo(tmp3+" = "+tmp2+" + "+existe_var.pos+"; //se suma la referencia más la posición de la variable\n");
                                c3d.addCodigo("Heap["+tmp3+"] = "+assig_res.valor+"; //asignar el valor a esta posición global en el heap\n");
                            }else{
                                //error en la asignacion del THIS
                                json_objeto = new Object();
                                json_objeto.tipo = "semantico";
                                json_objeto.linea = l_accesos[0].linea;
                                json_objeto.columna = l_accesos[0].columna;
                                json_objeto.descripcion = "Error en la asignación del THIS.";
                                TS.TS_Errores.push(json_objeto);
        
                            }                               
                        }
                    }else{
                        // esta variable no existe
                        json_objeto = new Object();
                        json_objeto.tipo = "semantico";
                        json_objeto.linea = l_accesos[0].linea;
                        json_objeto.columna = l_accesos[0].columna;
                        json_objeto.descripcion = "Error esta variable no existe.";
                        TS.TS_Errores.push(json_objeto);

                        break;
                    }
                break;
                default:
                    //error en this solo puede venir un identificador seguido de un acceso.
                    json_objeto = new Object();
                    json_objeto.tipo = "semantico";
                    json_objeto.linea = assig.linea;
                    json_objeto.columna = assig.columna;
                    json_objeto.descripcion = "Error en THIS solo puede venir un identificador seguido de un acceso.";
                    TS.TS_Errores.push(json_objeto);

                break;
            }
    }
    while(tmp_salida.length != 0){
        c3d.addCodigo(tmp_salida.pop()+":\n");
    }
}


//función que hace la logica de un this.metodo(algo);
exports.obj_cuerpo_this = function obj_cuerpo_this(l_accesos, TS_local, retorna){

    for(acc of l_accesos){
    //buscar la función si coincide
        if(retorna == false){
            acc = acc[0];
        }
        if(acc[0] == c.constantes.T_LLAMADA){
            llamada.ban_esTHIS = true;
            llamada.generarLlamada(acc, TS_local, retorna);
            llamada.ban_esTHIS = false;

        }else if(acc[0] == c.constantes.T_ID){
            //revisar si existe en la clase actual
            var existe_var = TS.getVariable(acc[1], TS_local);
            if(existe_var != false && existe_var.ambito == c.constantes.T_GLOBAL){
                var tmp1 = c3d.getTMP();
                var tmp2 = c3d.getTMP();
                var tmp3 = c3d.getTMP();
                var tmp4 = c3d.getTMP();

                c3d.addCodigo(tmp1+" = P + 0; //referencia pasada por parametro\n");
                c3d.addCodigo(tmp2+" = Stack["+tmp1+"]; //obtener el valor de la referencia\n");
                if(existe_var.tipo == c.constantes.T_ID){ //es referencia
                    c3d.addCodigo(tmp4+" = "+tmp2+" + "+existe_var.pos+"; //puntero en el heap de la variable\n");
                }else{ //es valor
                    c3d.addCodigo(tmp3+" = "+tmp2+" + "+existe_var.pos+"; //puntero en el heap de la variable\n");
                    c3d.addCodigo(tmp4+" = Heap["+tmp3+"]; //obtener el valor de esta variable\n");
                }
                if(retorna){
                    json_objeto = new Object();
                    json_objeto.valor = tmp4;
                    json_objeto.tipo = existe_var.tipo;
                }

            }else{
                //error debe ser una variable global y no local
                json_objeto = new Object();
                json_objeto.tipo = "semantico";
                json_objeto.linea = l_accesos.linea;
                json_objeto.columna = l_accesos.columna;
                json_objeto.descripcion = "Error debe ser una variable global no local";
                TS.TS_Errores.push(json_objeto);
                return;
            }
        }
    }
    if(retorna){
        return json_objeto;
    }

}
