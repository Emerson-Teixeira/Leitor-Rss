const bodyParser = require('body-parser');
const express = require('express')
const User = require('../models/userModel')
const router = express.Router();
const jwt = require('./jwt')

router.post('/cadastro', async (req,res) =>{
    try{
        const criado = await User.create(req.body)
        const { _id } = criado.toObject()
        const token = jwt.sign({User:_id})
        return res.send(token)
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
        const { _id } = user.toObject()
        const token = jwt.sign({User:_id})
        return res.send(token)
    }
    catch (err){
        return res.status(401).send("err")
    }
})

module.exports = router