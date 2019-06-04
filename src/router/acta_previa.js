const router = require('express').Router();
const pool = require('../database');
const {isLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de materia
router.get('/',IsLoggedIn,async(req, res, next) =>
{
    const actaPrevias = await pool.query('SELECT * FROM Acta_Previa')
    .catch(err => next(err));
    res.status(200).send({actaPrevias});
});


// --POST-- //

// Agregar Acta previa
router.get('/add',IsLoggedIn,(req, res, next) =>
{
    res.send('Agregar acta previa');
});


// Actualizar Acta previa
router.get('/update',IsLoggedIn,(req, res, next) =>
{
    res.send('Actualizar acta previa');
});

module.exports = router;