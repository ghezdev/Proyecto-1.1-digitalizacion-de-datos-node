const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

//enviar planes de estudio
router.get('/',async(req, res, next) =>{
    const planEstudio = await pool.query('SELECT * FROM Plan_Estudio')
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });

    res.json(planEstudio);
});

//enviar plan estudio con resolucion
router.get('/:resolucion',async(req, res, next) =>{
    const {resolucion} = req.params;
    const planEstudio = await pool.query('SELECT * FROM Plan_Estudio WHERE resolucion = ?',[resolucion])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });

    res.json(planEstudio);
});

// --POST-- //

// Agregar Plan de estudio
router.post('/add',async(req, res, next) =>{
    const {
        resolucion,
        descripcion,
        vigenciaDesde,
        vigenciaHasta
    } = req.body;

    const newPlandeEstudios = {
        resolucion,
        descripcion,
        vigenciaDesde,
        vigenciaHasta
    }
    await pool.query('INSERT INTO Plan_Estudio SET ? ',[newPlandeEstudios])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.sendStatus(200);
});


// Actualizar Plan de estudio
router.post('/update',async(req, res, next) => {
    const {
        resolucion,
        descripcion,
        vigenciaDesde,
        vigenciaHasta
    } = req.body;

    const newPlandeEstudios = {
        resolucion,
        descripcion,
        vigenciaDesde,
        vigenciaHasta
    }
    await pool.query('UPDATE Plan_Estudio SET ? ',[newPlandeEstudios])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.sendStatus(200);
});

module.exports = router;