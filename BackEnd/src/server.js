const express = require('express')
const path = require('path')
const app = express()
const static = path.join(__dirname,'../',"../",'FrontEnd') // Caminho até os arquivos frontEnd
const PORT = 3000

app.use(express.static(path.join(static)));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const authControl = require("./controller/controladorAuten")(app)

//pagina inicial
app.get('/',(req,res)=> res.sendFile(path.join(static,'HTML','login.html')))


app.listen(PORT, ()=>console.log(`Servidor rodando na porta: ${PORT}`))