import axios from 'axios';

export default async function handler(req, res) {
  const { endpoint = '/' } = req.query;
  
  try {
    console.log(`Proxying request to http://localhost:5000${endpoint}`);
    const response = await axios.get(`http://localhost:5000${endpoint}`);
    
    res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: error.code
      }
    });
  }
} 