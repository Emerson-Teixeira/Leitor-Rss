const express = require('express');
const User = require('../models/userModel')
const router = express.Router();
const fetch = require('node-fetch')
const buffer = require('buffer')
const iconv = require('iconv-lite')
const chardet = require('chardet')

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

router.get('/get/:id', async(req,res)=>{
    var rss  
    await User.findOne(req.session.userId, 'rssList', (err, user)=> {
        if(!err){
            var dados = user.rssList.toObject()
            dados.forEach(element => {
                if(element._id == req.params.id){
                    rss = element
                }
            });
        }
    })
      var xmlDocument = await fetch(rss.url,{method:'get'}).then(resp => resp.arrayBuffer())
      .then(arrayB => {
          //descobrir o encoding
          var encoding = chardet.detect(Buffer.from(arrayB))
          // convertendo buffer codificado para string
          return iconv.decode(Buffer.from(arrayB),encoding)})
      res.status(200).send(xmlDocument)
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