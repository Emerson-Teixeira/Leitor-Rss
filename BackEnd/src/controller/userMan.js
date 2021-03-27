const express = require('express')
const router = express.Router()
const User = require('../models/userModel')


router.get('/',async (req,res)=>{
    var usuario = await  User.findOne((req.session.userId),'nome email senha rssList createdAt' , (err, user)=> {
        if(!err){
            return user
        }
    })
    console.log(usuario)
    res.render('Configs',usuario)
})

module.exports = router