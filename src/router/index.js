const router = require('express').Router();
const passport = require('passport');
const {isLoggedIn, NotLoggedIn} = require('../autenticacion');

//  --GET--  //

//Pagina inicial
router.get('/',(req,res,next)=>{
    res.send('Api index');
    res.end();
});

//Registrarse
router.get('/signup',NotLoggedIn,(req,res,next)=>{
    res.send('Signup');
    res.end();
});

//Iniciar sesion
router.get('/signin',NotLoggedIn,(req,res,next)=>{
    res.send('signin');
    res.end();
});

//cerrar sesion
router.get('/logout',isLoggedIn,(req,res)=>{
    req.logOut();
    req.redirect('/api/');
})
//  --POST--  //

//Registrarse
router.post('/signup', passport.authenticate('local-signup',{
    successRedirect:'/api/',
    failureRedirect:'/api/signup'
}));

router.post('/signin', passport.authenticate('local-signin',{
    successRedirect:'/api/',
    failureRedirect:'/api/signin'
}));

module.exports = router;