const express = require('express')
const User = require('../models/userModel')
const router = express.Router();

router.post('/add',(req,res)=>{
    User.updateOne(req.session.userId,{$push: {rssList:req.body}},(err,obj)=>{
        if (err) {
            res.status(500).send({message: 'Erro ao acessar banco de dados'})
        }
        else
            if(obj)
                res.status(200).send({message: 'Link adicionado com sucesso'})
            else
                res.status(404).send({message: 'Não foi possivel achar o usuario'})
    })
})
router.delete('/remove',(req,res)=>{
    
})
router.put('/update',(req,res)=>{
    
})
router.get('/getNews',(req,res)=>{

})

module.exports = router