const router = require('express').Router();
const pool = require('../database');
const {isLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de Plan de estudio
router.get('/',IsLoggedIn,async(req, res, next) =>
{
    const planEstudio = await pool.query('SELECT * FROM Plan_Estudio')
    .catch(err => next(err));
    res.status(200).send({planEstudio});
});


// --POST-- //

// Agregar Plan de estudio
router.post('/add',IsLoggedIn,(req, res, next) =>
{
    res.send('Agregar plan de estudio');
});


// Actualizar Plan de estudio
router.post('/update',IsLoggedIn,(req, res, next) => 
{
    res.send('Actualizar plan de estudio');
});

module.exports = router;