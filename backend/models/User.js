const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // ... existing user fields
  
  fitbit: {
    connected: { type: Boolean, default: false },
    accessToken: String,
    refreshToken: String,
    tokenExpires: Date,
    lastSync: Date,
    userId: String
  }
});

module.exports = mongoose.model('User', UserSchema);
