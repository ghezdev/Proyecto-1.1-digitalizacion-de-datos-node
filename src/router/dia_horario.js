const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de Dia - Horarios
router.get('/',IsLoggedIn,async(req, res, next) =>
{
    const diaHorarios = await pool.query('SELECT * FROM Dia_Horario')
    .catch(err => next(err));
    res.status(200).send({diaHorarios});
});

router.get('/:idHorario',IsLoggedIn,async(req, res, next) => 
{
    const {idHorario} = req.body;
    const arrayHorario = await pool.query('SELECT * FROM Dia_Horario WHERE idHorario = ?', [idHorario]);
    res.send(arrayHorario);
});


// --POST-- //

// Agregar Dia - Horarios
router.post('/add',IsLoggedIn,async(req, res, next) =>
{
    const {dia, entrada, salida} = req.body;
    const newHorario = {
        dia,
        entrada,
        salida
    }
    await pool.query('INSERT INTO Dia_Horario SET ?', [newHorario]);
});


// Actualizar Dia - Horarios
router.post('/update',IsLoggedIn,async(req, res, next) => 
{
    const {idHorario, dia, entrada, salida} = req.body;
    const newHorario = {
        dia,
        entrada,
        salida
    }
    await pool.query('UPDATE Dia_Horario SET ? WHERE idHorario = ?', [newHorario, idHorario]);
});

module.exports = router;