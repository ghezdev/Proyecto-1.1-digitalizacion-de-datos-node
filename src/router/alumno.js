const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');

//  --GET--  //

//enviar tabla Alumno
router.get('/',async(req,res,next)=>{
    const alumnos = await pool.query(`SELECT * FROM alumno WHERE activo = 1`)
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(alumnos);
});

router.get('/:dniAlumno',async(req,res,next)=>{
    const {
        dniAlumno 
    }= req.params;
    const alumno = await pool.query(`SELECT * FROM alumno WHERE dniAlumno = ?`,[dniAlumno])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(alumno);
});

//  --POST--  //

//Agregar Alumno
router.post('/add',async (req,res,next)=>{
    const {
        dniAlumno,
        telefono,
        direccion,
        nombre,
        apellido,
        repetidor,
        fechaNacimiento,
        fechaIngreso
    } = req.body;

    const newAlumno={
        dniAlumno,
        telefono,
        direccion,
        nombre,
        apellido,
        repetidor,
        fechaNacimiento,
        fechaIngreso
    }
    await pool.query('INSERT INTO alumno SET ?',[newAlumno])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.status(200).send();
});

//Actualizar Alumno
router.post('/update',async(req,res,next)=>{
    const {
        dniAlumno,
        telefono,
        direccion,
        nombre,
        apellido,
        repetidor,
        fechaNacimiento,
        fechaIngreso
    } = req.body;

    const newAlumno={
        dniAlumno,
        telefono,
        direccion,
        nombre,
        apellido,
        repetidor,
        fechaNacimiento,
        fechaIngreso
    }
    await pool.query('UPDATE alumno SET ?',[newAlumno])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.status(200).send();
});

router.post('/delete',async(req,res,next)=>{
    const {
        dniAlumno
    } = req.body;

    await pool.query('UPDATE alumno SET activo = "0" WHERE dniAlumno = ?',[dniAlumno])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    })

    res.status(200).send();
})

module.exports = router;