const router = require('express').Router();
const path = require('path');
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');

//Enviar tabla autoridades
router.get('/',async (req,res,next)=>{
    const autoridades = await pool.query
    (`SELECT autoridadesActivos.dniAutoridad, GROUP_CONCAT(autoridadesRoles.idRol SEPARATOR ",") AS idRol, telefono, direccion, nombre, apellido, fechaIngreso, fechaNacimiento, fichaMedica
    FROM (
    SELECT *
    FROM autoridades
    WHERE activo = 1) AS autoridadesActivos 
    INNER JOIN (
    SELECT *
    FROM autoridades_roles) AS autoridadesRoles
    WHERE autoridadesActivos.dniAutoridad = autoridadesRoles.dniAutoridad 
    GROUP BY 1`)
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(autoridades);
});

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

//Recibir actualizacion de autoridad con ID
router.post('/update',async(req,res,next)=>{
    const {
        dniAutoridad,
        telefono,
        direccion,
        nombre,
        apellido,
        fechaIngreso,
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
        fechaIngreso,
        fechaNacimiento,
        FichaMedica
    }
    await pool.query('UPDATE autoridades SET ? WHERE dniAutoridad = ?',[newAutoridad,dniAutoridad])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    })

    await pool.query('DELETE FROM autoridades_roles WHERE dniAutoridad = ?',dniAutoridad)

    cargos.forEach((cargo) =>{
        pool.query('INSERT INTO autoridades_roles(dniAutoridad, idRol) VALUES ((SELECT dniAutoridad FROM autoridades WHERE dniAutoridad = ?),(SELECT idRol FROM roles WHERE idRol = ?))',[dniAutoridad,cargo.idRol])
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
        fechaIngreso,
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
        fechaIngreso,
        fechaNacimiento,
        FichaMedica
    }

    await pool.query('INSERT INTO autoridades SET ?',[newAutoridad])
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

    res.status(200).send();
})

router.post('/delete',async(req,res,next)=>{
    const {
        dniAutoridad
    } = req.body;

    await pool.query('UPDATE autoridades SET activo = "0" WHERE dniAutoridad = ?',[dniAutoridad])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    })

    res.status(200).send();
})

module.exports = router;