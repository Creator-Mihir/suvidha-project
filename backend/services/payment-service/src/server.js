require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const app  = express();
const PORT = process.env.PORT || 3007;

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/payment', require('./routes/paymentRoutes'));

app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Not found.' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: 'Server error.' }));

app.listen(PORT, () => {
  console.log(`\n💳 [PAYMENT SERVICE] Running on port ${PORT}`);
  console.log(`🔌 Gateway: ${process.env.PAYMENT_GATEWAY || 'mock'}`);
  console.log(`🔗 Health: http://localhost:${PORT}/payment/health\n`);
});