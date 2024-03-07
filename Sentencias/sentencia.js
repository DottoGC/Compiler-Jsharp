var c = require("../Arbol/constants");
var c_if = require("../Sentencias/if");
var c_switch = require("../Sentencias/switch");
var c_while = require("../Sentencias/while");
var c_for = require("../Sentencias/for");
var c_dowhile = require("../Sentencias/dowhile");

exports.sentencia = function sentencia(raiz, TS){
    var res;
    switch(raiz[0]){
        case c.constantes.T_IF:
            res = c_if.IF(raiz, TS);
            break;
            
        case c.constantes.T_SWITCH:
            res = c_switch.SWITCH(raiz, TS);
            break;
            
        case c.constantes.T_FOR:
            res = c_for.FOR(raiz, TS);
            break;
                
        case c.constantes.T_WHILE:
            res = c_while.WHILE(raiz, TS);
            break;
            
        case c.constantes.T_DOWHILE:
            res = c_dowhile.DOWHILE(raiz, TS);
            break;
    }
    return res; //puede traer un retorno
}

