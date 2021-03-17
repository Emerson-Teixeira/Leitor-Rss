const express = require('express');
const session = require('express-session');
const User = require('../models/userModel')
const router = express.Router();

router.post('/add',async (req,res)=>{
    if(await validationNotEqual(req.session.userId,req.body.url)==0){
        User.updateOne(req.session.userId,{$push: {rssList:req.body}}, async (err,obj)=>{
            if (err) {
                res.status(500).json({message: err})
            }
        })
        res.status(200).json(await returnNewRss(req.session.userId,req.body.url))
    }
    else{
        res.status(500).json({message: 'Feed ja cadastrado'})
    }
    
})
router.delete('/remove/:id',async (req,res)=>{
   await User.updateOne(req.session.userId,{$pull: {rssList: {_id:req.params.id}}},(err,obj)=>{
        if (err) {
            res.status(500).json({message: 'Error'})
        }
        else{
            res.status(200).json({message: 'removido'})
        }
    })
})
router.put('/update/:id',(req,res)=>{
    
})
router.get('/getNews',(req,res)=>{
        //logicadepegarconteudo
        res.send(xmlresponse)
})

async function returnNewRss(id,url){
    var newRss 
    await User.findOne(id, 'rssList', (err, user)=> {
        if(!err){
            var dados = user.rssList.toObject()
            dados.forEach(element => {
                if(element.url == url){
                    newRss = element
                }
            });
        }
    })
    return newRss
}

 async function validationNotEqual(id,url){
    var verif = 0
    await User.findOne(id, 'rssList', (err, user)=> {
        if(!err){
            var dados = user.rssList.toObject()
            dados.forEach(element => {
                if(element.url == url){
                    verif=1;
                }
            });
        }
    })
    return verif
}

module.exports = router