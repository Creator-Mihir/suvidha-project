require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const citizenRoutes = require('./routes/citizenRoutes');

const app  = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/citizen', citizenRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

app.use((err, req, res, next) => {
  console.error('[CITIZEN SERVICE ERROR]', err.message);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`\n👤 [CITIZEN SERVICE] Running on port ${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/citizen/health\n`);
});

module.exports = app;