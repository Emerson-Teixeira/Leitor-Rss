const express = require('express')
const User = require('../models/userModel')
const fetch = require('node-fetch')
require('dotenv').config()
const router = express.Router();
var response = {
    message: '',
    error: false,
    errorLog:''
}

router.post('/cadastro', async (req,res) =>{
    setJsonResponseClear()
    try{
        const criado = await User.create(req.body)
        const { _id, email } = criado.toObject()
        response.message = 'Cadastro realizado com sucesso, verifique seu email para realizar o login'
        const urlSend = `${process.env.APP_URL}/send/${_id}/${email}`
        fetch(urlSend,{method: 'GET'})
        return res.status(200).json(response)
    }
    catch (err){
        response.message = 'Erro ao realizar cadastro'
        response.error = true,
        response.errorLog = err
        return res.status(400).json(response)
    }
})

router.post('/login', async (req,res) =>{
    setJsonResponseClear()
    try{
        const user = await User.findOne(req.body)
        if((!user))
            throw (err = 1) 
        if (!user.validacaoEmail)
            throw (err = 2)     
        const { _id } = user.toObject()
        req.session.userId = {'_id':_id}
        response.message = "Login realizado com sucesso"
        return res.json(response)
    }
    catch (err){
        if (err == 1 ){
            res.status(401).json({message: 'Usuario Não encontrado' })
        }
        
        if (err == 2 ){
            res.status(401).json({message: 'É necessario realizar a validaçao no email'})
        }
        
    }
})

router.get('/validate/:id',async (req,res)=>{
    setJsonResponseClear()
    await User.updateOne({'_id':req.params.id},{validacaoEmail: true},(err,obj)=>{
        if(err){
            response.message = 'Não foi possivel realizar a validaçao'
            response.error = true
            response.errorLog = err
            console.log(err)
            res.status(404).json(response)
        }
    })
    res.redirect("/home")
})

router.get('*',(req,res)=>res.status(404).send('what???'))

function setJsonResponseClear(){
    response.message = ""
    response.errorLog = ""
    response.error = false
}

module.exports = router