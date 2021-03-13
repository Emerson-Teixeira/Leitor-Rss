const express = require('express')
const User = require('../models/userModel')
const router = express.Router();

router.post('/cadastro', async (req,res) =>{
    try{
        const criado = await User.create(req.body)
        const { _id } = criado.toObject()
        req.session.userId = {'_id':_id}
        return res.send('ok')
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
        req.session.userId = {'_id':_id}
        return res.send('ok')
    }
    catch (err){
        return res.status(401).send("err")
    }
})

router.get('*',(req,res)=>res.status(404).send('what???'))

module.exports = router