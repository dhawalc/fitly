import envConfig from '../../../config/env-config';

export default function handler(req, res) {
  // Log configuration for debugging
  console.log('Environment Config:', envConfig);
  
  const FITBIT_CLIENT_ID = envConfig.FITBIT_CLIENT_ID;
  const REDIRECT_URI = envConfig.FITBIT_REDIRECT_URI;
  
  // Define the scope of permissions we're requesting
  const scope = 'activity heartrate location nutrition profile sleep weight';
  
  // Construct the Fitbit authorization URL
  const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scope)}&expires_in=604800`;
  
  // Log the constructed URL for debugging
  console.log('Redirecting to:', authUrl);
  
  // Redirect the user to the Fitbit authorization page
  res.redirect(authUrl);
} 