var c = require("../Arbol/constants");
var c3d = require("../Codigo3D/generarCodigoC3D");
var exp = require("../Expresiones/expresion");
var TS = require("../Arbol/TS");
var json_objeto ;


exports.logicas = function logicas(tipo, izq, der, TS_local){
json_objeto = new Object();
    if(izq != undefined && der != undefined){
            //json_objeto = new Object();
            switch(tipo){
                    
                case c.constantes.T_AND:
                    var tipo_izq = exp.expresion(izq,TS_local);
                    var tipo_der = exp.expresion(der,TS_local);
                    
                    if(tipo_izq != undefined && tipo_der != undefined){
                        if(tipo_izq.tipo == c.constantes.T_BOOLEANO && tipo_der.tipo == c.constantes.T_BOOLEANO){       
                            if(TS.ban_analisis == false){ //no debe venir análisis
                                var tmp = retornarResultanteAND(tipo_izq, tipo_der); //retorna el temporal del booleano resultante
                                json_objeto.valor = tmp;
                            }                   
                            json_objeto.tipo = c.constantes.T_BOOLEANO;
                            return json_objeto;
                        }else{
                            //error no vinieron valores booleanos
                            json_objeto.tipo = "Semantico";
                            json_objeto.linea = izq.linea;
                            json_objeto.columna = izq.columna;
                            json_objeto.descripcion = "Error en los tipos de una expresión lógica en AND no vinieron valores booleanos.";
                            TS.TS_Errores.push(json_objeto);  
                        }
                    }
                    break;
                    
                    
                
                case c.constantes.T_OR:
                    var tipo_izq = exp.expresion(izq,TS_local);
                        if(tipo_izq == undefined || (tipo_izq.tipo !=c.constantes.T_BOOLEANO && TS.ban_analisis == false)){
                            var etqv = c3d.getETQ();
                            c3d.addCodigo("goto "+etqv+";\n");
                            c3d.addCodigo(c3d.pilaETQF.pop()+": #etiqueta se saca inmediatamente del OR izquierdo\n");
                            c3d.pilaETQV.push(etqv);
                        }
                    
                    var tipo_der = exp.expresion(der,TS_local);
                        if(tipo_der == undefined || (tipo_der.tipo !=c.constantes.T_BOOLEANO && TS.ban_analisis == false)){
                        var etqv = c3d.pilaETQV.pop();
                        c3d.addCodigo("goto "+etqv+";\n");
                        c3d.pilaETQV.push(etqv);
                    }
                                 
                    if(tipo_izq != undefined && tipo_der != undefined){
                        if(tipo_izq.tipo == c.constantes.T_BOOLEANO && tipo_der.tipo == c.constantes.T_BOOLEANO){
                            if(TS.ban_analisis == false){
                                var tmp = retornarResultanteOR(tipo_izq, tipo_der); //retorna el temporal del booleano resultante
                                json_objeto.valor = tmp;
                            }
                            json_objeto.tipo = c.constantes.T_BOOLEANO;
                            return json_objeto;
                            
                        }else{
                            //error
                            json_objeto.tipo = "Semantico";
                            json_objeto.linea = izq.linea;
                            json_objeto.columna = izq.columna;
                            json_objeto.descripcion = "Error en los tipos de una expresión lógica en OR no vinieron valores booleanos";
                            TS.TS_Errores.push(json_objeto);  
                        }                     
                    }
                    break;
                    
                    
                    
                    
                case c.constantes.T_XOR:
                    var tipo_izq = exp.expresion(izq,TS_local);
                    
                    var codigo, etqf, etqv,etqv_tmp, tmp, salida;

                    if(tipo_izq == undefined || (tipo_izq.tipo !=c.constantes.T_BOOLEANO && TS.ban_analisis == false)){
                        etqv = c3d.getETQ();
                        codigo = "goto "+etqv+";\n";
                        c3d.addCodigo(codigo);
                        c3d.pilaETQV.push(etqv);
                        c3d.addCodigo(c3d.pilaETQF.pop()+":\n");
                        
                    }else if(tipo_izq != undefined && (tipo_izq.tipo ==c.constantes.T_BOOLEANO && TS.ban_analisis == false)){
                        etqf = c3d.getETQ();
                        etqv = c3d.getETQ();
                        codigo = "if ("+tipo_izq.valor+" <> 1) goto "+etqf+";\n";
                        codigo += "goto "+etqv+";\n";
                        codigo += etqf+":\n";
                        c3d.pilaETQV.push(etqv);
                    }
                    
                    
                    var tipo_der = exp.expresion(der,TS_local);
                    
                    if(tipo_der == undefined || (tipo_der.tipo !=c.constantes.T_BOOLEANO && TS.ban_analisis == false)){
                        etqv_tmp = c3d.pilaETQV.pop();
                        etqv = c3d.getETQ();
                        codigo = "goto "+etqv+";\n";
                        c3d.addCodigo(codigo);
                        c3d.pilaETQV.push(etqv);
                        c3d.addCodigo(etqv_tmp+":\n");
                        
                    }else if(tipo_der != undefined && (tipo_der.tipo ==c.constantes.T_BOOLEANO && TS.ban_analisis == false)){
                        etqf = c3d.getETQ();
                        etqv = c3d.getETQ();
                        codigo += "if ("+tipo_der.valor+" <> 1) goto "+etqf+";#comparacioniz\n";
                        codigo += "goto "+etqv+";\n";
                        codigo += c3d.pilaETQV.pop()+":\n";
                        c3d.pilaETQF.push(etqf);
                        c3d.pilaETQV.push(etqv);
                    }
                    
                    
                    var tipo_der = exp.expresion(der,TS_local);
                    if(tipo_der == undefined || (tipo_der.tipo !=c.constantes.T_BOOLEANO && TS.ban_analisis == false)){
                        etqv = c3d.getETQ(); //etiqueta verdadera
                        c3d.addCodigo("goto "+etqv+";\n");
                        c3d.pilaETQV.push(c3d.pilaETQV.pop()+","+c3d.pilaETQF.pop());
                        c3d.pilaETQF.push(etqv+","+c3d.pilaETQF.pop());
                        
                    }else if(tipo_der != undefined && tipo_der.tipo ==c.constantes.T_BOOLEANO && TS.ban_analisis == false){
                        etqv = c3d.getETQ();
                        etqf = c3d.getETQ();
                        tmp = c3d.getTMP();
                        salida = c3d.getETQ();
                        
                        codigo += "if ("+tipo_der.valor+"<> 1) goto "+etqv+";#comparacionder\n";
                        codigo += "goto "+etqf+";\n";
                        
                        codigo += etqv+":\n"+c3d.pilaETQV.pop()+":\n";//codigo += etqv+","+c3d.pilaETQV.pop()+":\n";
                        
                        codigo += tmp+" = 1;\n";
                        codigo += "goto "+salida+";\n";
                        
                        codigo += etqf+":\n"+c3d.pilaETQF.pop()+":\n";//codigo += etqf+","+c3d.pilaETQF.pop()+":\n";
                        
                        codigo += tmp+" = 0;\n";
                        
                        c3d.addCodigo(codigo);
                        json_objeto.tipo = tipo_der.tipo;
                        json_objeto.valor = tmp;
                        return json_objeto;
                        
                    }else if(tipo_der != undefined && tipo_der.tipo ==c.constantes.T_BOOLEANO && TS.ban_analisis == true){
                        json_objeto.tipo = tipo_der.tipo;
                        return json_objeto;
                    }
                    break;
                    
            }//fin SWITCH
    
    
    }else if(izq !=undefined){ //not
        if(tipo == c.constantes.T_NOT){
            var tipo_izq = exp.expresion(izq,TS_local);
            if(tipo_izq != undefined && tipo_izq.tipo == c.constantes.T_BOOLEANO &&  TS.ban_analisis == false){
                var tmp = c3d.getTMP();
                var salida = c3d.getETQ();
                var etqf = c3d.getETQ();
                
                var codigo = "if ( "+tipo_izq.valor +" <> 1) goto "+etqf+";\n";
                codigo += tmp+" = 0;\n";
                codigo += "goto "+salida+";\n";
                codigo += etqf+":\n";
                codigo += tmp+" = 1;\n";
                codigo += salida+":\n";
                
                c3d.addCodigo(codigo);
                json_objeto.tipo = tipo_izq.tipo;
                json_objeto.valor = tmp;
                return json_objeto;
                
            }else if(TS.ban_analisis == false){
                var etq_v = c3d.pilaETQV.pop();
                var etq_f = c3d.pilaETQF.pop();
                c3d.pilaETQV.push(etq_f);
                if(etq_v != undefined){
                    c3d.pilaETQF.push(etq_v);
                }
                
            }else if(tipo_izq != undefined && tipo_izq.tipo == c.constantes.T_BOOLEANO &&  TS.ban_analisis == true){
                json_objeto.tipo = tipo_izq.tipo;
                return json_objeto;
            }
        }//Fin if si es NOT
    }//Fin else si es NOT

}


//FUNCION QUE REALIZA LOGICA DE AND
function retornarResultanteAND(tipo_izq, tipo_der){
    c3d.addCodigo("#Comienza el codigo de AND\n");
    var etqf = c3d.getETQ();
    var tmp = c3d.getTMP();
    var salida = c3d.getETQ();
    
    var codigo = "if ("+tipo_izq.valor +" <> "+tipo_der.valor+") goto "+etqf+";\n";
    codigo += tmp+" = 1;\n";
    codigo += "goto "+salida+";\n";
    codigo += etqf+":\n";
    codigo += tmp+" = 0;\n";
    codigo += salida+":\n";
    
    c3d.addCodigo(codigo);
    return tmp;
}



//FUNCION QUE REALIZA LOGICA DE OR
function retornarResultanteOR(tipo_izq, tipo_der){
    c3d.addCodigo("#Comienza el codigo de OR\n");
    var etqf = c3d.getETQ();
    var etqf2 = c3d.getETQ();
    var tmp = c3d.getTMP();
    var salida = c3d.getETQ();
    var codigo = "if ("+tipo_izq.valor +" <> 1) goto "+etqf+";\n";
    codigo += tmp+" = 1;\n";
    codigo += "goto "+salida+";\n";
    codigo += etqf+":\n";
    codigo += "if ("+tipo_der.valor+" <> 1) goto "+etqf2+";\n";
    codigo += tmp+" = 1;\n";
    codigo += "goto "+salida+";\n";
    codigo += etqf2+":\n";
    codigo += tmp+" = 0;\n";
    codigo += salida+":\n";
    
    c3d.addCodigo(codigo);
    return tmp;
}


