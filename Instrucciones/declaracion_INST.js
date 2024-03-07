var assig = require("../Instrucciones/asignacion_INST");
//var local = require("../Arbol/TS");
var c = require("../Arbol/constants");
var objeto_json; //variable que se convertirá en objeto cuando se declare una variable
var c3d = require("../Codigo3D/generarCodigoC3D");
var TS = require("../Arbol/TS");


//FUNCIÓN QUE HACE LA SEMANTICA PARA DESPUÉS GENERAR CÓDIGO
exports.declaraciones_semantica = function declaraciones_semantica(decla,TS_local,idFuncion){//Recibimos nodo local y la tabla de simbolos local
/*
        local: tipo_retorno lista_declaraciones PYC           -> new Nodo_3(c.constantes.T_DECLARACION,$1,$2,@1.first_line, @1.last_column+1);
*/
    var pos=TS_local.length+1; //posición de cada variable en entorno local más el retorno es el primer elemento del entorno
    var tipo = decla[1]; //tipo de la variable a declarar
    var hijo_decla = decla[2];//obtenemos el tercer elemento del nodo local: lista_declaraciones, indica si es declaracion o listaDeclaraciones o es con asignacion
/*
lista_declaraciones : lista_declaraciones COMA tipo_declaracion assig     {var n = new Nodo_2($3,$4, @4.first_line, @4.last_column+1); $1.push(n); $$ = $1;}
                    | lista_declaraciones COMA tipo_declaracion           {var n = new Nodo_1($3, @3.first_line, @3.last_column+1); $1.push(n); $$ = $1;}   
                    | tipo_declaracion assig                               
                        {
                            var n = new Nodo_1("", @2.first_line, @2.last_column+1);
                            var n1 = new Nodo_2($1, $2,@2.first_line, @2.last_column+1);  
                            n.pop();
                            n.push(n1);
                            $$ = n;   
                        }
                    | tipo_declaracion                                    {var n = new Nodo_1($1, @1.first_line, @1.last_column+1); $$ = n;}
                    ;
*/
    var comparar; //variable para arreglos    
    var l_decla;//iterador
    
    for(l_decla of hijo_decla){//iteramos la lista de lista_declaraciones
        var id_tmp ;//guarda ID actual
        
        if(l_decla.length == 1){//si el nodo lista_declaraciones es tamaño 1 es solo un tipo_declaracion de nodo1 que traer un elemento q nos trae el id
            id_tmp = l_decla[0];//Obtenemos el elemento cero que es el ID q trae nodo tipo_declaracion
            console.log("l_decla.length=1 y id_tmp=l_decla[0] >"+id_tmp);
        }else{//Si no de tamaño uno, entonces puede ser una asignacion xq no solo trae un ID o bien puede ser una delcaraccion pero de arreglo
            if(l_decla[0].length == 3){//Si el primer elemento del nodo lista_declaraciones tiene un nodo de tamaño 3, entonces es un tipo_declaracion_arreglo
                comparar = l_decla[0];//El elemento cero del nodo tipo_declaracion deberia ser otro nodo que trae tres elementos
                if(comparar[0] == c.constantes.T_ARREGLO){//si el primer elemento del nodo es la constante arreglo
                    id_tmp = comparar[1]; //Entonces sabemos que el id del arreglo esta en la posicion 2 del nodo
                }
            }else{//Si no entonces deberia ser una puta asignacion, pero aqui solo vamos obtener su id                
                id_tmp = l_decla[0];//obtenemos el primer elemento que es un nodo tipo_declaracion            
                //independientemente si es una asignacion a una variable normal o a un arreglo en este nodo solo viene el id en su posicion 0
                id_tmp = id_tmp[0];
            }
        }
        
        
        
        if(TS.existe_variable_local(id_tmp, TS_local) == true){
            //ERROR esta variable ya existe no se puede declarar
            objeto_json = new Object();
            objeto_json.tipo = "Semantico";
            objeto_json.linea = l_decla.linea;
            objeto_json.columna = l_decla.columna;
            objeto_json.descripcion = "La variable "+ id_tmp+" ya existe y no se puede declarar.";
            TS.TS_Errores.push(objeto_json);
            
        }else{//Variable no existe, se guarda en tabla simbolos local
            
            objeto_json = new Object();
            
            var existe_Instancia = l_decla[1];//obtenemos el segundo elemento  para verificamos si existe el nodo assig
/*
            assig : IGUAL inicializador_var                   -> $2;
                  | arrays IGUAL COND                         -> new Nodo_3(c.constantes.T_ACCESOARRAYS, $1, $3, @1.first_line, @1.last_column+1);
                  | ACCESOS IGUAL COND                        -> new Nodo_3(c.constantes.T_ACCESOOBJETO, $1, $3, @1.first_line, @1.last_column+1);    
                  ;  
*/
            
            if(l_decla[0].length == 1 || l_decla.length == 1){ //nodo tipo_declaracion es tamaño uno(solo ID) y nodo lista_declaracion es tambien tamaño uno sol(nodo1) entonces es un Declaracion Normal
                
                objeto_json.tipo = TS.getTipo(tipo);//Obtenemos el no. que identifica al tipo de dato del identificaor q se declara
                
                //verificar si esta clase existe.
                if(objeto_json.tipo == c.constantes.T_ID && TS.existe_estructura(tipo) != false){
                //Si el tipoDeDato es ID, significa q no es un primitivo y deberia existir la estructura del tipo q se esta definiendo
                    objeto_json.ID = id_tmp;
                    objeto_json.pos = pos;//posicion variable en entorno local
                    objeto_json.padre = TS.ban_archivoActual;//tipo;
                    objeto_json.ambito = idFuncion;//"local";
                    objeto_json.valor="---";
                    
                    if(TS.ban_for){ //le agrega un nuevo atributo a esta variable que indica que es una declaración en un for
                        objeto_json.for = true;
                    }else{
                        objeto_json.for = false;
                    }
                    
                    TS_local.push(objeto_json);TS.TS_locales.push(objeto_json);
                    pos++;//aumentamos el id para la siguiente posicion de la siguiente declaracion
                    
                }else if(objeto_json.tipo == c.constantes.T_ID && existe_Instancia[0] == c.constantes.T_OBJETO){//Si es el tipo de datos de la variable es un ID y existe una asignacion tipo COND que q es llega hasta EXP del tipo NEW LLAMADA
                   objeto_json.ID = id_tmp;
                   objeto_json.pos = pos;
                   objeto_json.padre = TS.ban_archivoActual;//tipo;
                   objeto_json.instancia = true; //lleva el control de visibilidad ya que es local y de instancia no tiene problema
                   objeto_json.ambito = idFuncion;//"local";
                   objeto_json.valor="---";
                   
                   TS_local.push(objeto_json);TS.TS_locales.push(objeto_json);                    
                    
                   pos++;
                    
                }else if(objeto_json.tipo != c.constantes.T_ID){//Declaracion tipo PRIMITIVO
                    objeto_json.ID = id_tmp;
                    objeto_json.pos = pos;
                    objeto_json.padre = TS.ban_archivoActual;//tipo;
                    objeto_json.dimen=0;
                    objeto_json.ambito = idFuncion;//"local";                    
                    objeto_json.valor="---";
                    
                    
                    if(objeto_json.ambito != c.constantes.T_GLOBAL && l_decla.length == 1){//Si es una declaracion LOCAL y no trae asignacion
                        if(objeto_json.tipo != c.constantes.T_CADENA){//si no es cadena
                            setDefaultValue(objeto_json);//Sete el valor default para la declaracion sin valor
                            c3d.asignarStack(objeto_json.pos, objeto_json.valor);//generar código para declaración con valor
                        }else{//si es cadena
                            setDefaultValue(objeto_json);//Sete el valor default para la declaracion sin valor                                        
                            var tmp2 = c3d.getTMP();
                            c3d.addCodigo(tmp2 +" = H; #Se obtiene el puntero de heap\n");
                            c3d.addCodigo("Heap["+tmp2+"] = -1; #Valor predeterminado en cadenas null\n");
                            c3d.addCodigo("H = H + 1; #Aumentamos puntero de Heap\n");
                            c3d.asignarStack(objeto_json.pos, tmp2);//generar código para declaración con valor
                        }
                    }
                    //var res = assig.asignaciones_semantica(l_decla[1], l_decla[0], TS_local);//mandamos el nodo assig de la posicion 1 y nodo declaracion posicion 0
                    
                    TS_local.push(objeto_json);TS.TS_locales.push(objeto_json);
                    pos++;              
                    
                }
                
            }else{ //declaración con arreglos xq aunque length es 1 pero el l_decla[0] ya no seria tamaño cero xq ya trae tres elementos metadata para un array
               
                objeto_json.tipo = TS.getTipo(tipo);
                
                if(comparar != undefined && comparar[2] != undefined){//si la bandera es difernte a null y su posicion 2 que es q indica la dimension del array existe
                    objeto_json.ID = id_tmp;
                    objeto_json.dimen = comparar[2].length;
                    //objeto_json.l_dimen = comparar[2]; //guardar la lista de dimensiones
                    objeto_json.arreglo = true;
                    console.log("Aqui primer if donde deberia detectar la declaracion de un aRRAY.");
                
                }else{
                    if(l_decla.length != 3){//aqui seria siento q entonces seria una declaracion de array con asignacion
                        var tmp_decla = l_decla[0];
                        
                        objeto_json.ID = tmp_decla[1];
                        objeto_json.dimen = tmp_decla[2].length;
                        //objeto_json.l_dimen = tmp_decla[2]; //guardar la lista de dimensiones
                        objeto_json.arreglo = true;
                    }else if(l_decla[0] == c.constantes.T_ARREGLO){//declaracion normal de arreglo xq tendria tamaño tres
                        //siento que este else ya no seria necesaria xq este seria lo mismo que el primer if cuando padre cuand comparar!=unedined y comparar[2]!=undifined
                        objeto_json.ID = l_decla[1];
                        objeto_json.dimen = l_decla[2].length;
                        //objeto_json.l_dimen = l_decla[2]; //guardar la lista de dimensiones
                        objeto_json.arreglo = true;
                        
                        console.log("Aqui dentro de else anidado dentro de else, donde detectar la declaracion de un aRRAY pero no deberia entrar nunca aqui..");
                    }
                }
                
                objeto_json.pos = pos;
                objeto_json.padre = exports.ban_archivoActual;//tipo;
                objeto_json.ambito = idFuncion;//"local";
                
                TS_local.push(objeto_json);
                pos++;
            }
            
            
            
            
            if(l_decla.length == 2){ //Es Asignación
                c3d.addCodigo("#Se genera codigo para declaraciones con asignacion\n");
                
               var res = assig.asignaciones_semantica(l_decla[1], l_decla[0], TS_local);//mandamos el nodo assig de la posicion 1 y nodo declaracion posicion 0
               
                if(res != undefined && res != c.constantes.T_ERROR && res.valor != undefined){
                   //verificar si vienen casteos implicitos
                   if(objeto_json.tipo == c.constantes.T_DECIMAL && res.tipo == c.constantes.T_ENTERO || objeto_json.tipo == c.constantes.T_ENTERO && res.tipo == c.constantes.T_CARACTER       || objeto_json.tipo == c.constantes.T_DECIMAL && res.tipo == c.constantes.T_CARACTER || objeto_json.tipo == c.constantes.T_ID && res.tipo == c.constantes.T_ID 
                       || objeto_json.tipo == c.constantes.T_CADENA && res.tipo == c.constantes.T_NULL || objeto_json.tipo == c.constantes.T_ID && res.tipo == c.constantes.T_NULL 
                       || objeto_json.tipo == res.tipo){
                         
                         if(res.arreglo && objeto_json.arreglo){//verificar si se va asignar un arreglo
                             if(res.dimen == objeto_json.dimen){
                                objeto_json.dimensiones = res.dimensiones;
                                objeto_json.dimen = res.dimen;    
                             }else{
                                //error en asignación porque las dimensiones no coinciden con el arreglo 
                                objeto_json = new Object();
                                objeto_json.tipo = "Semantico";
                                objeto_json.linea = l_decla[1].linea;
                                objeto_json.columna = l_decla[1].columna;
                                objeto_json.descripcion = "Error en asignación porque las dimensiones no coinciden con el arreglo";
                                TS.TS_Errores.push(objeto_json);
                                return;
                             }
                        }       
                       
                        c3d.asignarStack(objeto_json.pos, res.valor);//generar código para declaración                       
                        objeto_json.valor = res.valor;  //asignarle valor a la declaracion para llevar el control de la semantica   

                        if(objeto_json.tipo == c.constantes.T_CADENA && res.tipo == c.constantes.T_NULL){
                            //objeto_json.tipo =res.tipo;// TS.getTipo(res.tipo);//res.tipo; 
                            objeto_json.cadIsNULL =true;
                        }
                       
                        if(res.t_casteo != undefined){ //lleva el control del casteo en cadenas
                            objeto_json.t_casteo = res.t_casteo;
                        }
                       

                    }else if(objeto_json.tipo == c.constantes.T_DECIMAL && res.tipo == c.constantes.T_NULL ||
                        objeto_json.tipo == c.constantes.T_ENTERO && res.tipo == c.constantes.T_NULL ||
                        objeto_json.tipo == c.constantes.T_CARACTER && res.tipo == c.constantes.T_NULL){
                            
                            objeto_json = new Object();
                            objeto_json.tipo = "Semantico";
                            objeto_json.linea = l_decla[1].linea;
                            objeto_json.columna = l_decla[1].columna;
                            objeto_json.descripcion = "El tipo DECIMAL/ENTERO/CARACTER no puede ser igual a NULL.";
                       
                            TS.TS_Errores.push(objeto_json);
                   }else if(objeto_json.tipo != c.constantes.T_ID && objeto_json.tipo != c.constantes.T_CADENA && res.tipo != c.constantes.T_OBJETO ){
                       //Error los tipos no son validos para asignarlo a esta declaración
                       objeto_json = new Object();
                       objeto_json.tipo = "Semantico";
                       objeto_json.linea = l_decla[1].linea;
                       objeto_json.columna = l_decla[1].columna;
                       objeto_json.descripcion = "Tipo no válido para la asignacion en esta declaración.";
                       TS.TS_Errores.push(objeto_json);
                        
                   }
                   
               }else{//Else de IF si el resultado devuelto por la asignacion es incorrecto
                   //Existió un error en la asignación 
                   objeto_json = new Object();
                   objeto_json.tipo = "Semantico";
                   objeto_json.linea = l_decla[1].linea;
                   objeto_json.columna = l_decla[1].columna;
                   objeto_json.descripcion = "Existió un error en la asignación.";
                   
                   TS.TS_Errores.push(objeto_json);
               }
                
            }//Fin if si son Asignaciones
            
        }//Fin Else si variable no existe para registrar el simbolo
    
        
    }//Fin FOR que recorre HIJOS de Declaracion
}




//FUNCION QUE PREPARA VARIABLES LOCALES SIN ASIGNACION
function setDefaultValue(objeto_json){
    switch(objeto_json.tipo){
            
        case c.constantes.T_ENTERO: 
            c3d.addCodigo("#Valor predeterminado en enteros\n");
            objeto_json.valor= 0;
            break;
        case c.constantes.T_DECIMAL:
            c3d.addCodigo("#Valor predeterminado en decimales\n");
            objeto_json.valor= 0.0;
            break;
        case c.constantes.T_CARACTER:
            c3d.addCodigo("#Valor predeterminado en caracter\n");
            objeto_json.valor= 00;
            break;
        case c.constantes.T_BOOLEANO:
            c3d.addCodigo("#Valor predeterminado en booleanos\n");
            objeto_json.valor= 0;
            break;
        case c.constantes.T_CADENA:
            c3d.addCodigo("#Valor predeterminado en cadenas null\n");
            objeto_json.valor= -1;
            break;
                                    
        default:                                    
            c3d.addCodigo("#Valor predeterminado en referencias\n");
            objeto_json.valor= -1;
            break;
    }

}

