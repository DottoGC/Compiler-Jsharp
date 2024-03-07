var parser = require("../Analizador/gramatica");
var generar_dot = require('../Arbol/reporte_AST');
var c = require("../Arbol/constants");
var TS = require("../Arbol//TS");//Controla todas las listas necesarias
var INST = require("../Instrucciones/cuerpo_INST"); //Archivo que recorrera toda la info de las clases

var json_objeto = {};//OOBJETO VARIABLE GLOBAL QUE USAREMOS PARA CREAR LOS SIMBOLOS EN FORMATO JSON Y LOS ALMACENA EN LA TS
exports.cadConsolaHLC="";//CADENA DEL RESULTADO DE LA COMPILACION PARA MOSTRAR EN CONSOLA HLC
exports.posV = 0; //POSICION RELATIVA DE LAS VARIABLES GLOBALES
exports.posF = 0; //POSICION RELATIVA DE LAS FUNCIONES GLOBALES
exports.contCompilaciones=-1;//CONTADOR DE NUMERO DE COPILACIONES QUE SE VAN HACIENDO DURANTE EL TIEMPO ACTIVO DEL SERVIDOR
//exports.nombreArchivoPadreEjecutandose="";
//var json_clase ;//función que guarda todas las clases en una lista de clases



//FUNCION PRINCIPAL QUE SE LLAMA AL COMPILAR UN ARCHIVO DE ENTRADA
exports.compilar = function compilar(input){
    var raiz;
    
    try{
        raiz= parser.parse(input);       
        
        var ts_tmp = TS.TS_Errores;        
        if(ts_tmp.length < 1){ //si no vienen errores lexicos o sintacticos
           
            exports.cadConsolaHLC="Compilacion con Exito. :) ";            
        }else{
            
            exports.cadConsolaHLC="Compilacion con Errores. :( ";            
        }
        
        generar_dot.digraph = "digraph{\n"; //generando .dot
        generar_dot.nodo_padre = "root";    //generando .dot            
            
        recorrer_arbol(raiz);//Enviamos el nodo raiz > que es el nodo de la produccion inst
/*
            inst    : import_list cuerpo_global       -> new Nodo_2($1, $2, @2.first_line, @2.last_column+1);
                    | cuerpo_global                    -> new Nodo_1($1, @1.first_line, @1.last_column+1);       
                    ;
*/
        generar_dot.digraph +="}";      //generando .dot
        generar_dot.ejecutarDot();      //ejecutando .dot
                    
        INST.recorrer_instrucciones();//recorrer clases con sus instrucciones
                
    }catch(err){
        console.log(err);
    }   
}



//FUNCIÓN QUE RECORRE NODO IMPORTS Y NODO CUERPO_GLOBAL
function recorrer_arbol(raiz){//Recibimos el nodo raiz, que es un nodo inst
/*inst    : import_list cuerpo_global       -> new Nodo_2($1, $2, @2.first_line, @2.last_column+1);
          | cuerpo_global                   -> new Nodo_1($1, @1.first_line, @1.last_column+1);       
          ;*/
    if(raiz!=null){
        exports.contCompilaciones=exports.contCompilaciones+1;//Por cada compilacion, incrementamos este contador q nos indica la imagen AST que hay q ir a traer
        
        if(raiz.length == 1){ //size=1 > viene cuerpo_global
            console.log("En main>recorrer_arbol()   > inst : cuerpo_global");
            recorrer_CuerpoGlobal(raiz[0]);//mandamos nodo cuerpo_global
            
        }else if(raiz.length == 2){ //size=2 > viene import_list cuerpo_global
            console.log("En main.recorrer_arbol()   > inst : import_list cuerpo_global");
            recorrer_imports(raiz[0]);//mandamos nodo import_list
            recorrer_CuerpoGlobal(raiz[1]);//mandamos nodo cuerpo_global            
        }
        
    }
    //Limpiamos variables para otra corrida
    //TS.limpiar(); //limpiar listas de la clase actual
    exports.posF = 1
    exports.posV = 1;
}



//FUNCIÓN QUE RECORRE EL CUERPO DE CADA ARCHIVO Y ALMACENA EN LISTAS TODOS LOS SIMBOLOS
function recorrer_CuerpoGlobal(raiz){//Reciimos nodo cuerpo_global
    console.log("En Main.Recorrer_CuerpoGlobal() > cuerpo_global : cuerpo_global global | global");
    
/*              cuerpo_global : cuerpo_global global      {   $1.push($2); $$ = $1;}
                              | global                    {  $$ = new Nodo_1($1, @1.first_line, @1.last_column+1);};
*/
    
    if(raiz!=null){
        var itemGlobal;
        for(itemGlobal of raiz){//Recorre la lista de globales que es el nodo cuerpo_global
            console.log("En Main.Recorrer_CuerpoGlobal() > For > global : tipo_retorno opt_global");            
/*           
                global : tipo_retorno opt_global              -> new Nodo_2($1, $2, @2.first_line, @2.last_column+1);             
                       ;
*/
            json_objeto = new Object();
            
            //En el cuerpo global pueden venir: Declaraciones y Métodos  
            if(itemGlobal.length == 2){ //Si es tamaño dos es correcto, xq trae 1.tipo_retorno 2.opt_global
                console.log("itemGlobal.Size = 2 > [tipo_retorno, opt_global] > Declaraciones o Metodos ");
                
                json_objeto.tipo = itemGlobal[0]; //tipo_retorno > tipos que puede ser void, int, char, etc...  LO UTILIZAMOS PARA METODOS                             
                console.log("tipo_retorno: "+json_objeto.tipo);
                
                
                if(itemGlobal[1].length == 2){ //opt_global > es declaración
                    console.log("opt_global.size == 2 >  [lista_declaraciones,PYC] > Declaracion ");
                    
                    var opt_global = itemGlobal[1];
/*
                    opt_global : lista_declaraciones PYC          -> new Nodo_2($1, $2, @2.first_line, @2.last_column+1);
                               | metodos                          -> $1; */     
                    
                    
                    
                    var lista_declaraciones = opt_global[0];
  /*
lista_declaraciones : lista_declaraciones COMA tipo_declaracion assig  {var n = new Nodo_2($3,$4,@4.firstline,@4.lastcolumn+1); $1.push(n); $$=$1;}
                    | lista_declaraciones COMA tipo_declaracion         {var n = new Nodo_1($3, @3.first_line, @3.last_column+1); $1.push(n); $$ = $1;}   
                    | tipo_declaracion assig                               
                                                                {   var n = new Nodo_1("", @2.first_line, @2.last_column+1);
                                                                    var n1 = new Nodo_2($1, $2,@2.first_line, @2.last_column+1);  
                                                                    n.pop();  n.push(n1);  $$ = n;   
                                                                }
                    | tipo_declaracion                  {var n = new Nodo_1($1, @1.first_line, @1.last_column+1); $$ = n;}
                    ;
  */                  
                    
                    var cd;//iterador, caso de declaracion
                    //var cont_var = 0; //contador que llevará el control de si viene una lista de declaraciones                                   
                    var tipo =  itemGlobal[0];
                    var dimen = 0;
                    var valor = "---";
                    var ID;
                    var ban_arreglo=false;
                    for(cd of lista_declaraciones){//se obtiene la raiz de las declaraciones
                        ID = cd[0];
                        ban_arreglo = false; //lleva el control si es arreglo global o no
                        
                            if(cd.length > 1){ //Es una declaración de array, o declaracion con asignacion de array, o declaracion con asignacion variable normal
                                
                                if(cd[0] == c.constantes.T_ARREGLO & cd.length==3){ //es declaracion arreglo
                                    console.log("Aqui en IF > Declaracion de arreglo");
                                    
                                    ID = cd[1];
                                    dimen = cd[2].length;//En este proyecto solo existen arreglos de una dimension                                    
                                    ban_arreglo = true;
                                    
                                }else{ //es asignación
                                    //verificar si es asignacion de arreglo o asignacion de variable normal
                                    if(ID[0] == c.constantes.T_ARREGLO && ID.length == 4){
                                        console.log("Aqui en ELSE > IF > Es Declaracion/Asignacion de arreglo");
                                        
                                        ID = ID[1];
                                        dimen = cd[2].length;
                                        
/*                                        if(cd[3].length==2 && (cd[3])[0]!=c.constantes.T_ID){//Si el valor es una valor simple y no necesita ser ejecutado para saber
                                            valor = cd[3];//El valor si es una expresion es un arreglo de dos elementos, [TipoDato,Valor]
                                            valor = valor[1];//Por lo tanto obtenemos el valor real ubicado en la segunda posicion
                                        }else{
                                            valor=undefined;
                                        }
                                        valor = cd[1];
   */                                     
                                        ban_arreglo = true;
                                    }else{
                                        console.log("Aqui en ELSE > ELSE > Es Declaracion/Asignacion variable normal");
                                        
                                        ID = cd[0];
                                        valor =  cd[1];
                                        
                                        

/*                                        if(cd[1].length==2 && (cd[1])[0]!=c.constantes.T_ID){//Si el valor es una valor simple y no necesita ser ejecutado para saber
                                            valor =  cd[1];//El valor si es una expresion es un arreglo de dos elementos, [TipoDato,Valor]
                                            valor = valor[1];//Por lo tanto obtenemos el valor real ubicado en la segunda posicion
                                        }else{
                                            valor=undefined;
                                        }
*/
                                        
                                        //cd = cd[0]; //porque viene en la siguiente posicion
                                    }
                                }
                            }
                        
                        
                            //cd.length == 1, entonces solo guardamos el simbolo de la variable sino existe.
                            //Igual, despues de tener los atributos cuando cd:length>1 guardamos el simbolo de la variable si no existe
                            if(!TS.existe_variable(ID)){
                                    console.log("La variable no existe. Se agregara a la tabla de simbolos.");
                                    
                                    json_objeto = new Object();
                                    json_objeto.tipo = TS.getTipo(tipo);
                                    //console.log("tipo_retorno utilizando ts.getTipo(tipo): "+json_objeto.tipo);
                                    
                                    
                                    json_objeto.valor = valor;
                                console.log('\0');console.log(valor);
                                    if(valor=="---"){
                                        json_objeto.tam = 0;
                                    }else if(valor[0]==c.constantes.T_CADENA){
                                            json_objeto.tam = valor[1].length;//para saber cuando es tamaño de cadena String;
                                    }
                                    //json_objeto.l_modificadores = modificador;
                                    json_objeto.ID = ID;
                                    json_objeto.dimen = dimen;
                                    json_objeto.pos = exports.posV;
                                    json_objeto.arreglo = ban_arreglo;
                                    //json_objeto.cont = cont_var;
                                    json_objeto.padre = TS.ban_archivoActual;//exports.nombreArchivoPadreEjecutandose; //arcivo a la que pertenece esta variable
                                
                                    json_objeto.ambito = c.constantes.T_GLOBAL;
                                    json_objeto.linea = itemGlobal.linea;
                                    json_objeto.columna = itemGlobal.columna;                                

                                    //TS.TMP_global.push(json_objeto);TS_global
                                    TS.TS_global.push(json_objeto);
                                
                                    generar_dot.crearNodo("Nodo_Declaracion_"+ID,ID); //generando .dot
                                    exports.posV++;//Incrementamos variable xq ya guardamos uno
                            }else{
                                    //Error esta variable ya existe.
                                    json_objeto = new Object();
                                    json_objeto.tipo = "Semantico";
                                    json_objeto.linea = itemGlobal.linea;
                                    json_objeto.columna = itemGlobal.columna;
                                    json_objeto.descripcion = "La variable "+cd[0]+" ya existe.";
                                
                                    TS.TS_Errores.push(json_objeto);
                            }
                        
                        
                    }//Fin FOR donde se obtiene la raiz de las declaraciones

                }else if(itemGlobal[1].length == 3){ //es método normal
                    console.log("opt_global.size == 3 [metodo] > [tipo_metodo,t_parametros,opt_metodos] > Metodo ");
                    
                    verificacion_funciones(itemGlobal[1]); // Mandamos un nodo opt_global > segunda produccion > opt_global := metodos
                    
                }
            }
            
        }//fin for(cuerpo of raiz)
    }//fin if(raiz!=null)
}



//FUNCIÓN QUE VÁLIDA LA EXISTENCIA DE LOS METODOS NUEVOS
function verificacion_funciones(opt_global){//Recibimos un nodo opt_global, tamaño 3, seunda produccion: opt_global:= metodo
    
/*    metodos : tipo_metodo  t_parametros LLAVEA opt_metodos              -> new Nodo_3($1, $2, $4, @3.first_line, @3.last_column+1);  
              ;
*/
    var metodo = opt_global;
    var ban_verificarEsArreglo = false;
    
    var id_funcion= metodo[0];//tipo_metodo
    var ID = metodo[0];//tipo_metodo     
/*
        tipo_metodo : CORCHA dimen_metodo ID PARENA                         -> new Nodo_2($2, $3, @3.first_line, @3.last_column+1); 
                    | ID PARENA                                             -> new Nodo_1($1, @1.first_line, @1.last_column+1);
                    ;
*/
    if(id_funcion.length == 2){ //es arreglo > primera produccion de tipo_metodo
        ID = id_funcion[1];//obtenemos el ID de la funcion, q esta en la posicion 2 del la lista del nodo
        ban_verificarEsArreglo = true;
        
    }else{ //es id normal > segunda produccion de tipo_metodo        
        ID = id_funcion[0];//obtenemos el ID de la funcion
    }
    

    
    
    if(!TS.existe_funcion(ID)){//Si la funcion NO esta declarada
        var params = metodo[1];//Obtenemos el nodo t_parametros del metodo
        
        if(!ban_verificarEsArreglo){ //Si es una funcion normal          
            json_objeto.ID = ID;//id_funcion[0];
            json_objeto.dimen=0;
            json_objeto.arreglo = false;
            almacenar_funciones(params, metodo, false,ID);//La bandera false que mandamos es para saber si es una sobrecarga de metodo o no
            
        }else{ //Si es una función de tipo arreglo
            
            if(json_objeto.tipo != "void"){
                json_objeto.ID = ID;//id_funcion[1];
                json_objeto.dimen = id_funcion[0].length;//Tamaño produccion dimen_metodo q seria un corchetecierre q indica tamaño uno = dimension 1 de array
                json_objeto.arreglo = true; //función que es arreglo
                almacenar_funciones(params, metodo, false,ID);// id_funcion[1]);
                
            }else{
                //ERROR no puede venir un método tipo void en un retorno de referencia de un arreglo
                json_objeto = new Object();
                json_objeto.tipo = "Semantico";
                json_objeto.linea = metodo.linea;
                json_objeto.columna = metodo.columna;
                json_objeto.descripcion = "No puede venir el método "+ID+" tipo void con un retorno de referencia de arreglo.";
                TS.TS_Errores.push(json_objeto);               
            }
        }
        
        
    }else{//Si la funcion YA esta declarada, se realiza SOBRECARGA DE METODO
        
        
        var params = metodo[1]; //se obtienen t_parametros del metodo, que son los parámetros de la función actual
        verificacion_parametros(params); //Verificamos y almacenanamos los parámetros d la nueva funcion para q tenga el mismo formato
        
        var funct_tmp;//almacena el metodo con el que coincide al sacar de la tabla de simbolos         
        for(funct_tmp of TS.TS_Funciones){ //se recorre la lista de funciones y buscar todas las del mismo nombre
            
                if(funct_tmp.ID == ID){ //si coincide con una funcion
                    //Aqui hay dos casos: 1. Si coincide con el numero de parametros que recibe, se sobrecarta. 2. Si no coincide con num de parametros solo se agrega.(TOMAR ENCUENTA Q AQUI HAY DEBILIDAD DE SOFTWARE XQ YA NO SIGUE BUSCANDO POR SI EXISTE OTRO METODO CON EL MISMO ID AORITA CON EL PRIMERO QUE ENCUNETRE COMPARA Y TERMINA EL CICLO ESTE PODRIA MEJORARSE)
                    
                        if(json_objeto.params.length == funct_tmp.no_params){ //si la cantidad de parámetros coincide
                            
                            var res =TS.esTipocoincidente(json_objeto.params, funct_tmp.params);//verificar tipos si coinciden
                            if(res){//Si los tipos coinciden > ERROR                                
                                json_objeto = new Object();
                                json_objeto.tipo = "Semantico";
                                json_objeto.linea = metodo.linea;
                                json_objeto.columna = metodo.columna;
                                json_objeto.descripcion = "La funcion '"+ID+"' que se intenta crear ya se encuentra declarado con los mismo parametros.";
                                TS.TS_Errores.push(json_objeto);
                                break;
                            
                            }else{//Si los tipos no coinciden > se almacena la funcion
                                if(id_funcion.length == 1){ //Si viene solo ID es funcion normal
                                    json_objeto.ID = ID;
                                    json_objeto.dimen=0;
                                    
                                    json_objeto.linea=metodo.linea;
                                    json_objeto.columna=metodo.columna;
                                    
                                    almacenar_funciones(undefined, metodo,true,ID);
                                    
                                }else{//funcion de arreglos
                                    json_objeto.ID = id_funcion[1];
                                    json_objeto.dimen = id_funcion[0].length;
                                    json_objeto.arreglo = true; //función que es arreglo
                                    
                                    json_objeto.linea=metodo.linea;
                                    json_objeto.columna=metodo.columna;
                                    almacenar_funciones(undefined, metodo,true,ID);
                                }
                                
                                break;
                            }
                            
                        }else{//Si la cantidad de parametros NO coincide > Se sobrecarga o se almacena la nueva funcion
                            if(id_funcion.length == 1){ //Si solo viene ID es funcion normal
                                json_objeto.ID = ID;
                                json_objeto.dimen=0;
                                
                                json_objeto.linea=metodo.linea;
                                json_objeto.columna=metodo.columna;
                                
                                almacenar_funciones(undefined, metodo, true,ID); //antes se mandaba false pero se supone q estamos aqui xq es una sobrecarga, tambien se mandaba params pero no deberia xq se supone q ya se verificaron los parametros del metodo  
                                
                            }else{ //Viene ID y corechete, es funcion de arreglos
                                json_objeto.ID = id_funcion[1];
                                json_objeto.dimen = id_funcion[0].length;
                                json_objeto.arreglo = true; //función que es arreglo
                                
                                json_objeto.linea=metodo.linea;
                                json_objeto.columna=metodo.columna;
                                
                                almacenar_funciones(undefined, metodo,true,ID);
                            }
                            break;//Aqui hay una debilidad de software xq terminamos de buscar entre los metodos
                        }
                    
                }//Fin if si coincide ID con una funcion para sobrecargar
            
        }//Fin FOR que recorre Tabla Simbolos global
        
    }//Fin ELSE si es sobrecarga de metodo

}



//FUNCIÓN QUE ALMACENA LA INFORAMCIÓN DE PARÁMETROS Y EL CUERPO DE LAS FUNCIOONES
function almacenar_funciones(params, metodo, esSobrecarga,id_funcion){
    console.log("En Main.Almacenar_funciones()");
    
/*
            t_parametros : PARENC                                               -> $1;
                         | parametros PARENC                                    -> $1;
                         ;

                parametros : parametros COMA parametro                                  {$1.push($3); $$ = $1;}
                           | parametro                                               -> new Nodo_1($1, @1.first_line, @1.last_column+1);
                           ;

                parametro : tipo_retorno tipo_declaracion                            -> new Nodo_2($1, $2, @2.first_line, @2.last_column+1);
                          ; 
*/
    
    if(esSobrecarga == false){ //Si no es un metodo de sobrecarga
        //Ya traemos en el objeto json el tipo al igual q el id
        json_objeto.no_params = params.length;
        
        verificacion_parametros(params);//verificamos y guardamos sus parámetros, antes de guardar
    }
    //Else si es una sobrecarga, desde arriba ya traemos todo asi como ya verificamos sus parametros ya solo queda guardarlo
    
    
    
/*
      metodos : tipo_metodo  t_parametros LLAVEA opt_metodos       -> new Nodo_3($1, $2, $4, @3.first_line, @3.last_column+1);  
*/
        json_objeto.cuerpo = metodo[2];//opt_metodos, tercer elemento del nodo metodos
        json_objeto.pos=exports.posF;
        json_objeto.ambito = c.constantes.T_GLOBAL;
        json_objeto.padre = TS.ban_archivoActual;//exports.nombreArchivoPadreEjecutandose;//archivo del q es esta función

        TS.TS_Funciones.push(json_objeto);

        generar_dot.crearNodo("Nodo_Metodo_"+id_funcion,id_funcion); //generar .dot
        exports.posF++;//AUMENTAMOS CONTADOR XQ YA RECIBIMOS UNA FUNCION
}



//FUNCIÓN QUE VERIFICA EL TIPO DE PARÁMETROS Y LOS ALMACENA EN EL ATRIBUTO PARAMETROS DEL OBJETO JSON FUNCION QUE SE ESTA DECLARANDO
function verificacion_parametros(nodo){//Traemos el nodo t_parametros del metodo
/*
            t_parametros : PARENC                                               -> $1;
                         | parametros PARENC                                    -> $1;
                         ;

                parametros : parametros COMA parametro                                  {$1.push($3); $$ = $1;}
                           | parametro                                               -> new Nodo_1($1, @1.first_line, @1.last_column+1);
                           ;

                parametro : tipo_retorno tipo_declaracion                            -> new Nodo_2($1, $2, @2.first_line, @2.last_column+1);
                          ; 
*/
    
      
    json_objeto.params =[]; //inicializar un arreglo de objetos tipo parametros
    
    var pos_param = 1; // return = 1;               si hubieran clases seria this = 0 , return = 1
    
    if(nodo != ")"){ //Si la funcion SI tiene parametros
        
        var json_param;//objeto json que iremos construyendo para guardar el parametro en el objeto json metodo
        var params;//iterados de parametros
        for(params of nodo){
            json_param = new Object();
            
            var tipo_param = params[0]; //obtenemos el tipo_retorno del parametro para verifica tipoDato del parametro            
            json_param.tipo = TS.getTipo(tipo_param);
            
            if(json_param.tipo == c.constantes.T_ID){//Si el tipo es un ID, dejamos una bandera que indique q es por referencia
                json_param.referencia = true;
            }
            
            var val_param;//lo usamos para obtener el tipo_declaracion del parametro            
            val_param = params[1]; //verificar si es ID o ID[][] para saber si el parametro es un arreglo o no
            
                        
            //verificar si este parámetro ya ha sido declarado en este ámbito de la funcion
            if(json_objeto.params.length != 0){                
                var existe = false;//bandera
                
                var tmp_existe;//iterador de los parametros de la funcion
                for(tmp_existe of json_objeto.params){
                    if(val_param[2] != undefined){//Si es parametro array
                        if(tmp_existe.ID == val_param[1]){
                            existe = true;
                            break;
                        }
                    }else{//Si es paramatro normal
                        if(tmp_existe.ID == val_param[0]){
                            existe = true;
                            break;
                        }
                    }
                }
                
                if(existe == true){//Si ya existe es un error semantico
                    json_objeto = new Object();
                    json_objeto.tipo = "Semantico";
                    json_objeto.linea = val_param.linea;
                    json_objeto.columna = val_param.columna;
                    json_objeto.descripcion = "El parámetro "+val_param[0]+" ya ha sido declarado en el ambito del metodo.";
                    
                    TS.TS_Errores.push(json_objeto);
                    continue;//Llamamos directamente la siguiente iteracion del for
                }
            }
            
            
            if(val_param[2] != undefined){ //Aqui verificamos si es parametro tipo arreglo, si viene ] en la posicion 3 es arreglo
                json_param.ID = val_param[1];//como es array el val_param es de tamaño 3[c.constante.T_ARREGLO, id, ']']
                json_param.pos = pos_param;//La posicion del parametro dentro del metodo
                json_param.dimen = val_param[2].length;
                //json_param.referencia = true;
                json_param.arreglo = true;
                
            }else{//Si es un parametro normal
                json_param.ID = val_param[0];
                json_param.pos = pos_param;
                json_param.dimen=0;
                
            }
            json_param.parametro = true;//Dejamos una bandera que indique que es un parametro en el entorno del metodo
            json_param.linea = val_param.linea;
            json_param.columna = val_param.columna;
            
            json_objeto.params.push(json_param); //Agrega el parametro al objeto metodo
            json_objeto.no_params = json_objeto.params.length;//Se cambia el numero de parmetros
            
            pos_param++;//Incrementamos el contador q indicara la posicion del siguiente parametro dentro del ambito del metodo
            
        }//Fin FOR que recorre la lista de parametros
    
        
    }else{//Si la funcion NO tiene parametros
        json_objeto.no_params = 0;      
        //json_objeto.params.push(json_param);<- no es necesario hacer push al atributo xq no tiene
    }

}




//función que guarda todos los imports en una lista de imports
function recorrer_imports(raiz){

    if(raiz !=null){
        if(raiz.length == 2){
             if(raiz[0] == "import"){
                json_objeto = new Object();
                json_objeto.path =raiz[1];
                json_objeto.linea = raiz[1].linea;
                json_objeto.columna = raiz[1].columna;
                generar_dot.crearNodo("Nodo_Imports", "\""+raiz[1]+"\""); //generando .dot
                TS.TS_imports.push(json_objeto); //guarda en la tabla de simbolos para imports
            }
            
        }else if(raiz.length == 3){
            if(raiz[1] == "import"){
                json_objeto = new Object();
                json_objeto.path = raiz[2];
                json_objeto.linea = raiz[2].linea;
                json_objeto.columna = raiz[2].columna;
                generar_dot.crearNodo("Nodo_Imports", "\""+raiz[2]+"\""); //generando .dot
                TS.TS_imports.push(json_objeto); //guarda en la tabla de símbolos para imports
            }
            recorrer_imports(raiz[0]);
        }
    }

}
    
