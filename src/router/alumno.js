const router = require('express').Router();
const pool = require('../database');
const {isLoggedIn, NotLoggedIn} = require('../autenticacion');

//  --GET--  //

//enviar tabla Alumno
router.get('/',async(req,res,next)=>{
    const alumnos = await pool.query('SELECT * FROM alumno')
    .catch(err=> next(err));
});

//enviar alumno con ID
router.get('/:idAlumno',async(req,res,next)=>{
    const {idAlumno} = req.params;
    const alumno = await pool.query('SELECT * FROM alumno WHERE idAlumno = ?',[idAlumno])
    .catch(err=> next(err));
});

//  --POST--  //

//Agregar Alumno
router.post('/add',(req,res,next)=>{
    const {
        idAlumno,
        dni,
        telefono,
        direccion,
        nombre,
        apellido,
        repetidor,
        fechaNacimiento,
        fechaIngreso
    } = req.body;

    const newAlumno={
        idAlumno,
        dni,
        telefono,
        direccion,
        nombre,
        apellido,
        repetidor,
        fechaNacimiento,
        fechaIngreso
    }
    await pool.query('INSERT INTO alumno SET= ?',[newAlumno])
    .catch(err=> next(err));
});

//Actualizar Alumno
router.post('/update',async(req,res,next)=>{
    const {
        idAlumno,
        dni,
        telefono,
        direccion,
        nombre,
        apellido,
        repetidor,
        fechaNacimiento,
        fechaIngreso
    } = req.body;

    const newAlumno={
        idAlumno,
        dni,
        telefono,
        direccion,
        nombre,
        apellido,
        repetidor,
        fechaNacimiento,
        fechaIngreso
    }

    await pool.query('UPDATE alumno SET ?',[newAlumno])
    .catch(err=>next(err));
});

module.exports = router;