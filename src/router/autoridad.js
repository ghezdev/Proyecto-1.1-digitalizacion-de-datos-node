const router = require('express').Router();
const path = require('path');
const pool = require('../database');
const {isLoggedIn, NotLoggedIn} = require('../autenticacion');

//Ver tabla de autoridades
router.get('/',isLoggedIn,async (req,res,next)=>{
    const autoridades = await pool.query('SELECT * FROM autoridades');
});

//ver autoridad
router.get('/:idAutoridad',isLoggedIn,async (req,res,next)=>{
    const {idAutoridad} = req.params;
    const autoridad = await pool.query('SELECT * FROM autoridades WHERE idAutoridad = ?',[idAutoridad]);
});

router.post('/update',isLoggedIn,async(req,res,next)=>{
    const {
        idAutoridad,
        dni,
        telefono,
        direccion,
        nombre,
        apellido,
        fechaIngreso,
        fechaNacimiento,
        FichaMedica
    } = req.body;

    const newAutoridad ={
        idAutoridad,
        dni,
        telefono,
        direccion,
        nombre,
        apellido,
        fechaIngreso,
        fechaNacimiento,
        FichaMedica
    }
    await pool.query('UPDATE autoridad SET ? ',[newAutoridad]);
});

module.exports = router;