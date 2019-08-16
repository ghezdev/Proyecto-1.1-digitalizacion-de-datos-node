const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de divisiones
router.get('/',IsLoggedIn,async(req, res, next) =>
{
    const divisiones = await pool.query('SELECT * FROM Divisiones')
    .catch(err => next(err));
    res.status(200).send({divisiones});
});

router.get('/:idDivision',IsLoggedIn,async(req, res, next) =>
{
    const {idDivision} = req.body;
    const arrayDivision = await pool.query('SELECT * FROM Division WHERE idDivision = ?', [idDivision]);
    res.send(arrayDivision);
});


// --POST-- //

// Agregar Division
router.post('/add',IsLoggedIn,async(req, res, next) =>
{
    const {especialidad, año, turno, numDivision, cicloLectivo} = req.body;
    const newDivision = {
        especialidad,
        año,
        turno,
        numDivision,
        cicloLectivo
    }
    await pool.query('INSERT INTO Division SET ?',[newDivision]);
});


// Actualizar Division
router.post('/update',IsLoggedIn,async(req, res, next) =>
{
    const {idDivision, especialidad, año, turno, numDivision, cicloLectivo} = req.body;
    const newDivision = {
        especialidad,
        año,
        turno,
        numDivision,
        cicloLectivo
    }
    await pool.query('UPDATE Division SET ? WHERE idDivision = ?', [newDivision, idDivision]);
});

module.exports = router;