const Booking=require('../models/Booking');
const {overlaps}=require('./bookingPolicy');
async function filterRooms(items,filters){
 let rooms=items||[];
 if(filters.arrivalDate&&filters.departureDate){const stay={arrivalDate:new Date(Number(filters.arrivalDate)),departureDate:new Date(Number(filters.departureDate))};if(!Number.isFinite(+stay.arrivalDate)||!Number.isFinite(+stay.departureDate)||stay.departureDate<=stay.arrivalDate)throw Object.assign(new Error('INVALID_DATES'),{status:400});const booked=await Booking.find({status:{$ne:'cancelled'},arrivalDate:{$lt:stay.departureDate},departureDate:{$gt:stay.arrivalDate}});const ids=new Set(booked.filter(b=>overlaps(b,stay)).map(b=>String(b.roomId)));rooms=rooms.filter(r=>!ids.has(String(r._id)));}
 for(const field of ['hasWifi','hasConditioner','hasWorkSpace'])if(filters[field]==='true'||filters[field]===true)rooms=rooms.filter(r=>r.comforts?.includes(field));
 for(const field of ['canSmoke','canPets','canInvite','hasWideCorridor','hasDisabledAssistant'])if(filters[field]==='true'||filters[field]===true)rooms=rooms.filter(r=>r[field]);
 if(filters.price){const range=Array.isArray(filters.price)?filters.price:String(filters.price).split(',');rooms=rooms.filter(r=>r.price>=Number(range[0])&&r.price<=Number(range[1]));}
 return rooms;
}
module.exports={filterRooms};
