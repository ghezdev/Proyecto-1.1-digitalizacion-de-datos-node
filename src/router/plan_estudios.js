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

router.get('/resoluciones',async(req, res, next) =>{
    const resoluciones = await pool.query('SELECT resolucion FROM Plan_Estudio')
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });

    res.json(resoluciones);
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
        vigenciaDesde
    } = req.body;

    const newPlandeEstudios = {
        resolucion,
        descripcion,
        vigenciaDesde
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
        vigenciaDesde
    } = req.body;

    console.log(resolucion);
    const newPlandeEstudios = {
        resolucion,
        descripcion,
        vigenciaDesde
    }
    await pool.query('UPDATE Plan_Estudio SET ? WHERE resolucion = ?',[newPlandeEstudios, resolucion])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.sendStatus(200);
});

router.post('/down',async(req, res, next) => {

    const {resolucion} = req.body;

    let fechaActual = new Date().toISOString();

    await pool.query('UPDATE Plan_Estudio SET vigenciaHasta = ? WHERE resolucion = ? ', [fechaActual, resolucion])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });

    res.sendStatus(200);
});

module.exports = router;