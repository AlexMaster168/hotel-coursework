const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });
const production = process.env.NODE_ENV === 'production';
const secret = name => {
  const value = process.env[name];
  if (production && (!value || value.length < 32)) throw new Error(`${name} must contain at least 32 characters`);
  return value || `local-development-only-${name}-change-before-deploy`;
};
module.exports = {
  production,
  port: Number(process.env.PORT || 8080),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hotel?replicaSet=rs0',
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  accessSecret: secret('ACCESS_SECRET'), refreshSecret: secret('REFRESH_SECRET'),
};
