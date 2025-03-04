/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    FITBIT_CLIENT_ID: process.env.FITBIT_CLIENT_ID,
    FITBIT_CLIENT_SECRET: process.env.FITBIT_CLIENT_SECRET,
    FITBIT_REDIRECT_URI: process.env.FITBIT_REDIRECT_URI,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    BACKEND_API_URL: process.env.BACKEND_API_URL
  }
};

module.exports = nextConfig; 