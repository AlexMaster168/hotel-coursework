const settings = require('../settings');
const mongoose = require('mongoose');
(async () => { await mongoose.connect(settings.mongoUri); await require('./initDatabase')(); await mongoose.disconnect(); })().catch(error => { console.error(error.message); process.exit(1); });
