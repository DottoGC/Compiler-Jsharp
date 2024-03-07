var c = require("../Arbol/constants");
var exp = require("../Expresiones/expresion");
var local = require("../Arbol/TS");
var c3d = require("../Codigo3D/generarCodigoC3D");
var llamada = require("../Instrucciones/llamada_INST");
var arreglosdimen = require("../Instrucciones/arreglo_INST");

var json_objeto;
var cadena_elemento = ""; //temporal que concatena lo que se genera en los elementos de cada arreglo



exports.asignaciones_semantica = function asignaciones_semantica(assig, ID, TS){//Recibimos el nodo asignacion y el nodo declaracion asi como la tabla de simbolo local
/*
        assig : IGUAL inicializador_var                   -> $2;
              | arrays IGUAL COND                         -> new Nodo_3(c.constantes.T_ACCESOARRAYS, $1, $3, @1.first_line, @1.last_column+1);
              | ACCESOS IGUAL COND                        -> new Nodo_3(c.constantes.T_ACCESOOBJETO, $1, $3, @1.first_line, @1.last_column+1);    
              ; 
*/
    var tipo_assig = assig[0];//obtenemos la posicion 1 del nodo assig
    
    switch(tipo_assig){
        case c.constantes.T_ARRAYS:
            
            
        case c.constantes.T_INSTANCIA:
            var existe;
            if(ID[0] == c.constantes.T_ARREGLO){
                existe = local.getVariable(ID[1], TS);
            }else{
                existe = local.getVariable(ID[0], TS);//(ID, TS);
            }
            
            
            if(existe != false){
                var tmp = c3d.getTMP();
                var tmp_ret = c3d.getTMP();
                
                if(tipo_assig== c.constantes.T_INSTANCIA){ //instancia de arreglos u objetos
                    
                    if(existe.tipo == local.getTipo(assig[1])){ //&& assig[1].length != 3){
                        var verificar = assig[2];
                       
                        if(verificar[0] == c.constantes.T_ARRAYS){
                            if(existe.dimen == verificar[1].length){
                                
                                var reserva_tam = c3d.getTMP();
                                c3d.addCodigo(reserva_tam+" = H; //reserva de tamaño del arreglo de instancia\n");
                                c3d.addCodigo("H = H + 1; //se suma uno porque el anterior se guardó su tamaño\n");
                                c3d.addCodigo(tmp +" = H; //referencia del nuevo arreglo se tomara como contador \n");
                                c3d.addCodigo(tmp_ret+" = H; //referencia al nuevo arreglo y se guardará en la variable del arreglo\n");
                                c3d.addCodigo("H = H + "+(verificar[1].length)+"; //se tomaran estas posiciones para almacenar el tamaño de cada fila \n");
                                
                                var tmp_dime ;
                                var tam_final = c3d.getTMP(); //multiplica el valor de la variable
                                c3d.addCodigo(tam_final+" = 1; //se inicializa un temporal que llevará el control del tamaño final\n");
                                for(tmp_dime of verificar[1]){
                                    var res_exp = exp.expresion(tmp_dime, TS);
                                    if(res_exp != undefined && existe.tipo == res_exp.tipo || (existe.tipo == c.constantes.T_CARACTER && res_exp.tipo == c.constantes.T_ENTERO) ||
                                        (existe.tipo == c.constantes.T_ENTERO || existe.tipo == c.constantes.T_DECIMAL) && (res_exp.tipo == c.constantes.T_ENTERO || res_exp.tipo == c.constantes.T_DECIMAL))
                                        {    
                                            c3d.addCodigo("Heap["+tmp+"] = "+res_exp.valor+";\n");
                                            c3d.addCodigo(tam_final+" = "+tam_final+" * "+res_exp.valor+"; //se multiplica las dimensiones\n");
                                            c3d.addCodigo(tmp+" = "+tmp+" + 1; //se suma uno en el heap\n");
                                        }else{
                                        //existió un error de valor a la hora de recibir la dimensión del arreglo o el tipo no coincide
                                            json_objeto = new Object();
                                            json_objeto.tipo = "semantico";
                                            json_objeto.linea = assig.linea;
                                            json_objeto.columna = assig.columna;
                                            json_objeto.descripcion = "Error de valor a la hora de recibir la dimensión del arreglo o tipo no coincide.";
                                            local.TS_Errores.push(json_objeto);
                                        }
                                }
                                c3d.addCodigo("Heap["+reserva_tam+"] = "+tam_final+"; //se reserva el tamaño del arreglo\n");
                                c3d.addCodigo(tam_final+" = "+tam_final+" * "+verificar[1].length+"; //se multiplica el tamaño de las dimensiones\n");
                                c3d.addCodigo(tam_final+" = "+tam_final+" + "+verificar[1].length+";//se suma los espacios reservados para las dimensiones\n");
                                c3d.addCodigo("H = H + "+tam_final+"; //se reserva el tamaño del arreglo\n");//se reserva el tamaño total del arreglo
                               
                            }else{
                                //error el arreglo a instanciar debe ser del mismo tamaño
                                json_objeto = new Object();
                                json_objeto.tipo = "Semantico";
                                json_objeto.linea = tipo_assig.linea;
                                json_objeto.columna = tipo_assig.columna;
                                json_objeto.descripcion = "El arreglo a instanciar debe ser del mismo tamaño.";
                                
                                local.TS_Errores.push(json_objeto);
                            
                            }
                        }else if(verificar == c.constantes.T_LINKEDLIST){
                            c3d.addCodigo(tmp_ret+" = H; //referencia al nuevo linkedlist y se guardará en la variable de linkedlist\n");
                            c3d.addCodigo("H = H + 3 ; //se tomaran tres espacios porque es una lista doblemente enlazada más su indice\n");
                            
                            existe.tipo_arr = c.constantes.T_INSTANCIA; //para diferenciar si es un arreglo de instancia o array
                            json_objeto = new Object();
                            json_objeto.tipo =  existe.tipo;
                            json_objeto.valor = tmp_ret;
                            return json_objeto;

                        }else if(verificar[0] == c.constantes.T_OBJETO){ //instancia de una clase
                            if(local.existe_clase(assig[1]) != false){//verificar si la variable a sido instanciada
                                //generar codigo de constructor
                                return llamada.generarLlamadaInstancia(assig[2], ID, TS);
                            }else{
                                //error no se puede instanciar una clase que no existe
                                json_objeto = new Object();
                                json_objeto.tipo = "semantico";
                                json_objeto.linea = tipo_assig.linea;
                                json_objeto.columna = tipo_assig.columna;
                                json_objeto.descripcion = "Error no se puede instanciar una clase que no existe";
                                local.TS_Errores.push(json_objeto);
                            }
                        }
                        existe.tipo_arr = c.constantes.T_INSTANCIA; //para diferenciar si es un arreglo de instancia o array
                        existe.arreglo = true; //bandera nueva que indica es un arreglo
                        json_objeto = new Object();
                        json_objeto.tipo =  local.getTipo(assig[1]);
                        json_objeto.valor = tmp_ret;
                        return json_objeto;
                    }else{
                        //error los tipos deben ser el mismo
                        json_objeto = new Object();
                        json_objeto.tipo = "semantico";
                        json_objeto.linea = assig.linea;
                        json_objeto.columna = assig.columna;
                        json_objeto.descripcion = "Error los tipos deben ser iguales en los arreglos de instancia.";
                        local.TS_Errores.push(json_objeto);
                    }
                    
                    
                }else if(tipo_assig == c.constantes.T_ARRAYS){ //instancia de la manera double arr1[][] = {{1,2,1},{2,3,3},{3,4,5},{2,2,1}};
                    if(assig[1] == "}"){
                        c3d.addCodigo(tmp_ret+" = H; //referencia al nuevo arreglo y se guardará en la variable del arreglo\n");
                        c3d.addCodigo("H = H + 1; //siguiente posicion vacia del heap \n");
                        existe.tam = 0;  //tamaño del arreglo
                    }else if(assig[1].length > 0 && assig.length != 3){ //contiene datos  
                        var filas; //filas del arreglo
                        //c3d.addCodigo(tmp +" = H; //referencia del nuevo arreglo se tomara como contador \n");
                        if(existe.dimen == 1){
                            //c3d.addCodigo("Heap["+tmp+"] = "+(assig[1].length)+";//tam del arreglo de una dimensión\n");
                            //c3d.addCodigo(tmp+" = "+tmp+" + 1; //siguiente posición inicia el arreglo\n");
                            existe.tam = assig[1].length; //tamaño del arreglo si solo viene una dimensión 
                        }
                        var reserva_tam = c3d.getTMP();
                        c3d.addCodigo(reserva_tam+" = H; //guardara una posición anterior en donde se guarda el tamaño\n");
                        c3d.addCodigo("H = H + 1; //se suma un espacio ya que el anterior se guarda el tamaño\n");
                        //si es cadena se reservan sus posiciones antes
                        c3d.addCodigo(tmp_ret+" = H; //referencia al nuevo arreglo y se guardará en la variable del arreglo\n");
                        c3d.addCodigo(tmp +" = H; //referencia del nuevo arreglo se tomara como contador \n");
                        if(existe.dimen == 1){
                            if(existe.tipo == c.constantes.T_CADENA){
                                c3d.addCodigo("H = H + "+assig[1].length+"; //se suma un espacio ya que el anterior se guarda el tamaño para CADENAS\n");
                            }   
                        }   
                        var cont_dimen = 0;
                        var cont_ini = 0;
                        var cont_final = 1;
                        var var_control = []; //pila que almacena toda la información que contiene el arreglo
                        var_control.push(1);
                        var cola1 = [];
                        for(filas of assig[1]){  
                            if(existe.dimen != 1){ //que no sea de una dimensión
                                var columnas; //columnas del arreglo
                                for(columnas of filas){
                                    if(columnas != "}"){
                                        if(columnas.length > 2){
                                            for(k of columnas){
                                               // var res = tratamiento_elementos(k, tmp, existe, TS);
                                                //3 en adelante dimensiones
                                                cola1.push(k);
                                                if(cont_dimen <= 0){ //control de dimensiones
                                                   // tmp_dimen.push(res.valor);//guarda el temporal de esta dimensión
                                                    cont_dimen = 1;
                                                    //cont_final++;
                                                }
                                            }
                                            var var_control = [];
                                            var_control.push(1);
                                            var_control.push(-1)
                                            cola1.push(var_control);
                                            cont_dimen = -1;
                                            
                                        }else{
                                            //var res = tratamiento_elementos(columnas, tmp, existe,TS);
                                            cola1.push(columnas);
                                            if(cont_ini == 0){
                                               // tmp_dimen.push(res.valor);//guarda el temporal de esta dimensión
                                                cont_ini = 1;  
                                            //    cont_final++;                                             
                                            }
                                        }
                                    }else{
                                        //c3d.addCodigo(tmp+" = "+tmp+" + 1;\n");//no tiene columnas {}
                                    }
                                    //cont_filas++;
                                }  
                                if(cont_dimen != -1){
                                    var var_control = []; //se lleva el control de que momento se termina una fila
                                    var_control.push(1);
                                    var_control.push(-1);
                                    cola1.push(var_control); 
                                    cont_dimen = 0;
                                }
                                //cont_ini = 0; //controla las primeras dimensiones                             
                            }else{ //es de una dimensión
                                if(filas.length == 1){
                                    filas = filas[0];
                                }
                                tratamiento_elementos(filas, tmp, existe, TS);
                            }
                        }
                        //existe.tam = cont_filas; //tamaño del arreglo
                        existe.tipo_arr = c.constantes.T_ARRAYS; //para diferenciar que tipo de arreglo se instanció
                        existe.dimensiones = assig[1];//se guarda la información del arreglo para hacer arr[0].length

                        if(existe.dimen != 1){ //que sea mayor a 1 dimensión
                            //verificar si es cadena reservar espacios antes
                            if(existe.tipo == c.constantes.T_CADENA){
                                c3d.addCodigo("H = H + "+cola1.length+"; //se suma un espacio ya que el anterior se guarda el tamaño para CADENAS\n");
                            } 
                            tratamiento_ordenamiento(cola1, tmp, existe, TS); //se cambio de posición porque no se obtenia el tamaño real del arreglo
                        }
                        c3d.addCodigo("Heap["+reserva_tam+"] = "+(existe.tam)+"; //tamaño del arreglo\n"); 
                            //c3d.addCodigo(tmp+" = "+tmp+" + 1; //en esta posición se inician los valores del arreglo\n")
                        c3d.addCodigo(cadena_elemento);
                        c3d.addCodigo("H = H + "+tmp+"; //se le setea su valor actual al puntero a Heap\n");   
                        cadena_elemento = ""; 
                        
                        json_objeto = new Object();
                        json_objeto.tipo = existe.tipo; //se guarda el tipo del arreglo
                        json_objeto.valor = tmp_ret; //se guarda la referencia del objeto arreglo
                        json_objeto.arreglo = true;
                        json_objeto.dimen = existe.dimen;
                        json_objeto.dimensiones = assig[1];
                        existe.arreglo = true;//bandera nueva para la variable local
                        return json_objeto;
                    }else{ //es un acceso a un arreglo para obtener su valor assig = arr[6+i]
                        return exports.tratamiento_arreglos(assig[2], undefined, assig[1], TS);
                
                    }
                }
                
            }//If Si la variable existe en la tabla de simbolos local o global
            break;
            
            
        case c.constantes.T_ACCESOARRAYS:
            return exports.tratamiento_arreglos(assig[1],assig[2], ID, TS);
            
            
        case c.constantes.T_ACCESOOBJETO:
            return exp.expresion(assig, TS);
            
            
        case c.constantes.T_ARREGLO: //TODO viene de la forma var = arreglo[0].length
            return arreglosdimen.manejodimensiones(assig, TS, false);
            
            
        default:
            exp.tipo_assig = true;//cambiamos bandera, para expresiones relacionales/logicas
            
            var res = exp.expresion(assig, TS);//cond
            
            if(res != undefined && res.valor != undefined){//Si retorno de funcion expresion sale bien
                exp.tipo_assig = false;//Regresamos bandera a estado inicial
                
                return res;//retornamos el objeto que se va asignar a la variable
            
            }else{
                //Error no tiene ningún valor a asignar.
                json_objeto = new Object();
                json_objeto.tipo = "Semantico";
                json_objeto.linea = assig.linea;
                json_objeto.columna = assig.columna;
                json_objeto.descripcion = "No se obtuvo de la expresion ningún valor a asignar.";
                
                local.TS_Errores.push(json_objeto);
            }
            
    }//Fin SWITCH que recorre tipo de assignacion
}





//función que ordena un arreglo de n dimensiones
function tratamiento_ordenamiento(cola1, tmp, existe, TS_local){

    var cola2 = [];
    var cola3 = [];

    var ban_ini = 0;
    var cont = 0;
    var tam = cola1.length;
    var i;
    while(tam != 0){
        i = cola1[cont];
        if(i != undefined && ban_ini == 0){
            if(i[0].length == 2){
                cola2.push(i[0]); //1er valor;
                cola3.push(i[1]);
            }else if(i[1] != -1){
                cola2.push(i); //1er valor;
            }
            ban_ini = 1;
        }else if(i != undefined){
            if(i[1] != -1){
                cola3.push(i); //los demás valores hasta -1
            }else{
                cola3.push(i);
                ban_ini = 0;
            }
        }
        cont++;
        tam --;
        if(tam == 0){ //si llega a su tamaño total
            cola1 = cola3;
            cont = 0;
            tam = cola3.length;
            cola3 = [];
            continue;
        }

    }
    var c;
    for(c of cola2){ //recorrer el arreglo ordenado
        tratamiento_elementos(c, tmp, existe, TS_local);
    }
    existe.tam = cola2.length; //tamaño del arreglo
}

//función que hará la logica de un objeto como arreglo almacena su información en el heap
function tratamiento_arregloobjeto(variable, l_dimen , assig, TS_local){
    if(variable.valor != undefined){  
            if(assig[0] != c.constantes.T_OBJETO){
               //debe ser una instancia de un objeto sin esto no se puede asignar este valor a un objeto arreglo
               json_objeto = new Object();
               json_objeto.tipo = "semantico";
               json_objeto.linea = assig.linea;
               json_objeto.columna = assig.columna;
               json_objeto.descripcion = "Error debe ser una instancia de un objeto sin esto no se puede asignar este valor a un objeto arreglo";
               local.TS_Errores.push(json_objeto);
       
               return;
            }
            var tmp1 = c3d.getTMP();
            var tmp2 = c3d.getTMP();
            var tmp3 = c3d.getTMP();
            var tmp4 = c3d.getTMP();
            var tmp5 = c3d.getTMP();

            var etq1 = c3d.getETQ();
            var etq2 = c3d.getETQ();
            var etq3 = c3d.getETQ();
            var etq4 = c3d.getETQ();

            c3d.addCodigo(tmp1+" = 1; //multiplicará el tamaño del arreglo\n");
            for(accesos of l_dimen){
                var a_exp = exp.expresion(accesos, TS_local);
                if(a_exp != undefined && a_exp.tipo == c.constantes.T_ENTERO){
                    c3d.addCodigo(tmp1+" = "+tmp1+" * "+a_exp.valor+"; //se multiplican las dimensiones de acceso\n");
                }
            }    
            //c3d.addCodigo(tmp2 +" = "+variable.valor+" + 1; //verifica si se pasa del tamaño del arreglo\n"); 
            c3d.addCodigo(tmp3 +" = Heap["+variable.valor+"]; //se toma el tamaño del arreglo del objeto\n"); 
            c3d.addCodigo("ifFalse( "+tmp3+" >= "+tmp1+") goto "+etq1+";//si no es mayor tira un excepción\n");
            var tmp_ref = exp.expresion(assig, TS_local);
            if(tmp_ref != undefined){
                c3d.addCodigo(tmp3+" = "+tmp3+" - 1; //le restamos su tamaño\n");
                c3d.addCodigo("Heap["+variable.valor+"] = "+tmp3+"; //se resta el valor del tamaño del arreglo, nuevo tamaño disponible\n");
                c3d.addCodigo(tmp5 +" = "+variable.valor+" + 1; //se guarda la primer referencia del arreglo\n");
                c3d.addCodigo(etq4+":\n");
                c3d.addCodigo(tmp4 +" = Heap["+tmp5+"]; //obtener el valor y verificar si apunta a otro lado\n");
                c3d.addCodigo("ifFalse( "+tmp4 +" == 0 ) goto "+etq2+"; //si no es 0 apunta a otro lado del heap\n");
                c3d.addCodigo("Heap["+tmp5+"] = "+tmp_ref.valor+"; //se guarda la referencia de la primera posición\n");
                c3d.addCodigo("goto "+etq3+"; //salida\n");
                c3d.addCodigo(etq2+":\n");
                c3d.addCodigo(tmp5 +" = "+tmp5+" + 1; //se obtiene la referencia del siguiente valor\n");
                c3d.addCodigo("goto "+etq4+";\n");
                c3d.addCodigo(etq1+":\n");
                c3d.addCodigo(etq3+":\n");
            
            }
    }else{
        //no se ha instanciado este objeto
        json_objeto = new Object();
        json_objeto.tipo = "semantico";
        json_objeto.linea = assig.linea;
        json_objeto.columna = assig.columna;
        json_objeto.descripcion = "Error no se ha instanciado este objeto.";
        local.TS_Errores.push(json_objeto);
    }

}

//funcion que almacenará la información de los elementos de un arreglo
function tratamiento_elementos(elemento, tmp, existe, TS_local){

    var arr_exp = exp.expresion(elemento, TS_local); //TODO verificar elementos tipo objeto
    if(arr_exp != undefined){
        if(existe.tipo == arr_exp.tipo ||
             (existe.tipo == c.constantes.T_ENTERO || existe.tipo == c.constantes.T_DECIMAL) && (arr_exp.tipo == c.constantes.T_ENTERO || arr_exp.tipo == c.constantes.T_DECIMAL)
             || existe.tipo == c.constantes.T_CADENA && arr_exp.tipo == c.constantes.T_CADENA){
               // c3d.addCodigo("Heap["+tmp+"] = "+arr_exp.valor+";\n");
                //c3d.addCodigo(tmp+" = "+tmp+" + 1; //se sigue escalando en el Heap\n");
                cadena_elemento += "Heap["+tmp+"] = "+arr_exp.valor+";\n";
                cadena_elemento += tmp+" = "+tmp+" + 1; //se sigue escalando en el Heap\n"
             }
    }
}

//función que llevará el control del acceso de arreglos , modificar
exports.tratamiento_arreglos = function tratamiento_arreglos(lista_accesos, assig, ID, TS_local){

    var var_tmp =[];
    var_tmp.push(c.constantes.T_ID);
    var_tmp.push(ID);
    var existe = exp.expresion(var_tmp, TS_local); //obtener la referencia de la variable
    if(existe != undefined){ //TODO se quito el tipo de arreglo
            if(existe.tipo != c.constantes.T_ID){
                var indice = c3d.getTMP(); //indice final
                //var tmp_cont = c3d.getTMP(); //variable que llevara el valor que esta en cierta dimension
                var tmp_dim = c3d.getTMP(); //variable que llevará el valor de cada dimension
                var tmp_i = c3d.getTMP(); //un temporal del i real en donde se almacenará esta información
                //var tmp_1 = c3d.getTMP(); // temporal de la condicion del tamaño del arrelgo
                var tmp_2 = c3d.getTMP(); //temporal que devuelve un valor
                var ref_var = existe.valor; //la referencia se guarda en este tmp
                var acc;        
               // if(existe.tipo_arr == c.constantes.T_ARRAYS){    //verificar si es tipo instancia o array
                    //var etq = c3d.getETQ();
                    //var salida = c3d.getETQ();
                    c3d.addCodigo(indice +" = 0 ; //inicializar el indice real\n"); //calcular el indice real
                    if(existe.dimen != undefined && existe.dimen != 1 && existe.tipo != c.constantes.T_CADENA){ //que no sea de una dimensión 
                        c3d.addCodigo(tmp_dim+" = "+existe.dimen+"; //indica que el arreglo es de dos o más dimensiones \n");
                    }
                    var tmp_entro = false;
                    for(acc of lista_accesos){
                        var val = exp.expresion(acc, TS_local);
                        if(existe.dimen != 1){ //que no sea de una dimensión 
        
                            if(tmp_entro != true){
                                c3d.addCodigo(tmp_i+" = "+val.valor+"; //se toma el primer indice\n");
                                tmp_entro = true;
                            }else{
                                c3d.addCodigo(indice +" = "+val.valor+" * "+tmp_dim+"; //se multiplicara el indice por la dimension\n");
                                c3d.addCodigo(indice +" = "+tmp_i+" + "+indice+"; //se suma el total del indice real\n");
                                c3d.addCodigo(tmp_i+" = "+indice+"; //se pasa el resultado a un temporal por si vienen mas dimensiones\n"); 
                                c3d.addCodigo(tmp_dim+" = "+tmp_dim+" + 1; //si vienen más dimensiones\n");
                            }
                            
                        }else{
                            c3d.addCodigo(indice + " = "+val.valor+"; //es una dimension\n");
                        }
                    }
                    
                            json_objeto = new Object();
                            if(existe.tipo == c.constantes.T_CADENA){
                                c3d.addCodigo(indice+" = "+tmp_i+" + "+ref_var+"; //se suma la referencia más el indice real\n");
                            }else{
                                c3d.addCodigo(indice+" = "+indice+" + "+ref_var+"; //se suma la referencia más el indice real\n");
                            }
                           // c3d.addCodigo(tmp_1+" = "+existe.tam+" + "+ref_var+"; //se suma la referencia más el tamaño del arreglo\n");
                           // c3d.addCodigo("ifFalse("+tmp_1+" >= "+indice+") goto "+etq+"; //tira una excepcion de arreglo si no se cumple\n");
                            if(assig != undefined){
                                var val_assig = exp.expresion(assig, TS_local); //el valor asignar en esa posicion del arreglo
                                if(val_assig != undefined){
                                    c3d.addCodigo("Heap["+indice+"] = "+val_assig.valor+"; //se asigna el valor en esa posición del arreglo\n");
                                    //c3d.addCodigo("goto "+salida+"; //se sale de la asignacion sin pasar por la excepcion\n");
                                    //json_objeto.tipo = c.constantes.T_ARRAYS;
                                }
                            }else{//si viene solo retornar el valor que contiene esa posición
                                if(existe.tipo == c.constantes.T_CADENA){
                                    json_objeto.valor = indice;
                                }else{
                                    c3d.addCodigo(tmp_2 +" = Heap["+indice+"]; //se obtiene el valor en esta posición del heap\n");
                                    // c3d.addCodigo("goto "+salida+"; //se sale de la asignacion sin pasar por la excepcion\n");
                                     json_objeto.valor = tmp_2;
                                }
                                json_objeto.tipo = existe.tipo;
                                json_objeto.arreglo = true;
                                existe.arreglo = true;
                                return json_objeto;
                            }
                            //c3d.addCodigo(etq+":\n");
                            //c3d.addCodigo("exception = 4; // 4 es ArrayIndexOutOfBoundsException\n");
                            //c3d.addCodigo(salida+":\n");

                    
                /*}else if(existe.tipo_arr == c.constantes.T_INSTANCIA){
                        json_objeto = new Object();
                        c3d.addCodigo(tmp_cont+" = Heap["+ref_var+"]; //obtener el valor en esa posicion del heap\n");
                        c3d.addCodigo(indice +" = 0 ; //inicializar el indice real\n");
                        if(existe.dimen != 1){
                            c3d.addCodigo(tmp_dim+" = 1; //indica que el arreglo es de dos o más dimensiones \n");
                        }
                        var tmp_salida = []; //pila de etiquetas de salida del ciclo
                        for(acc of lista_accesos){
                            var val = exp.expresion(acc, TS_local);
                            if(val != undefined ){ 
                                var etq = c3d.getETQ();
                                tmp_salida.push(etq);
                                c3d.addCodigo("ifFalse("+tmp_cont+" >= "+val.valor+") goto "+etq+"; //si no se cumple es una excepcion;\n");
                                c3d.addCodigo(ref_var+" = "+ref_var+" + 1; //se suma 1 para la siguiente posicion en Heap\n");
                                c3d.addCodigo(tmp_cont+" = Heap["+ref_var+"]; //se obtiene la siguiente dimension\n");
                                if(existe.dimen != 1){ //que no sea de una dimensión 
                                    c3d.addCodigo(tmp_i +" = "+val.valor+" * "+tmp_dim+"; //se multiplicara el indice por la dimension\n");
                                    c3d.addCodigo(indice+" = "+indice+" + "+tmp_i+"; //se suma los subindices del indice real\n");
                                    c3d.addCodigo(tmp_dim+" = "+tmp_dim+" + 1; //la dimension se suma por si vienen mas\n");
                                }else{
                                    c3d.addCodigo(indice + " = "+val.valor+"; //es una dimension\n");
                                }
                            }
                        }
                        if(assig != undefined){ //si no viene con asignación vienen del lado de asignación
                            var valor_assig = exp.expresion(assig, TS_local);
                            if(valor_assig != undefined && valor_assig.tipo == existe.tipo
                                ||(existe.tipo == c.constantes.T_ENTERO || existe.tipo == c.constantes.T_DECIMAL) && (valor_assig.tipo == c.constantes.T_ENTERO || valor_assig.tipo == c.constantes.T_DECIMAL)){ //que sean del mismo tipo
                                c3d.addCodigo("Heap["+indice+"] = "+valor_assig.valor+"; //asignando el valor a esa posicion del arreglo\n");
                                json_objeto.tipo = c.constantes.T_INSTANCIA;
                            }
                        }else{
                            var valor_ret = c3d.getTMP();
                            c3d.addCodigo(valor_ret +" = Heap["+indice+"]; //asignando el valor a esa posicion del arreglo\n");
                            json_objeto.tipo = existe.tipo;
                            json_objeto.valor = valor_ret;
                        }
                        while(tmp_salida.length != 0){
                            c3d.addCodigo(tmp_salida.pop()+":\n");
                        }
                        c3d.addCodigo("exception = 4; //4 es ArrayIndexOutOfBoundsException \n");
                        existe.arreglo = true;
                        return json_objeto;
                }   */     
            }else{ //es de la forma ID[num] = 
                return tratamiento_arregloobjeto(existe, lista_accesos, assig, TS_local);
            }
        }
    }



