
var TS = require("../Arbol/TS");
var c = require("../Arbol/constants");
var c3d = require("../Codigo3D/generarCodigoC3D");
var exp = require("../Expresiones/expresion");
var cuerpo = require("../Instrucciones/cuerpo_INST");


//variable que lleva el control de no sobreescribir valores cuando viene una funcion en un parámetro
exports.ban_sobrescritura = false;

exports.pila_sobreescritura = [];//pila del control anterior

exports.pila_parametros = [];//pila que llevará el control de los parámetros por si viene una llamada como paraémtro

exports.cad_parametros = "";//cadena que se llevará en el proceso de acumulación por si viene parámetros con llamadas

exports.ban_parametros = false;//bandera que verifica si viene un parámetro

exports.ban_esTHIS = false;//bandera que verifica si esta llamada viene en un this

//bandera que verifica si se está utilizando una variable que viene como parámetro
//si fuera así entonces, se puede generar código de doble referencia
exports.ban_esparametro = false;

var auxNombreLlamada="";


//FUNCION QUE GENERA CODIGO PARA LLAMADAS A METODOS
exports.generarLlamada = function generarLlamada(llamada, TS_local, retorna, variable_objeto){

    var tmp_llamada = llamada[2];
    if(tmp_llamada == ")"){
        tmp_llamada = 0;//Entonces no trae parametros la llamada
    }
    
    var existe = TS.existe_metodo(llamada[1], tmp_llamada, TS_local); //revisar pendiente
    if(existe.tipo == "void" && retorna == true){ //métoodo es void y retorna
        // error si viene en expresion es porque debe retornar algo
        json_objeto = new Object();
        json_objeto.tipo = "Semantico";
        json_objeto.linea = tmp_llamada.linea;
        json_objeto.columna = tmp_llamada.columna;
        json_objeto.descripcion = "Error no puede venir un void en donde se retorna un valor.";
        TS.TS_Errores.push(json_objeto);
    }
    
    
    if(existe != false){//SI la funcion existe
        if(TS.ban_analisis == false){
            var json_obj = new Object;
            var tmp1 = c3d.getTMP();
            var tmp2 = c3d.getTMP();
            var tmp3 = c3d.getTMP();
            var tmp4 = c3d.getTMP();
            var tmp5 = c3d.getTMP();

            var ret = c3d.getTMP();
            var val_ret = c3d.getTMP();
            var pos = 1;
            
            //********* realiza los parámetros primero ****************
            if(tmp_llamada.length > 0 && tmp_llamada != ")"){ //existen más parámetros

                if(exports.ban_parametros){ //control de parámetros en llamadas
                    c3d.addCodigo(tmp1+" = P + "+(TS_local.length+1)+"; #tamaño del metodo para simular el ámbito \n");//+2
                    
                }else if(exports.ban_esTHIS){ //si vienen this.metodo(algo)
                    exports.cad_parametros += tmp3+" = P + 0; //referencia que viene por parámetro\n";
                    exports.cad_parametros += tmp5+" = Stack["+tmp3+"]; //obtener la referencia\n";
                    exports.cad_parametros += tmp1+" = P + "+(TS_local.length+1)+"; //tamaño del método actual\n";//+2
                    exports.cad_parametros += tmp4+" = "+tmp1+" + 0; //se pasa la referencia del this actual\n";
                    exports.cad_parametros += "Stack["+tmp4+"] = "+tmp5+"; //pasar la referencia a la llamada de la función\n";
                    exports.pila_parametros.push(exports.cad_parametros);
                    exports.cad_parametros = "";

                }else if(exports.ban_esTHIS && exports.ban_parametros){ //si viene this.metodo(algo());
                    c3d.addCodigo(tmp2+" = P + 0; //referencia que viene por parámetro\n");
                    c3d.addCodigo(tmp3+" = Stack["+tmp2+"]; //obtener la referencia\n");
                    c3d.addCodigo(tmp1+" = P + "+(TS_local.length+1)+"; //tamaño del método actual\n");//+2
                    c3d.addCodigo(tmp4+" = "+tmp1+" + 0; //se pasa la referencia del this actual\n");
                    c3d.addCodigo("Stack["+tmp4+"] = "+tmp3+"; //pasar la referencia a la llamada de la función\n"); 
                    
                }else{
                    exports.cad_parametros += tmp1+" = P + "+(TS_local.length+1)+"; #tamaño del metodo para simular el ámbito\n";//+2
                    exports.pila_parametros.push(exports.cad_parametros);
                    exports.cad_parametros = "";
                }
                
                
                for(tmp_param of tmp_llamada){    
                    //c3d.addCodigo(tmp2+" = "+tmp1+" + "+pos+";//simulando el ámbito \n");
                    if(tmp_param[0] == c.constantes.T_NULL){
                        if(exports.ban_parametros){ //control de parámetros en llamadas
                            c3d.addCodigo(tmp2+" = "+tmp1+" + "+pos+";#simulando el ámbito \n");
                            c3d.addCodigo("Stack["+tmp2+"] = 00; #agregarle el valor NULL que se va a enviar\n"); 
                            
                        }else{
                            exports.cad_parametros += tmp2+" = "+tmp1+" + "+pos+";#simulando el ámbito \n";
                            exports.cad_parametros += "Stack["+tmp2+"] = 00; #agregarle el valor NULL que se va a enviar\n";
                            exports.pila_parametros.push(exports.cad_parametros);
                            exports.cad_parametros = "";
                        }
                        
                    }else{
                         //se reescriben datos
                        var tmp_sobreescritura = exports.pila_sobreescritura.pop(); //pila que lleva control d no sobreescribir valores cuando viene una funcion en un parámetro
                        if(tmp_param[0] == c.constantes.T_LLAMADA && tmp_sobreescritura){ //pila que lleva el control de no sobreescribir valores cuando viene una funcion en un parámetro
                            var tmp_quitarparametro = existe.nombre.split("_");
                            var tmp_nombre = "";
                            for(var i = 0; i < tmp_quitarparametro.length-1; i++){
                                tmp_nombre += tmp_quitarparametro[i]+"_";
                            }
                            auxNombreLlamada=existe.nombre;
                            existe.nombre = tmp_nombre.substring(0, tmp_nombre.length-1);
                        }
                        //llamada de la forma metodo(metodo(), 5)
                        //objeto de la forma metodo(new objeto())
                        //accesos de la forma metodo(objeto.algo())
                        if(tmp_param[0] == c.constantes.T_LLAMADA || tmp_param[0] == c.constantes.T_OBJETO 
                            || tmp_param[0] == c.constantes.T_ACCESOOBJETO){ 
                            exports.ban_parametros = true;
                        }
                        
                        exports.pila_sobreescritura.push(tmp_sobreescritura);
                        exports.pila_sobreescritura.push(true);
                        var res_param = exp.expresion(tmp_param, TS_local);
                        if(res_param != undefined){

                            if(exports.ban_parametros || (exports.ban_esTHIS && exports.ban_parametros)){ //control de parámetros con llamadas
                                c3d.addCodigo(tmp2+" = "+tmp1+" + "+pos+";#simulando el ámbito \n");
                                c3d.addCodigo("Stack["+tmp2+"] = "+res_param.valor+"; //agregarle el valor que se va a enviar\n");
                                
                            }else{
                                exports.cad_parametros += tmp2+" = "+tmp1+" + "+pos+";#simulando el ámbito \n";
                                exports.cad_parametros += "Stack["+tmp2+"] = "+res_param.valor+"; #agregarle el valor que se va a enviar\n";
                                exports.pila_parametros.push(exports.cad_parametros);
                                exports.cad_parametros = "";                                
                            }
                        }
                        exports.pila_sobreescritura.pop(); //pila que lleva el control de no sobreescribir valores cuando viene una funcion en un parámetro
                        //exports.ban_sobrescritura = false;
                    }
                    pos++;
                }
            }//fin if que realiza los parámetros primero
            
            
            

            //c3d.addCodigo(tmp1+" = P + "+(TS_local.length+2)+"; //tamaño del metodo para simular el ámbito \n");
    
            if(variable_objeto != undefined){ //pasar la referencia de este objeto al método antes de llamarlo
                var tmp3 = c3d.getTMP();
                var tmp4 = c3d.getTMP();
                var tmp5 = c3d.getTMP();
                var tmp6 = c3d.getTMP();

                if(exports.ban_parametros){ //control de parámetros con llamadas, accesos a llamadas
                    c3d.addCodigo(tmp1+" = P + "+(TS_local.length)+"; #tamaño del metodo para simular el ámbito \n");//+2
                    c3d.addCodigo(tmp3+" = P + "+variable_objeto.pos+";#posicion de la variable\n");
                    c3d.addCodigo(tmp4+" = Stack["+tmp3+"]; #se obtiene la referencia del objeto\n");
                    if(exports.ban_esparametro){ //solo cuando venga parámetro se hace doble referencia
                        c3d.addCodigo("#se realiza cuando la función va a retornar un valor\n");
                        c3d.addCodigo(tmp6+" = Heap["+tmp4+"]; #doble referencia, se obtiene la real\n");
                        c3d.addCodigo(tmp5+" = "+tmp1+" + 0; #viene acceso de objeto se pasa la referencia\n");
                        c3d.addCodigo("Stack["+tmp5+"] = "+tmp6+"; #se pasa la referencia del objeto\n");        
                    }else{
                        c3d.addCodigo(tmp5+" = "+tmp1+" + 0; #viene acceso de objeto se pasa la referencia\n");
                        c3d.addCodigo("Stack["+tmp5+"] = "+tmp4+"; #se pasa la referencia del objeto\n");                          
                    }
                }else{
                    exports.cad_parametros += tmp1+" = P + "+(TS_local.length)+"; #tamaño del metodo para simular el ámbito \n";//+2
                    exports.cad_parametros += tmp3+" = P + "+variable_objeto.pos+";#posicion de la variable\n";
                    exports.cad_parametros += tmp4+" = Stack["+tmp3+"]; #se obtiene la referencia del objeto\n";
                    //verificar si la función retorna un valor pasarle la doble referencia
                    if(exports.ban_esparametro){//solo cuando venga parámetro se hace doble referencia
                        exports.cad_parametros += "#se realiza cuando la función va a retornar un valor\n";
                        exports.cad_parametros += tmp6+"= Heap["+tmp4+"]; #doble referencia, se obtiene la real\n";
                        exports.cad_parametros += tmp5+"= "+tmp1+" + 0; #viene acceso de objeto se pasa la referencia\n";
                        exports.cad_parametros += "Stack["+tmp5+"] = "+tmp6+"; #se pasa la referencia del objeto\n";
                        exports.pila_parametros.push(exports.cad_parametros);
                        exports.cad_parametros = "";
                    }else{
                        exports.cad_parametros += tmp5+"= "+tmp1+" + 0; #viene acceso de objeto se pasa la referencia\n";
                        exports.cad_parametros += "Stack["+tmp5+"] = "+tmp4+"; #se pasa la referencia del objeto\n";
                        exports.pila_parametros.push(exports.cad_parametros);
                        exports.cad_parametros = "";                       
                    }
                }
            }
    

            if(!exports.ban_parametros){
                while(exports.pila_parametros.length != 0){
                    c3d.addCodigo(exports.pila_parametros.shift()); //sacar toda la info que se obtuvo cuando no era paámetro llamada
                }
            }
            
            c3d.addCodigo("P = P + "+(TS_local.length+1)+"; \n");//+2
            if(existe.miembro != true){
                if(existe.nombre != undefined){
                    c3d.addCodigo("call "+existe.ID+"_"+existe.tipo+existe.no_params+"; #llamada al metodo\n");
                    //c3d.addCodigo("call "+existe.padre+"_"+existe.nombre+"; #llamada al metodo\n");
                }else{
                    c3d.addCodigo("call "+existe.ID+"_"+existe.tipo+existe.no_params+"; #llamada al metodo\n");
                    //c3d.addCodigo("call "+existe.padre+"_"+existe.ID+"; #llamada al metodo\n");
                }
            }else{
                c3d.addCodigo("call "+existe.ID+"_"+existe.tipo+existe.no_params+"; #llamada al metodo\n");
                //c3d.addCodigo("call "+existe.nombre+"; #llamada al metodo\n");
                var pila_sobre = exports.pila_sobreescritura.pop(); //pila que lleva el control de no sobreescribir valores cuando viene una funcion en un parámetro
                if(pila_sobre != true ||  exports.pila_sobreescritura.length == 0){
                    var tmp_quitarparametro = existe.nombre.split("_");
                    var tmp_nombre = "";
                    for(var i = 0; i < tmp_quitarparametro.length-1; i++){
                        tmp_nombre += tmp_quitarparametro[i]+"_";
                    }
                    existe.nombre = tmp_nombre.substring(0, tmp_nombre.length-1);
                }
                if(exports.pila_sobreescritura.length != 0){ //pila que lleva el control de no sobreescribir valores cuando viene una funcion en un parámetro
                    exports.pila_sobreescritura.push(pila_sobre);
                }
            }
    
            if(existe.tipo != "void" && retorna == true){ //si es void no retorna nada
                c3d.addCodigo(ret+" = P + 1; #recoger el retorno antes de cambiar de ambito\n");
                c3d.addCodigo(val_ret+" = Stack["+ret+"]; #recoge el valor\n");   
            }
            c3d.addCodigo("P = P - "+(TS_local.length+1)+"; #regreso de ambito\n");//+2
            json_obj.valor = val_ret;
            
        }//Fin IF donde banderaAnalisis=false
        
        
        
        if(exports.ban_parametros){ //cambiar bandera de parámetro llamada
            exports.ban_parametros = false;
        }
        
        if((existe.tipo != "void" && retorna == true) || TS.ban_analisis == true){ //si es void no retorna nada
            json_obj.tipo = TS.getTipo(existe.tipo); //enviar el tipo de método para saber que retorna
            //verificar si la funcion es arreglo
            if(existe.arreglo){
                json_obj.dimen = existe.dimen; //se lleva la dimension
                json_obj.dimensiones = existe.dimensiones; //se lleva sus valores si tuviera este arreglo
                json_obj.arreglo = true;
            }
            return json_obj;
        }
        
        
    }else{
        //ERROR esta funcion no existe o sus parámetros no coinciden
        json_objeto = new Object();
        json_objeto.tipo = "Semantico";
        json_objeto.linea = llamada.linea;
        json_objeto.columna = llamada.columna;
        json_objeto.descripcion = "Error esta función no existe o sus parámetros no coinciden";
        TS.TS_Errores.push(json_objeto);

    }

}




//método que genera el codigo de un constructor
exports.generarLlamadaInstancia = function generarLlamadaInstancia(cuerpo_llamada, TS_local){

    if(cuerpo_llamada[0] == c.constantes.T_LLAMADA){
        //verificar si la clase permite instanciarse
        var clase_actual = TS.existe_clase(cuerpo_llamada[1]);
        if(clase_actual != false){
            if(clase_actual.modificador == c.constantes.T_ABSTRACT && (clase_actual.miembro != undefined && clase_actual.miembro == false)){ //es error ya que no es miembro
                json_objeto = new Object();
                json_objeto.tipo = "Semantico";
                json_objeto.linea = clase_actual.linea;
                json_objeto.columna = clase_actual.columna;
                json_objeto.descripcion = "Error esta clase "+clase_actual.ID+" no se puede instanciar porque trae el modificador abstract y no es miembro";
                TS.TS_Errores.push(json_objeto);
            }else{
            //buscar en los constructores actuales
            var existe_const = TS.existe_constructor_llamada(cuerpo_llamada[1], cuerpo_llamada[2], TS_local); 
            if(existe_const != false){
                var tmp_param;
                var pos = 2; //tamaño de los parametros más 0= this y 1= return
                var tmp1 = c3d.getTMP();
                var tmp2 = c3d.getTMP();
                var tmp3 = c3d.getTMP();
                var tmp0 = c3d.getTMP();
      
                if(cuerpo_llamada[2].length > 0 && cuerpo_llamada[2] != ")"){ //existen más parámetros
                    c3d.addCodigo(tmp2+" = P + "+(TS_local.length+2)+"; //tamaño del metodo para simular ambito\n");
                    for(tmp_param of cuerpo_llamada[2]){
                        var exp_total = exp.expresion(tmp_param, TS_local);
                        if(exp_total != undefined){
                            c3d.addCodigo(tmp3+" = "+tmp2+" + "+pos+"; //simulando el ambito \n");
                            c3d.addCodigo("Stack["+tmp3+"] = "+exp_total.valor+"; //asignar el valor al simulado de parametros\n");
                            pos++;
                            tmp3 = c3d.getTMP();
                        }
                    }  
                }
                
                c3d.addCodigo("P = P + "+(TS_local.length+2)+"; //cambio de ambito\n");
                c3d.addCodigo("call "+existe_const.nombre+"; //llamar al constructor\n");
                c3d.addCodigo(tmp0 +" = P + 0; //esta posicion retorna el this del objeto la referencia\n");
                c3d.addCodigo(tmp1 +" = Stack["+tmp0+"]; //obtener la referencia del objeto\n");
                c3d.addCodigo("P = P - "+(TS_local.length+2)+"; //regreso al ambito\n");

                //bandera que activa el parámetro como falso
                exports.ban_parametros = false;

                var json_obj = new Object();
                json_obj.valor = tmp1; 
                return json_obj; //se retorna la referencia de la variable
            }else{
            //error este constructor no existe.
                json_objeto = new Object();
                json_objeto.tipo = "semantico";
                json_objeto.linea = cuerpo_llamada.linea;
                json_objeto.columna = cuerpo_llamada.columna;
                json_objeto.descripcion = "Error este constructor "+cuerpo_llamada[1]+" no existe.";
                TS.TS_Errores.push(json_objeto);
            }
            }
        }else{ //esta clase no existe no se puede instanciar
            json_objeto = new Object();
            json_objeto.tipo = "semantico";
            json_objeto.linea = cuerpo_llamada.linea;
            json_objeto.columna = cuerpo_llamada.columna;
            json_objeto.descripcion = "Error esta clase "+cuerpo_llamada[1]+" no existe no se puede instanciar";
            TS.TS_Errores.push(json_objeto);
        }
        
    }else if(cuerpo_llamada[0] == c.constantes.T_ARRAYS){ //si viene en este caso new clasenombre[6]
        var id_clase = cuerpo_llamada[1]; //verificar si la clase existe.
        var existe_clase = TS.existe_clase(id_clase);
        if(existe_clase != false){
            var arr;
            var tmp4 = c3d.getTMP();
            var tmp5 = c3d.getTMP();
            var tmp6 = c3d.getTMP();

            c3d.addCodigo(tmp6+" = H ; //se enviara a la variable esta referencia\n");
            c3d.addCodigo(tmp4+" = H; //guardar la nueva referencia\n");
            c3d.addCodigo(tmp5+" = 1; //variable que multiplicará todas las dimensiones que se van a reservar en el heap\n");
            //c3d.addCodigo(tmp4+" = "+tmp4+" + 1; //se suma la siguiente posición para guardar su tamaño\n");
            for(arr of cuerpo_llamada[2]){
                var v_exp = exp.expresion(arr, TS_local);
                if(v_exp != undefined){
                    c3d.addCodigo(tmp5+" = "+tmp5+" * "+v_exp.valor+"; //multiplica las dimensiones de los arreglos\n");
                }
            }
            c3d.addCodigo("Heap["+tmp4+"] = "+tmp5+"; //se asigna el tamaño del arreglo de objetos\n");
            c3d.addCodigo("H = H + "+tmp5+"; //siguiente posición libre del heap\n"); //siguiente posición libre del puntero a heap\n");
            c3d.addCodigo("H = H + 1; //sumare un espacio más porque en la primer posición se utilizará para el tamaño del arreglo\n");

            var json_obj = new Object();
            json_obj.valor = tmp6;
            return json_obj; //se retorna la referencia de la variable
        }
    
    }
}



//funcion que verifica si viene un método estático y viene this o super como acceso
function tratamiento_estatico(l_modificadores, this_super, error){

    for(l of l_modificadores){
        if(l[0] == c.constantes.T_STATIC){
            //error no puede venir un this/super como acceso de un método estático
            json_objeto = new Object();
            json_objeto.tipo = "semantico";
            json_objeto.linea = error.linea;
            json_objeto.columna = error.columna;
            json_objeto.descripcion = "Error este "+this_super+" no puede venir en un método estático";
            TS.TS_Errores.push(json_objeto);
            return true;
        }
    }
    return false;
}




