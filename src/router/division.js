const router = require('express').Router();
const pool = require('../database');
const {isLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de divisiones
router.get('/',IsLoggedIn,async(req, res, next) =>
{
    const divisiones = await pool.query('SELECT * FROM Divisiones')
    .catch(err => next(err));
    res.status(200).send({divisiones});
});


// --POST-- //

// Agregar Division
router.get('/add',IsLoggedIn,(req, res, next) =>
{
    res.send('Agregar divisiones');
});


// Actualizar Division
router.get('/update',IsLoggedIn,(req, res, next) =>
{
    res.send('Actualizar divisiones');
});

module.exports = router;