var file = require('fs');
const {exec} = require('child_process');

exports.digraph = "";
exports.nodo_padre="";
exports.cont = 0;


//función que genera código .dot para gráficar el arbol
exports.crearNodo = function crearNodo(tipo, hijo){
    exports.digraph += exports.nodo_padre +"->"+tipo+"->"+hijo+";\n"+
    exports.nodo_padre +" [shape = cylinder, color = black];\n"+
    hijo+" [shape = cylinder, color = red, style = filled];\n"+
    tipo+" [shape = tripleoctagon, color = green];\n";
}


//función que ejecuta y genera el png del archivo .dot
exports.ejecutarDot = function ejecutarDot(){
    var digraph_tmp = exports.digraph;
    
    file.writeFile("src/images/image"+exports.cont+".dot", digraph_tmp, function(err, digraph_tmp){
        if(err) console.log(err)
    });
    
    exec('dot -Tpng "./src/images/image'+exports.cont+'.dot" -o "./src/images/image'+exports.cont+'.png"');
   
    exports.cont++;
}
