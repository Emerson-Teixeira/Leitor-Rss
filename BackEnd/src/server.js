const express = require('express')
const path = require('path')
const app = express()
const static = path.join(__dirname,'../',"../",'FrontEnd') // Caminho até os arquivos frontEnd
const handlebars = require('express-handlebars')
const session = require('express-session')
const User = require('./models/userModel')
const cors = require('cors')
require('dotenv').config()

const{  PORT = 5000, MAX_LIFETIME = 3600000,    SESS_NAME = 'sId', SESS_SECRET = 'Eutenhosoquatroanos'} = process.env
app.engine('handlebars',handlebars({defaultLayout: 'main',runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
}}))
app.set('view engine', 'handlebars')
app.use(cors())
app.use(express.static(path.join(static)));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret:SESS_SECRET,
    resave:false,
    saveUninitialized:false,
    name: SESS_NAME,
    cookie:{
    maxAge: Number(MAX_LIFETIME),
    sameSite: true,
    secure:false
}}))

//middleware
var redirectLP = (req,res,next)=>{
    if(!req.session.userId){
        res.status(401).redirect('/logout')
    }
    else{
        next()
    }
}
var redirectHome = (req,res,next)=>{
    if(req.session.userId){
        res.redirect('/home')
    }
    else{
        next()
    }
}

var getUserData =  (req,res,next) =>{
    if(!req.session.userId){
        res.redirect('/logout')
    }
    else{
         User.findOne(req.session.userId, 'nome rssList email', (err, user)=> {
                if (err){
                    res.redirect('/logout')
                }
                else{
                    const dados = {'nome':`${user.nome}`,'rssList':user.rssList,'email':`${user.email}`}
                    res.locals.user = dados
                    next()
                }
        })
    }
}
app.use('/entrar',redirectHome,require('./controller/controladorAuten'))
app.use('/home',redirectLP,getUserData,require('./controller/home'))
app.use('/opcoes',redirectLP,getUserData, require('./controller/userMan'))
app.use('/rss',redirectLP,getUserData,require('./controller/rssMan.js'))
app.use('/send',require('./controller/email.js'))
app.use('/search',redirectLP,getUserData,require('./controller/search.js'))


//pagina inicial
app.get('/',redirectHome,(req,res)=> res.sendFile(path.join(static,'HTML','login.html')))
app.get('/feed/:id',redirectLP,getUserData,async (req,res)=>{
    res.render('Feed',res.locals.user)
})
app.get('/logout',(req,res)=> {
    req.session.destroy(err => {
        if(!err){
            res.clearCookie(SESS_NAME)
            res.redirect('/')
        }
    } )
})


//Caso nao ache rota
app.get('*',(req,res)=>res.status(404).send('what???'))

app.listen(PORT, ()=>console.log(`Servidor rodando na porta: ${PORT}`))