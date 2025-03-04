import { generateMockWorkoutData } from '../../../../services/mock-data-service';

export default function handler(req, res) {
  // Get the period from the query params
  const period = req.query.period || '30d';
  
  // Generate mock workout data
  const days = period === '90d' ? 90 : period === '60d' ? 60 : 30;
  const workoutData = generateMockWorkoutData(days);
  
  res.status(200).json(workoutData);
} 