const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect DB and start server with startup checks
connectDB()
  .then(() => {
    // Startup checks
    const jwtConfigured = !!process.env.JWT_SECRET;
    console.log(`✓ MongoDB Connected`);
    console.log(`✓ Server Running`);
    console.log(jwtConfigured ? `✓ JWT Configured` : `✗ JWT_SECRET not set`);
    console.log(`✓ Admin Seeder Available`);

    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/posts', require('./routes/posts'));
    app.use('/api/users', require('./routes/users'));
    app.use('/api/admin', require('./routes/admin'));

    // health check
    app.get('/api/health', (req, res) => {
      const mongoose = require('mongoose');
      const state = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
      res.json({ status: 'ok', database: state });
    });

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(err.status || 500).json({ message: err.message || 'Server Error' });
    });

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
