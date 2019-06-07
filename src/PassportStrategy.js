const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('./database');
const helpers = require('./helpers');

 //Estrategia local de inicio de sesion
passport.use('local-signin', new LocalStrategy({
    usernameField:'username',
    passwordField:'password'
}, async(username,password,done) =>{
    const usuarios = await pool.query('SELECT * FROM autoridades WHERE username = ?',[username]);
    if(usuarios.length > 0){
        const user = usuarios[0];
        const validPassword = await helpers.matchPassword(password,user.password);
        if(validPassword){
            done(null,user);
        }else{
            done(null,false);
        }
    }else{
        done(null,false);
    }
}));

//Estrategia local de registro
passport.use('local-signup', new LocalStrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback: true
},async(req,username,password,done)=>{
    const {idAutoridad} = req.body;
    const user = await pool.query('SELECT * FROM autoridades WHERE idAutoridad = ?',[idAutoridad]);
    const userObject = user[0];
    const newPassword = await helpers.encryptPassword(password);
    userObject.username = username;
    userObject.password = newPassword;
    await pool.query('UPDATE autoridades SET ? WHERE idAutoridad = ?',[userObject,idAutoridad]);
    return done(null,userObject);
}));

passport.serializeUser((user,done)=>{
    done(null,user.idAutoridad);
});

passport.deserializeUser(async(idAutoridad,done)=>{
    const usuario = pool.query('SELECT * FROM autoridades WHERE idAutoridad = ?',[idAutoridad]);
    done(null,usuario[0]);
});