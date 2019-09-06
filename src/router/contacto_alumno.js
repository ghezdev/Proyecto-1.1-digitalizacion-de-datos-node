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
router.post('/update',async (req, res, next) => {
    const {
        idContacto,
        nombre,
        apellido,
        relacion,
        celular,
        mail,
        dniContacto
    } = req.body;

    const newContactoAlumno ={
        idContacto,
        nombre,
        apellido,
        relacion,
        celular,
        mail,
        dniContacto
    }
    await pool.query('UPDATE Contacto_Alumno SET ? WHERE idContacto = ?',[newContactoAlumno,idContacto])
    .catch(err=>{return new Promise(()=>{
            next(err)
        })
    })

    res.status(200).send();
});

router.post('/delete',async(req,res,next)=>{
    const {
        idContacto
    } = req.body;

    await pool.query(`DELETE FROM contacto_alumno WHERE idContacto = ?`,[idContacto])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    })
    res.status(200).send();
})

module.exports = router;