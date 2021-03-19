const express = require('express')
const path = require('path')
const app = express()
const static = path.join(__dirname,'../',"../",'FrontEnd') // Caminho até os arquivos frontEnd
const handlebars = require('express-handlebars')
const session = require('express-session')
const User = require('./models/userModel')
const fetch = require('node-fetch')

const PORT = 3000
const MAX_LIFETIME = 7200000
const SESS_NAME = 'sId'
const SESS_SECRET = 'Eutenhosoquatroanos'

app.engine('handlebars',handlebars({defaultLayout: 'main',runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
}}))
app.set('view engine', 'handlebars')
app.use(express.static(path.join(static)));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret:SESS_SECRET,
    resave:false,
    saveUninitialized:false,
    name: SESS_NAME,
    cookie:{
    maxAge: MAX_LIFETIME,
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
app.use('/opcoes',redirectLP,getUserData, require('./controller/opçoes.js'))
app.use('/rss',redirectLP,getUserData,require('./controller/rssMan.js'))
app.use('/send',require('./controller/email.js'))

//pagina inicial
app.get('/',redirectHome,(req,res)=> res.sendFile(path.join(static,'HTML','login.html')))
app.get('/feed/:id',getUserData,async (req,res)=>{
    res.render('feed',res.locals.user)
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