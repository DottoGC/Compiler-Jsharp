var c = require("../Arbol/constants");
var TS = require("../Arbol/TS");
var c3d = require("../Codigo3D/generarCodigoC3D");
var MAIN_enviardata = require("../Instrucciones/main_INST");
var ambitos = require("../Arbol/ambitos");

var decla = require("../Instrucciones/declaracion_INST");
var sent = require("../Sentencias/sentencia");
var assig = require("../Instrucciones/asignacion_INST");
var exp  = require("../Expresiones/expresion");
var llamada = require("../Instrucciones/llamada_INST");

var objeto = require("../Instrucciones/objeto_INST");
const fs = require('fs');

var json_objeto;

//var clase_local = require("../Instrucciones/clases_INST");

var vino_error = false; //bandera que se activa cuando viene un error en los miembros




//RECORRE LA LISTA DE INSTRUCCIONES
exports.recorrer_instrucciones = function recorrer_instrucciones(){
   
    if(TS.TS_global.length == 0 && TS.TS_Funciones.length == 0){
        //raros casos puede venir un error y traer todas las listas vacías
        console.log("ERROR: Listas vacias aqui en recorrer instrucciones.")
        return;
    }   
    
    if(TS.TS_global.length != 0){
//        var tmp1 = c3d.getTMP();
//        c3d.addCodigo(tmp1+" = H; #Obtener el puntero libre del heap para globales\n");
        init();//GENERAMOS C3D PARA VARIABLES GLOBALES
    }
    
    //EMPEZAMOS A GENERAR C3D PARA FUNCIONES GLOBALES    
    var TS_local = []; //tabla local que se enviará por parámetros a cada sentencia que necesite un ambito
    var funcion ;//iterador de funciones 
    for(funcion of TS.TS_Funciones){ //generar codigo para cada funcion                     
        if(funcion.ID != "principal"){//Mientras no sea el metodo principal

            //obtener parámetros, agregarlos al ambito local. 
            var nom_param = exports.tratamiento_parametros(funcion, TS_local);
            var n_etq = c3d.getETQ();
            if(nom_param != ""){                
                c3d.addCodigo("\ngoto "+n_etq+";\n");        
                c3d.addCodigo("proc "+funcion.ID+"_"+funcion.tipo+funcion.no_params+" begin\n");
                //c3d.addCodigo("proc "+funcion.ID+"_"+funcion.tipo+funcion.no_params+"_"+nom_param+" begin\n");                
                //c3d.addCodigo("proc "+funcion.ID+"_"+nom_param+" begin\n");
               
            }else{
                c3d.addCodigo("\ngoto "+n_etq+";\n"); 
                c3d.addCodigo("proc "+funcion.ID+"_"+funcion.tipo+funcion.no_params+" begin\n"); 
                //c3d.addCodigo("proc "+clase.ID+"_"+funcion.ID+" begin\n");
               
            }
            
            
            TS.ban_funcion = funcion; //se llevará para los ifs/ciclos
            exports.recorrer_cuerpo(funcion.cuerpo,TS_local, funcion); //recorre todas las sentencias del cuerpo del metodo
            
            //sacar etiquetas de salida si existieran
            while(c3d.pilaSalida.length != 0){ 
                c3d.addCodigo(c3d.pilaSalida.pop()+":\n");
            }

            while(c3d.pilaReturn.length != 0){
                c3d.addCodigo(c3d.pilaReturn.pop()+":\n");                      
            }
            
            c3d.addCodigo("end\n\n");
            c3d.addCodigo(n_etq+":\n");
            TS_local = [];//limpiar ambito local del metodo actual del bucle
            
        }//Fin IF mientras no sea el metodo Principal(MAIN)        
    }//Fin FOR q recorre Tabla Simbolos Funciones

        
        
    for(funcion of TS.TS_Funciones){ //lista de funciones
        if(funcion.ID == "principal"){
            TS.TS_main.push(funcion);//Guardamos el main en una lista aparte
            TS.ban_main++;//incrementamos el contador de mains
        }
    }

        
    if(TS.ban_main > 1 ){//error, solo puede existir un metodo principal
        json_objeto = new Object();
        json_objeto.tipo = "Semantico";
        json_objeto.linea = funcion.linea;
        json_objeto.columna = funcion.columna;
        json_objeto.descripcion = "Solo debe existir un metodo principal.";
        TS.TS_Errores.push(json_objeto);
    }

        
    
    if(TS.TS_main.length != 0 && TS.ban_entro == false && TS.ban_import == false){ //se genera el main.
        TS.ban_entro = true;//Modificamos bandera para que ya no ejecute ningun metodo principal    
        funcion = TS.TS_main.pop();//Reutilizamos la variable auxiliar funcion q habiamos declarado, para optener el main
        
        var n_etq = c3d.getETQ();
        c3d.addCodigo("\ngoto "+n_etq+";\n");        
        c3d.addCodigo("proc "+funcion.ID+"_"+funcion.tipo+funcion.no_params+" begin\n");
        //c3d.addCodigo("call "+funcion.padre+"_"+funcion.padre+"; //llama a su constructor implicito\n");//llama a su constructor actual       
                    
        exports.recorrer_cuerpo(funcion.cuerpo,TS_local, funcion); //recorre todas las sentencias del cuerpo
        
        //sacar etiquetas de salida si existieran
        while(c3d.pilaSalida.length != 0){ 
            c3d.addCodigo(c3d.pilaSalida.pop()+":\n");
        }
        
        c3d.addCodigo("end\n");
        c3d.addCodigo(n_etq+":\n");
        
        c3d.addCodigo("call "+funcion.ID+"_"+funcion.tipo+funcion.no_params +";\n");
        
        TS_local = [];//limpiar ambito local

    }//Fin IF para recororer main   
    
}


//FUNCION CONCATENA TODOS LOS PARAMETRO Y RETORNA PARA CADA METODO, ADEMAS DE IR AGREGANDOLOS A TABLA SIMBOLOS LOCAL DEL C/METODO
exports.tratamiento_parametros = function tratamiento_parametros(funcion, TS_local){
    var cad_params = "";    
    if(funcion.params!=undefined && funcion.params.length != 0){//Si la funcion tiene parametros
        var param;//iterados de prametros
        for(param of funcion.params){
            cad_params += param.tipo;
            param.esParametro = true; //bandera que indica si es un tipo de variable parametro
            TS_local.push(param);//Agregamos a la tabla de simbolos local del metodo actual en la iteracion
        }
    }    
    return cad_params;
}




//FUNCIÓN QUE RECORRE EL CUERPO DE UN MÉTODO
exports.recorrer_cuerpo = function recorrer_cuerpo(cuerpo, TS_local, funcion_actual){
//el parametro cuerpo es la lista de sentencias del cuerpo del metodo actual, cuerpo el nodo opt_metodo  
/*
                opt_metodos   : cuerpo_local LLAVEC      -> $1;
                              | LLAVEC                   -> $1;
                              ;


                cuerpo_local : cuerpo_local local                           { $1.push($2); $$ = $1;}
                             | local                                          -> new Nodo_1($1, @1.first_line, @1.last_column+1);
                             ;
*/
    
    var res;
    var cuerpo_tmp;//iterador de sentencias del cuerpo, toma el valor de cada nodo local de la lista
    for(cuerpo_tmp of cuerpo){//cuerpo es entonces una lista de nodos locales

        json_objeto = new Object();
        
        switch(cuerpo_tmp[0]){//La expresion q comparamos es la posicion cero de cada nodo local del cuerpo
/*
local: tipo_retorno lista_declaraciones PYC           -> new Nodo_3(c.constantes.T_DECLARACION,$1,$2,@1.first_line, @1.last_column+1);
     | ID opt_assig PYC                               -> new Nodo_3(c.constantes.T_ASIGNACION,$1, $2, @2.first_line, @2.last_column+1);
     | BREAK PYC                                      -> new Nodo_1(c.constantes.T_BREAK, @1.first_line, @1.last_column+1);
     | CONTINUE PYC                                   -> new Nodo_1(c.constantes.T_CONTINUE, @1.first_line, @1.last_column+1);
     | RETURN opt_return                              -> new Nodo_2(c.constantes.T_RETURN, $2, @2.first_line, @2.last_column+1);
     | sentencias_seleccion                           -> $1; 
     | sentencias_ciclicas                            -> $1; 
     | ID PUNTO ACCESOS PYC                           -> new Nodo_3(c.constantes.T_ACCESOOBJETO, $1, $3, @1.first_line, @1.last_column+1);           
     | THROW EXP PYC                                  -> new Nodo_2($1, $2, @2.first_line, @2.last_column+1);
     | TRY LLAVEA cuerpo_global LLAVEC opt_catch      -> new Nodo_3($1, $3, $5, @5.first_line, @5.last_column+1);
     | PRINT PARENA EXP PARENC PYC                    -> new Nodo_2(c.constantes.T_PRINT, $3, @3.first_line, @3.last_column+1);
     | LLAMADA PYC                                    -> new Nodo_2(c.constantes.T_LLAMADA,$1, @1.first_line, @1.last_column+1);
     | ID INCCI PYC {var n=new Nodo_2(c.constantes.T_ID,$1, @1.first_line, @1.last_column+1); $$=new Nodo_2(c.constantes.T_INCCD, n, @2.first_line, @2.last_column+1);}
     | ID DECCI PYC {var n=new Nodo_2(c.constantes.T_ID,$1, @1.first_line, @1.last_column+1); $$=new Nodo_2(c.constantes.T_DECCD, n, @2.first_line, @2.last_column+1);}
     | error PYC
     ;
*/
        case c.constantes.T_DECLARACION:
            c3d.addCodigo("#Declaracion de una variable\n");
            decla.declaraciones_semantica(cuerpo_tmp, TS_local,funcion_actual.ID); //realiza la semantica de las declaraciones, mandamos el nodo de la sentencia local, la tabla de simbolo actual y el ID de la funcion
            break;
            
                
        case c.constantes.T_ASIGNACION:
            c3d.addCodigo("#Asignacion de una variable\n");
            var variable_actual = TS.getVariable(cuerpo_tmp[1], TS_local);
                
            if(variable_actual != false){//Si la variable a la que se quiere asignar existe en la tabla de simbolos actual
                var temporal0 = c3d.getTMP();
                var temporal = c3d.getTMP();
                if(variable_actual.ambito == c.constantes.T_GLOBAL){ //si la variable es global
                    //verificar su tipo de modificador si tiene final y no tiene valor
                    if(variable_actual.construct == false && variable_actual.modificador == c.constantes.T_STATIC){
                        //error solo se pueden inicializar en un constructor
                        json_objeto.tipo = "Semantico";
                        json_objeto.linea = cuerpo.linea;
                        json_objeto.columna = cuerpo.columna;
                        json_objeto.descripcion = "Error no se puede asignar valor a esta variable static "+variable_actual.ID+" solo en los constructores.";
                        TS.TS_Errores.push(json_objeto);
                        continue;
                    }
                        c3d.addCodigo(temporal0+" = P + 0; #referencia del objeto\n");
                        c3d.addCodigo(temporal +" = Stack["+temporal0+"]; #obtener la referencia del objeto\n");
                        c3d.addCodigo(temporal +" = "+temporal+" + "+variable_actual.pos+"; #se escala hasta la variable\n");
                    
                }else{ //sino es local 
                        c3d.addCodigo(temporal+" = P + "+variable_actual.pos+";\n");
                }
                
                   
                res = assig.asignaciones_semantica(cuerpo_tmp[2], cuerpo_tmp[1],TS_local); //devuelve un temmporal o valor
                if(res != undefined && res.tipo == variable_actual.tipo && res.valor != undefined
                        && (res.tipo != c.constantes.T_ARRAYS && res.tipo != c.constantes.T_THIS 
                            || variable_actual.arreglo == undefined && res.arreglo ||
                            variable_actual.tipo == c.constantes.T_CADENA && res.tipo == c.constantes.T_NULL 
                            || variable_actual.tipo == c.constantes.T_ID && res.tipo == c.constantes.T_NULL)){
                            if(res.tipo != c.constantes.T_INSTANCIA){ //si los dos son tipo arreglo no se debería de asignar en el stack
                                if(variable_actual.ambito == c.constantes.T_GLOBAL){ 
                                    //es global
                                    variable_actual.valor = res.valor; //para llevar control de los finales
                                    c3d.addCodigo("Heap["+temporal+"] = "+res.valor+";#la variable es global\n");
                                }else{ //es local
                                    c3d.addCodigo("Stack["+temporal+"] = "+res.valor+"; #la variable es local\n");
                                }
                            }
                }else if(res != undefined && res.arreglo != undefined && !res.arreglo){
                    // error en asignación
                    json_objeto = new Object();
                    json_objeto.tipo = "Semantico";
                    json_objeto.linea = cuerpo_tmp[2].linea;
                    json_objeto.columna = cuerpo_tmp[2].columna;
                    json_objeto.descripcion = "Error existió en el resultado de la asignación de "+cuerpo_tmp[1];
                    TS.TS_Errores.push(json_objeto);
                    
                }else if(res != undefined && !res.arreglo && !variable_actual.arreglo){
                    json_objeto = new Object();
                    json_objeto.tipo = "Semantico";
                    json_objeto.linea = cuerpo_tmp[2].linea;
                    json_objeto.columna = cuerpo_tmp[2].columna;
                    json_objeto.descripcion = "Error existió en el resultado de la asignación de "+cuerpo_tmp[1];
                    TS.TS_Errores.push(json_objeto);                    
                }

            }else{
                //Error esta variable no existe no se puede asignar ningún valor
                json_objeto.tipo = "Semantico";
                json_objeto.linea = cuerpo_tmp.linea;
                json_objeto.columna = cuerpo_tmp.columna;
                json_objeto.descripcion = "La variable "+cuerpo_tmp[1]+" no existe, no se puede asignar ningún valor.";
                TS.TS_Errores.push(json_objeto);
            }               
            break;
                
                
               
                
        case c.constantes.T_IF:
        case c.constantes.T_SWITCH:
        case c.constantes.T_WHILE:
        case c.constantes.T_DOWHILE:
        case c.constantes.T_FOR:
            sent.sentencia(cuerpo_tmp, TS_local);
           // debug_function(cuerpo_tmp.linea);
            break;
        
        
                
        case c.constantes.T_BREAK:
            //verificar que el break esté en un ciclo o switch
            var tipo_tmp = ambitos.popAmbito();//verificar si está dentro de un ciclo
            if(tipo_tmp == c.constantes.T_WHILE || tipo_tmp == c.constantes.T_DOWHILE || tipo_tmp == c.constantes.T_FOR || tipo_tmp == c.constantes.T_SWITCH){
                ambitos.pushAmbito(tipo_tmp);      
                var n_etq = c3d.getETQ();
                c3d.addCodigo("goto "+n_etq+"; #esto es lo que genera un break\n");
                c3d.pilaBreak.push(n_etq); //genera una etiqueta de salida.                  
            }else{
                //error este break no viene dentro de un ciclo o switch
                json_objeto = new Object();
                json_objeto.tipo = "Semantico";
                json_objeto.linea = cuerpo_tmp.linea;
                json_objeto.columna = cuerpo_tmp.columna;
                json_objeto.descripcion = "Error este BREAK viene fuera de un ciclo o switch.";
                TS.TS_Errores.push(json_objeto);
            }

            break;
                
                
                
        case c.constantes.T_CONTINUE:
            //verificar si está en un ciclo sino tira error
            var tmp_tipo = ambitos.popAmbito(); //verificar si el tipo de la pila es un ciclo
            if(tmp_tipo != undefined &&(tmp_tipo == c.constantes.T_FOR || tmp_tipo == c.constantes.T_WHILE || tmp_tipo == c.constantes.T_DOWHILE)){
                ambitos.pushAmbito(tmp_tipo);
                var tmp_continue = c3d.pilaContinue.pop();
                c3d.addCodigo("goto "+tmp_continue+"; #esto es lo que genera un continue\n");
                c3d.pilaContinue.push(tmp_continue);
            }else{
                //error este CONTINUE viene fuera de un ciclo
                json_objeto = new Object();
                json_objeto.tipo = "Semantico";
                json_objeto.linea = cuerpo_tmp.linea;
                json_objeto.columna = cuerpo_tmp.columna;
                json_objeto.descripcion = "Error este CONTINUE viene fuera de un ciclo.";
                TS.TS_Errores.push(json_objeto);
            }
            break;
        
            
            
        case c.constantes.T_RETURN:
            if(cuerpo_tmp[1] != ";" && (funcion_actual.construct == undefined || funcion_actual.construct == false) && funcion_actual.tipo != "void"){
                exp.tipo_assig = true; //para expresiones relacionales/logicas
                var retornar = exp.expresion(cuerpo_tmp[1], TS_local);
                exp.tipo_assig = false; //para expresiones relacionales/logicas
                
                if(retornar != undefined && (retornar.tipo == TS.getTipo(funcion_actual.tipo) 
                && (retornar.arreglo == undefined && funcion_actual.arreglo == undefined || retornar.arreglo == false || funcion_actual.arreglo == false))                    || retornar.tipo == c.constantes.T_NULL && c.constantes.T_ID == TS.getTipo(funcion_actual.tipo) ) //que sea el mismo tipo que se retorne
                    {//verificar que el método retorne este mismo tipo de dato
                    var etq_retornar = c3d.getETQ();
                    var tmp_retornar = c3d.getTMP();
                    c3d.addCodigo(tmp_retornar+" = P + 0;\n"); //se almacena el return en la pos 1
                    //c3d.addCodigo(tmp_retornar+" = P + 1;\n"); //se almacena el return en la pos 1 
                    c3d.addCodigo("Stack["+tmp_retornar+"] = "+retornar.valor+";\n"); //se le setea su valor
                    c3d.addCodigo("goto "+etq_retornar+"; #esto lo genera un return con expresion\n"); //se sale de cualquier instrucción en la que esté                    c3d.pilaReturn.push(etq_retornar); //se guarda la etiqueta de salida para sacarla en algun otro lugar                              
                }else if(retornar != undefined && (retornar.tipo == TS.getTipo(funcion_actual.tipo) && retornar.arreglo && funcion_actual.arreglo) 
                         && retornar.dimen == funcion_actual.dimen)
                        { //verificar si el retorno es arreglo y la función es retorno
                    var etq_retornar = c3d.getETQ();
                    var tmp_retornar = c3d.getTMP();
                    c3d.addCodigo(tmp_retornar+" = P;\n"); //se almacena el return en la pos 1
                    //c3d.addCodigo(tmp_retornar+" = P + 1;\n"); //se almacena el return en la pos 1
                    c3d.addCodigo("Stack["+tmp_retornar+"] = "+retornar.valor+";\n"); //se le setea su valor
                    c3d.addCodigo("goto "+etq_retornar+"; #esto lo genera un return con expresion\n"); //se sale de cualquier instrucción en la que esté 
                    c3d.pilaReturn.push(etq_retornar); //se guarda la etiqueta de salida para sacarla en algun otro lugar                              
                    //guardo en la función sus dimensiones
                    funcion_actual.dimensiones = retornar.dimensiones; //servirá para obtener las dimensiones del arreglo que se está retornando
                }else{
                    //error el tipo del método no coincide con el tipo a retornar
                    json_objeto = new Object();
                    json_objeto.tipo = "Semantico";
                    json_objeto.linea = cuerpo_tmp[1].linea;
                    json_objeto.columna = cuerpo_tmp[1].columna;
                    json_objeto.descripcion = "Error en RETORNAR el tipo no coincide o el retorno con la función";      
                    TS.TS_Errores.push(json_objeto);
                }
            
            }else if(funcion_actual.tipo == "void"){
                //viene un return sin expresion debe estar contenido en un método void
                var tmp_salida = c3d.getETQ();
                c3d.pilaSalida.push(tmp_salida);
                c3d.addCodigo("goto "+tmp_salida+"; #esto lo genera un return sin expresion\n");
            }
            break;
            
                
                
        case c.constantes.T_PRINT:        
            TS.ban_imprimir = cuerpo_tmp[0]; //activamos bandera para imprimir
            TS.ban_arreglo = true; //activamos bandera que se quiere obtener un valor de un arreglo para iprimir
            
            var exp_imprimir = exp.expresion(cuerpo_tmp[1], TS_local);//Mandamos la expresion y la tabla de simbolos como parametro, devuelve objeto con metadatos
            
            if(exp_imprimir != undefined && exp_imprimir.vinoimprimir !=true){//Si todo esta bien con la expresion a imprimir en consola xq solo fue a imprimir valores nativos
                
                if(exp_imprimir.tipo == c.constantes.T_CADENA && exp_imprimir.cadIsNULL!=true){ //Si es una cadena y no tien asignado null, devuelve la referencia

                    var tmp_valor = c3d.getTMP(); //temp para obtener valor
                    var etq_0 = c3d.getETQ();
                    var etq_1 = c3d.getETQ();
    
                    c3d.addCodigo(etq_0+":\n");
                    c3d.addCodigo(tmp_valor+" = Heap["+exp_imprimir.valor+"]; #se obtiene el valor del primer caracter mediante la referencia al heap\n");
                    c3d.addCodigo("if ("+tmp_valor+" == -1) goto "+etq_1+"; #si es igual a fin de texto, terminar impresion\n");
                    //c3d.addCodigo("ifFalse("+tmp_valor+" != -1) goto "+etq_1+"; #si no es igual a fin de texto\n");

                    if(exp_imprimir.t_casteo != undefined){//Si es necesario un casteo
                        if(exp_imprimir.t_casteo == c.constantes.T_ENTERO){
                            c3d.addCodigo("print( \"%i\" , "+tmp_valor+"); #Se imprime el entero con casteo \n");
                            
                        }else if(exp_imprimir.t_casteo == c.constantes.T_DECIMAL){
                            c3d.addCodigo("print( \"%d\" , "+tmp_valor+"); #Se imprime el decimal con casteo \n");
                            
                        }else if(exp_imprimir.t_casteo == c.constantes.T_CARACTER){
                            c3d.addCodigo("print( \"%c\" , "+tmp_valor+"); #Se imprime el caracter con casteo \n");

                        }
                    }else{//Si no es necesario casteo, solo se imprime valor
                        c3d.addCodigo("print( \"%c\" , "+tmp_valor+"); #Se imprime el caracter \n");
                        
                    }
                    
                    c3d.addCodigo(exp_imprimir.valor+" = "+exp_imprimir.valor+" + 1; #Se aumenta el puntero a heap para el siguiente caracter \n");
                    c3d.addCodigo("goto "+etq_0+"; #Un salto al inicio de la condicion\n");
                    c3d.addCodigo(etq_1+":\n");
    
                    if(cuerpo_tmp[0] == c.constantes.T_PRINT){
                        c3d.addCodigo("print( \"%c\" , 10); #salto de linea \n");
                    }
                    
                }else if(exp_imprimir.tipo == c.constantes.T_ENTERO){
                        c3d.addCodigo("print( \"%i\" , "+exp_imprimir.valor+");\n");
                        c3d.addCodigo("print( \"%c\" , 10); #se imprime nueva linea\n");
                    
                }else if(exp_imprimir.tipo == c.constantes.T_BOOLEANO){
                    //var tmp1 = c3d.getTMP();                                
                    //var etqV = c3d.getETQ();
                    var etqF = c3d.getETQ();
                    var etqS = c3d.getETQ();
                    
                    c3d.addCodigo("if ("+exp_imprimir.valor+"==0) goto "+etqF+";\n");
                    c3d.addCodigo("print( \"%c\" , 116 ); #imprimiendo caracter t\n");
                    c3d.addCodigo("print( \"%c\" , 114 ); #imprimiendo caracter r\n");
                    c3d.addCodigo("print( \"%c\" , 117 ); #imprimiendo caracter u\n");
                    c3d.addCodigo("print( \"%c\" , 101 ); #imprimiendo caracter e\n");
                    c3d.addCodigo("print( \"%c\" , 10); #se imprime nueva linea\n")
                    c3d.addCodigo("goto "+etqS+ ";\n");
                    
                    c3d.addCodigo(etqF+":\n");
                    c3d.addCodigo("print( \"%c\" , 102 ); #imprimiendo caracter f\n");
                    c3d.addCodigo("print( \"%c\" , 97 ); #imprimiendo caracter a\n");
                    c3d.addCodigo("print( \"%c\" , 108 ); #imprimiendo caracter l\n");
                    c3d.addCodigo("print( \"%c\" , 115 ); #imprimiendo caracter s\n");
                    c3d.addCodigo("print( \"%c\" , 101);  #imprimiendo caracter e\n");
                    c3d.addCodigo("print( \"%c\" , 10); #se imprime nueva linea\n")
                    
                    c3d.addCodigo(etqS+":\n");
                    /*if(exp_imprimir.valor==0){//imprimimos false
                            c3d.addCodigo("print( \"%c\" , 102 ); #imprimiendo caracter f\n");
                            c3d.addCodigo("print( \"%c\" , 97 ); #imprimiendo caracter a\n");
                            c3d.addCodigo("print( \"%c\" , 108 ); #imprimiendo caracter l\n");
                            c3d.addCodigo("print( \"%c\" , 115 ); #imprimiendo caracter s\n");
                            c3d.addCodigo("print( \"%c\" , 101);  #imprimiendo caracter e\n");
                        }else{//imprimimos true
                            c3d.addCodigo("print( \"%c\" , 116 ); #imprimiendo caracter t\n");
                            c3d.addCodigo("print( \"%c\" , 114 ); #imprimiendo caracter r\n");
                            c3d.addCodigo("print( \"%c\" , 117 ); #imprimiendo caracter u\n");
                            c3d.addCodigo("print( \"%c\" , 101 ); #imprimiendo caracter e\n");
                        }*/
                        
                        //c3d.addCodigo("print( \"%i\" , "+exp_imprimir.valor+");\n");
                        //c3d.addCodigo("print( \"%c\" , 10); #se imprime nueva linea\n");
                    
                }else if(exp_imprimir.tipo == c.constantes.T_DECIMAL){
                        c3d.addCodigo("print( \"%d\" , "+exp_imprimir.valor+");\n");
                        c3d.addCodigo("print( \"%c\" , 10); #se imprime nueva linea\n");
                    
                }else if(exp_imprimir.tipo == c.constantes.T_CARACTER){
                        c3d.addCodigo("print( \"%c\" , "+exp_imprimir.valor+");\n");
                        c3d.addCodigo("print( \"%c\" , 10); #se imprime nueva linea\n");
                    
                }else if(exp_imprimir.tipo == c.constantes.T_NULL || (exp_imprimir.tipo == c.constantes.T_CADENA && exp_imprimir.cadIsNULL==true )){
                        c3d.addCodigo("print( \"%c\" , 110 ); #imprimiendo caracter n\n");
                        c3d.addCodigo("print( \"%c\" , 117 ); #imprimiendo caracter u\n");
                        c3d.addCodigo("print( \"%c\" , 108 ); #imprimiendo caracter l\n");
                        c3d.addCodigo("print( \"%c\" , 108 ); #imprimiendo caracter l\n");
                        c3d.addCodigo("print( \"%c\" , 10); #se imprime nueva linea\n");
                    
                }
                
            }//Fin IF si todo esta bien con la expresion a imprimir en consola
                
            TS.ban_arreglo = false; //regresamos bandera de Var que lleva el control por si se quiere imprimir valor de un arreglo
            TS.ban_imprimir = false; //regresamos bandera de Var que lleva el control por si se quiere imprimir cualquier tipo 
            break;
            
                
              
        case c.constantes.T_LLAMADA:
            llamada.generarLlamada(cuerpo_tmp[1], TS_local, false); //TODO puede venir retornar
            while(llamada.pila_parametros.length != 0){
                llamada.pila_parametros.pop();
            }
            break;
                

                
        case c.constantes.T_INCCD:        //incc , decc prefijo id ++, id --
        
        case c.constantes.T_DECCD:
            
        case c.constantes.T_INCCI:        //incc, decc postfijo ++id, --id
            
        case c.constantes.T_DECCI:
            exp.expresion(cuerpo_tmp, TS_local);
            break;

                
        }//Fin SWITCH    
    
    }//Fin FOR que recorre Sentencias del Cuerpo de la funcion
    
}




//FUNCION QUE PREPARA VARIABLES GLOBALES
function init(){
    var cont_static = 0;
    
    if(TS.TS_global.length != 0){
        var tmp1 = c3d.getTMP();
        c3d.addCodigo(tmp1+" = H; #Obtener el puntero libre del heap para globales\n");
        var tmp2 = c3d.getTMP();
        c3d.addCodigo(tmp2 +" = H; #Se guarda el puntero al heap\n");
        
        var global; 
        for(global of TS.TS_global){            
            var tipo;
            tipo = global.tipo;
                if(tipo != "void"){

                    if(global.valor != "---" && global.arreglo == false ){ //SI trae valores y NO es arreglo
                        var exp_val = exp.expresion(global.valor, TS.TS_global);
                        
                        if(exp_val != undefined){//Si la funcion expresion devuelve un resultado
                            if(global.tipo == c.constantes.T_ENTERO && exp_val.tipo == c.constantes.T_NULL ||
                                global.tipo == c.constantes.T_DECIMAL && exp_val.tipo == c.constantes.T_NULL ||
                                global.tipo == c.constantes.T_CARACTER && exp_val.tipo == c.constantes.T_NULL)
                                {///ERROR no coinciden los tipos como deberia ser
                                    json_objeto = new Object();
                                    json_objeto.tipo = "Semantico";
                                    json_objeto.linea = global.linea;
                                    json_objeto.columna = global.columna;
                                    json_objeto.descripcion = "No se pueden asignar valores nulos a tipos primitivos.";
                                    TS.TS_Errores.push(json_objeto);
                                    
                            }else{
                                if(global.tipo!=c.constantes.T_CADENA){//Si es primitivo
                                    c3d.addCodigo("Heap["+tmp2+"] = "+exp_val.valor+"; #Se le setea el valor por predeterminado\n");
                                    c3d.addCodigo(tmp2+" = "+tmp2+" + 1; #se sube en el heap\n");
                                    c3d.addCodigo("H = "+tmp2+";\n");
                                    //cont_static++; 
                                    
                                }else{//Si es String, trae un tref y su tamaño   
                                    console.log('\0');console.log(tmp2);console.log(exp_val.valor);
                                    c3d.addCodigo(tmp2+" = "+exp_val.valor+"; #Actualizamos puntero globales a referencia de cadena\n");
                                    c3d.addCodigo(tmp2+" = "+tmp2+" +"+exp_val.tam+"; \n");
                                }                                
                            }
                        }
                                
                                
                    }else if(global.valor != "---" && global.arreglo == true){ //Si trae valores y es arreglos con asignación
                        var res = assig.asignaciones_semantica(global.valor, global.ID, TS.TMP_global);
                        if(res != undefined){
                            c3d.addCodigo("Heap["+tmp2+"] = "+res.valor+"; //se le setea el valor de los arreglos\n");
                            c3d.addCodigo(tmp2+" = "+tmp2+" + 1; //se sube en el heap\n");
                        }
                                
                                
                                
                                
                    }else{//si NO trae valores
                        
                        if(global.arreglo == true){//verificar si es arreglo
                            c3d.addCodigo("Heap["+tmp2+"] = -1; #valor prederminado para arreglos\n");
                            c3d.addCodigo("H = H + "+global.dimen+"; #se reserva el tamaño del arreglo\n");
                                    
                        }else{//es variable primitivo y no trae valores
                            
                            console.log('\0');console.log('ESTA QUI EN INICALIZAR GLOBALES');
                            switch(tipo){
                                case c.constantes.T_ENTERO: 
                                    c3d.addCodigo("Heap["+tmp2+"] = 0; #Valor predeterminado en enteros\n");
                                    break;
                                case c.constantes.T_DECIMAL:
                                    c3d.addCodigo("Heap["+tmp2+"] = 0.0; #Valor predeterminado en decimales\n");
                                    break;
                                case c.constantes.T_CARACTER:
                                    c3d.addCodigo("Heap["+tmp2+"] = 00; #Valor predeterminado en caracter\n");
                                    break;
                                case c.constantes.T_BOOLEANO:
                                    c3d.addCodigo("Heap["+tmp2+"] = 0; #Valor predeterminado en booleanos\n");
                                    break;
                                case c.constantes.T_CADENA:
                                    c3d.addCodigo("Heap["+tmp2+"] = -1; #Valor predeterminado en cadenas null\n");//Heap["+tmp2+"] = -1;
                                    break;
                                    
                                default:                                    
                                    c3d.addCodigo("Heap["+tmp2+"] = -1; #Valor predeterminado en referencias\n");
                                    break;
                            }
                            c3d.addCodigo(tmp2+" = "+tmp2+" + 1; #se sube en el heap\n");
                            cont_static++;                                       
                        }
                    }
                    
                }else{
                    json_objeto = new Object();
                    json_objeto.tipo = "Semantico";
                    json_objeto.linea = global.linea;
                    json_objeto.columna = global.columna;
                    json_objeto.descripcion = "El tipo de dato de una variable global no puede ser void.";
                    
                    TS.TS_Errores.push(json_objeto);
                }
        }//Fin FOR que recorre variables globales
        
        
        //Aumentamos el puntero de HEAP segun la cantidad de variables globales existentes
        if(cont_static > 0){
            c3d.addCodigo("H = H + "+(cont_static)+"; #se suma la siguiente posición del heap\n");
        }
        
    }//fiN if SI ts_glolbales no esta vacia
    return cont_static; //este numero servirá para restarle al Hs
}




//función que realiza la lógica de los imports
function tratamiento_imports(l_imports){
    
    var importar;
    //TODO tratamiento de verificación de similitud de nombres de archivo
    var tmp_l1 = l_imports; //se guarda la original
    var tmp_l2 = []; //se guarda lo que se saca de la original
    var cont_coincidencias = 0; //contador de coincidencias
    for(i of l_imports){
        for(c_import of tmp_l1){
            if(i.path.localeCompare(c_import.path) == 0){
                cont_coincidencias++;
            }
        }
        if(cont_coincidencias > 1){
            //error existieron no pueden venir varios importar del mismo path
            json_objeto = new Object();
            json_objeto.tipo = "semantico";
            json_objeto.linea = 0;
            json_objeto.columna = 0;
            json_objeto.descripcion = "Error en IMPORTAR existieron coincidencias no pueden venir varios con el mismo path";
            TS.TS_Errores.push(json_objeto);
        }else{
            tmp_l2.push(i); // se guarda el path si no trae más de una coincidencia
            cont_coincidencias = 0;
        }
    }
    l_imports = tmp_l2; //se agregan los imports que pasaron el filtro de no repetidos
    for(importar of l_imports){
        try{
            var data = fs.readFileSync(importar.path).toString().split('\n');
            var val_data;
            var cad = "";
            for(val_data of data){
                cad += val_data+"\n";
            }
            var tmp_errores = [];//guardar errores
            while(TS.TS_Errores.length != 0){
                tmp_errores.push(TS.TS_Errores.pop());
            }
            //TODO bandera que indica que viene un import
            TS.ban_import = true;
            MAIN_enviardata.compilar(cad); //se compila y se carga toda la data
            TS.ban_import = false; //cambiar el estado del import
            while(tmp_errores.length != 0){
                TS.TS_Errores.push(tmp_errores.pop());
            }
        }catch(err){
            console.log(err);
            //TODO exception de archivo no encontrado
            json_objeto = new Object();
            json_objeto.tipo = "semantico";
            json_objeto.linea = importar.linea;
            json_objeto.columna = importar.columna;
            json_objeto.descripcion = "Error en IMPORTAR el archivo no se encontró";
            TS.TS_Errores.push(json_objeto);
            continue;            
        }
    }
}


