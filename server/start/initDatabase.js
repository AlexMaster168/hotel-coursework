const Room=require('../models/Room');
const User=require('../models/User');
const bcrypt=require('bcryptjs');
module.exports=async({demo=false}={})=>{
 if(await Room.countDocuments()===0){const rooms=require('../mockData/rooms.json').map(({_id,...room})=>({...room,bookings:[],images:['/images/room-1.jpg','/images/room-2.jpg','/images/room-3.jpg']})); await Room.insertMany(rooms);}
 const email=demo?'admin@example.com':process.env.ADMIN_EMAIL;
 const password=demo?'DemoAdmin123!':process.env.ADMIN_PASSWORD;
 if(email&&password){if(password.length<12) throw new Error('Admin password must contain at least 12 characters');await User.updateOne({email},{$setOnInsert:{email,password:await bcrypt.hash(password,12),role:'admin',firstName:'Адміністратор',secondName:'Toxin',gender:'male'}},{upsert:true});}
 if(demo)await User.updateOne({email:'guest@example.com'},{$setOnInsert:{email:'guest@example.com',password:await bcrypt.hash('DemoGuest123!',12),role:'user',firstName:'Олена',secondName:'Коваль',gender:'female'}},{upsert:true});
 console.log('Seed complete (existing data preserved).');
};
