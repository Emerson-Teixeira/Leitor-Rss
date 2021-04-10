const express = require('express')
require('dotenv').config()
const User = require('../models/userModel')
const fetch = require('node-fetch')
const CLIENT_ID = process.env.CLIENT_ID
const {OAuth2Client} = require('google-auth-library');
const crypto = require('crypto')
const client = new OAuth2Client(CLIENT_ID);
const router = express.Router();
var response = {
    message: '',
    error: false,
    errorLog:''
}
async function verify(id_token) {
    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return payload
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  }
router.post('/cadastro', async (req,res) =>{
    setJsonResponseClear()
    try{
        const {email,senha,nome} = req.body
        const criado = await User.create({nome,email,senha})
        const {_id} = criado.toObject()
        response.message = 'Cadastro realizado com sucesso, verifique seu email para realizar o login'
        const urlSend = `${process.env.APP_URL}send/${_id}/${email}`
        fetch(urlSend,{method: 'GET'})
        return res.status(200).json(response)
    }

    catch (err){
        console.error(err)
        response.message = 'Erro ao realizar cadastro'
        response.error = true,
        response.errorLog = err
        return res.status(400).json(response)
    }
})

router.post('/login', async (req,res) =>{
    setJsonResponseClear()
    try{
        const {email,senha} = req.body
        const user = await User.findOne({email,senha})
        if((!user))
            throw 1
        if (!user.validacaoEmail)
            throw 2     
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
            res.status(404).json(response)
        }
    })
    res.redirect("/home")
})

router.post('/SignGoogle', async (req,res)=>{
    const {id_token} = req.body
    if(!id_token){
        response.message = 'Não foi possivel realizar a validaçao da conta Google'
        response.error = true
        return res.status(404).json(response)
    }
    else{
        const {...google} = await verify(id_token).catch(console.error)
        if((google.aud == CLIENT_ID ) && (google.iss == 'accounts.google.com'|| 'https://accounts.google.com') && google.exp){
            pessoa = await User.findOne({googleSub:google.sub})
            if(pessoa){
                const { _id,validacaoEmail } = pessoa.toObject()
                if(validacaoEmail){
                    req.session.userId = {'_id':_id}
                    response.message = "Login realizado com sucesso"
                    return res.json(response)
                }
                else{
                    response.message = "Valide seu email"
                    return res.json(response).status(404)
                }
            }
            else{
                try{
                    const criado = await User.create({nome:google.given_name,email:google.email,googleSub:google.sub,validacaoEmail:google.email_verified})
                    const { _id, email,validacaoEmail } = criado.toObject()
                    if(!validacaoEmail){
                        response.message = 'Cadastro realizado com sucesso, verifique seu email para realizar o login'
                        const urlSend = `${process.env.APP_URL}send/${_id}/${email}`
                        fetch(urlSend,{method: 'GET'})
                        return res.status(201).json(response)
                    }
                    response.message = 'Cadastro realizado com sucesso'
                    return res.status(200).json(response)
                }
                catch (err){
                    response.message = 'Erro ao realizar cadastro'
                    response.error = true,
                    response.errorLog = err
                    return res.status(400).json(response)
                }
            }
        }
    }
})
router.get('*',(req,res)=>res.status(404).send('what???'))

function setJsonResponseClear(){
    response.message = ""
    response.errorLog = ""
    response.error = false
}

module.exports = router