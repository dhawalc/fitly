export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { token } = req.body;
  
  // This is a mock implementation - in a real app, you would validate the Google token
  // and either create a new user or fetch an existing one
  
  return res.status(200).json({
    user: {
      id: 'google-123456789',
      name: 'Dhawal Chheda',
      email: 'dhawal@example.com',
      avatar: null
    },
    token: 'mock-token-xyz'
  });
} 