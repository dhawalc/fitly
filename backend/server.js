require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fitbitRoutes = require('./routes/fitbit');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing
  credentials: true
}));
app.use(express.json());

// Add this near the top of your file, after the imports
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/health-fitness-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  console.log('Root endpoint accessed');
  res.json({
    status: 'Health & Fitness App API is running',
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Import and use route modules
app.use('/api/users', (req, res, next) => {
  console.log('Users API accessed:', req.method, req.path);
  next();
}, require('./api/users'));
// app.use('/api/workouts', require('./api/workouts'));
// app.use('/api/nutrition', require('./api/nutrition'));
// app.use('/api/bloodtests', require('./api/bloodtests'));

// Add this near your other routes
app.get('/ping', (req, res) => {
  console.log('Ping endpoint accessed');
  res.send('pong');
});

// Fitbit routes
app.use('/api/fitbit', fitbitRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const startServer = (port) => {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', e);
    }
  });
};

startServer(PORT); 