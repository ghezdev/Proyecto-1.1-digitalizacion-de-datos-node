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
    if(typeof(usuarios) != 'undefined'){
        const user = usuarios[0];
        const validPassword = await helpers.matchPassword(password,user.password);
        if(validPassword){
            done(null,user.idAutoridad);
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
    const userArray = await pool.query('SELECT * FROM autoridades WHERE idAutoridad = ?',[idAutoridad]);
    const user = userArray[0];

    //Si el usuario ya está registrado
    if(user.password){
        return done(null,false);
    }
    
    const newPassword = await helpers.encryptPassword(password);
    user.username = username;
    user.password = newPassword;
    await pool.query('UPDATE autoridades SET ? WHERE idAutoridad = ?',[user,idAutoridad]);
    return done(null,user);
}));

passport.serializeUser((idAutoridad,done)=>{
    done(null,idAutoridad);
});

passport.deserializeUser(async(idAutoridad,done)=>{
    const usuario = await pool.query('SELECT * FROM autoridades WHERE idAutoridad = ?',[idAutoridad]);
    done(null,usuario[0]);
});