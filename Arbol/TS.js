
var c = require("../Arbol/constants");
var exp = require("../Expresiones/expresion");
var llamada = require("../Instrucciones/llamada_INST");


exports.TS_imports = TS_imports = [];//LLEVARÁ EL CONTROL DE TODOS LOS IMPORTS
exports.TS_Errores = TS_Errores = [];//LLEVARÁ EL CONTROL DE LOS ERRORES
exports.TS_global = TS_global =[];//LLEVARÁ EL CONTROL DE LAS VARIABLES GLOBAL
exports.TS_locales = TS_locales =[];//UNICAMENTE PARA IPRIMIRLO EN TABLA DE SIMBOLOS

exports.TS_Funciones = TS_Funciones =[];//LLEVARÁ EL CONTROL DE LAS FUNCIONES
exports.TS_main = TS_main = [];//guardará el main de último
exports.TS_estructuras = TS_estructuras =[];//Llevará el control de todas las estructuras que se definen para verificar cuando se instancie una varuabke de este tipo


exports.ban_archivoActual = "";
//exports.ban_claseactual = "";//bandera que lleva el nombre de la clase actual y finaliza cuando termina el proceso
exports.ban_main = 0;//bandera que lleva el control de cuantos main's existen en todo el proceso de análisis
exports.ban_entro = false;//bandera que lleva el control para que se haga solo una vez el main, cuando entra a main bandera se vuelve True
exports.ban_funcion = undefined;//guarda la funcion actual, bandera que lleva el control de la funcion entrante para los ifs/ciclos/
exports.ban_for = false;//bandera que se utiliza para los for, nos indica si entramos o estamos dentro de una sentencia For




//exports.TS_clase_anterior = TS_clase_anterior = [];//guardará la clase anterior al import


exports.ban_import = false;//bandera que se utiliza para los imports

exports.ban_return = 0;//bandera que se utiliza para el conteo de returns en un método




exports.ban_analisis = false;//bandera de tipos en los parámetros de la búsqueda del método



exports.ban_arreglo = false;//bandera que lleva el control si viene print de la forma print(arr[2][3]);

exports.ban_imprimir = false;//bandera que se activará cuando viene un print
//exports.TMP_global = TMP_global = [];//lista temporal de globales
//exports.TMP_funciones = TMP_funciones = [];//lista temporal de funciones
//exports.TMP_clases = TMP_clases = [];//lista temporal de clases/archivos




//OBTIENE EL NO.IDENTIFICADOR DEL TIPO DE DATO A DECLARAR
exports.getTipo = function getTipo(tipo){
    console.log("TS.getTipo(tipo): "+tipo);    
    
    switch(tipo.toLowerCase()){
        case "integer":
            return c.constantes.T_ENTERO;
        case "char":
            return c.constantes.T_CARACTER;
        case "string":
            return c.constantes.T_CADENA;
        case "double":
            return c.constantes.T_DECIMAL;
        case "boolean":
            return c.constantes.T_BOOLEANO;
        case "void":
            return c.constantes.T_VOID;

        default:
            return c.constantes.T_ID;
    }
}


//VERIFICA SI LA VARIABLE YA EXISTE.
exports.existe_variable = function existe_variable(ID){
    var tmp_var;    
    for(tmp_var of exports.TS_global){
        if(tmp_var.ID == ID){
            return true;
        }
    }    
    return false;
}


//VERIFICA SI LA FUNCIONES YA EXISTEN
exports.existe_funcion = function existe_funcion(ID){    
    if(exports.TS_Funciones.length == 0){
        return false;
    }
    
    var tmp_var;
    for(tmp_var of exports.TS_Funciones){
        if(tmp_var.ID == ID){ //solo se busca si el nombre coincide
            return true;
        }
    }
    
    return false;
}


//FUNCIÓN QUE VERIFICA DOS ARREGLOS DE TIPOS CON LA FINALIDAD DE VER SI COINCIDEN
exports.esTipocoincidente = function esTipocoincidente(arr1, arr2){

    if(arr1.length == 0 && arr2.length == 0){ //si ambos tienen tamaño 0
        return true;
    }
    
    var i;
    for(i = 0; i < arr1.length; i++){//Como sabemos q tienen el mismo tamaño 
        if(arr1[i].tipo== arr2[i].tipo){
            return true;
        }
    }
    
    return false;

}


//FUNCIÓN QUE VERIFICA SI UNA VARIABLE YA HA SIDO DECLARADA LOCALMENTE
exports.existe_variable_local = function existe_variable_local(ID,TS){
    var tmp_var;
    for(tmp_var of TS){
        if(tmp_var.ID == ID){
            return true;
        }
    }
    //Si no existiera, verificar en el ambito global
    exports.existe_variable(ID);
}



//OBTENER LA VARIABLE SI EXISTE EN LOCAL O EN SU DEFECTO EN GLOBAL
exports.getVariable = function getVariable(ID,TS){
   var tmp_var;//iterador
    for(tmp_var of TS){
        if(tmp_var.ID == ID){
                return tmp_var;
        }
    }
    
    //si no verificar ambito global 
    for(tmp_var of exports.TS_global){
        if(tmp_var.ID == ID){
            return tmp_var;
        }
    }

    return false;
}



//OBTENER LA VARIABLE SI EXISTE EN LOCAL O EN SU DEFECTO EN GLOBAL
exports.setTVariable = function getVariable(T){
   var tmp_var;//iterador
    for(tmp_var of TS){
        if(tmp_var.ID == ID){
                return tmp_var;
        }
    }
    
    //si no verificar ambito global 
    for(tmp_var of exports.TS_global){
        if(tmp_var.ID == ID){
            return tmp_var;
        }
    }

    return false;
}

//método que verifica si coincide el nombre y sus tipos de parametros
exports.existe_metodo = function existe_metodo(ID, no_params, TS_local){
    var objeto_metodo;
    var n_params ;
    if(no_params != 0 && no_params != ")"){
        n_params = no_params.length;
    }else{
        n_params = 0;
    }

    for(objeto_metodo of exports.TS_Funciones){
        if(objeto_metodo.ID == ID && objeto_metodo.no_params == n_params){ //si vienen miembros
            var nom = "";
            if(objeto_metodo.miembro != true){
                nom = objeto_metodo.ID;
            }
        
            if(no_params == ")" && objeto_metodo.miembro != true){
                var obj_param = exports.getTipo(objeto_metodo.tipo);
                objeto_metodo.nombre = nom+"_"+obj_param;
                return objeto_metodo;
            }
            if(n_params > 0){ //nombre del constructor, nombreclase_566755()
                nom += "_";
            }
            exports.ban_analisis = true; //bandera para el control de solo tipos
            for(var i = 0 ; i < no_params.length; i++){ //recorre los dos tipos de parámetros
                var obj_param = objeto_metodo.params[i]; //obtiene el primer parámetro del constructor
                var val_exp = no_params[i];//exp.expresion(no_params[i], TS_local); //obtiene el tipo del parametro que se quiere pasar por parámetro
                val_exp.tipo = val_exp[0]; //tipo
                if(val_exp != undefined){
                    if(obj_param.tipo == val_exp.tipo ||
                        (obj_param.tipo == c.constantes.T_ID && val_exp.tipo == c.constantes.T_NULL) ||
                            obj_param.tipo == c.constantes.T_ID &&(val_exp.tipo == c.constantes.T_ACCESOOBJETO ||
                            val_exp.tipo == c.constantes.T_ACCESOARRAYS || val_exp.tipo == c.constantes.T_OBJETO ||
                            val_exp.tipo == c.constantes.T_THIS) ||//si los dos son iguales se retorna el objeto del constructor
                            obj_param.tipo == c.constantes.T_CARACTER && val_exp.tipo == c.constantes.T_CADENA){ //el parametro puede ser caracter pero lo que se envia puede ser cadena
                        nom += obj_param.tipo;
                    }else{
                        //verificar si la variable coincide con el tipo 
                        if(val_exp.tipo == c.constantes.T_ID){
                            var coincide = exports.getVariable(val_exp[1], TS_local);
                            if(coincide != false){
                                if(coincide.tipo == obj_param.tipo){
                                    nom += obj_param.tipo;
                                    //si el parámetro que se enviará es arreglo y el del método también se le agrega
                                    //la información necesaria a la función
                                    if(coincide.arreglo && obj_param.arreglo){
                                        obj_param.dimen = coincide.dimen;
                                        obj_param.dimensiones = coincide.dimensiones;
                                    }
                                }else{
                                    return false;
                                }
                            }else{
                                return false;
                            }
                        }else{
                            var exp1 = exp.expresion(val_exp, TS_local);
                            if(exp1 != undefined){
                                if(exp1.tipo == obj_param.tipo){
                                    nom += obj_param.tipo;  
                                }else if(val_exp[0] == c.constantes.T_LLAMADA){ //si viene llamada se debe convertir el tipo de la funcion
                                    if(exports.getTipo(exp1) == obj_param.tipo){
                                        nom += obj_param.tipo;
                                    }
                                }
                            }else{
                                return false;
                            }
                        }
                    }
                }else{
                    return false;
                }
            }
            exports.ban_analisis = false; //bandera para el control de solo tipos
            var verificacion = "";
            //TODO verificar si el objeto método es miembro
            var pila_sobre = llamada.pila_sobreescritura.pop();          //pila que lleva el control de no sobreescribir valores cuando viene una funcion en un parámetro
            if(pila_sobre != true ||  llamada.pila_sobreescritura.length == 0){//variable que lleva el control de no sobreescribir valores cuando viene una funcion en un parámetro
                if(objeto_metodo.miembro == true && objeto_metodo.heredade == "null"){
                    verificacion = objeto_metodo.nombre+"_"+nom;
                }else if(objeto_metodo.miembro == true && objeto_metodo.heredade != "null"){  //verificar si el objeto método es miembro y heredado
                    verificacion = objeto_metodo.nombre+nom;
                }else if(objeto_metodo.heredade != undefined && objeto_metodo.heredade != "null"){  //verificar si el objeto método es heredado
                    verificacion = nom;
                }else{
                    verificacion = nom;
                }
                objeto_metodo.nombre = verificacion;
            }
            if(llamada.pila_sobreescritura.length != 0){ //pila que lleva el control de no sobreescribir valores cuando viene una funcion en un parámetro
                llamada.pila_sobreescritura.push(pila_sobre);
            }
            return objeto_metodo;
        }
    }
    return false;
    
}

//función que verifica solo el tipo de la función, para el control cuando funciones se pasadas por parámetro
exports.verificar_tipofuncion = function verificar_tipofuncion(ID){
    var tmp_var;
    if(exports.TS_Funciones.length == 0){
        return false;
    }
    for(tmp_var of exports.TS_Funciones){
        if(tmp_var.ID == ID){ //solo se busca si el nombre coincide
            return tmp_var;
        }
    }
    return false;

}



//función que verifica si existe la estructura.
exports.existe_estructura = function existe_estructura(nombre_clase){//,analisis){
    var objeto_struct;
    /*if(analisis == true){
        for(objeto_clase of exports.TMP_clases){
            if(nombre_clase == objeto_clase.ID){
                return objeto_clase;
            }
        }
    }else{*/
        for(objeto_struct of exports.TS_estructuras){
            if(nombre_clase == objeto_clase.ID){
                return objeto_clase;
            }
        }
//    }

    return false;
}

//función que retorna si existe el constructor y su nombre en c3d para llamadas
exports.existe_constructor_llamada = function existe_constructor_llamada(nombre_clase, no_params, TS_local){
    var objeto_constructor;
    var tam_params;
    if(no_params == ")"){
        tam_params = 0;
    }else{
        tam_params = no_params.length;
    }
    for(objeto_constructor of exports.TS_Constructores){
        if(objeto_constructor.ID == nombre_clase && objeto_constructor.no_params == tam_params){
            var nom = objeto_constructor.ID;
            if(tam_params > 0){ //nombre del constructor, nombreclase_566755()
                nom += "_";
                exports.ban_analisis = true; //bandera para el control de solo tipos

                for(var i = 0 ; i < no_params.length; i++){ //recorre los dos tipos de parámetros
                    var obj_param = objeto_constructor.params[i]; //obtiene el primer parámetro del constructor
                    var val_exp = no_params[i];//exp.expresion(no_params[i], TS_local); //obtiene el tipo del parametro que se quiere pasar por parámetro
                    val_exp.tipo = val_exp[0]; //tipo
                    if(val_exp != undefined){
                        if(obj_param.tipo == val_exp.tipo ||
                            (obj_param.tipo == c.constantes.T_ID && val_exp.tipo == c.constantes.T_NULL) ||
                                obj_param.tipo == c.constantes.T_ID &&(val_exp.tipo == c.constantes.T_ACCESOOBJETO ||
                                val_exp.tipo == c.constantes.T_ACCESOARRAYS || val_exp.tipo == c.constantes.T_OBJETO ||
                                val_exp.tipo == c.constantes.T_THIS) ||
                                obj_param.tipo == c.constantes.T_CARACTER && val_exp.tipo == c.constantes.T_CADENA){ //si los dos son iguales se retorna el objeto del constructor
                            nom += obj_param.tipo;
                        }else{
                            //verificar si la variable coincide con el tipo 
                            if(val_exp.tipo == c.constantes.T_ID){
                                var coincide = exports.getVariable(val_exp[1], TS_local);
                                if(coincide != false){
                                    if(coincide.tipo == obj_param.tipo){
                                        nom += obj_param.tipo;
                                    }else{
                                        return false;
                                    }
                                }else{
                                    return false;
                                }
                            }else{
                                return false;
                            }
                        }
                    }else{
                        return false;
                    }
                }
                exports.ban_analisis = false; //bandera para el control de solo tipos
            }
            objeto_constructor = new Object();
            objeto_constructor.nombre = nombre_clase+"_"+nom;
            objeto_constructor.no_params = tam_params;
            return objeto_constructor;
        }
    }
    return false;

}