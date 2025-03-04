export default function handler(req, res) {
  // Hard-coded values for testing
  const FITBIT_CLIENT_ID = '23Q4RP';
  const REDIRECT_URI = 'http://localhost:3000/api/fitbit/callback';
  
  // Define the scope of permissions we're requesting
  const scope = 'activity heartrate location nutrition profile sleep weight';
  
  // Construct the Fitbit authorization URL
  const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scope)}&expires_in=604800`;
  
  // Log the constructed URL for debugging
  console.log('Redirecting to:', authUrl);
  
  // Redirect the user to the Fitbit authorization page
  res.redirect(authUrl);
} 