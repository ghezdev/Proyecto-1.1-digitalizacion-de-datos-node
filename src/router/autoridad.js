const router = require('express').Router();
const path = require('path');
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');

//Enviar tabla autoridades
router.get('/',async (req,res,next)=>{
    const autoridades = await pool.query
    (`SELECT autoridadesActivos.idAutoridad, GROUP_CONCAT(autoridadesRoles.idRol SEPARATOR ",") AS idRol, dni, telefono, direccion, nombre, apellido, fechaIngreso, fechaNacimiento, fichaMedica
    FROM (
    SELECT *
    FROM autoridades
    WHERE activo = true) AS autoridadesActivos 
    INNER JOIN (
    SELECT *
    FROM autoridades_roles) AS autoridadesRoles
    WHERE autoridadesActivos.idAutoridad = autoridadesRoles.idAutoridad 
    GROUP BY 1`)
    .catch(err=> next(err));
    res.json(autoridades);
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
    .catch(err=> next(err))
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
        FichaMedica,
        cargos
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
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    })

    const idAutoridadNueva = await pool.query('SELECT idAutoridad FROM autoridades WHERE dni = ?',[dni]);

    cargos.forEach((cargo) =>{
         pool.query('INSERT INTO `autoridades_roles`(`idAutoridad`, `idRol`) VALUES ((SELECT idAutoridad FROM autoridades WHERE idAutoridad = ?),(SELECT idRol FROM roles WHERE idRol = ?))',[idAutoridadNueva[0].idAutoridad,cargo.idRol])
         .catch(err=>{return new Promise(()=>{
            next(err)
            })
        })
    });

    res.status(200).send();
})

router.post('/delete',async(req,res,next)=>{
    const {
        idAutoridad
    } = req.body;

    await pool.query('UPDATE autoridades SET activo = "0" WHERE idAutoridad = ?',[idAutoridad])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    })

    res.status(200).send();
})

module.exports = router;