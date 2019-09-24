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

    let entradaIso =new Date(entrada);
    let salidaIso = new Date(salida);

    let entradaDefinitiva= new Date(entradaIso.getFullYear(), entradaIso.getMonth(), entradaIso.getDate(), entradaIso.getHours() - 3, entradaIso.getMinutes(), 0).toISOString();
    let salidaDefinitiva= new Date(salidaIso.getFullYear(), salidaIso.getMonth(), salidaIso.getDate(), salidaIso.getHours() - 3, salidaIso.getMinutes(), 0).toISOString();

    const newHorario = {
        idCursada,
        dia,
        entradaDefinitiva,
        salidaDefinitiva
    }

    await pool.query('INSERT INTO Dia_Horario SET ?', [newHorario])
    .catch(err=>{return new Promise(()=>{
                next(err)
            })
        });

    res.sendStatus(200);
});


// Actualizar Dia - Horarios
router.post('/update',async(req, res, next) => 
{
    const {idHorario, dia, entrada, salida} = req.body;
    const newHorario = {
        dia,
        entrada,
        salida
    }
    await pool.query('UPDATE Dia_Horario SET ? WHERE idHorario = ?', [newHorario, idHorario]);
});

module.exports = router;