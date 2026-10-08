const settings = require('./settings');
const mongoose = require('mongoose');
const app = require('./httpApp');
async function start() {
  let demo;
  if (process.env.DEMO_MODE === 'true') {
    if (settings.production) throw new Error('DEMO_MODE is disabled in production');
    const { MongoMemoryReplSet } = require('mongodb-memory-server');
    demo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  }
  await mongoose.connect(demo ? demo.getUri('hotel') : settings.mongoUri);
  await Promise.all([require('./models/ReservationNight').init(), require('./models/User').init()]);
  if (demo) await require('./start/initDatabase')({ demo: true });
  const server = app.listen(settings.port, () => console.log(`Hotel API: http://localhost:${settings.port}`));
  const stop = () => server.close(async () => { await mongoose.disconnect(); if (demo) await demo.stop(); process.exit(0); });
  process.on('SIGINT', stop); process.on('SIGTERM', stop);
}
start().catch(error => { console.error(error.message); process.exit(1); });
