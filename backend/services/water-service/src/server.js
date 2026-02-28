require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3005;

app.use(require('helmet')()); app.use(require('cors')({ origin: '*' })); app.use(express.json());
app.use('/water', require('./routes/waterRoutes'));
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Not found.' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: 'Server error.' }));

app.listen(PORT, () => {
  console.log(`\n💧 [WATER SERVICE] Running on port ${PORT}`);
  console.log(`🔌 Dummy server: ${process.env.USE_DUMMY_SERVER === 'true' ? 'ENABLED ✅' : 'DISABLED (fallback)'}`);
  console.log(`🔗 Health: http://localhost:${PORT}/water/health\n`);
});