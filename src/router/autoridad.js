const router = require('express').Router();
const pool = require('../database');
const {isLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de autoridades
router.get('/',IsLoggedIn,async(req, res, next) =>{
    const autoridades = await pool.query('SELECT * FROM Autoridades')
    .catch(err => next(err));
    res.status(200).send({autoridades});
});


// --POST-- //

// Agregar Autoridad
router.post('/add',IsLoggedIn,(req, res, next) =>{
    res.send('Agregar autoridad');
});


// Actualizar Autoridad
router.post('/update',IsLoggedIn,(req, res, next) => {
    res.send('Actualizar autoridad');
});

module.exports = router;