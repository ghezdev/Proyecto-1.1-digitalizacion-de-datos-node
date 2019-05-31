const router = require('express').Router();
const pool = require('../database');

// --GET-- //

// Leer lista de autoridades
router.get('/', async(req, res, next) =>
{
    const contactoAlumno = await pool.query('SELECT * FROM Contacto_Alumno')
    .catch(err => next(err));
    res.status(200).send({contactoAlumno});
});


// --POST-- //

// Agregar Contacto de alumno
router.post('/add', (req, res, next) =>
{
    res.send('Agregar contacto de alumno');
});


// Actualizar Contacto de alumno
router.post('/update', (req, res, next) => 
{
    res.send('Actualizar contacto de alumno');
});

module.exports = router;