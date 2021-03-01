const jwt = require('jsonwebtoken');
const { ConnectionStates } = require('mongoose');
const secret = '35597b5e2b4e5162536c78202b6a40745d4e743d344d72705e48775e50'
module.exports = {
    sign:(payload)=> jwt.sign(payload,secret,{expiresIn:86400 }),
    verify: (token) => jwt.verify(token,secret),
    verifyAuth: async (req,res,next)=>{
        token = req.headers['x-access-token']
        console.log(token)
        try {
             jwt.verify(token,secret)
             next()
            
        } catch (error) {
            res.status(401).send('Acesso Invalido')
        }
        
    }
} 