export default function handler(req, res) {
  // Only show this in development
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ error: 'Not found' });
  }
  
  // Return a subset of environment variables for debugging
  res.status(200).json({
    FITBIT_CLIENT_ID: process.env.FITBIT_CLIENT_ID ? 'Set (hidden value)' : 'Not set',
    FITBIT_REDIRECT_URI: process.env.FITBIT_REDIRECT_URI,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NODE_ENV: process.env.NODE_ENV
  });
} 