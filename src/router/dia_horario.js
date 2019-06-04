const router = require('express').Router();
const pool = require('../database');
const {isLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de Dia - Horarios
router.get('/',IsLoggedIn,async(req, res, next) =>
{
    const diaHorarios = await pool.query('SELECT * FROM Dia_Horario')
    .catch(err => next(err));
    res.status(200).send({diaHorarios});
});


// --POST-- //

// Agregar Dia - Horarios
router.post('/add',IsLoggedIn,(req, res, next) =>
{
    res.send('Agregar Dia-Horarios');
});


// Actualizar Dia - Horarios
router.post('/update',IsLoggedIn,(req, res, next) => 
{
    res.send('Actualizar Dia-Horarios');
});

module.exports = router;