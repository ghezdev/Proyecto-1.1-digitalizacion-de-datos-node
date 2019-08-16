const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de Actas Cursadas
router.get('/',IsLoggedIn,async(req, res, next) =>
{
    const actaCursadas = await pool.query('SELECT * FROM Acta_Cursada')
    .catch(err => next(err));
    res.status(200).send({actaCursadas});
});

router.get('/:idActaCursada',IsLoggedIn,async (req, res, next) =>
{
    const {idActaCursada} = req.body;
    const arrayActaCursada = await pool.query('SELECT * FROM Acta_Cursada WHERE idActaCursada = ?',[idActaCursada]);
    res.send(arrayActaCursada);
});


// --POST-- //

// Agregar Actas Cursadas
router.post('/add',IsLoggedIn,async (req, res, next) =>
{
    const {periodo, nota, fechaCierre} = req.body;
    const newActaCursada = {
        periodo,
        nota,
        fechaCierre
    }
    await pool.query('INSERT INTO Acta_Cursada SET ?',[newActaCursada]);
    res.send(newActaCursada);
});


// Actualizar Actas Cursadas
router.post('/update',IsLoggedIn,async (req, res, next) =>
{
    const {idActaCursada, periodo, nota, fechaCierre} = req.body;
    const newActaCursada = {
        periodo,
        nota,
        fechaCierre
    }
    await pool.query('UPDATE Acta_Cursada SET ? WHERE idActaCursada = ?',[newActaCursada, idActaCursada]);
});

module.exports = router;