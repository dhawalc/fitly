import { generateMockHeartRateData } from '../../../../services/mock-data-service';

export default function handler(req, res) {
  // Get the period from the query params
  const period = req.query.period || '7d';
  
  // Generate mock heart rate data
  const days = period === '30d' ? 30 : period === '14d' ? 14 : 7;
  const heartRateData = generateMockHeartRateData(days);
  
  res.status(200).json(heartRateData);
} 