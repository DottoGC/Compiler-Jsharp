'use strict';
var main = require('./Instrucciones/main_INST');//Esto unicamente para saber que numero de copmilada se esta haciendo, y poder mostrar la imagenAST correspondiente

const Hapi = require('hapi');
const middleware = require('./src/javascript/middleware');



//HABEMOS USO DEL MODULO HAPI PARA LEVANTAR EL SERVIDOR
const server = new Hapi.Server({
    port: 3000,
    host: 'localhost'
});


//Ruta que usamos para parsear el codigo de alto nivel
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'PUT',
    path: '/parse',
    handler: middleware.parsear
});


//Ruta que usamos para obtener la info de consola de alto nivel
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'GET',
    path: '/getConsola',
    handler: middleware.getConsola
});



//Ruta que usamos para obtener tabla de errores
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'GET',
    path: '/getTablaErrores',
    handler: middleware.getTablaErrores
});


//Ruta que usamos para obtener tabla de simbolos
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'GET',
    path: '/getTS',
    handler: middleware.getTS
});


//DEVEUELVE IMAGEN AST
server.route({
    method: 'GET',
    path: '/image0.png',
    handler: (request, h) => {
        return h.file('./src/images/image'+main.contCompilaciones+'.png')
    }
});

//BORRAR IMAGEN AST
server.route({
        config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'PUT',
    path: '/limpiador',
    handler: middleware.limpiador
    
});


//RUTA DONDE SE RECIBE EL NOMBRE DEL TAB QUE SE ESTA COMPILANDO
server.route({
        config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'PUT',
    path: '/nombreTabCompilando',
    handler: middleware.nombreTabCompilando
    
});

//Ruta que usamos para obtener el C3D
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'GET',
    path: '/getCodigo3D',
    handler: middleware.getCodigo3D
});


//RUTA QUE USAMOS PARA OBTENER LA INFO DE CONSOLA C3D
server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method: 'GET',
    path: '/getConsola3D',
    handler: middleware.getConsola3D
});



(async () => {
    try {
        await server.register(require('inert'));

        
        //INTERACCIONES CON SCRIPTS DE DISEÑO DE VISUALES
        server.route({
            method: 'GET',
            path: '/ace',
            handler: function (request, h) {

                return h.file('./src/javascript/layout/src-min-noconflict/ace.js');
            }
        });

        server.route({
            method: 'GET',
            path: '/theme-eclipse.js',
            handler: function (request, h) {

                return h.file('./src/javascript/layout/src-min-noconflict/theme-eclipse.js');
            }
        });

        server.route({
            method: 'GET',
            path: '/theme-monokai.js',
            handler: function (request, h) {

                return h.file('./src/javascript/layout/src-min-noconflict/theme-monokai.js');
            }
        });
        
        
        server.route({
            method: 'GET',
            path: '/mode-java.js',
            handler: function (request, h) {

                return h.file('./src/javascript/layout/src-min-noconflict/mode-java.js');
            }
        });

        
        server.route({
            method: 'GET',
            path: '/ajax',
            handler: function (request, h) {

                return h.file('./src/javascript/layout/jquery-2.0.3.min.js');
            }
        });

        server.route({
            method: 'GET',
            path: '/jquery',
            handler: function (request, h) {

                return h.file('./src/javascript/layout/jquery-ui.min.js');
            }
        });

        
        
        
        
        //INTERACCIONES CON PAGINA UNICA HTML
        server.route({
            method: 'GET',
            path: '/Jsharp',
            handler: function (request, h) {
                return h.file('./src/html/index.html');
            }
        });

        
        
        
        //INTERACCIONES CON ESTILOS CSS
        server.route({
            method: 'GET',
            path: '/style.css',
            handler: (request, h) => {
                return h.file('./src/css/style.css')
            }
        });

        server.route({
            method: 'GET',
            path: '/bootstrap.css',
            handler: (request, h) => {
                return h.file('./src/css/bootstrap.css')
            }
        });

        
        
        //INTERACCION CON SCRIPT PARA 'GUARDAR COMO'
        server.route({
            method: 'GET',
            path: '/fileSaver.js',
            handler: (request, h) => {
                return h.file('./src/javascript/fileSaver.js')
            }
        });
        

        //INTERACCION CON SCRIPT PARA IMAGENES
        server.route({
            config: {
                cors: {
                    origin: ['*'],
                    additionalHeaders: ['cache-control', 'x-requested-with']
                }
            },
            method: 'GET',
            path: '/images/{file*}',
            handler: {
                directory: {
                    path: 'src/images',
                    listing: true
                }
            }
        });

        
        await server.start();
        console.log(`Server running at: ${server.info.uri}`);        
        
    }catch (err) {
        console.log(err)
        process.exit(1)
    }
    
})();
