// Environment configuration for Fitbit and backend API
const envConfig = {
  FITBIT_CLIENT_ID: process.env.FITBIT_CLIENT_ID,
  FITBIT_CLIENT_SECRET: process.env.FITBIT_CLIENT_SECRET,
  FITBIT_REDIRECT_URI: process.env.FITBIT_REDIRECT_URI,
  BACKEND_API_URL: process.env.BACKEND_API_URL,
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
};

export default envConfig; 