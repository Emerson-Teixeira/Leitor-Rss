const mongoose = require('../database/bancoConnect');
const crypto = require('crypto')

const modeloUsuario = new mongoose.Schema({
    nome:{
        type: String,
        required: true,
    },
    validacaoEmail:{
        type:Boolean,
        default: false 
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    senha:{
        type: String,
        required: true,
        select: false,
        set: value => crypto.createHash('md5').update(value).digest('hex')
    },
    rssList:[{
        url:String,
        tags:{type:[String]},
        nome:String
    }],
    googleSub:{
        type:String,
        unique:true
    },
    createdAt:{
        type:Date,
        default: Date.now,
    }
})

const user = mongoose.model('User',modeloUsuario)

module.exports = user
