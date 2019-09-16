const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');

//  --GET--  //

//enviar tabla Alumno
router.get('/',async(req,res,next)=>{
    const alumnos = await pool.query(`SELECT Alumno.dniAlumno,Alumno.telefono,Alumno.direccion,Alumno.nombre,Alumno.apellido,Alumno.repetidor,Alumno.fechaNacimiento,Alumno.activo,MAX(fechaAlta)fechaAlta FROM (SELECT * FROM alumno WHERE activo = 1)AS alumno INNER JOIN (SELECT dniAlumno,fechaAlta FROM fechas_activo_alumno) AS AlumnoFA WHERE alumno.dniAlumno = AlumnoFA.dniAlumno GROUP BY dniAlumno`)
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
    const alumno = await pool.query(`SELECT Alumno.dniAlumno,Alumno.telefono,Alumno.direccion,Alumno.nombre,Alumno.apellido,Alumno.repetidor,Alumno.fechaNacimiento,Alumno.activo,MAX(fechas_activo_alumno.fechaAlta)fechaAlta FROM alumno AS alumno INNER JOIN fechas_activo_alumno WHERE alumno.dniAlumno = fechas_activo_alumno.dniAlumno AND alumno.dniAlumno = ?`,[dniAlumno])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(alumno);
});

router.get('/historial/:dniAlumno',async(req,res,next)=>{
    const {
        dniAlumno 
    }= req.params;
    const historialAlumno = await pool.query(`SELECT * FROM fechas_activo_alumno WHERE dniAlumno = ?`,[dniAlumno])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(historialAlumno);
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
        fechaAlta
    } = req.body;

    const newAlumno={
        dniAlumno,
        telefono,
        direccion,
        nombre,
        apellido,
        repetidor,
        fechaNacimiento,
    }

    let fechasAlumno = await pool.query('SELECT fechaBaja FROM fechas_activo_alumno WHERE fechaBaja IS NULL AND dniAlumno = ?',[dniAlumno]);

    if(fechasAlumno.length > 0){
        res.sendStatus(409);
    }else{
        let alumno = await pool.query('SELECT activo FROM alumno where dniAlumno = ?',[dniAlumno])
        if(alumno.length > 0){
            await pool.query('UPDATE alumno SET activo = 1 WHERE dniAlumno = ?',[dniAlumno])
            .catch(err=>{return new Promise(()=>{
                next(err)
                })
            });
            await pool.query('UPDATE alumno SET ?',[newAlumno])
                .catch(err=>{return new Promise(()=>{
                next(err)
                })
            });
        }else{
            await pool.query('INSERT INTO alumno SET ?',[newAlumno])
            .catch(err=>{return new Promise(()=>{
                next(err)
                })
            });
        }
        await pool.query('INSERT INTO fechas_activo_alumno(dniAlumno,fechaAlta) VALUES((SELECT dniAlumno FROM alumno WHERE dniAlumno = ?),?)',[dniAlumno,fechaAlta])
            .catch(err=>{return new Promise(()=>{
                next(err)
                })
            })
    }
    res.sendStatus(200);
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
        fechaAlta
    } = req.body;

    const newAlumno={
        dniAlumno,
        telefono,
        direccion,
        nombre,
        apellido,
        repetidor,
        fechaNacimiento
    }
    
    await pool.query('UPDATE alumno SET ?',[newAlumno])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });

    const fechaAltaSet={
        dniAlumno,
        fechaAlta
    }

    await pool.query('UPDATE fechas_activo_alumno SET ?',[fechaAltaSet])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    })

    res.sendStatus(200);
});

router.post('/delete',async(req,res,next)=>{
    const {
        dniAlumno
    } = req.body;

    let fechaActual = new Date().toISOString();

    let index = await pool.query('SELECT idFecha FROM fechas_activo_alumno WHERE fechaBaja IS NULL AND dniAlumno = ?',[dniAlumno]);

    await pool.query('UPDATE fechas_activo_alumno SET fechaBaja=? WHERE idFecha = ?',[fechaActual,index[0].idFecha])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    })

    await pool.query('UPDATE alumno SET activo = "0" WHERE dniAlumno = ?',[dniAlumno])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    })

    res.status(200).send();
})

module.exports = router;