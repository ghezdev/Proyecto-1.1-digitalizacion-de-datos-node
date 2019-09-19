const router = require('express').Router();
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');

router.get('/',async(req, res, next) =>
{
    const actaCursadas = await pool.query('SELECT * FROM cursada')
    .catch(err=>{return new Promise(()=>{
        next(err)
        })
    });
    res.json(actaCursadas);
});