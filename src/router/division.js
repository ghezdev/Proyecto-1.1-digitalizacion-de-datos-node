const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de divisiones
router.get('/',async(req, res, next) =>
{
    const divisiones = await pool.query('SELECT * FROM Division')
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });

    res.json(divisiones);
});

router.get('/:idDivision',IsLoggedIn,async(req, res, next) =>
{
    const {idDivision} = req.body;
    const arrayDivision = await pool.query('SELECT * FROM Division WHERE idDivision = ?', [idDivision]);
    res.send(arrayDivision);
});


// --POST-- //

// Agregar Division
router.post('/add',async(req, res, next) =>{
    const {
        dniPreceptor,
        especialidad,
        año,
        turno,
        numDivision,
        cicloLectivo
    } = req.body;

    await pool.query('INSERT INTO Division(dniPreceptor, especialidad, año, turno, numDivision, cicloLectivo) VALUES ((SELECT dniAutoridad FROM autoridades WHERE dniAutoridad = ?),?,?,?,?,?)',[dniPreceptor,especialidad,año,turno,numDivision,cicloLectivo])
    .catch(err=>{return new Promise(()=>{
        next(err)
      })
    });
    res.status(200).send();
});


// Actualizar Division
router.post('/update',IsLoggedIn,async(req, res, next) =>
{
    const {idDivision, especialidad, año, turno, numDivision, cicloLectivo} = req.body;
    const newDivision = {
        especialidad,
        año,
        turno,
        numDivision,
        cicloLectivo
    }
    await pool.query('UPDATE Division SET ? WHERE idDivision = ?', [newDivision, idDivision]);
});

module.exports = router;