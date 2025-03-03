// This is a Next.js API route that will run on the server side
import axios from 'axios';

export default async function handler(req, res) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  
  try {
    console.log(`Testing backend connection to ${backendUrl}`);
    const response = await axios.get(backendUrl, { timeout: 5000 });
    
    res.status(200).json({
      success: true,
      backendUrl,
      response: {
        status: response.status,
        data: response.data
      }
    });
  } catch (error) {
    console.error('Backend connection test failed:', error.message);
    
    res.status(500).json({
      success: false,
      backendUrl,
      error: {
        message: error.message,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : null
      }
    });
  }
} 