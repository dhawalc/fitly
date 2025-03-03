import axios from 'axios';

// Try different ports to see if any work
const API_URLS = [
  process.env.NEXT_PUBLIC_API_URL,
  'http://localhost:5001',
  'http://localhost:5000',
  'http://localhost:3001',
  'http://127.0.0.1:5001'
].filter(Boolean); // Remove any undefined values

console.log('Trying these API URLs:', API_URLS);

// Create a function to test each URL
const testApiUrls = async () => {
  for (const url of API_URLS) {
    try {
      console.log(`Testing connection to ${url}...`);
      const response = await axios.get(`${url}/`, { 
        timeout: 2000,
        headers: { 'Accept': 'application/json' }
      });
      console.log(`Connection to ${url} successful:`, response.data);
      return url; // Return the first URL that works
    } catch (error) {
      console.error(`Connection to ${url} failed:`, error.message);
    }
  }
  return API_URLS[0]; // Default to the first URL if none work
};

// Initialize with the first URL, then try to find a working one
let baseURL = API_URLS[0];
testApiUrls().then(url => {
  baseURL = url;
  console.log(`Using API URL: ${baseURL}`);
});

const apiClient = axios.create({
  get baseURL() { return baseURL; }, // Use a getter to always get the latest value
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response || error);
    return Promise.reject(error);
  }
);

export default apiClient;
