const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

//enviar planes de estudio
router.get('/',IsLoggedIn,async(req, res, next) =>{
    const planEstudio = await pool.query('SELECT * FROM Plan_Estudio')
    .catch(err => next(err));
});

//enviar plan estudio con resolucion
router.get('/:resolucion',IsLoggedIn,async(req, res, next) =>{
    const {resolucion} = req.params;
    const planEstudio = await pool.query('SELECT * FROM Plan_Estudio WHERE resolucion = ?',[resolucion])
    .catch(err => next(err));
});

// --POST-- //

// Agregar Plan de estudio
router.post('/add',IsLoggedIn,async(req, res, next) =>{
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
    .catch(err=>next(err));
});


// Actualizar Plan de estudio
router.post('/update',IsLoggedIn,async(req, res, next) => {
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
    .catch(err=>next(err));
});

module.exports = router;