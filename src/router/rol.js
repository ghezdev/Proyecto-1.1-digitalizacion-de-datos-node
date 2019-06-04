const router = require('express').Router();
const pool = require('../database');
const {isLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de roles
router.get('/',IsLoggedIn,async(req, res, next) =>
{
    const roles = await pool.query('SELECT * FROM Roles')
    .catch(err => next(err));
    res.status(200).send({roles});
});


// --POST-- //

// Agregar rol
router.get('/add',IsLoggedIn,(req, res, next) =>
{
    res.send('Agregar rol');
});


// Actualizar rol
router.get('/update',IsLoggedIn,(req, res, next) =>
{
    res.send('Actualizar rol');
});

module.exports = router;