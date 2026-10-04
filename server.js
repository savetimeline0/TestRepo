const express = require('express');
const logger = require('./src/logger');
const apRoutes = require('./src/routes/apRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Request logging middleware (JSON)
app.use((req, res, next) => {
  logger.info({ event: 'request', method: req.method, url: req.originalUrl, body: req.body });
  next();
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'AP Simulator' });
});

// Accounts Payable API
app.use('/api/ap', apRoutes);

// Error handler
app.use((err, req, res, next) => {
  logger.error({ event: 'error', message: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  logger.info({ event: 'startup', message: `Server running on port ${port}` });
  console.log(`Server running on port ${port}`);
});
