const router = require('express').Router();
const path = require('path');
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');

//Enviar tabla autoridades
router.get('/',async (req,res,next)=>{
    const autoridades = await pool.query('SELECT autoridades.idAutoridad,GROUP_CONCAT(idRol SEPARATOR ",") AS idRol, dni, telefono, direccion, nombre, apellido,fechaIngreso,fechaNacimiento,fichaMedica FROM autoridades JOIN autoridades_roles WHERE autoridades.idAutoridad = autoridades_roles.idAutoridad GROUP BY autoridades.idAutoridad')
    .catch(err=> next(err));
    res.json(autoridades);
});

//Enviar autoridad con ID
router.get('/:idAutoridad',IsLoggedIn,async (req,res,next)=>{
    const {idAutoridad} = req.params;
    const autoridad = await pool.query('SELECT * FROM autoridades WHERE idAutoridad = ?',[idAutoridad])
    .catch(err=> next(err));
});

//Recibir actualizacion de autoridad con ID
router.post('/update',IsLoggedIn,async(req,res,next)=>{
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
router.post('/add',async(req,res,next)=>{
    const {
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
        dni,
        telefono,
        direccion,
        nombre,
        apellido,
        fechaIngreso,
        fechaNacimiento,
        FichaMedica
    }

    await pool.query('INSERT INTO autoridades SET ?',[newAutoridad])
    .catch(err=> console.log(err));
})

module.exports = router;