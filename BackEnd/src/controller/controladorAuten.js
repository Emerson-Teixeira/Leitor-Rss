const bodyParser = require('body-parser');
const express = require('express')
const User = require('../models/userModel')
const router = express.Router();

router.post('/cadastro', async (req,res) =>{
    try{
        console.log(req.body)
        const user = await User.create(req.body)
        return res.send('Cadastro Realizado com Sucesso')
    }
    catch (err){
        return res.status(400).send("err")
    }
})

router.post('/login', async (req,res) =>{
    try{
        const user = await User.findOne(req.body)
        if(!user)
            throw err
        return res.send(user)
    }
    catch (err){
        return res.status(401).send("err")
    }
})

module.exports = app=> app.use('/entrar', router)