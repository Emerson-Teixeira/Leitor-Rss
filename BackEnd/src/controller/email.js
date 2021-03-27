const express = require('express')
const router = express.Router();
const User = require('../models/userModel')
const nodemailer = require('nodemailer')
require('dotenv').config()

router.get('/:id/:email',async (req,res)=>{
    existInDatabase(req.params.id,req.params.email) 
    if (await existInDatabase(req.params.id,req.params.email) == true){
        var status = await main(req.params.id,req.params.email)
        res.json({message: status})
    }
    else{
        res.json({message: "Cannot send an Email, account not found"})
    }
})

async function existInDatabase(id,email){
    var boolean = false
    var emailUser = await User.findOne({'_id':id}, 'email').then( user => { if (user) return user.email; else  return null}).catch(err => console.log(err))
    if (email == emailUser)
        boolean = true
    return boolean
}
async function main(id,email){
    let emailPath = `${process.env.APP_URL}/entrar/validate/${id}`
    let transporter = nodemailer.createTransport({
        service:'Gmail',
        auth: {
            user: 'jrssreadersender@gmail.com',
            pass: '12345asd@'
        }
    })
  var status =  await  transporter.sendMail({
        from: "J-rss Reader <jrssreadersender@gmail.com>",
        to: email,
        subject: "Validaçao da conta",
        text: `Clique no link para validar sua conta ${emailPath}`,
        replyTo: 'emejunior99@gmail.com',
        html: ` <h1>Bem vindo ao J-rss Reader</h1>
                <hr><br>
                <h2><a href = ${emailPath}>clique aqui</a> para validar sua conta</h2>`
    }).then(resp=>resp).catch(err => err) 

    return status
}

module.exports = router