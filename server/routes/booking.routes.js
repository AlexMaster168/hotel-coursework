const express = require('express');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth.middleware');
const {createBooking,cancelBooking} = require('../services/booking.service');
const router = express.Router();
router.use(auth);
router.get('/', async (req,res)=>res.json(await Booking.find(req.userRole==='admin'?{}:{userId:req.user._id}).sort({arrivalDate:-1}).select('-checkoutSessionId -paymentIntentId')));
router.post('/', async(req,res)=>res.status(201).json(await createBooking(req.body,req.user._id)));
router.delete('/:bookingId',async(req,res)=>{
 const booking=await Booking.findById(req.params.bookingId);
 if(!booking) return res.status(404).json({message:'Booking not found'});
 if(String(booking.userId)!==req.user._id && req.userRole!=='admin') return res.sendStatus(403);
 if(booking.paymentStatus==='paid') return res.status(409).json({error:{message:'REFUND_REQUIRED',code:409}});
 if(booking.checkoutSessionId) await require('./payment.routes').expireCheckout(booking.checkoutSessionId, req.app.locals.paymentClient);
 await cancelBooking(booking._id); res.json(null);
});
module.exports=router;
