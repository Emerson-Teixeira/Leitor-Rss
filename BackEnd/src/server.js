const express = require('express')
const bodyParser = require('body-parser')
const hdbExp = require("express-handlebars")
const path = require('path')
const app = express()
const static = path.join(__dirname,'../',"../",'FrontEnd')
const PORT = 3000
console.log(static)
app.engine('handlebars', hdbExp());
app.set('view engine', 'handlebars');
app.use(express.static(path.join(static)));

app.get('/',(req,res)=> res.sendFile(path.join(static,'HTML','login.html')))



app.listen(PORT, ()=>console.log(`Servidor rodando na porta: ${PORT}`))