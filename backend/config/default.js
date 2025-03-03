module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/health-fitness-app',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  openaiApiKey: process.env.OPENAI_API_KEY,
  googleFitClientId: process.env.GOOGLE_FIT_CLIENT_ID,
  googleFitClientSecret: process.env.GOOGLE_FIT_CLIENT_SECRET,
  appleHealthClientId: process.env.APPLE_HEALTH_CLIENT_ID,
  appleHealthClientSecret: process.env.APPLE_HEALTH_CLIENT_SECRET
}; 