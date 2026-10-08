const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const settings = require('./settings');
const app = express();
app.disable('x-powered-by');
if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: { directives: { 'img-src': ["'self'", 'data:', 'https:'], 'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'], 'font-src': ["'self'", 'https://fonts.gstatic.com'] } } }));
app.use(cors({ origin: settings.origin }));
app.post('/api/payments/webhook', express.raw({ type: 'application/json', limit: '256kb' }), require('./routes/payment.routes').webhook);
app.use(express.json({ limit: '32kb' }));
app.use('/api', rateLimit({ windowMs: 60000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60000, limit: 40, standardHeaders: 'draft-8', legacyHeaders: false }));
app.get('/api/health', (req, res) => res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({ status: mongoose.connection.readyState === 1 ? 'ok' : 'unavailable' }));
app.use('/api/payments', require('./routes/payment.routes').router);
app.use('/api', require('./routes'));
app.use('/api', (req, res) => res.status(404).json({ message: 'Endpoint not found' }));
app.use('/images', express.static(path.join(__dirname, 'images')));
if (settings.production) {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('/{*path}', (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));
}
app.use((error, req, res, next) => {
  const status = error.status || (['ValidationError', 'CastError'].includes(error.name) ? 400 : error.code === 11000 ? 409 : 500);
  if (status === 500) console.error(error);
  res.status(status).json({ error: { message: status === 500 ? 'Server error. Try again later.' : error.message, code: status } });
});
module.exports = app;
