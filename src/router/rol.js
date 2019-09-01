const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de roles
router.get('/',async(req, res, next) =>
{
    const roles = await pool.query('SELECT * FROM Roles')
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(roles);
});


// --POST-- //

// Agregar rol
router.post('/add',async(req, res, next) =>{
    const {
        rol
    }= req.body;

    const NewRol = {
        rol
    }

    await pool.query('INSERT INTO roles SET ? ',[NewRol])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.status(200).send();
});


// Actualizar rol
router.post('/update',async (req, res, next) =>{
    const {
        idRol,
        rol
    } = req.body;

    const NewRol = {
        rol
    }
    
    await pool.query('UPDATE roles SET ? WHERE idRol = ?',[NewRol,idRol])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    })
    res.status(200).send();
});

module.exports = router;