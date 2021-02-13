const express = require('express')
const User = require('../models/userModel')
const router = express.Router();

router.post('/cadastro', async (req,res) =>{
    try{
        const user = await User.create(req.body)
        return res.send({user})
    }
    catch (err){
        return res.status(400).send("err")
    }
})

module.exports = app=> app.use('/login', router)