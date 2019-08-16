const router = require('express').Router();
const passport = require('passport');
const path = require('path');
const pool = require('../database');
const {IsLoggedIn, NotLoggedIn} = require('../autenticacion');

//  --GET--  //

//Pagina inicial
router.get('/',IsLoggedIn,(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../public/Privado.html'));
});

//Registrarse
router.get('/signup',NotLoggedIn,(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../public/signup.html'));
});

//Iniciar sesion
router.get('/signin',NotLoggedIn,(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../public/login.html'));
});

//cerrar sesion
router.get('/logout',IsLoggedIn,(req,res)=>{
    req.logOut();
    req.redirect('/api/');
})
//  --POST--  //

//Registrarse
router.post('/signup',passport.authenticate('local-signup',{
            successRedirect:'/api/',
            failureRedirect:'/api/signup'
}));

router.post('/signin', passport.authenticate('local-signin',{
    successRedirect:'/api/',
    failureRedirect:'/api/signin'
}));

module.exports = router;