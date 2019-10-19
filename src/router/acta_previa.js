const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');


// --GET-- //

// Leer lista de materia
router.get('/',async(req, res, next) =>
{
    const actaPrevias = await pool.query(`
    SELECT AlumInscripcion_ProfActa_Previa.*, Materia_Acta_Previa.idMateria, Materia_Acta_Previa.situacion, Materia_Acta_Previa.fechaCierre, Materia_Acta_Previa.turno, Materia_Acta_Previa.titulo
FROM (
	SELECT Alumno_Inscripcion_Previa.*, NombreAutoridad, ApellidoAutoridad, Profe_Acta_Previa.dniAutoridad
	FROM (
		SELECT (Alumno.nombre) AS NombreAlumno, (Alumno.apellido) AS ApellidoAlumno, Inscripcion_Previa.*
		FROM Alumno
		INNER JOIN Inscripcion_Previa
		ON Alumno.dniAlumno = Inscripcion_Previa.dniAlumno
	) AS Alumno_Inscripcion_Previa
	INNER JOIN (
		SELECT (Autoridades.nombre) AS NombreAutoridad, (Autoridades.apellido) AS ApellidoAutoridad, Profesores_Acta_Previa.*
		FROM Autoridades
		INNER JOIN Profesores_Acta_Previa
		ON Autoridades.dniAutoridad = Profesores_Acta_Previa.dniAutoridad
	) AS Profe_Acta_Previa
	ON Alumno_Inscripcion_Previa.idActa = Profe_Acta_Previa.idActa
) AS AlumInscripcion_ProfActa_Previa
INNER JOIN (
	SELECT Materia.titulo, Acta_Previa.*
	FROM Materia
	INNER JOIN Acta_Previa
	ON Materia.idMateria = Acta_Previa.idMateria
) AS Materia_Acta_Previa
ON AlumInscripcion_ProfActa_Previa.idActa = Materia_Acta_Previa.idActa`)
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });

    res.json(actaPrevias);
});

router.get('/:idActa',async(req, res, next) =>
{
    const {idActa} = req.params;
    const arrayActaPrevia = await pool.query( `
    SELECT AlumInscripcion_ProfActa_Previa.*, Materia_Acta_Previa.idMateria, Materia_Acta_Previa.situacion, Materia_Acta_Previa.fechaCierre, Materia_Acta_Previa.turno, Materia_Acta_Previa.titulo
    FROM (
      SELECT Alumno_Inscripcion_Previa.*, NombreAutoridad, ApellidoAutoridad, Profe_Acta_Previa.dniAutoridad
      FROM (
        SELECT (Alumno.nombre) AS NombreAlumno, (Alumno.apellido) AS ApellidoAlumno, Inscripcion_Previa.*
        FROM Alumno
        INNER JOIN Inscripcion_Previa
        ON Alumno.dniAlumno = Inscripcion_Previa.dniAlumno
      ) AS Alumno_Inscripcion_Previa
      INNER JOIN (
        SELECT (Autoridades.nombre) AS NombreAutoridad, (Autoridades.apellido) AS ApellidoAutoridad, Profesores_Acta_Previa.*
        FROM Autoridades
        INNER JOIN Profesores_Acta_Previa
        ON Autoridades.dniAutoridad = Profesores_Acta_Previa.dniAutoridad
      ) AS Profe_Acta_Previa
      ON Alumno_Inscripcion_Previa.idActa = Profe_Acta_Previa.idActa
    ) AS AlumInscripcion_ProfActa_Previa
    INNER JOIN (
      SELECT Materia.titulo, Acta_Previa.*
      FROM Materia
      INNER JOIN Acta_Previa
      ON Materia.idMateria = Acta_Previa.idMateria
    ) AS Materia_Acta_Previa
    ON AlumInscripcion_ProfActa_Previa.idActa = Materia_Acta_Previa.idActa
    WHERE AlumInscripcion_ProfActa_Previa.idActa = ?`,[idActa])
    .catch(err=>{return new Promise(()=>{
      next(err)
      })
  });
  res.json(arrayActaPrevia);
});


// --POST-- //

// Agregar Acta previa
router.post('/add',async(req, res, next) =>
{
    const {
      idMateria,
      dniAlumno,
      dniAutoridad,
      situacion,
      turno
    } = req.body;
    const newActaPrevia = {
      idMateria,
      situacion,
      turno
    }
    const {insertId} = await pool.query('INSERT INTO acta_previa SET ?', [newActaPrevia])
    .catch(err=>{return new Promise(()=>{
        next(err)
      })
    });

    await pool.query('INSERT INTO inscripcion_previa SET ?', [{idActa:insertId,dniAlumno}])
    .catch(err=>{return new Promise(()=>{
        next(err)
      })
    });
    await pool.query('INSERT INTO profesores_acta_previa SET ?', [{idActa:insertId,dniAutoridad}])
    .catch(err=>{return new Promise(()=>{
        next(err)
      })
    });

    res.sendStatus(200);
});


// Actualizar Acta previa
router.post('/update',async(req, res, next) =>
{
    const {
      idActa, 
      idMateria,
      situacion,
      turno
    } = req.body;
    const newActaPrevia = {
      idActa,
      idMateria,
      situacion,
      turno
    }
    await pool.query('UPDATE acta_previa SET ?', [newActaPrevia])
    .catch(err=>{return new Promise(()=>{
        console.log("Error 1")
        console.log(err)
        next(err)
      })
    });

    res.sendStatus(200);
});

module.exports = router;