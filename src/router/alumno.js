const router = require('express').Router();
const pool = require('../database');
const {isLoggedIn, NotLoggedIn} = require('../autenticacion');

//  --GET--  //

//Leer lista de alumnos
router.get('/',isLoggedIn,async(req,res,next)=>{
    const alumnos = await pool.query('SELECT * FROM alumno')
    .catch(err=> next(err));
    res.status(200).send({alumnos});
});

//  --POST--  //

//Agregar Alumno
router.post('/add',(req,res,next)=>{
    res.send('Api Alumno');
});

//Actualizar Alumno
router.post('/update',(req,res,next)=>{
    res.send('Api Alumno');
});

//Eliminar Alumno
router.post('/delete',(req,res,next)=>{
    res.send('Api Alumno');
});

module.exports = router;