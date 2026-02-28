require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const electricityRoutes = require('./routes/electricityRoutes');

const app  = express();
const PORT = process.env.PORT || 3003;

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/electricity', electricityRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

app.use((err, req, res, next) => {
  console.error('[ELECTRICITY SERVICE ERROR]', err.message);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`\n⚡ [ELECTRICITY SERVICE] Running on port ${PORT}`);
  console.log(`🔌 Dummy server: ${process.env.USE_DUMMY_SERVER === 'true' ? 'ENABLED ✅' : 'DISABLED (using fallback data)'}`);
  console.log(`🔗 Health: http://localhost:${PORT}/electricity/health\n`);
});

module.exports = app;