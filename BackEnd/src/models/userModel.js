const mongoose = require('../database/bancoConnect');

const modeloUsuario = new mongoose.Schema({
    nome:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
        unique: true,
        lowercase: true,
    },
    senha:{
        type: String,
        require: true,
        select: false,
    },
    createdAt:{
        type:Date,
        default: Date.now,
    }
})

const user = mongoose.model('User',modeloUsuario)

module.exports = user