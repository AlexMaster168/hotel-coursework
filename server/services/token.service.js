const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Token = require('../models/Token');
const settings = require('../settings');
class TokenService {
 generate(payload){return {accessToken:jwt.sign(payload,settings.accessSecret,{expiresIn:'1h',algorithm:'HS256'}),refreshToken:jwt.sign(payload,settings.refreshSecret,{expiresIn:'7d',jwtid:crypto.randomUUID(),algorithm:'HS256'}),expiresIn:3600};}
 async save(userId,refreshToken){return Token.findOneAndUpdate({user:userId},{refreshToken},{upsert:true,returnDocument:'after'});}
 validateRefresh(token){try{return jwt.verify(token,settings.refreshSecret,{algorithms:['HS256']});}catch{return null;}}
 validateAccess(token){try{return jwt.verify(token,settings.accessSecret,{algorithms:['HS256']});}catch{return null;}}
 async findToken(refreshToken){return Token.findOne({refreshToken});}
}
module.exports=new TokenService();
