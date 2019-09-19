const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('passport');

//Base de datos
const {database} = require('./keys');

//Dev dependencias
const morgan = require('morgan');

//Inicializaciones
const app = express();
require('./PassportStrategy');

//Configuracion
app.set('port',process.env.PORT || 3000);

//Middleware
app.use(session({
    secret:'LIOK2019',
    resave:false,
    saveUninitialized:false
}))
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());

//Variables globales

//Rutas
app.use('/api/',require('./router/index'));
app.use('/api/alumno/',require('./router/alumno'));
app.use('/api/autoridad/',require('./router/autoridad'));
app.use('/api/acta_cursada/',require('./router/acta_cursada'));
app.use('/api/acta_previa/',require('./router/acta_previa'));
app.use('/api/contacto_alumno/',require('./router/contacto_alumno'));
app.use('/api/dia_horario/',require('./router/dia_horario'));
app.use('/api/division/',require('./router/division'));
app.use('/api/materia/',require('./router/materia'));
app.use('/api/plan_estudios/',require('./router/plan_estudios'));
app.use('/api/rol/',require('./router/rol'));
app.use('/api/cursada/',require('./router/cursada'));


//Archivos estaticos
app.use(express.static(path.join(__dirname,'/public')));

//Inicializar servidor
app.listen(app.get('port'),(req,res) =>{
    console.log('servidor escuchando el puerto',app.get('port'));
});

//Error Handler basico
app.use(function(err, req, res, next) {
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
    next();
});