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

router.get('/:idDivision',async(req, res, next) =>
{
    const {idDivision} = req.params;
    const Division = await pool.query('SELECT * FROM Division WHERE idDivision = ?', [idDivision])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(Division);
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

    if(dniPreceptor){
        await pool.query('INSERT INTO Division(dniPreceptor, especialidad, año, turno, numDivision, cicloLectivo) VALUES ((SELECT dniAutoridad FROM autoridades WHERE dniAutoridad = ?),?,?,?,?,?)',[dniPreceptor,especialidad,año,turno,numDivision,cicloLectivo])
        .catch(err=>{return new Promise(()=>{
            next(err)
        })
        });
    }else{
        await pool.query('INSERT INTO Division(especialidad, año, turno, numDivision, cicloLectivo) VALUES (?,?,?,?,?)',[especialidad,año,turno,numDivision,cicloLectivo])
        .catch(err=>{return new Promise(()=>{
            next(err)
        })
        });
    }
    
    res.status(200).send();
});

router.post('/delete',async(req,res,next) =>{
    const {
        idDivision
    } = req.body;
});

// Actualizar Division
router.post('/update',async(req, res, next) =>
{
    const {idDivision, especialidad, año, turno, numDivision, cicloLectivo,dniPreceptor} = req.body;
    const newDivisionPreceptor = {
        especialidad,
        año,
        turno,
        numDivision,
        cicloLectivo,
        dniPreceptor
    }
    const newDivision = {
        especialidad,
        año,
        turno,
        numDivision,
        cicloLectivo,
    }

    if(dniPreceptor){
        await pool.query('UPDATE division SET ? WHERE idDivision = ?', [newDivisionPreceptor, idDivision])
        .catch(err=>{return new Promise(()=>{
            next(err)
            })
        });
    }else{
        await pool.query('UPDATE division SET ? WHERE idDivision = ?', [newDivision, idDivision])
        .catch(err=>{return new Promise(()=>{
            next(err)
            })
        });
    }

    
  res.status(200).send();
});

module.exports = router;