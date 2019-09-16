const router = require('express').Router();
const path = require('path');
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');

//Enviar tabla autoridades
router.get('/',async (req,res,next)=>{
    const autoridades = await pool.query
    (`SELECT autoridadesActivosRoles.dniAutoridad, GROUP_CONCAT(DISTINCT autoridadesActivosRoles.idRol SEPARATOR ",") AS idRol, telefono, direccion, nombre, apellido, fechaAlta,fechaBaja, fechaNacimiento, fichaMedica
    FROM (
        SELECT autoridadesActivos.dniAutoridad, idRol, telefono, direccion, nombre, apellido, fechaNacimiento, fichaMedica 
        FROM(
            SELECT *
            FROM autoridades WHERE activo = 1) AS autoridadesActivos
        INNER JOIN (
            SELECT * FROM autoridades_roles) AS autoridadesRoles
        WHERE autoridadesActivos.dniAutoridad = autoridadesRoles.dniAutoridad) AS autoridadesActivosRoles 
        INNER JOIN (
            SELECT * FROM fechas_activo_autoridad) AS autoridadesFechas 
            WHERE autoridadesActivosRoles.dniAutoridad = autoridadesFechas.dniAutoridad
            GROUP BY dniAutoridad`)
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(autoridades);
});

router.get('/preceptores',async (req,res,next)=>{
    const autoridad = await pool.query
    (`SELECT autoridadesActivosRoles.dniAutoridad, GROUP_CONCAT(DISTINCT autoridadesActivosRoles.idRol SEPARATOR ",") AS idRol, telefono, direccion, nombre, apellido, MAX(fechaAlta)fechaAlta, fechaNacimiento, fichaMedica
    FROM (SELECT autoridadesActivos.dniAutoridad, autoridadesRoles.idRol, telefono, direccion, nombre, apellido, fechaNacimiento, fichaMedica
          FROM(
        SELECT * 
        FROM autoridades) AS autoridadesActivos
    INNER JOIN (
        SELECT * 
        FROM autoridades_roles WHERE idRol = 1) AS autoridadesRoles
    WHERE autoridadesActivos.dniAutoridad = autoridadesRoles.dniAutoridad) AS autoridadesActivosRoles
    INNER JOIN (
      SELECT * FROM fechas_activo_autoridad) AS autoridadesFechas 
      WHERE autoridadesActivosRoles.dniAutoridad = autoridadesFechas.dniAutoridad
    GROUP BY dniAutoridad`)
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(autoridad);
});

router.get('/:dniAutoridad',async(req,res,next)=>{
    const {
        dniAutoridad
    } = req.params;

    const autoridad = await pool.query
    (`SELECT *
    FROM (SELECT autoridadesActivosRoles.dniAutoridad, GROUP_CONCAT(DISTINCT autoridadesActivosRoles.idRol SEPARATOR ",") AS idRol, telefono, direccion, nombre, apellido, MAX(fechaAlta)fechaAlta, fechaNacimiento, fichaMedica
          FROM (select autoridadesActivos.dniAutoridad,autoridadesRoles.idRol , telefono, direccion, nombre, apellido, fechaNacimiento, fichaMedica FROM(
              SELECT * 
              FROM autoridades) AS autoridadesActivos
          INNER JOIN (
              SELECT * 
              FROM autoridades_roles) AS autoridadesRoles
          WHERE autoridadesActivos.dniAutoridad = autoridadesRoles.dniAutoridad) as autoridadesActivosRoles
          INNER JOIN(
              SELECT *
              FROM fechas_activo_autoridad) AS autoridadesFechas
          WHERE autoridadesActivosRoles.dniAutoridad = autoridadesFechas.dniAutoridad
          GROUP BY dniAutoridad
       ) AS A
    WHERE A.dniAutoridad = ?`,[dniAutoridad])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });

    res.json(autoridad);
})

router.get('/roles/:dniAutoridad',async (req,res,next)=>{
    const {
        dniAutoridad
    } = req.params;

    const autoridadesRoles = await pool.query('SELECT roles.idRol, rol FROM autoridades_roles INNER JOIN roles ON roles.idRol = autoridades_roles.idRol WHERE dniAutoridad = ?',[dniAutoridad])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });

    res.json(autoridadesRoles);
})

router.get('/historial/:dniAutoridad',async(req,res,next)=>{
    const {
        dniAutoridad 
    }= req.params;
    const historialAutoridad = await pool.query(`SELECT * FROM fechas_activo_autoridad WHERE dniAutoridad = ?`,[dniAutoridad])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(historialAutoridad);
});

//Recibir actualizacion de autoridad con ID
router.post('/update',async(req,res,next)=>{
    const {
        dniAutoridad,
        telefono,
        direccion,
        nombre,
        apellido,
        fechaAlta,
        fechaNacimiento,
        FichaMedica,
        cargos
    } = req.body;

    const newAutoridad ={
        dniAutoridad,
        telefono,
        direccion,
        nombre,
        apellido,
        fechaNacimiento,
        FichaMedica
    }
    await pool.query('UPDATE autoridades SET ? WHERE dniAutoridad = ?',[newAutoridad,dniAutoridad])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    })

    const fechaAltaSet={
        fechaAlta
    }
    await pool.query('UPDATE fechas_activo_autoridad SET ? WHERE dniAutoridad = ? ',[fechaAltaSet,dniAutoridad])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    })

    await pool.query('DELETE FROM autoridades_roles WHERE dniAutoridad = ?',dniAutoridad)

    cargos.forEach(async(cargo) =>{
        await pool.query('INSERT INTO autoridades_roles(dniAutoridad, idRol) VALUES ((SELECT dniAutoridad FROM autoridades WHERE dniAutoridad = ?),(SELECT idRol FROM roles WHERE idRol = ?))',[dniAutoridad,cargo.idRol])
        .catch(err=>{return new Promise(()=>{
           next(err)
           })
       })
   });
   
   res.status(200).send();
});

//Agregar una nueva autoridad
router.post('/add',async(req,res,next)=>{
    const {
        dniAutoridad,
        telefono,
        direccion,
        nombre,
        apellido,
        fechaAlta,
        fechaNacimiento,
        fichaMedica,
        cargos
    } = req.body;
    
    const newAutoridad ={
        dniAutoridad,
        telefono,
        direccion,
        nombre,
        apellido,
        fechaNacimiento,
        fichaMedica
    }

    fechasAutoridad = await pool.query('SELECT fechaBaja FROM fechas_activo_autoridad WHERE fechaBaja IS NULL AND dniAutoridad = ?',[dniAutoridad]);

    if(fechasAutoridad.length > 0){
        res.sendStatus(409); 
    }else{
        let autoridad = await pool.query('SELECT activo FROM autoridades where dniAutoridad= ?',[dniAutoridad])
        if(autoridad.length > 0){
            await pool.query('UPDATE autoridades SET activo = 1 WHERE dniAutoridad = ?',[dniAutoridad])
            .catch(err=>{return new Promise(()=>{
                next(err)
                })
            });
            await pool.query('UPDATE autoridades SET ? WHERE dniAutoridad = ?',[newAutoridad,dniAutoridad])
            .catch(err=>{return new Promise(()=>{
                next(err)
                })
            })
        }else{
            await pool.query('INSERT INTO autoridades SET ?',[newAutoridad])
            .catch(err=>{return new Promise(()=>{
                next(err)
                })
            })
        }
        await pool.query('INSERT INTO fechas_activo_autoridad(dniAutoridad,fechaAlta) VALUES((SELECT dniAutoridad FROM autoridades WHERE dniAutoridad = ?),?)',[dniAutoridad,fechaAlta])
        .catch(err=>{return new Promise(()=>{
            next(err)
            })
        })

    cargos.forEach((cargo) =>{
         pool.query('INSERT INTO autoridades_roles(dniAutoridad, idRol) VALUES ((SELECT dniAutoridad FROM autoridades WHERE dniAutoridad = ?),(SELECT idRol FROM roles WHERE idRol = ?))',[dniAutoridad,cargo.idRol])
         .catch(err=>{return new Promise(()=>{
            next(err)
            })
        })
    });
    }
    res.sendStatus(200);
})

router.post('/delete',async(req,res,next)=>{
    const {
        dniAutoridad
    } = req.body;
    let fechaActual = new Date().toISOString();

    await pool.query('UPDATE fechas_activo_autoridad SET fechaBaja = ? WHERE dniAutoridad = ?',[fechaActual,dniAutoridad])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    })

    await pool.query('UPDATE autoridades SET activo = "0" WHERE dniAutoridad = ?',[dniAutoridad])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    })

    res.status(200).send();
})

module.exports = router;