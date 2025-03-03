import { OpenAIService } from './openai-service';

// This is a mock AI insights service
// In a real app, this would call your backend AI service

export const AIInsightsService = {
  // Generate insights based on user data
  generateInsights: async (userData, healthMetrics) => {
    try {
      // Use OpenAI to generate personalized insights
      const insights = await OpenAIService.generateInsights(userData, healthMetrics);
      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      
      // Fallback to our basic insights generator if OpenAI fails
      return {
        progress: generateProgressInsight(userData, healthMetrics),
        workout: generateWorkoutInsight(userData, healthMetrics),
        nutrition: generateNutritionInsight(userData, healthMetrics),
        health: generateHealthInsight(userData, healthMetrics),
        sleep: generateSleepInsight(userData, healthMetrics)
      };
    }
  }
};

// Helper functions to generate specific insights as fallback
function generateProgressInsight(userData, healthMetrics) {
  const weightDiff = healthMetrics.weight.previous - healthMetrics.weight.current;
  const muscleDiff = healthMetrics.muscleMass.current - healthMetrics.muscleMass.previous;
  
  let content = '';
  
  if (userData.goal === 'fat-loss' && weightDiff > 0) {
    content = `You've lost ${weightDiff.toFixed(1)} lbs in the last ${healthMetrics.period || '3 weeks'} while ${muscleDiff > 0 ? 'gaining' : 'maintaining'} muscle mass. This is an ideal rate of fat loss.`;
  } else if (userData.goal === 'muscle-gain' && muscleDiff > 0) {
    content = `You've gained ${muscleDiff.toFixed(1)} lbs of muscle in the last ${healthMetrics.period || '3 weeks'} while ${weightDiff < 0 ? 'gaining' : weightDiff > 0 ? 'losing' : 'maintaining'} weight. Keep up the good work!`;
  } else if (userData.goal === 'maintenance') {
    content = `Your weight has ${Math.abs(weightDiff) < 2 ? 'remained stable' : weightDiff > 0 ? 'decreased' : 'increased'} in the last ${healthMetrics.period || '3 weeks'}. Your body composition is ${Math.abs(muscleDiff) < 1 ? 'stable' : muscleDiff > 0 ? 'improving' : 'changing'}.`;
  } else {
    content = `You've ${weightDiff > 0 ? 'lost' : 'gained'} ${Math.abs(weightDiff).toFixed(1)} lbs in the last ${healthMetrics.period || '3 weeks'}. Focus on ${userData.goal === 'fat-loss' ? 'creating a calorie deficit through diet and exercise' : 'progressive overload in your strength training'} to achieve your goals.`;
  }
  
  return {
    title: 'Progress Analysis',
    content
  };
}

function generateWorkoutInsight(userData, healthMetrics) {
  const workouts = healthMetrics.workouts || [];
  
  // Analyze which workout types are most effective based on the user's goal
  const workoutTypes = workouts.map(w => w.type);
  const uniqueTypes = [...new Set(workoutTypes)];
  
  let mostEffectiveType = '';
  let recommendation = '';
  
  if (userData.goal === 'fat-loss') {
    mostEffectiveType = uniqueTypes.includes('hiit') ? 'HIIT' : uniqueTypes.includes('cardio') ? 'cardio' : 'strength';
    recommendation = `Consider increasing from ${workouts.filter(w => w.type === mostEffectiveType.toLowerCase()).length || 2} to ${workouts.filter(w => w.type === mostEffectiveType.toLowerCase()).length + 1 || 3} sessions per week.`;
  } else if (userData.goal === 'muscle-gain') {
    mostEffectiveType = 'strength training';
    recommendation = "Ensure you're progressively increasing weight or reps to continue building muscle.";
  } else {
    mostEffectiveType = uniqueTypes.length > 0 ? uniqueTypes[0] : 'mixed';
    recommendation = 'Maintain a balanced approach with both cardio and strength training.';
  }
  
  return {
    title: 'Workout Efficiency',
    content: `Your ${mostEffectiveType} sessions are showing the best results for ${userData.goal.replace('-', ' ')}. ${recommendation}`
  };
}

function generateNutritionInsight(userData, healthMetrics) {
  const dietPreferences = userData.dietPreferences || [];
  let content = '';
  
  if (userData.goal === 'fat-loss') {
    if (dietPreferences.includes('high-protein')) {
      content = 'Your protein intake is optimal for muscle preservation. Consider reducing carbohydrates by 10% to accelerate fat loss.';
    } else if (dietPreferences.includes('low-carb')) {
      content = 'Your low-carb approach is working well. Ensure adequate protein intake (at least 0.8g per pound of body weight) to preserve muscle mass.';
    } else if (dietPreferences.includes('intermittent-fasting')) {
      content = 'Your intermittent fasting schedule is helping with calorie control. Consider adding one more hour to your fasting window for enhanced fat burning.';
    } else {
      content = 'Based on your current progress, increasing protein intake and slightly reducing carbohydrates could enhance your fat loss results.';
    }
  } else if (userData.goal === 'muscle-gain') {
    content = "To optimize muscle growth, ensure you're in a slight calorie surplus (200-300 calories above maintenance) with at least 1g of protein per pound of body weight.";
  } else {
    content = 'Your current nutrition approach is supporting your maintenance goals. For optimal health, focus on nutrient density and adequate protein intake.';
  }
  
  return {
    title: 'Nutrition Insights',
    content
  };
}

function generateHealthInsight(userData, healthMetrics) {
  // Check for potential health issues based on available data
  const warnings = [];
  
  // Check bloodwork if available
  if (userData.bloodwork) {
    if (userData.bloodwork.vitaminD && userData.bloodwork.vitaminD < 30) {
      warnings.push('Your Vitamin D levels are below optimal. Consider supplementation or increased sun exposure.');
    }
    
    if (userData.bloodwork.cholesterol && userData.bloodwork.cholesterol > 200) {
      warnings.push('Your total cholesterol is elevated. Focus on increasing fiber intake and omega-3 fatty acids.');
    }
    
    if (userData.bloodwork.glucose && userData.bloodwork.glucose > 100) {
      warnings.push('Your fasting glucose is slightly elevated. Consider reducing refined carbohydrates and increasing physical activity.');
    }
  }
  
  // Check sleep data if available
  if (healthMetrics.sleep && healthMetrics.sleep.avgDuration < 7) {
    warnings.push(`Your average sleep duration (${healthMetrics.sleep.avgDuration} hours) is below the recommended 7-9 hours. Inadequate sleep can impact recovery and hormonal balance.`);
  }
  
  // If no specific warnings, provide general health advice
  if (warnings.length === 0) {
    warnings.push('No specific health concerns detected. Continue your current approach and consider regular check-ups to monitor your progress.');
  }
  
  return {
    title: 'Health Warnings',
    content: warnings[0] // Just return the most important warning for now
  };
}

function generateSleepInsight(userData, healthMetrics) {
  if (!healthMetrics.sleep) {
    return {
      title: 'Sleep Analysis',
      content: 'Start tracking your sleep to receive personalized insights.'
    };
  }
  
  const avgDuration = healthMetrics.sleep.avgDuration;
  const avgQuality = healthMetrics.sleep.avgQuality;
  
  let content = '';
  
  if (avgDuration < 7) {
    content = `Your average sleep duration of ${avgDuration} hours is below the recommended 7-9 hours. Aim to increase your sleep time by going to bed 30 minutes earlier.`;
  } else if (avgQuality < 70) {
    content = `While your sleep duration is adequate, your sleep quality score of ${avgQuality}% suggests room for improvement. Consider limiting screen time before bed and maintaining a consistent sleep schedule.`;
  } else {
    content = `Your sleep metrics look good! Maintaining your current sleep habits will support your ${userData.goal.replace('-', ' ')} goals and overall recovery.`;
  }
  
  return {
    title: 'Sleep Analysis',
    content
  };
} 