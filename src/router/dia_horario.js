const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de Dia - Horarios
router.get('/',async(req, res, next) =>
{
    const diaHorarios = await pool.query('SELECT * FROM Dia_Horario')
    .catch(err => next(err));
    res.status(200).send({diaHorarios});
});

router.get('/:idHorario',IsLoggedIn,async(req, res, next) => 
{
    const {idHorario} = req.body;
    const arrayHorario = await pool.query('SELECT * FROM Dia_Horario WHERE idHorario = ?', [idHorario]);
    res.send(arrayHorario);
});


// --POST-- //

// Agregar Dia - Horarios
router.post('/add',async(req, res, next) =>
{
    const {
        idCursada,
        dia,
        entrada,
        salida
    } = req.body;

    let entradaInicio = entrada.slice(0,2);
    let entradaFin = entrada.slice(3,5);

    let salidaInicio = salida.slice(0,2);
    let salidaFin = salida.slice(3,5);

    let entradaDefinitiva =new Date(0,0,0,entradaInicio,entradaFin);
    let salidaDefinitiva = new Date(0,0,0,salidaInicio,salidaFin);

    const newHorario = {
        idCursada,
        dia,
        entrada:entradaDefinitiva,
        salida:salidaDefinitiva
    }

    await pool.query('INSERT INTO Dia_Horario SET ?', [newHorario])
    .catch(err=>{return new Promise(()=>{
        console.log(err)
        next(err)
        })
    });

    res.sendStatus(200);
});


// Actualizar Dia - Horarios
router.post('/delete',async(req, res, next) => 
{
    const {
        idHorario
    } = req.body;
    
    await pool.query('DELETE FROM Dia_Horario WHERE idHorario = ?', [idHorario])
    .catch(err=>{return new Promise(()=>{
        console.log(err)
        next(err)
        })
    });

    res.sendStatus(200);
});

module.exports = router;