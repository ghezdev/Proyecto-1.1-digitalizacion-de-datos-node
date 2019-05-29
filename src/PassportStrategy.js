const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

 const pool = require('./database');
const helpers = require('./helpers');

 //Estrategia local de inicio de sesion
passport.use('local-signin', new LocalStrategy({
    usernameField:'username',
    passwordField:'password'
}, async(username,password,done) =>{
    const usuarios = await pool.query('SELECT * FROM usuarios WHERE username = ?',[username]);
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
    passwordField:'password'
},async(username,password,done)=>{
    const newUser = {
        username,
        password
    }
    newUser.password = await helpers.encryptPassword(password);
    const user = await pool.query('INSERT INTO usuarios SET ?',[newUser]);
    newUser.id = user.insertID;
    return done(null,newUser);
}));

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser(async(id,done)=>{
    const usuario = pool.query('SELECT * FROM usuarios WHERE id = ?',[id]);
    done(null,usuario[0]);
});