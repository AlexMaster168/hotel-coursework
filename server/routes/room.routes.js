const express=require('express');
const router=express.Router();
const Room=require('../models/Room');
const auth=require('../middleware/auth.middleware');
const {filterRooms}=require('../utils/filterRooms');
router.get('/',async(req,res)=>{const rooms=await Room.find();res.json(Object.keys(req.query).length?await filterRooms(rooms,req.query):rooms);});
router.get('/:roomId',async(req,res)=>{const room=await Room.findById(req.params.roomId);if(!room)return res.sendStatus(404);res.json(room);});
// Old clients may ask to sync a booking; inventory is now managed by the server.
router.post('/:roomId',auth,async(req,res)=>res.json(await Room.findById(req.params.roomId)));
router.patch('/:roomId',auth,async(req,res)=>{
 if(req.userRole!=='admin')return res.sendStatus(403);
 const fields=['roomNumber','price','type','comforts','canSmoke','canPets','canInvite','hasWideCorridor','hasDisabledAssistant'];
 const changes=Object.fromEntries(fields.filter(k=>Object.hasOwn(req.body,k)).map(k=>[k,req.body[k]]));
 if(changes.price!==undefined&&(!Number.isFinite(Number(changes.price))||Number(changes.price)<=0))return res.status(400).json({message:'Invalid price'});
 const room=await Room.findByIdAndUpdate(req.params.roomId,changes,{returnDocument:'after',runValidators:true});if(!room)return res.sendStatus(404);res.json(room);
});
module.exports=router;
