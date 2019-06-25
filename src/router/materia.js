const router = require('express').Router();
const pool = require('../database');
const {isLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de materia
router.get('/',IsLoggedIn,async(req, res, next) =>
{
    const materias = await pool.query('SELECT * FROM Materia')
    .catch(err => next(err));
    res.status(200).send({materias});
});

router.get('/:idMateria',IsLoggedIn,async(req, res, next) =>
{
    const {idMateria} = req.body;
    const materiaArray = await pool.query('SELECT * FROM Materia WHERE idMateria = ?', [idMateria]);
    res.send(materiaArray);
});


// --POST-- //

// Agregar materia
router.post('/add',IsLoggedIn,async(req, res, next) =>
{
    const {titulo, descripcion, cantHoras} = req.body;
    const newMateria = {
        titulo,
        descripcion,
        cantHoras
    }
    await pool.query('INSERT INTO Materia SET ?',[newActaCursada]);
});


// Actualizar materia
router.post('/update',IsLoggedIn,async(req, res, next) =>
{
    const {idMateria, titulo, descripcion, cantHoras} = req.body;
    const newMateria = {
        titulo,
        descripcion,
        cantHoras
    }
    await pool.query('UPDATE Materia SET ? WHERE idMateria = ?', [newMateria, idMateria]);
});


module.exports = router;