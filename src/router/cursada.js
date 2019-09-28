const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');

router.get('/completa',async(req, res, next) =>
{
    const Cursadas = await pool.query(`SELECT DivCursAutoridades.*, materia.titulo, materia.descripcion, materia.cantHoras
    FROM (
        SELECT DivisionCursada.*, Autoridades.nombre, Autoridades.apellido
        FROM (
            SELECT Cursada.*, Division.dniPreceptor, Division.especialidad, Division.año, Division.turno, Division.numDivision, Division.cicloLectivo
            FROM (
                SELECT *
                FROM cursada
            ) AS Cursada
            INNER JOIN (
                SELECT *
                FROM division
            ) AS Division
            ON Cursada.idDivision = Division.idDivision
        ) AS DivisionCursada
        INNER JOIN (
            SELECT dniAutoridad, nombre, apellido
            FROM autoridades
        ) AS Autoridades
        ON DivisionCursada.dniProfesor = Autoridades.dniAutoridad
    ) AS DivCursAutoridades
    INNER JOIN
    materia
    ON DivCursAutoridades.idMateria = materia.idMateria`)
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(Cursadas);
});

router.get('/completa/:idCursada',async(req, res, next) =>
{
    const{
        idCursada
    } = req.params;

    const Cursadas = await pool.query(`SELECT * FROM (SELECT DivCursAutoridades.*, materia.titulo, materia.descripcion, materia.cantHoras
        FROM (
            SELECT DivisionCursada.*, Autoridades.nombre, Autoridades.apellido
            FROM (
                SELECT Cursada.*, Division.dniPreceptor, Division.especialidad, Division.año, Division.turno, Division.numDivision, Division.cicloLectivo
                FROM (
                    SELECT *
                    FROM cursada
                ) AS Cursada
                INNER JOIN (
                    SELECT *
                    FROM division
                ) AS Division
                ON Cursada.idDivision = Division.idDivision
            ) AS DivisionCursada
            INNER JOIN (
                SELECT dniAutoridad, nombre, apellido
                FROM autoridades
            ) AS Autoridades
            ON DivisionCursada.dniProfesor = Autoridades.dniAutoridad
        ) AS DivCursAutoridades
        INNER JOIN
        materia
        ON DivCursAutoridades.idMateria = materia.idMateria) AS DivCursMatAutoridades
        WHERE DivCursMatAutoridades.idCursada = ?`,[idCursada])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(Cursadas);
});

router.get('/horarios/:idCursada',async(req,res,next) =>{
    const{
        idCursada
    } = req.params;

    const horarios = await pool.query('Select * FROM dia_horario WHERE idCursada = ?',[idCursada])
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(horarios);
});

router.post('/add',async(req,res,next)=>{
    const{
        idDivision,
        idMateria,
        dniProfesor,
        tomarLista
    } = req.body;

    await pool.query(`INSERT INTO cursada(idDivision, idMateria, dniProfesor, tomarLista) 
    VALUES 
    (
        (SELECT idDivision FROM division WHERE idDivision = ?),
        (SELECT idMateria FROM materia WHERE idMateria = ?),
        (SELECT dniAutoridad FROM autoridades WHERE dniAutoridad = ?),
        ?
    )`,[idDivision,idMateria,dniProfesor,tomarLista])
        .catch(err=>{return new Promise(()=>{
                next(err)
            })
        });

    res.sendStatus(200);
});
router.post('/alumno/add',async(req,res,next)=>{
    const{
        idCursada,
        dia,
        entrada,
        salida
    } = req.body;

    let entradaIso =new Date(entrada);
    let salidaIso = new Date(salida);

    let entradaDefinitiva= new Date(entradaIso.getFullYear(), entradaIso.getMonth(), entradaIso.getDate(), entradaIso.getHours() - 3, entradaIso.getMinutes(), 0).toISOString();
    let salidaDefinitiva= new Date(salidaIso.getFullYear(), salidaIso.getMonth(), salidaIso.getDate(), salidaIso.getHours() - 3, salidaIso.getMinutes(), 0).toISOString();

    await pool.query(`INSERT INTO dia_horario(idCursada, dia, entrada, salida) 
    VALUES 
    (
        (SELECT idCursada FROM cursada WHERE idCursada = ?),
        ?,
        ?,
        ?
    )`,[idCursada,dia,entradaDefinitiva,salidaDefinitiva])
        .catch(err=>{return new Promise(()=>{
                next(err)
            })
        });

    res.sendStatus(200);
});

router.post('/update',async(req,res,next) =>{
    const{
        idCursada,
        idDivision,
        idMateria,
        dniProfesor,
        tomarLista,
    } = req.body;

    const newCursada ={
        idCursada,
        idDivision,
        idMateria,
        dniProfesor,
        tomarLista,
    }

    await pool.query('UPDATE cursada SET ?',[newCursada])
    .catch(err=>{return new Promise(()=>{
        next(err)
    })
});

res.sendStatus(200);
});
module.exports = router;