const router = require('express').Router();
const pool = require('../database');
const {isLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de Contactos de alumnos
router.get('/',IsLoggedIn,async(req, res, next) =>
{
    const contactoAlumnos = await pool.query('SELECT * FROM Contacto_Alumno')
    .catch(err => next(err));
    res.status(200).send({contactoAlumnos});
});


// --POST-- //

// Agregar Contacto de alumno
router.post('/add',IsLoggedIn,(req, res, next) =>
{
    res.send('Agregar contacto de alumno');
});


// Actualizar Contacto de alumno
router.post('/update',IsLoggedIn,(req, res, next) => 
{
    res.send('Actualizar contacto de alumno');
});

module.exports = router;