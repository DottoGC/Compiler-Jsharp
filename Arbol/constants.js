
exports.constantes ={
    
    T_ERROR : -1,  //Esta constante lo utilizamos en la validacion de tipos 
    
    T_BOOLEANO : 0,//Lo usaamos en EXP
    T_ENTERO : 1,//Lo usaamos en EXP
    T_DECIMAL : 2,//Lo usaamos en EXP
    T_CADENA : 3,//Lo usaamos en EXP
    T_CARACTER : 4, //Lo usaamos en EXP   
    T_NULL : 5,//Lo usaamos en EXP
    T_ID : 6,//Lo usaamos en local>Incremento, local>Decremento, OPT_ACCESOS,EXP

    
    T_SUMA : 7,//Lo usaamos en EXP
    T_RESTA : 8,//Lo usaamos en EXP
    T_MULT : 9,//Lo usaamos en EXP
    T_DIV : 10,//Lo usaamos en EXP
    T_MOD : 11,//Lo usaamos en EXP
    //T_INCCI : 12,
    //T_DECCI : 13,
    T_INCCD : 14,//Lo usaamos en local, EXP
    T_DECCD : 15,//Lo usaamos en local, EXP
    T_POW : 16,//Lo usaamos en EXP
    T_UNARIO : 17,//Lo usaamos en EXP

    
    T_IGUALIGUAL : 18,//Lo usaamos en REL
    T_MAYORQ : 19,//Lo usaamos en REL
    T_MENORQ : 20,//Lo usaamos en REL
    T_MAYORIQ : 21,//Lo usaamos en REL
    T_MENORIQ : 22,//Lo usaamos en REL
    T_DIF : 23,//Lo usaamos en REL

    
    //T_TERNARIO : 24,
    T_AND : 25,//Lo usamos en COND
    T_OR : 26,//Lo usamos en COND
    T_NOT : 27,//Lo usamos en COND
    T_XOR : 28,//Lo usamos en COND
    T_INSTANCEOF : 29,//Lo usamos en COND

    
    T_DECLARACION : 30,//Lo usaamos en local,for_init
    T_ASIGNACION : 31,//Lo usaamos en local,for_init    
    T_INSTANCIA : 32,//Lo usamos en inicializador_array
    //T_LINKEDLIST : 33,
    T_ARRAYS : 34,//Lo usamos en inicializador_array, opt_instancia, LLAMADA

    
    T_IF : 35,//Lo usaamos en sentencia_IF
    T_IFELSE : 36,//Lo usaamos en if_list
    T_ELSE : 37,//Lo usaamos en if_list
    T_SWITCH : 38,//Lo usaamos en sentencia_SWITCH
    T_WHILE : 39,//Lo usaamos en sentencia_WHILE
    T_DOWHILE : 40,//Lo usaamos en sentencia_DOWHILE
    T_FOR : 41,//Lo usaamos en sentencia_FOR
    //T_DEFAULT : 42,

    
    //T_PRINT : 43,
    //T_GOTO : 44,
    
    //T_IFFALSE : 45,
    //T_C :46,
    //T_E : 47,
    //T_D : 48,
    //T_CALL : 49,
    //T_ETQ : 50,
    //T_STACK : 51,
    //T_HEAP : 52,
    //T_TMP: 53,
    
    T_BREAK : 54,//Lo usaamos en local>Break
    T_CONTINUE: 55,//Lo usaamos en local>Continue
    T_RETURN : 56,//Lo usaamos en local>Return
    
    
    T_GLOBAL : 57,//Lo usamos al ir agregando simbolos a la tabla de simbolos

    
    T_PRINT : 58,//Lo usaamos en local>Print
    //T_PRINTLN : 59,
    T_OBJETO : 60,//Lo usamos en opt_instancia

    T_ACCESOARRAYS : 61,//Lo usamos en assig
    T_ACCESOOBJETO : 62,//Lo usaamos en local,assig

    //T_VOID : 63,
    T_LLAMADA : 64,//Lo usaamos en local, LLAMADA
    //T_EXTENDS: 65,
    //T_ADD : 66,
    //T_CLEAR : 67,
    //T_GET : 68,
    //T_REMOVE : 69,
    //T_SET : 70,
    T_SIZE : 71,//Lo usamos en OPT_ACCESOS
    //T_EQUALS : 72,
    //T_GETCLASS : 73,
    T_TOSTRING : 74,//Lo usamos en OPT_ACCESOS
    T_LENGTH : 75,//Lo usamos en OPT_ACCESOS (atributo de Array)
    T_TOCHARARRAY : 76,//Lo usamos en OPT_ACCESOS
    T_STRINGLENGTH : 77,//Lo usamos en OPT_ACCESOS (metodo de String)
    T_TOUPPERCASE : 78,//Lo usamos en OPT_ACCESOS
    T_TOLOWERCASE : 79,//Lo usamos en OPT_ACCESOS

    //T_PUBLIC : 80,
    //T_PRIVATE : 81,
    //T_PROTECTED : 82,
    //T_STATIC : 83,
    //T_FINAL : 84,
    //T_ABSTRACT : 85,
    //T_CLASS : 86,
    //T_OVERRIDE :87,
    
    //T_STRC : 88,
    //T_TODOUBLE : 89,
    //T_TOINT : 90,
    //T_TOCHAR : 91,
    //T_EXPLICITO : 92,
    
    //T_THIS : 93,
    //T_THISCONSTRUCTOR : 94,
    //T_SUPER : 95,
    //T_READFILE : 96,
    T_ARREGLO : 97 //Lo usamos en tipo_declaracion
};



MT_SUMA = [
    //booleano                      //entero                        //decimal                   //cadena                    //caracter                      
    [exports.constantes.T_BOOLEANO , exports.constantes.T_ENTERO,  exports.constantes.T_ERROR,  exports.constantes.T_CADENA, exports.constantes.T_ERROR],  //booleano
    [exports.constantes.T_ENTERO   , exports.constantes.T_ENTERO,  exports.constantes.T_DECIMAL, exports.constantes.T_CADENA, exports.constantes.T_ENTERO],  //entero
    [exports.constantes.T_DECIMAL  , exports.constantes.T_DECIMAL, exports.constantes.T_DECIMAL, exports.constantes.T_CADENA, exports.constantes.T_ERROR],  //decimal
    [exports.constantes.T_CADENA   , exports.constantes.T_CADENA , exports.constantes.T_CADENA  , exports.constantes.T_CADENA ,exports.constantes.T_CADENA],  //cadena
    [exports.constantes.T_ERROR    , exports.constantes.T_ENTERO,  exports.constantes.T_DECIMAL, exports.constantes.T_CADENA, exports.constantes.T_ENTERO]   //caracter
];

MT_RESTA = [
    //booleano                      //entero                        //decimal                   //cadena                    //caracter                      
    [exports.constantes.T_ERROR   , exports.constantes.T_ENTERO,  exports.constantes.T_DECIMAL , exports.constantes.T_ERROR , exports.constantes.T_ERROR],  //booleano
    [exports.constantes.T_ENTERO  , exports.constantes.T_ENTERO,  exports.constantes.T_DECIMAL , exports.constantes.T_ERROR , exports.constantes.T_ENTERO],  //entero
    [exports.constantes.T_DECIMAL , exports.constantes.T_DECIMAL, exports.constantes.T_DECIMAL , exports.constantes.T_ERROR , exports.constantes.T_DECIMAL],  //decimal
    [exports.constantes.T_ERROR   , exports.constantes.T_ERROR ,  exports.constantes.T_ERROR   , exports.constantes.T_ERROR , exports.constantes.T_ERROR],  //cadena
    [exports.constantes.T_ERROR   , exports.constantes.T_ENTERO,  exports.constantes.T_DECIMAL ,exports.constantes.T_ERROR  , exports.constantes.T_CARACTER]   //caracter
];

MT_MULT = [
    //booleano                      //entero                        //decimal                   //cadena                    //caracter                      
    [exports.constantes.T_BOOLEANO , exports.constantes.T_ENTERO,  exports.constantes.T_DECIMAL , exports.constantes.T_ERROR , exports.constantes.T_ERROR],  //booleano
    [exports.constantes.T_ENTERO   , exports.constantes.T_ENTERO,  exports.constantes.T_DECIMAL , exports.constantes.T_ERROR , exports.constantes.T_ENTERO],  //entero
    [exports.constantes.T_DECIMAL  , exports.constantes.T_DECIMAL, exports.constantes.T_DECIMAL , exports.constantes.T_ERROR , exports.constantes.T_DECIMAL],  //decimal
    [exports.constantes.T_ERROR    , exports.constantes.T_ERROR ,  exports.constantes.T_ERROR   , exports.constantes.T_ERROR , exports.constantes.T_ERROR],  //cadena
    [exports.constantes.T_ERROR    , exports.constantes.T_ENTERO,  exports.constantes.T_DECIMAL ,exports.constantes.T_ERROR  , exports.constantes.T_CARACTER]   //caracter
];

MT_DIV = [
    //booleano                      //entero                        //decimal                   //cadena                    //caracter                      
    [exports.constantes.T_ERROR   , exports.constantes.T_ENTERO,  exports.constantes.T_DECIMAL , exports.constantes.T_ERROR , exports.constantes.T_ERROR],  //booleano
    [exports.constantes.T_ENTERO  , exports.constantes.T_ENTERO,  exports.constantes.T_DECIMAL , exports.constantes.T_ERROR , exports.constantes.T_ENTERO],  //entero
    [exports.constantes.T_DECIMAL , exports.constantes.T_DECIMAL, exports.constantes.T_DECIMAL , exports.constantes.T_ERROR , exports.constantes.T_ERROR],  //decimal
    [exports.constantes.T_ERROR   , exports.constantes.T_ERROR  , exports.constantes.T_ERROR   , exports.constantes.T_ERROR , exports.constantes.T_ERROR],  //cadena
    [exports.constantes.T_ERROR   , exports.constantes.T_ENTERO, exports.constantes.T_DECIMAL , exports.constantes.T_ERROR  , exports.constantes.T_CARACTER]   //caracter
];

MT_POW = [
    //booleano                      //entero                        //decimal                   //cadena                    //caracter                      
    [exports.constantes.T_ERROR   , exports.constantes.T_ERROR,  exports.constantes.T_ERROR , exports.constantes.T_ERROR , exports.constantes.T_ERROR],  //booleano
    [exports.constantes.T_ERROR   , exports.constantes.T_ENTERO,  exports.constantes.T_DECIMAL , exports.constantes.T_ERROR , exports.constantes.T_DECIMAL],  //entero
    [exports.constantes.T_ERROR   , exports.constantes.T_DECIMAL, exports.constantes.T_DECIMAL , exports.constantes.T_ERROR , exports.constantes.T_DECIMAL],  //decimal
    [exports.constantes.T_ERROR   , exports.constantes.T_ERROR  , exports.constantes.T_ERROR   , exports.constantes.T_ERROR , exports.constantes.T_ERROR],  //cadena
    [exports.constantes.T_ERROR   , exports.constantes.T_ENTERO, exports.constantes.T_DECIMAL , exports.constantes.T_ERROR  , exports.constantes.T_CARACTER]   //caracter
];

MT_MOD = [
    //booleano                      //entero                        //decimal                   //cadena                    //caracter                      
    [exports.constantes.T_ERROR   , exports.constantes.T_ERROR,  exports.constantes.T_ERROR , exports.constantes.T_ERROR , exports.constantes.T_ERROR],  //booleano
    [exports.constantes.T_ERROR   , exports.constantes.T_ENTERO,  exports.constantes.T_DECIMAL , exports.constantes.T_ERROR , exports.constantes.T_ENTERO],  //entero
    [exports.constantes.T_ERROR   , exports.constantes.T_DECIMAL, exports.constantes.T_DECIMAL , exports.constantes.T_ERROR , exports.constantes.T_DECIMAL],  //decimal
    [exports.constantes.T_ERROR   , exports.constantes.T_ERROR  , exports.constantes.T_ERROR   , exports.constantes.T_ERROR , exports.constantes.T_ERROR],  //cadena
    [exports.constantes.T_ERROR   , exports.constantes.T_ENTERO, exports.constantes.T_DECIMAL , exports.constantes.T_ERROR  , exports.constantes.T_ENTERO]   //caracter
];

MT_RELACIONAL1 =[
    //booleano                      //entero                        //decimal                   //cadena                    //caracter                      
    [exports.constantes.T_ERROR   , exports.constantes.T_ERROR,     exports.constantes.T_ERROR ,    exports.constantes.T_ERROR , exports.constantes.T_ERROR],  //booleano
    [exports.constantes.T_ERROR   , exports.constantes.T_BOOLEANO,  exports.constantes.T_BOOLEANO , exports.constantes.T_ERROR , exports.constantes.T_BOOLEANO],  //entero
    [exports.constantes.T_ERROR   , exports.constantes.T_BOOLEANO,  exports.constantes.T_BOOLEANO , exports.constantes.T_ERROR , exports.constantes.T_BOOLEANO],  //decimal
    [exports.constantes.T_ERROR   , exports.constantes.T_ERROR  ,   exports.constantes.T_ERROR   ,  exports.constantes.T_ERROR , exports.constantes.T_ERROR],  //cadena
    [exports.constantes.T_ERROR   , exports.constantes.T_BOOLEANO,  exports.constantes.T_BOOLEANO , exports.constantes.T_ERROR , exports.constantes.T_BOOLEANO]   //caracter
];

MT_RELACIONAL2 =[ //para == !=
    //booleano                      //entero                        //decimal                   //cadena                    //caracter                      //null                          //ID
    [exports.constantes.T_BOOLEANO, exports.constantes.T_ERROR,     exports.constantes.T_ERROR ,    exports.constantes.T_ERROR , exports.constantes.T_ERROR, exports.constantes.T_BOOLEANO,   exports.constantes.T_ERROR],  //booleano
    [exports.constantes.T_ERROR   , exports.constantes.T_BOOLEANO,  exports.constantes.T_BOOLEANO , exports.constantes.T_ERROR , exports.constantes.T_BOOLEANO, exports.constantes.T_BOOLEANO,exports.constantes.T_ERROR],  //entero
    [exports.constantes.T_ERROR   , exports.constantes.T_BOOLEANO,  exports.constantes.T_BOOLEANO , exports.constantes.T_ERROR , exports.constantes.T_BOOLEANO, exports.constantes.T_BOOLEANO,exports.constantes.T_ERROR],  //decimal
    [exports.constantes.T_ERROR   , exports.constantes.T_ERROR  ,   exports.constantes.T_ERROR   ,  exports.constantes.T_BOOLEANO , exports.constantes.T_ERROR, exports.constantes.T_ERROR   ,exports.constantes.T_BOOLEANO],  //cadena
    [exports.constantes.T_ERROR   , exports.constantes.T_BOOLEANO,  exports.constantes.T_BOOLEANO , exports.constantes.T_ERROR , exports.constantes.T_BOOLEANO, exports.constantes.T_BOOLEANO,exports.constantes.T_ERROR],   //caracter
    [exports.constantes.T_BOOLEANO, exports.constantes.T_BOOLEANO,  exports.constantes.T_BOOLEANO,  exports.constantes.T_ERROR, exports.constantes.T_BOOLEANO, exports.constantes.T_BOOLEANO ,exports.constantes.T_BOOLEANO], //null
    [exports.constantes.T_ERROR   , exports.constantes.T_ERROR,     exports.constantes.T_ERROR,     exports.constantes.T_CADENA, exports.constantes.T_ERROR,    exports.constantes.T_BOOLEANO,exports.constantes.T_BOOLEANO] //ID
];


exports.comprobacion_tipos = function comprobacion_tipos(tipo_izq, tipo_der, MAT){
    return MAT[tipo_izq][tipo_der];
}