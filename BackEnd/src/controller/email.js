const express = require('express')
const router = express.Router();
const nodemailer = require('nodemailer')

router.get('/:id/:email',async (req,res)=>{
    var status = await main(req.params.id,req.params.email)
    res.json({message: status})
})

async function main(id,email){
    let emailPath = `http://localhost:3000/entrar/validate/${id}`
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
        html: ` <h1>Bem vindo ao Jrss Reader</h1>
                <hr><br><br>
                <h2></h2><a href = ${emailPath}>clique aqui</a> para validar sua conta</h2>`
    }).then(resp=>resp).catch(err => err) 

    return status
}

module.exports = router