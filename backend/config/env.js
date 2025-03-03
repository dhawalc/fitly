require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/health-fitness-tracker',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GOOGLE_FIT_API_KEY: process.env.GOOGLE_FIT_API_KEY,
  APPLE_HEALTH_API_KEY: process.env.APPLE_HEALTH_API_KEY
};
