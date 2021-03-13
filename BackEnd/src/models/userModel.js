const mongoose = require('../database/bancoConnect');
const crypto = require('crypto')

const modeloUsuario = new mongoose.Schema({
    nome:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
        unique: true,
        lowercase: true
    },
    senha:{
        type: String,
        require: true,
        select: false,
        set: value => crypto.createHash('md5').update(value).digest('hex')
    },
    rssList:[{
        url:String,
        tags:[String],
        nome:String,
    }],
    createdAt:{
        type:Date,
        default: Date.now,
    }
})

const user = mongoose.model('User',modeloUsuario)

module.exports = user