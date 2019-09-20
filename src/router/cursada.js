const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');

router.get('/completa',async(req, res, next) =>
{
    const actaCursadas = await pool.query(`SELECT DivCursAutoridades.*, materia.titulo, materia.descripcion, materia.cantHoras
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
    res.json(actaCursadas);
});

router.post('/add',async(req,res,next)=>{
    const{
        idDivision,
        idMateria,
        dniProfesor,
        tomarLista,
        dia,
        entrada,
        salida
    } = req.body;

    let entradaIso =new Date(entrada);
    let salidaIso = new Date(salida);

    let entradaDefinitiva= new Date(entradaIso.getFullYear(), entradaIso.getMonth(), entradaIso.getDate(), entradaIso.getHours() - 3, entradaIso.getMinutes(), 0).toISOString();
    let salidaDefinitiva= new Date(salidaIso.getFullYear(), salidaIso.getMonth(), salidaIso.getDate(), salidaIso.getHours() - 3, salidaIso.getMinutes(), 0).toISOString();

    await pool.query(`INSERT INTO cursada(idDivision, idMateria, dniProfesor, tomarLista, dia, entrada,salida) 
    VALUES 
    (
        (SELECT idDivision FROM division WHERE idDivision = ?),
        (SELECT idMateria FROM materia WHERE idMateria = ?),
        (SELECT dniAutoridad FROM autoridades WHERE dniAutoridad = ?),
        ?,
        ?,
        ?,
        ?
    )`,[idDivision,idMateria,dniProfesor,tomarLista,dia,entradaDefinitiva,salidaDefinitiva])
        .catch(err=>{return new Promise(()=>{
                next(err)
            })
        });

    res.sendStatus(200);
});

module.exports = router;