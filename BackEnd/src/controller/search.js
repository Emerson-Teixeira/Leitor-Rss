const express = require('express')
const router = express.Router()

router.get('/nome',(req,res)=>{
    var searchResult = {
        nome: res.locals.user.nome,
        rssList: searchByName(req.query.q,res.locals.user.rssList),
        email: res.locals.user.email,
        type: 'o nome: ',
        procura: req.query.q
    }
    res.render('SearchResult',searchResult)
})

router.get('/tags',(req,res)=>{
    var searchResult = {
        nome: res.locals.user.nome,
        rssList: searchByTags(req.query.q,res.locals.user.rssList),
        email: res.locals.user.email,
        type: 'a tag: ',
        procura: req.query.q,
    }
    res.render('SearchResult',searchResult)
})

function searchByName(searchParams,rssList){
    var result = []
    rssList.forEach(element => {
        if ((element.nome).toLowerCase() == searchParams.toLowerCase()){
            result.push(element)
        }
    });
    return result
}
function searchByTags(searchParams,rssList){
    var result = []
    rssList.forEach(element => {
        element.tags.includes(searchParams.toLowerCase())? result.push(element): null
    })
    return result
}
module.exports = router
