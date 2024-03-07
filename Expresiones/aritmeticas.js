var c = require("../Arbol//constants");
var exp = require("../Expresiones/expresion");
var c3d = require("../Codigo3D/generarCodigoC3D");
var json_objeto;
var TS = require("../Arbol/TS");


//FUNCION PRINCIPAL QUE REALIZA LA LOGICA NECESARIA PARA OPERACIONES ARITMETICAS
exports.aritmeticas = function aritmeticas(tipo, izq, der, TS_local){

    if(izq != undefined && der != undefined){
        if(TS.ban_imprimir){ //se activa cuando viene un imprimir entonces se hace los prints de una vez
            var tipo_izq = exp.expresion(izq,TS_local);
            var tipo_der = exp.expresion(der,TS_local);
        }else{
            var tipo_der = exp.expresion(der,TS_local);  
            var tipo_izq = exp.expresion(izq,TS_local);  
        }

        if(tipo_izq != undefined && tipo_der != undefined){
            json_objeto = new Object();
            switch(tipo){
                case c.constantes.T_SUMA:
                    var resultante = c.comprobacion_tipos(tipo_izq.tipo, tipo_der.tipo, MT_SUMA);
                    
                    if(resultante != c.constantes.T_ERROR){
                        if((tipo_izq.tipo == c.constantes.T_CADENA || tipo_der.tipo == c.constantes.T_CADENA) && !TS.ban_imprimir){ //si los dos tipos contienen cadenas
                            if(TS.ban_analisis == false){
                                //console.log('\0');console.log(tipo_izq.tipo +" "+ tipo_der.tipo);
                                return concatenacion(tipo_izq, tipo_der);
                            }
                            
                        }else{
                            if(TS.ban_analisis == false){
                                if(TS.ban_imprimir == c.constantes.T_PRINT){ //se activa cuando viene un imprimir entonces se hace los prints de una vez
                                //verificar si vienen una concatenación con entero , double , boolean o caracter
                                    if(tipo_izq.tipo == c.constantes.T_CADENA){
                                        if(tipo_der.tipo == c.constantes.T_ENTERO){
                                            c3d.addCodigo("print( \"%i\" , "+tipo_der.valor+"); #se imprime el entero en concatenación \n");
                                        }else if(tipo_der.tipo == c.constantes.T_DECIMAL){
                                            c3d.addCodigo("print( \"%d\" , "+tipo_der.valor+"); #se imprime el decimal en concatenación \n");
                                        }else if(tipo_der.tipo == c.constantes.T_CARACTER){
                                            c3d.addCodigo("print( \"%c\" , "+tipo_der.valor+"); #se imprime el caracter en concatenación \n");
                                        }else if(tipo_der.tipo == c.constantes.T_BOOLEANO){
                                            c3d.addCodigo("print( \"%i\" , "+tipo_der.valor+"); #se imprime el booleano en concatenación \n");
                                        }
                                        
                                        c3d.addCodigo("print( \"%c\" , 10); #se imprime nueva linea\n");
                                        return tipo_izq;
                                        
                                    }else if(tipo_der.tipo == c.constantes.T_CADENA){
                                        if(tipo_izq.tipo == c.constantes.T_ENTERO){
                                            c3d.addCodigo("print( \"%i\" , "+tipo_izq.valor+"); #se imprime el entero en concatenación \n");
                                        }else if(tipo_izq.tipo == c.constantes.T_DECIMAL){
                                            c3d.addCodigo("print( \"%d\" , "+tipo_izq.valor+"); #se imprime el decimal en concatenación \n");
                                        }else if(tipo_izq.tipo == c.constantes.T_CARACTER){
                                            c3d.addCodigo("print( \"%c\" , "+tipo_izq.valor+"); #se imprime el caracter en concatenación \n");
                                        }else if(tipo_izq.tipo == c.constantes.T_BOOLEANO){
                                            c3d.addCodigo("print( \"%i\" , "+tipo_izq.valor+"); #se imprime el booleano en concatenación \n");                                           
                                        }
                                        
                                        c3d.addCodigo("print( \"%c\" , 10); #se imprime nueva linea\n");
                                        return tipo_der;
                                    }
                                    
                                }else{
                                    //verificar si viene concatenación
                                    var tmp = c3d.generarCodigo(tipo_izq.valor, tipo_der.valor,"+"); //genera la suma
                                    json_objeto.valor = tmp;
                                }
                            }
                        }
                        
                        json_objeto.tipo = resultante;
                        return json_objeto;
                    }else{
                        //error en los tipos de una expresión suma
                        json_objeto = new Object();
                        json_objeto.tipo = "Semantico";
                        json_objeto.linea = der.linea;
                        json_objeto.columna = der.columna;
                        json_objeto.descripcion = "Error en los tipos de una expresión aritmética SUMA";
                        TS.TS_Errores.push(json_objeto);
                    }
                    break;
                    
                    
                    
                case c.constantes.T_RESTA:
                    var resultante = c.comprobacion_tipos(tipo_izq.tipo, tipo_der.tipo, MT_RESTA);
                    if(resultante != c.constantes.T_ERROR){
                        if(TS.ban_analisis == false){
                            var tmp = c3d.generarCodigo(tipo_izq.valor, tipo_der.valor,"-"); //genera la resta                        
                            json_objeto.valor = tmp;  
                        }
                        json_objeto.tipo = resultante;
                        return json_objeto;                     
                    }else{
                        //error en los tipos de una expresión resta
                        json_objeto = new Object();
                        json_objeto.tipo = "Semantico";
                        json_objeto.linea = der.linea;
                        json_objeto.columna = der.columna;
                        json_objeto.descripcion = "Error en los tipos de una expresión aritmética RESTA";
                        TS.TS_Errores.push(json_objeto);
                    }
                    break;
                    
                    
                    
                    
                case c.constantes.T_MULT:
                    var resultante = c.comprobacion_tipos(tipo_izq.tipo, tipo_der.tipo, MT_MULT);
                    if(resultante != c.constantes.T_ERROR){
                        if(TS.ban_analisis == false){
                            var tmp = c3d.generarCodigo(tipo_izq.valor, tipo_der.valor,"*"); //genera la multiplicación
                            json_objeto.valor = tmp;                      
                        }
                        json_objeto.tipo = resultante;
                        return json_objeto;                     
                    }else{
                        //error en los tipos de una expresión multiplicación
                        json_objeto = new Object();
                        json_objeto.tipo = "Semantico";
                        json_objeto.linea = der.linea;
                        json_objeto.columna = der.columna;
                        json_objeto.descripcion = "Error en los tipos de una expresión aritmética MULTIPLICACIÓN";
                        TS.TS_Errores.push(json_objeto);
                    }
                    break;
                    
                    
                    
                case c.constantes.T_DIV:
                    var resultante = c.comprobacion_tipos(tipo_izq.tipo, tipo_der.tipo, MT_DIV);
                    if(resultante != c.constantes.T_ERROR){
                        if(TS.ban_analisis == false){
                            var tmp = c3d.generarCodigo(tipo_izq.valor, tipo_der.valor,"/"); //genera la división
                            json_objeto.valor = tmp;                          
                        }
                        json_objeto.tipo = resultante;
                        return json_objeto;                     
                    }else{
                        //error en los tipos de una expresión división
                        json_objeto = new Object();
                        json_objeto.tipo = "Semantico";
                        json_objeto.linea = der.linea;
                        json_objeto.columna = der.columna;
                        json_objeto.descripcion = "Error en los tipos de una expresión aritmética DIVISIÓN";
                        TS.TS_Errores.push(json_objeto);
                    }
                    break;
                    
                    
                    
                    
                case c.constantes.T_MOD:
                    var resultante = c.comprobacion_tipos(tipo_izq.tipo, tipo_der.tipo, MT_MOD);
                    if(resultante != c.constantes.T_ERROR){
                        if(TS.ban_analisis == false){
                            var tmp = c3d.generarCodigo(tipo_izq.valor, tipo_der.valor,"%"); //genera la modulo
                            json_objeto.valor = tmp;                          
                        }
                        json_objeto.tipo = resultante;
                        return json_objeto;                     
                    }else{
                        //error en los tipos de una expresión modulo
                        json_objeto = new Object();
                        json_objeto.tipo = "Semantico";
                        json_objeto.linea = der.linea;
                        json_objeto.columna = der.columna;
                        json_objeto.descripcion = "Error en los tipos de una expresión aritmética MODULO";
                        TS.TS_Errores.push(json_objeto);
                    }
                    break;
                    
                    
                    
                case c.constantes.T_POW:
                    var resultante = c.comprobacion_tipos(tipo_izq.tipo, tipo_der.tipo, MT_POW);
                    if(resultante != c.constantes.T_ERROR){
                        if(TS.ban_analisis == false){
                            var codigo = "";
                            var tmp_base = tipo_izq.valor;
                            var tmp_potencia = tipo_der.valor;
                            var ETQF = c3d.getETQ();
                            var ETQV = c3d.getETQ();
                            var tmp_1 = c3d.getTMP();
                            var tmp_2 = c3d.getTMP();

                            c3d.addCodigo(tmp_1+" = 1;\n");
                            c3d.addCodigo(tmp_2+" = 1;\n");//c3d.addCodigo(tmp_2+" = 0;\n");
                            codigo += ETQV+":\n";
                            codigo += "if ("+tmp_2+" > "+tmp_potencia+") goto "+ETQF+";\n";// codigo += "ifFalse("+tmp_2+" < "+tmp_potencia+") goto "+ETQF+";\n";
                            codigo += tmp_1+" = "+tmp_1+" * "+tmp_base+";\n";
                            codigo += tmp_2+" = "+tmp_2+" + 1;\n";
                            codigo += "goto "+ETQV+";\n";
                            c3d.addCodigo(codigo);
                            c3d.addCodigo(ETQF+":\n");
                            json_objeto.valor = tmp_1; //TODO revisar
                        }
                        json_objeto.tipo = resultante;
                        return json_objeto;  
                    }else{
                        //error en los tipos de una expresión potencia
                        json_objeto = new Object();
                        json_objeto.tipo = "Semantico";
                        json_objeto.linea = der.linea;
                        json_objeto.columna = der.columna;
                        json_objeto.descripcion = "Error en los tipos de una expresión aritmética POTENCIA";
                        TS.TS_Errores.push(json_objeto);
                    }
                    break;
                    
                    
            }
        }
    }
}



//MÉTODO QUE REALIZA LA LÓGICA DE LA CONCATENACIÓN, SE RECIBEN DOS REFERENCIAS
function concatenacion(cad1, cad2){
    var var_obje = new Object();
    
    if(TS.ban_analisis == false){
        var tmp1 = c3d.getTMP();
        var tmp2 = c3d.getTMP();
        var tmp3 = c3d.getTMP();
        var tmp4 = c3d.getTMP();
    
        var etq1 = c3d.getETQ();
        var etq2 = c3d.getETQ();
        var etq3 = c3d.getETQ();
        var etq4 = c3d.getETQ();
    
        c3d.addCodigo(tmp1+"= H; #Obtener el puntero libre en el heap\n");
        c3d.addCodigo(tmp2+"= H; #Guardar la referencia del heap para retornar\n");

        if(cad1.tipo == c.constantes.T_CADENA){
            ///console.log('\0');console.log("aqui en cadena1.cadena: "cad1.tipo);
            c3d.addCodigo(etq2+":\n");
            c3d.addCodigo(tmp3+" = Heap["+cad1.valor+"]; #Caracter de la primer cadena\n");
            c3d.addCodigo("Heap["+tmp1+"] = "+tmp3+"; #Asignar el ascii la posición del heap libre\n");
            c3d.addCodigo(tmp1+" = "+tmp1+" + 1; #Subir en el heap\n");
            c3d.addCodigo("if ("+tmp3+" == -1) goto "+etq1+"; #Verifica que la 1er. cadena ya ha terminado\n");
            c3d.addCodigo(cad1.valor+" = "+cad1.valor+" + 1; #Escalar en la cadena 1\n");
            c3d.addCodigo("goto "+etq2+";\n");
            c3d.addCodigo(etq1+":\n");
            c3d.addCodigo(tmp1+" = "+tmp1+" - 1; #Para quitar el fin de cadena se sustituye con espacio\n");
            c3d.addCodigo("Heap["+tmp1+"] = 32; #Espacio intermedio de cadenas\n");
        }else{
            c3d.addCodigo("Heap["+tmp1+"] = "+cad1.valor+"; #Se concatena un valor a esta cadena\n");
            /*if(cad1.tipo == c.constantes.T_ENTERO){
                var valreal =c3d.getTMP();
                c3d.addCodigo(valreal +"= "+cad1.valor+"; #obtenemos valor real de entero\n");
                c3d.addCodigo("Heap["+tmp1+"] = "+cad1.valor+"; #se concatena valor a esta cadena\n");
            }else{
                c3d.addCodigo("Heap["+tmp1+"] = "+cad1.valor+"; #se concatena un valor a esta cadena\n");
            }*/            
            
            c3d.addCodigo(tmp1+" = "+tmp1+" + 1; #Se suma uno en el heap para setearle un espacio\n");
            c3d.addCodigo("Heap["+tmp1+"] = 32; #Espacio intermedio de cadenas\n");
        }

        if(cad2.tipo == c.constantes.T_CADENA){
            c3d.addCodigo(etq4+":\n");
            c3d.addCodigo(tmp4+" = Heap["+cad2.valor+"]; #Caracter de la segunda cadena\n");
            c3d.addCodigo("Heap["+tmp1+"] = "+tmp4+"; #Setearlo en el espacio siguiente del heap\n");
            c3d.addCodigo(tmp1+" = "+tmp1+" + 1; #Subir en el heap\n");
            c3d.addCodigo("if ("+tmp4+" == -1) goto "+etq3+"; #Verifica si la 2da. cadena ya ha terminado\n");
            c3d.addCodigo(cad2.valor+" = "+cad2.valor+" + 1; #Escalar en la cadena 2\n");
            c3d.addCodigo("goto "+etq4+";\n");
            c3d.addCodigo(etq3+":\n");
        }else{ //es entero, caracer, booleano o decimal
            c3d.addCodigo(tmp1+" = "+tmp1+" + 1; #Se suma uno en el heap agregar el nuevo valor a la cadena\n");
            c3d.addCodigo("Heap["+tmp1+"] = "+cad2.valor+"; #Se concatena un valor a esta cadena\n");
            c3d.addCodigo(tmp1+" = "+tmp1+" + 1;\n");//Esto no iba
        }
        
        c3d.addCodigo("Heap["+tmp1+"] = -1; #Fin de cadena\n");
        c3d.addCodigo("H = H + "+ tmp1+"; #Sumarle al heap toda esta cantidad\n");
        
        var_obje.valor = tmp2; //referencia del inicio de la cadena
    }
    var_obje.tipo = c.constantes.T_CADENA;
    return var_obje;
}
