const express = require('express')
const router = express.Router();

router.get('/',(req,res)=>{
    res.render('Home')
})
router.get('*',(req,res)=>res.status(404).send('what???'))

module.exports = router