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

router.get('/:idActaPrevia',IsLoggedIn,async(req, res, next) =>
{
    const {idActaPrevia} = req.body;
    const arrayActaPrevia = await pool.query('SELECT * FROM Acta_Previa WHERE idActaPrevia = ?',[idActaPrevia]);
    res.send(arrayActaPrevia);
});


// --POST-- //

// Agregar Acta previa
router.post('/add',IsLoggedIn,async(req, res, next) =>
{
    const {tipo, fechaCierre} = req.body;
    const newActaPrevia = {
        tipo,
        fechaCierre
    }
    await pool.query('INSERT INTO Acta_Previa SET ?', [newActaPrevia]);
});


// Actualizar Acta previa
router.post('/update',IsLoggedIn,async(req, res, next) =>
{
    const {idActaPrevia, tipo, fechaCierre} = req.body;
    const newActaPrevia = {
        tipo,
        fechaCierre
    }
    await pool.query('UPDATE Acta_Previa SET ? WHERE idActaPrevia = ?', [newActaPrevia, idActaPrevia]);
});

module.exports = router;