var c = require("../Arbol/constants");
var c3d = require("../Codigo3D/generarCodigoC3D");
var exp = require("../Expresiones/expresion");
var json_objeto;
var TS = require("../Arbol/TS");


exports.tipo_assig = tipo_assig = false; //llevará el control si viene en una asignación



//FUNCIÓN PRINCIPAL QUE REALIZA LOGICA DE RELACIONALES
exports.relacionales = function relacionales(tipo, izq, der, TS_local){

    if(izq != undefined && der != undefined){
        var tipo_izq = exp.expresion(izq,TS_local);
        var tipo_der = exp.expresion(der,TS_local);
        if(tipo_izq != undefined && tipo_der != undefined){
            json_objeto = new Object();
            switch(tipo){
                case c.constantes.T_IGUALIGUAL:
                case c.constantes.T_DIF:                    
                    var resultante = c.comprobacion_tipos(tipo_izq.tipo, tipo_der.tipo, MT_RELACIONAL2);
                    
                    if(resultante != c.constantes.T_ERROR && resultante == c.constantes.T_BOOLEANO){
                        var tmp = c3d.getTMP(); 
                        
                        if(tipo_izq.tipo == c.constantes.T_ID && tipo_der.tipo == c.constantes.T_NULL && TS.ban_analisis == false){
                            var tmp_ref = c3d.getTMP();
                            c3d.addCodigo(tmp_ref+" = Heap["+tipo_izq.valor+"]; #se obtiene el valor porque se está retornando una referencia\n");
                            tipo_izq.valor = tmp_ref;
                        }
                        
                        //verificar si lo que se va a comparar es ID o es un valor
                        //verificar si es ID y parametro
                        //si la posición es indefinida es porque viene una llamada con su retorno
                        if(tipo_izq.tipo == c.constantes.T_ID && tipo_izq.pos != undefined && TS.ban_analisis == false &&
                            tipo_der.tipo != c.constantes.T_NULL){
                            obtener_valor(tipo_izq, tipo_izq.referencia);
                        }
                        
                        if(tipo_der.tipo == c.constantes.T_ID && tipo_izq.pos != undefined && TS.ban_analisis == false){
                            obtener_valor(tipo_der, tipo_der.referencia);
                        }
                        
                        
                        
                        
                        if(tipo == c.constantes.T_IGUALIGUAL){
                            //verificar si trae comparación de cadenas
                            if(tipo_izq.tipo == c.constantes.T_CADENA || tipo_der.tipo == c.constantes.T_CADENA){
                                comparacion_cadenas(tipo_izq, tipo_der, tipo,tmp);
                                
                            }else if(exports.tipo_assig == true && TS.ban_analisis == false){
                                //var tmp1 = c3d.getTMP();                                
                                //var etqV = c3d.getETQ();
                                var etqF = c3d.getETQ();
                                var etqS = c3d.getETQ();
                                
                                c3d.addCodigo("if ("+ tipo_izq.valor + " <> " + tipo_der.valor+") goto "+ etqF + ";\n");
                                c3d.addCodigo(tmp +" = 1;\n");
                                c3d.addCodigo("goto "+etqS+ ";\n");
                                c3d.addCodigo(etqF+":\n");
                                c3d.addCodigo(tmp +" = 0;\n");
                                c3d.addCodigo(etqS+":\n");                                
                                //c3d.addCodigo(tmp +"="+ tipo_izq.valor + " == " + tipo_der.valor+";\n");
                                
                            }else if(TS.ban_analisis == false){
                                c3d.generarCodigoRel(tipo_izq.valor, tipo_der.valor," == ");
                                
                            }
                            
                            
                            
                        }else if(tipo == c.constantes.T_DIF && TS.ban_analisis == false){
                             //verificar si trae comparación de cadenas
                            if(tipo_izq.tipo == c.constantes.T_CADENA || tipo_der.tipo == c.constantes.T_CADENA){
                                comparacion_cadenas(tipo_izq, tipo_der, tipo,tmp);
                                
                            }else if(exports.tipo_assig == true){
                                //var tmp1 = c3d.getTMP();                                
                                //var etqV = c3d.getETQ();
                                var etqF = c3d.getETQ();
                                var etqS = c3d.getETQ();
                                
                                c3d.addCodigo("if ("+ tipo_izq.valor + " == " + tipo_der.valor+") goto "+ etqF + ";\n");
                                c3d.addCodigo(tmp +" = 1;\n");
                                c3d.addCodigo("goto "+etqS+ ";\n");
                                c3d.addCodigo(etqF+":\n");
                                c3d.addCodigo(tmp +" = 0;\n");
                                c3d.addCodigo(etqS+":\n");                                
                                //c3d.addCodigo(tmp +"="+ tipo_izq.valor + " != " + tipo_der.valor+";\n");
                                
                            }else if(TS.ban_analisis == false){
                                c3d.generarCodigoRel(tipo_izq.valor, tipo_der.valor," != ");
                                
                            }
                        }                        
                        
                        
                        
                        if(exports.tipo_assig == true || TS.ban_for == true || TS.ban_analisis == true){
                            json_objeto.tipo = resultante; //para acertar que es tipo booleano lo que está retornando
                            json_objeto.valor = tmp;
                            return json_objeto;
                        }
                        
                    }else{
                        json_objeto.tipo = "Semantico";
                        json_objeto.linea = izq.linea;
                        json_objeto.columna = izq.columna;
                        json_objeto.descripcion = "Error en los tipos de una expresión relacional (== , !=)";
                        TS.TS_Errores.push(json_objeto);                       
                    }
                    break;
                    
                    
                    
                    
                    
                    
                    
                case c.constantes.T_MAYORIQ:
                case c.constantes.T_MENORIQ:
                case c.constantes.T_MAYORQ:
                case c.constantes.T_MENORQ:
                    var resultante = c.comprobacion_tipos(tipo_izq.tipo, tipo_der.tipo, MT_RELACIONAL1);
                    if(resultante != c.constantes.T_ERROR && resultante == c.constantes.T_BOOLEANO){
                            var tmp = c3d.getTMP();
                        
                            //verificar si lo que se va a comparar es ID o es un valor
                            if(tipo_izq.tipo == c.constantes.T_ID && tipo_izq.pos != undefined && TS.ban_analisis == false){
                                obtener_valor(tipo_izq, tipo_izq.referencia);
                            }
                        
                            if(tipo_der.tipo == c.constantes.T_ID && tipo_izq.pos != undefined && TS.ban_analisis == false){
                                obtener_valor(tipo_der, tipo_der.referencia);
                            }  
                        
                            if(tipo == c.constantes.T_MAYORIQ){
                                if(exports.tipo_assig == true && TS.ban_analisis == false){                                    
                                    //var tmp1 = c3d.getTMP();                                
                                    //var etqV = c3d.getETQ();
                                    var etqV = c3d.getETQ();
                                    var etqS = c3d.getETQ();

                                    c3d.addCodigo("if ("+ tipo_izq.valor + " >= " + tipo_der.valor+") goto "+ etqV + ";\n");
                                    c3d.addCodigo(tmp +" = 0;\n");
                                    c3d.addCodigo("goto "+etqS+ ";\n");
                                    c3d.addCodigo(etqV+":\n");
                                    c3d.addCodigo(tmp +" = 1;\n");
                                    c3d.addCodigo(etqS+":\n");                                     
                                    //c3d.addCodigo(tmp +"="+ tipo_izq.valor + " >= " + tipo_der.valor+";\n");
                                    
                                }else if(TS.ban_analisis == false){
                                    c3d.generarCodigoRel(tipo_izq.valor, tipo_der.valor," >= ");
                                }
                                
                            }else if(tipo == c.constantes.T_MENORIQ){
                                if(exports.tipo_assig == true && TS.ban_analisis == false){
                                    var etqV = c3d.getETQ();
                                    var etqS = c3d.getETQ();

                                    c3d.addCodigo("if ("+ tipo_izq.valor + " <= " + tipo_der.valor+") goto "+ etqV + ";\n");
                                    c3d.addCodigo(tmp +" = 0;\n");
                                    c3d.addCodigo("goto "+etqS+ ";\n");
                                    c3d.addCodigo(etqV+":\n");
                                    c3d.addCodigo(tmp +" = 1;\n");
                                    c3d.addCodigo(etqS+":\n");
                                    //c3d.addCodigo(tmp +"="+ tipo_izq.valor + " <= " + tipo_der.valor+";\n");
                                    
                                }else if(TS.ban_analisis == false){
                                    c3d.generarCodigoRel(tipo_izq.valor, tipo_der.valor," <= ");
                                    
                                }
                                
                            }else if(tipo == c.constantes.T_MENORQ){
                                if(exports.tipo_assig == true && TS.ban_analisis == false){
                                    var etqV = c3d.getETQ();
                                    var etqS = c3d.getETQ();

                                    c3d.addCodigo("if ("+ tipo_izq.valor + " < " + tipo_der.valor+") goto "+ etqV + ";\n");
                                    c3d.addCodigo(tmp +" = 0;\n");
                                    c3d.addCodigo("goto "+etqS+ ";\n");
                                    c3d.addCodigo(etqV+":\n");
                                    c3d.addCodigo(tmp +" = 1;\n");
                                    c3d.addCodigo(etqS+":\n");
                                    //c3d.addCodigo(tmp +"="+ tipo_izq.valor + " < " + tipo_der.valor+";\n");
                                    
                                }else if(TS.ban_analisis == false){
                                    c3d.generarCodigoRel(tipo_izq.valor, tipo_der.valor," < ");
                                    
                                }
                                
                            }else if(tipo == c.constantes.T_MAYORQ){
                                if(exports.tipo_assig == true && TS.ban_analisis == false){
                                    var etqV = c3d.getETQ();
                                    var etqS = c3d.getETQ();

                                    c3d.addCodigo("if ("+ tipo_izq.valor + " > " + tipo_der.valor+") goto "+ etqV + ";\n");
                                    c3d.addCodigo(tmp +" = 0;\n");
                                    c3d.addCodigo("goto "+etqS+ ";\n");
                                    c3d.addCodigo(etqV+":\n");
                                    c3d.addCodigo(tmp +" = 1;\n");
                                    c3d.addCodigo(etqS+":\n");
                                    //c3d.addCodigo(tmp +"="+ tipo_izq.valor + " > " + tipo_der.valor+";\n");
                                    
                                }else if(TS.ban_analisis == false){
                                    c3d.generarCodigoRel(tipo_izq.valor, tipo_der.valor," > ");
                                    
                                }                                
                            }
                        
                        
                            if(exports.tipo_assig == true  || TS.ban_for == true || TS.ban_analisis == true){
                                json_objeto.tipo = resultante; //para acertar que es tipo booleano lo que está retornando
                                json_objeto.valor = tmp;
                                return json_objeto;
                            }
                        
                }else{
                    json_objeto.tipo = "Semantico";
                    json_objeto.linea = izq.linea;
                    json_objeto.columna = izq.columna;
                    json_objeto.descripcion = "Error en los tipos de una expresión relacional (>=,<=,<,>)";
                    TS.TS_Errores.push(json_objeto);
                }
                break;
                    
            }//Fin Switch que verifica tipo de relacional
        }
    }
}




//FUNCIÓN QUE HACE EL ANÁLISIS DE COMPARACIÓN DE CADENAS
function comparacion_cadenas(cad1, cad2, tipo,tmp){
    //existe 4 combinaciones
    // 1- cadena - cadena
    // 2. cadena - var
    // 3. var - cadena
    
    // 4. var - var
    
    
    if( cad1.primitivo == undefined && cad2.primitivo || cad1.primitivo && cad2.primitivo == undefined || cad1.primitivo  && cad2.primitivo){
        var tmp1 = c3d.getTMP();
        var tmp2 = c3d.getTMP();
        var tmp3 = c3d.getTMP();
        var tmp4 = c3d.getTMP();

        var etq1 = c3d.getETQ();
        var etq2 = c3d.getETQ();
        var etq3 = c3d.getETQ();
        var etq4 = c3d.getETQ();
        var etq5 = c3d.getETQ();

        c3d.addCodigo(tmp2+" = 0;\n");
        c3d.addCodigo(etq2+":\n");
        
        c3d.addCodigo(tmp1+" = Heap["+cad1.valor+"]; #obtener el primer caracter de la cadena\n");
        c3d.addCodigo("if ("+tmp1+" == -1) goto "+etq1+";#verifica si está en el fin de cadena\n");
        c3d.addCodigo(tmp2+" = "+tmp2+" + 1; #contador que se hace hasta llegar al -1 de la cadena\n");
        c3d.addCodigo(cad1.valor+" = "+cad1.valor+" + 1; #puntero del heap\n");  
        c3d.addCodigo("goto "+etq2+";\n");
        c3d.addCodigo(etq1+":\n");
        c3d.addCodigo("#iterar la 2da cadena primitiva\n");
        c3d.addCodigo(tmp4+" = 0;\n");
        c3d.addCodigo(etq4+":\n");
        c3d.addCodigo(tmp3+" = Heap["+cad2.valor+"]; #obtener primer caracter de la 2da.cadena\n");
        c3d.addCodigo("if ("+tmp3+" == -1) goto "+etq3+"; #verifica fin de cadena\n");
        c3d.addCodigo(tmp4+" = "+tmp4+" + 1; #contador hasta llegar al -1\n");
        c3d.addCodigo(cad2.valor+" = "+cad2.valor+" + 1;#puntero al heap\n");
        c3d.addCodigo("goto "+etq4+";\n");
        c3d.addCodigo(etq3+":\n");
        c3d.addCodigo("#comparar tamaños de cadena\n");
        
        if(tipo == c.constantes.T_IGUALIGUAL){
            c3d.addCodigo("if ( "+tmp2+" <> "+tmp4+") goto "+etq5+"; #salida si no se cumple\n");
        }else if(tipo == c.constantes.T_DIF){
            c3d.addCodigo("if ( "+tmp2+"  "+tmp4+") goto "+etq5+"; #salida si no se cumple\n");
        }
        
        c3d.pilaETQF.push(etq5);

        
        
        
    }else if(cad1.primitivo == undefined && cad2.primitivo == undefined){ //4to. caso xq son identificadores

        var tmp1 = c3d.getTMP();
        var tmp2 = c3d.getTMP();
        //var tmp3 = c3d.getTMP();        
        //var tmp4 = c3d.getTMP();
        //var tmp5 = c3d.getTMP();
        var etq1 = c3d.getETQ();
        var etq2 = c3d.getETQ();
        var etq3 = c3d.getETQ();

        c3d.addCodigo(etq1+":\n");
        c3d.addCodigo(tmp1+" = Heap["+cad1.valor+"]; #obtener el primer caracter de la 1er. cadena\n");
        c3d.addCodigo(tmp2+" = Heap["+cad2.valor+"]; #obtener el segundo caracter de la 2da. cadena\n");
        
        if(tipo == c.constantes.T_IGUALIGUAL){
            c3d.addCodigo("if ("+tmp2+" <> "+tmp1+") goto "+etq2+"; #se comparan los caracteres\n");
            
            var etqaOr = c3d.getETQ();
            c3d.addCodigo("if ("+tmp1+"==-1) goto "+etq3+";\n");
            c3d.addCodigo("goto "+etqaOr+";\n");
            c3d.addCodigo(etqaOr+":\n");
            c3d.addCodigo("if ("+tmp2+"==-1) goto "+etq3+";\n");

            c3d.addCodigo(tmp+" = 1; #Comparacion entre caracteres va siendo verdadero\n");
            c3d.addCodigo(cad1.valor+" = "+cad1.valor+" + 1; #Se sube en el heap de la 1er. cadena\n");
            c3d.addCodigo(cad2.valor+" = "+cad2.valor+" + 1; #Se sube en el heap de la 2da. cadena\n");
            c3d.addCodigo("goto "+etq1+";\n");

            c3d.addCodigo(etq2+":\n");
            c3d.addCodigo(tmp+" = 0; #Comparacion entre caracteres se vuelvio falso\n");
            c3d.addCodigo(etq3+":\n");
            
        }else if(tipo == c.constantes.T_DIF){
            var etqaOr = c3d.getETQ();
            c3d.addCodigo("if ("+tmp1+"==-1) goto "+etq3+";\n");
            c3d.addCodigo("goto "+etqaOr+";\n");
            c3d.addCodigo(etqaOr+":\n");
            c3d.addCodigo("if ("+tmp2+"==-1) goto "+etq3+";\n");
            
            
            c3d.addCodigo("if ("+tmp2+" == "+tmp1+") goto "+etq2+"; #Se comparan los caracteres\n");
            var etqaOr2 = c3d.getETQ();
            c3d.addCodigo("if ("+tmp1+"==-1) goto "+etq3+";\n");
            c3d.addCodigo("goto "+etqaOr2+";\n");
            c3d.addCodigo(etqaOr2+":\n");
            c3d.addCodigo("if ("+tmp2+"==-1) goto "+etq3+";\n");   


            c3d.addCodigo(tmp+" = 1; #Comparacion entre caracteres va siendo vdd\n");
            c3d.addCodigo(cad1.valor+" = "+cad1.valor+" + 1; #Se sube en el heap de la 1er. cadena\n");
            c3d.addCodigo(cad2.valor+" = "+cad2.valor+" + 1; #Se sube en el heap de la 2da. cadena\n");
            c3d.addCodigo("goto "+etq1+";\n");

            c3d.addCodigo(etq2+":\n");
            c3d.addCodigo(tmp+" = 0; #Comparacion entre caracteres se vuelvio falso\n");
            c3d.addCodigo(etq3+":\n");
        }
        

        
        //c3d.pilaETQF.push(etq2);
    }    
    
    
} 



//FUNCIÓN QUE OBTIENE EL VALOR DEL HEAP SI VIENE COMO REFERENCIA Y VERIFICA VALORES
function obtener_valor(tipo, esref){
    var tmp_pos = c3d.getTMP();
    var tmp_heap = c3d.getTMP();
    
    if(esref == undefined || !esref){
        c3d.addCodigo(tmp_pos+" = "+tipo.valor+" + "+tipo.pos+"; #Se escala a la variable en el heap\n");
        c3d.addCodigo(tmp_heap+" = Heap["+tmp_pos+"]; #Obtener el valor de la variable en el heap en relacionales\n");
    }else{
        c3d.addCodigo(tmp_heap+" = Heap["+tipo.valor+"]; #Obtener el valor de la variable en el heap en relacionales\n");
    }
    
    tipo.valor = tmp_heap; //se pasa el valor
}



