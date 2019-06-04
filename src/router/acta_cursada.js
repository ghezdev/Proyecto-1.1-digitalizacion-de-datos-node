const router = require('express').Router();
const pool = require('../database');
const {isLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de Actas Cursadas
router.get('/',IsLoggedIn,async(req, res, next) =>
{
    const actaCursadas = await pool.query('SELECT * FROM Acta_Cursada')
    .catch(err => next(err));
    res.status(200).send({actaCursadas});
});


// --POST-- //

// Agregar Actas Cursadas
router.get('/add',IsLoggedIn,(req, res, next) =>
{
    const {idActa,wea} = req.body;
    const newActaCursada = {
        idActa,
        wea
    }
    await pool.query('INSERT INTO Acta_Cursada SET ?',[newActaCursada]);
    res.send('Agregar Actas Cursadas');
});


// Actualizar Actas Cursadas
router.get('/update',IsLoggedIn,(req, res, next) =>
{
    res.send('Actualizar Actas Cursadas');
});

module.exports = router;