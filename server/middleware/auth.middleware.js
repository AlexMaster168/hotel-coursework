const User = require('../models/User');
const tokenService = require('../services/token.service');
module.exports = async (req,res,next)=>{
 try {
  const match=/^Bearer (.+)$/.exec(req.headers.authorization||'');
  const data=match&&tokenService.validateAccess(match[1]);
  if(!data?._id) return res.sendStatus(401);
  const user=await User.findById(data._id);
  if(!user) return res.sendStatus(401);
  req.user={_id:String(user._id)}; req.userRole=user.role; next();
 }catch{res.sendStatus(401);}
};
