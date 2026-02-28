require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const app     = express();
const PORT    = process.env.PORT || 3004;

app.use(helmet()); app.use(cors({ origin: '*' })); app.use(express.json());
app.use('/gas', require('./routes/gasRoutes'));
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Not found.' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: 'Server error.' }));

app.listen(PORT, () => {
  console.log(`\n🔥 [GAS SERVICE] Running on port ${PORT}`);
  console.log(`🔌 Dummy server: ${process.env.USE_DUMMY_SERVER === 'true' ? 'ENABLED ✅' : 'DISABLED (fallback)'}`);
  console.log(`🔗 Health: http://localhost:${PORT}/gas/health\n`);
});