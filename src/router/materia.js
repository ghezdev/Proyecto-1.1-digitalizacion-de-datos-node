const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de materia
router.get('/',async(req, res, next) =>
{
    const materias = await pool.query('SELECT * FROM Materia')
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(materias);
});

router.get('/PlanMateria',async(req, res, next) =>
{
    const materias = await pool.query('SELECT materia.idMateria,titulo,descripcion,cantHoras,resolucion FROM Materia INNER JOIN plan_materia WHERE Materia.idMateria = plan_materia.idMateria')
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(materias);
});

router.get('/:idMateria',async(req, res, next) =>
{
    const {
        idMateria
    } = req.params;
    const materia = await pool.query('SELECT * FROM Materia WHERE idMateria = ?',[idMateria])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(materia);
});

// router.get('/plan_Materia/:resolucion',async(req, res, next) =>
// {
//     const {
//         resolucion
//     } = req.params;
//     const ResolucionMateria = await pool.query('SELECT * FROM plan_materia WHERE resolucion = ?',[resolucion])
//     .catch(err=>{return new Promise(()=>{
//         next(err)
//         })
//     });
//     res.json(ResolucionMateria);
// });

router.get('/plan_Materia/Resolucion/:idMateria',async(req, res, next) =>
{
    const {
        idMateria
    } = req.params;
    const resolucion = await pool.query('SELECT resolucion FROM plan_materia WHERE idMateria = ?', [idMateria]);
    res.json(resolucion);
});


// --POST-- //

// Agregar materia
router.post('/add',async(req, res, next) =>
{
    const {
        titulo, 
        descripcion, 
        cantHoras,
        resoluciones
    } = req.body;

    const newMateria = {
        titulo,
        descripcion,
        cantHoras
    }
    await pool.query('INSERT INTO Materia SET ?',[newMateria])
    .then((res)=>{
        resoluciones.forEach((resolucion) => {
            pool.query('INSERT INTO plan_materia(resolucion, idMateria) VALUES ((SELECT resolucion FROM plan_estudio WHERE resolucion = ?),(SELECT idMateria FROM materia WHERE idMateria = ?))', [resolucion.resolucion, res.insertId])
            .catch(err=>{return new Promise(()=>{
              next(err)
              })
            });
        });
    })
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.sendStatus(200);
});


// Actualizar materia
router.post('/update',async(req, res, next) =>
{
    const {
        idMateria,
        titulo, 
        descripcion, 
        cantHoras,
        resoluciones
    } = req.body;
    const newMateria = {
        titulo,
        descripcion,
        cantHoras,
    }
    await pool.query('UPDATE Materia SET ? WHERE idMateria = ?', [newMateria, idMateria])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    
    await pool.query('DELETE FROM plan_materia WHERE idMateria = ?', [idMateria])
    .then(()=>{
      resoluciones.forEach(async (resolucion) => {
        await pool.query('INSERT INTO plan_materia(resolucion, idMateria) VALUES ((SELECT resolucion FROM plan_estudio WHERE resolucion = ?),(SELECT idMateria FROM materia WHERE idMateria = ?))', [resolucion.resolucion, idMateria])
        .catch(err=>{return new Promise(()=>{
          next(err)
          })
        });
      });
    })
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });

    res.sendStatus(200);
});


module.exports = router;