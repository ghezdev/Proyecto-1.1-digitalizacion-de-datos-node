const router = require('express').Router();
const pool = require('../database');
const {isLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de materia
router.get('/',IsLoggedIn,async(req, res, next) =>
{
    const materias = await pool.query('SELECT * FROM Materia')
    .catch(err => next(err));
    res.status(200).send({materias});
});


// --POST-- //

// Agregar materia
router.get('/add',IsLoggedIn,(req, res, next) =>
{
    res.send('Agregar materias');
});


// Actualizar materia
router.get('/update',IsLoggedIn,(req, res, next) =>
{
    res.send('Actualizar materias');
});

module.exports = router;