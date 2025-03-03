export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { email, password } = req.body;
  
  // This is a mock implementation - in a real app, you would validate credentials against your database
  if (email === 'dhawal@example.com' && password === 'password') {
    return res.status(200).json({
      user: {
        id: 'user-123456789',
        name: 'Dhawal Chheda',
        email: 'dhawal@example.com',
        avatar: null
      },
      token: 'mock-token-xyz'
    });
  }
  
  return res.status(401).json({ message: 'Invalid credentials' });
} 