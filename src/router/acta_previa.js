const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de materia
router.get('/',async(req, res, next) =>
{
    const actaPrevias = await pool.query('SELECT * FROM acta_previa')
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });

    res.json(actaPrevias);
});

router.get('/:idActaPrevia',async(req, res, next) =>
{
    const {idActaPrevia} = req.body;
    const arrayActaPrevia = await pool.query('SELECT * FROM Acta_Previa WHERE idActaPrevia = ?',[idActaPrevia]);
    res.send(arrayActaPrevia);
});


// --POST-- //

// Agregar Acta previa
router.post('/add',async(req, res, next) =>
{
    const {tipo, fechaCierre} = req.body;
    const newActaPrevia = {
        tipo,
        fechaCierre
    }
    await pool.query('INSERT INTO Acta_Previa SET ?', [newActaPrevia]);
});


// Actualizar Acta previa
router.post('/update',async(req, res, next) =>
{
    const {idActaPrevia, tipo, fechaCierre} = req.body;
    const newActaPrevia = {
        tipo,
        fechaCierre
    }
    await pool.query('UPDATE Acta_Previa SET ? WHERE idActaPrevia = ?', [newActaPrevia, idActaPrevia]);
});

module.exports = router;