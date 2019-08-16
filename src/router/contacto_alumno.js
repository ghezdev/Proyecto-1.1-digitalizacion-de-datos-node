const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

//enviar contactos de alumnos
router.get('/',IsLoggedIn,async(req, res, next) =>{
    const contactoAlumnos = await pool.query('SELECT * FROM Contacto_Alumno')
    .catch(err => next(err));
});

router.get('/:idContactoAlumno',IsLoggedIn,async(req, res, next) =>{
    const {idContactoAlumno} = req.params;
    const contactoAlumnos = await pool.query('SELECT * FROM Contacto_Alumno WHERE idContacto = ?',[idContactoAlumno])
    .catch(err => next(err));
});

// --POST-- //

// Agregar Contacto de alumno
router.post('/add',IsLoggedIn,async(req, res, next) =>{
    const {
        idContacto,
        idAlumno,
        nombre,
        apellido,
        relacion,
        celular,
        mail,
        dni
    } = req.body;

    const newContactoAlumno ={
        idContacto,
        idAlumno,
        nombre,
        apellido,
        relacion,
        celular,
        mail,
        dni
    }
    await pool.query('INSERT INTO Contacto_Alumno SET ?',[newContactoAlumno])
    .catch(err=>next(err));
});


// Actualizar Contacto de alumno
router.post('/update',IsLoggedIn,async (req, res, next) => {
    const {
        idContacto,
        idAlumno,
        nombre,
        apellido,
        relacion,
        celular,
        mail,
        dni
    } = req.body;

    const newContactoAlumno ={
        idContacto,
        idAlumno,
        nombre,
        apellido,
        relacion,
        celular,
        mail,
        dni
    }
    await pool.query('UPDATE Contacto_Alumno SET ?',[newContactoAlumno])
    .catch(err=>next(err));
});

module.exports = router;