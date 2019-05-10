const router = require('express').Router();

router.get('/',(req,res)=>{
    res.send('Api index');
});

module.exports = router;