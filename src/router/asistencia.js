const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');

//GET de todas las asistencias de un curso. Sino tomaría demasiado tiempo, qué carajo te pasa salame.
router.get('/:idDivision', async (req,res,next)=>
{
    var consulta = 'SELECT Asistencia.idAsistencia, AsistAlum.dniAlumno as DNI, AsistAlum.nombre AS Nombre, AsistAlum.apellido AS Apellido, valor AS Valor,DATE_FORMAT(fecha, "%Y-%m-%d") AS Fecha FROM Asistencia JOIN (SELECT `alumno`.dniAlumno, `alumno`.nombre, `alumno`.apellido, `historial_alumno`.idDivision FROM `alumno` JOIN `historial_alumno` WHERE `alumno`.dniAlumno = `historial_alumno`.dniAlumno AND historial_alumno.idDivision = ' + req.params.idDivision + ') AS AsistAlum WHERE Asistencia.dniAlumno = AsistAlum.dniAlumno';
    const asistencia = await pool.query(consulta)
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(asistencia);
});

router.get('/:idDivision/:fechaP', async (req,res,next)=>
{
    var consulta = 'SELECT * FROM (SELECT Asistencia.idAsistencia, AsistAlum.dniAlumno as DNI, AsistAlum.nombre AS Nombre, AsistAlum.apellido AS Apellido, valor AS Valor,DATE_FORMAT(fecha, "%Y-%m-%d") AS Fecha, idSemana FROM Asistencia JOIN (SELECT `alumno`.dniAlumno, `alumno`.nombre, `alumno`.apellido, `historial_alumno`.idDivision FROM `alumno` JOIN `historial_alumno` WHERE `alumno`.dniAlumno = `historial_alumno`.dniAlumno AND historial_alumno.idDivision = ' + req.params.idDivision +') AS AsistAlum WHERE Asistencia.dniAlumno = AsistAlum.dniAlumno) AS AsistAlumFecha WHERE AsistAlumFecha.Fecha = "' + req.params.fechaP +'";';
    const asistencia = await pool.query(consulta)
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(asistencia);
});



//GET de Semana de una división en un día de la semana
router.get('/turnos/:idDivision/:diaSemana', async (req,res, next)=>
{
    var consulta = "SELECT idSemana, tipo as turno, idDivision FROM Semana WHERE (semana.idDivision = " + req.params.idDivision + " AND semana.diaSemana = (SELECT DAYOFWEEK('" + req.params.diaSemana + "')));";
    const turnos = await pool.query(consulta)
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(turnos);
});

//UPDATE de Asistencia
router.post('/update',async(req,res, next)=>
{
    var consulta = "UPDATE Asistencia SET valor = '" + req.body[1]+ "' WHERE Asistencia.idAsistencia= " + req.body[0]+ ";";
    console.log(consulta);

    await pool.query(consulta, [req.body], (err,resultado)=>{
        if(err) throw err;
        else
        {
            res.sendStatus(200);
        }
    });
});


//POST de asistencia

router.post('/add', async (req,res, next)=>
{
    var prueba = await pool.query('SELECT * FROM Asistencia WHERE fecha = "' + req.body[0][1] + '" AND idSemana = ' + req.body[0][2]);
    if(prueba.length > 0)
    {
        res.sendStatus(409);
    }
    else
    {
        var sql = "INSERT INTO Asistencia (dniAlumno, fecha, idSemana, valor) VALUES ?";;
        await pool.query(sql, [req.body], (err,resultado)=>{
            if(err) throw err;
            else
            {
                res.sendStatus(200);
            }
        });
    }
});


module.exports = router;