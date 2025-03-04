const express = require('express');
const router = express.Router();
const axios = require('axios');
const querystring = require('querystring');
const User = require('../models/User');

// Environment variables
const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID;
const FITBIT_CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET;
const REDIRECT_URI = process.env.FITBIT_REDIRECT_URI;

// Initiate Fitbit OAuth flow
router.get('/auth', (req, res) => {
  const scope = 'activity heartrate location nutrition profile sleep weight';
  const authUrl = `https://www.fitbit.com/oauth2/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: FITBIT_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope,
    expires_in: '604800' // Token valid for 1 week
  })}`;
  
  res.redirect(authUrl);
});

// Handle Fitbit OAuth callback
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  const userId = req.session.userId; // Assuming you have user session management
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }
  
  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://api.fitbit.com/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`).toString('base64')}`
      },
      data: querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      })
    });
    
    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    
    // Save tokens to user record
    await User.findByIdAndUpdate(userId, {
      'fitbit.accessToken': access_token,
      'fitbit.refreshToken': refresh_token,
      'fitbit.tokenExpires': new Date(Date.now() + expires_in * 1000),
      'fitbit.connected': true
    });
    
    // Redirect to success page
    res.redirect('/settings/integrations?status=success&provider=fitbit');
  } catch (error) {
    console.error('Fitbit token exchange error:', error.response?.data || error.message);
    res.redirect('/settings/integrations?status=error&provider=fitbit');
  }
});

// Get user's Fitbit data
router.get('/data/:type', async (req, res) => {
  const { type } = req.params;
  const userId = req.session.userId;
  
  try {
    const user = await User.findById(userId);
    
    if (!user.fitbit?.connected) {
      return res.status(400).json({ error: 'Fitbit account not connected' });
    }
    
    // Check if token needs refresh
    if (new Date(user.fitbit.tokenExpires) <= new Date()) {
      await refreshFitbitToken(user);
    }
    
    // Get data from Fitbit API
    let endpoint;
    const date = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
    
    switch (type) {
      case 'activity':
        endpoint = `https://api.fitbit.com/1/user/-/activities/date/${date}.json`;
        break;
      case 'sleep':
        endpoint = `https://api.fitbit.com/1.2/user/-/sleep/date/${date}.json`;
        break;
      case 'weight':
        endpoint = `https://api.fitbit.com/1/user/-/body/log/weight/date/${date}/1m.json`;
        break;
      case 'heart':
        endpoint = `https://api.fitbit.com/1/user/-/activities/heart/date/${date}/1d.json`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid data type requested' });
    }
    
    const response = await axios.get(endpoint, {
      headers: {
        'Authorization': `Bearer ${user.fitbit.accessToken}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Fitbit data fetch error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Fitbit data' });
  }
});

// Helper function to refresh Fitbit token
async function refreshFitbitToken(user) {
  try {
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://api.fitbit.com/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`).toString('base64')}`
      },
      data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: user.fitbit.refreshToken
      })
    });
    
    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    
    // Update tokens in database
    await User.findByIdAndUpdate(user._id, {
      'fitbit.accessToken': access_token,
      'fitbit.refreshToken': refresh_token,
      'fitbit.tokenExpires': new Date(Date.now() + expires_in * 1000)
    });
    
    return access_token;
  } catch (error) {
    console.error('Token refresh error:', error.response?.data || error.message);
    throw new Error('Failed to refresh Fitbit token');
  }
}

module.exports = router; 