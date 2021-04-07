const express = require('express');
const User = require('../models/userModel')
const router = express.Router();
const fetch = require('node-fetch')
const iconv = require('iconv-lite')
const chardet = require('chardet');
const { DOMParser } = require('xmldom')
router.post('/add',async (req,res)=>{
    if(await validationNotEqual(req.session.userId,req.body.url)==0){
        try{
            var nome = await getNameFeed(req.body.url)
            var newFeed = {
                url: req.body.url,
                tags: req.body.tags,
                nome
            }
        }
        catch (e){
            return res.status(500).json({message: 'O link não é um Feed Rss'})
        }
       User.updateOne(req.session.userId,{$push: {rssList:newFeed}},async (err,obj)=>{
            if (err) {
                return res.status(500).json({message: 'Erro ao cadastrar Feed'})
            }
            else{
                res.status(200).json(await returnNewRss(req.session.userId,req.body.url))
            }
            
        })
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
    //sem funçao ainda
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
    if(!rss){
        return res.status(404).send({Error: 'Error'})
    }
      res.status(200).send(await getFeedAsTxt(rss.url))
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

async function getFeedAsTxt(url){
    var xmlDocument = await fetch(url,{method:'get'}).then(resp => resp.arrayBuffer())
      .then(arrayB => {
          //descobrir o encoding
          var encoding = chardet.detect(Buffer.from(arrayB))
          // convertendo buffer codificado para string
          return iconv.decode(Buffer.from(arrayB),encoding)
        })
    return xmlDocument
}

async function getNameFeed(url){
    feed = await getFeedAsTxt(url);
    try{
    feedAsXML = new DOMParser({
        /**
         * locator is always need for error position info
         */
        locator:{},
        /**
         * you can override the errorHandler for xml parser
         * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
         */
        errorHandler:{warning:function(w){},error: (e)=>{throw e},fatalError:(e)=>{throw e}}
        //only callback model
        //errorHandler:function(level,msg){console.log(level,msg)}
    }).parseFromString(feed,'application/xml')
    }
    catch (e) {
        throw e
    }
    
    return feedAsXML.getElementsByTagName("title")[0].childNodes[0].nodeValue
}

module.exports = router