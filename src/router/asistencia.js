const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');

//GET de Asistencia + Semana de una división en un día de la semana
app.get('/ObtenerSemSistencia/:idDivision/:diaSemana', async (req,res, next)=>
{
    var consulta = "SELECT idSemana, tipo as turno, idDivision FROM Semana WHERE (Semana.idDivision = " + req.params.idDivision + " AND Semana.diaSemana = (SELECT DAYOFWEEK('" + req.params.diaSemana + "')));";
    console.log(consulta);
    pool.query(consulta,(err,rows) =>
    {
        if(err)
        {
            throw err;
        }
        res.json(rows);
    })
});

//POST de asistencia

router.post('/add', async (req,res, next)=>
{
    var sql = "INSERT INTO Proyecto1_2.Asistencia (dniAlumno, idSemana, valor, fecha) VALUES (" + req.body.dniAlumno + "," + req.body.idSemana + ",'" + req.body.valor + "','"+ req.body.fecha +"');";
    pool.query(sql, (err,res)=>{
        if(err) throw err;
        console.log("I'm in");
    });
    res.sendFile(__dirname + "/vistas/exito.html");
});


module.exports = router;