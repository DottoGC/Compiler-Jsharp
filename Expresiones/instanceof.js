var TS = require("../Arbol/TS");
var c3d = require("../Codigo3D/generarCodigoC3D");
var c = require("../Arbol/constants");

var json_objeto;

//TODO función que realiza la lógica de un instanceof
exports.tratamiento_instanceof = function tratamiento_instanceof(obj1, obj2, TS_local){

    if(TS.existe_clase(obj1, false) != false){
        if(TS.existe_clase(obj2, false) != false){
            var variable = TS.getVariable(obj1, TS_local); //esta es una representación de una clase
            if(variable != false){
                var tmp1 = c3d.getTMP();
                if(variable.padre == obj2){ //compara si la clase existe
                    c3d.addCodigo(tmp1+" = 1; //es verdadero si existe esta clase para el INSTACEOF\n");
                }else{
                    c3d.addCodigo(tmp1+" = 0; //es falso no existe para esta clase INSTACEOF\n");
                }
                json_objeto = new Object();
                json_objeto.tipo = c.constantes.T_BOOLEANO;
                json_objeto.valor = tmp1;
                return json_objeto;
            }else{
                //esta variable no se ha instanciado no se puede comparar con INSTANCEOF
                json_objeto = new Object();
                json_objeto.tipo = "semantico";
                json_objeto.linea = obj1.linea;
                json_objeto.columna = obj1.columna;
                json_objeto.descripcion = "Error esta variable no se ha instanciado no se puede comparar con INSTANCEOF";
                TS.TS_Errores.push(json_objeto);
            }
        }else{
            //error esta clase no existe
            json_objeto = new Object();
            json_objeto.tipo = "semantico";
            json_objeto.linea = obj2.linea;
            json_objeto.columna = obj2.columna;
            json_objeto.descripcion = "Error esta clase no existe "+obj2;
            TS.TS_Errores.push(json_objeto);
        }
    }else{
        //error esta clase no existe
        json_objeto = new Object();
        json_objeto.tipo = "semantico";
        json_objeto.linea = obj1.linea;
        json_objeto.columna = obj1.columna;
        json_objeto.descripcion = "Error esta clase no existe "+obj1;
        TS.TS_Errores.push(json_objeto);
    }
    
}

