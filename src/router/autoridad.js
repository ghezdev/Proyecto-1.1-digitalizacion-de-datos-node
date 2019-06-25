const router = require('express').Router();
const path = require('path');
const pool = require('../database');
const {isLoggedIn, NotLoggedIn} = require('../autenticacion');

//Enviar tabla autoridades
router.get('/',isLoggedIn,async (req,res,next)=>{
    const autoridades = await pool.query('SELECT * FROM autoridades')
    .catch(err=> next(err));
});

//enviar autoridad con ID
router.get('/:idAutoridad',isLoggedIn,async (req,res,next)=>{
    const {idAutoridad} = req.params;
    const autoridad = await pool.query('SELECT * FROM autoridades WHERE idAutoridad = ?',[idAutoridad])
    .catch(err=> next(err));
});

//Recibir actualizacion de autoridad con ID
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
    await pool.query('UPDATE autoridades SET ?',[newAutoridad])
    .catch(err=> next(err));
});

//Agregar una nueva autoridad
router.post('/add',isLoggedIn,async(req,res,next)=>{
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

    await pool.query('INSERT INTO autoridades SET= ?',[newAutoridad])
    .catch(err=> next(err));
})

module.exports = router;