const express = require('express');
const path = require('path');

//Base de datos
const {database} = require('./keys');

//Dev dependencias
const morgan = require('morgan');

//Inicializaciones
const app = express();

//Configuracion
app.set('port',process.env.PORT || 3000);

//Middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(morgan('dev'));

//Variables globales

//Rutas
app.use('/api/',require('./router/index'));
app.use('/api/alumno/',require('./router/alumno'));

//Archivos estaticos
app.use(express.static(path.join(__dirname,'public')));

//Inicializar servidor
app.listen(app.get('port'),(req,res) =>{
    console.log('servidor escuchando el puerto',app.get('port'));
});

//Error Handler
app.use(function(err, req, res, next) {
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
    next();
});