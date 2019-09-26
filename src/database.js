const mysql = require('mysql');
const {promisify} = require('util');
const {database} = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err,connection) =>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('LA CONEXION A LA BASE DE DATOS FUE CERRADA');
        }
        if(err.code ==='ER_CON_COUNT_ERROR'){
            console.error('LA BASE DE DATOS TIENE DEMASIADAS CONEXIONES');
        }
        if(err.code ==='ECONNREFUSED'){
            console.error('LA CONEXION A LA BASE DE DATOS FUE DENEGADA');
        }
    }else
    console.log('DB is Connected');

    if(connection) {connection.release();}
    return;
});

//tranforma a promesas las consultas de la pool
pool.query = promisify(pool.query);

module.exports = pool;