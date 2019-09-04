const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

router.get('/:dniAlumno',async(req, res, next) =>{
    const {dniAlumno} = req.params;
    const contactoAlumnos = await pool.query('SELECT * FROM contacto_alumno WHERE dniAlumno = ?',[dniAlumno])
    .catch(err=>{return new Promise(()=>{
            next(err)
        })
    })
    
    res.json(contactoAlumnos)
});

// --POST-- //

// Agregar Contacto de alumno
router.post('/add',async(req, res, next) =>{
    const {
        dniAlumno,
        nombre,
        apellido,
        relacion,
        celular,
        mail,
        dniContacto
    } = req.body;

    const newContactoAlumno ={
        dniAlumno,
        nombre,
        apellido,
        relacion,
        celular,
        mail,
        dniContacto
    }
    await pool.query('INSERT INTO Contacto_Alumno SET ?',[newContactoAlumno])
    .catch(err=>{return new Promise(()=>{
            next(err)
        })
    })

    res.status(200).send();
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