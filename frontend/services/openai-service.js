// This is a mock OpenAI service for demonstration purposes
// In a real app, you would use the OpenAI API

export const OpenAIService = {
  // Generate AI insights using OpenAI
  generateInsights: async (userData, healthMetrics) => {
    try {
      // Create a prompt for the OpenAI API
      const prompt = `
        Generate personalized health and fitness insights for a user with the following data:
        
        User Profile:
        - Name: ${userData.name}
        - Age: ${userData.age}
        - Gender: ${userData.gender}
        - Weight: ${userData.weight} lbs
        - Height: ${userData.heightFeet}'${userData.heightInches}"
        - Goal: ${userData.goal || 'Not specified'}
        
        Health Metrics:
        - Current Weight: ${healthMetrics.weight.current} lbs
        - Previous Weight: ${healthMetrics.weight.previous} lbs
        - Goal Weight: ${healthMetrics.weight.goal} lbs
        - Current Body Fat: ${healthMetrics.bodyFat.current}%
        - Current Muscle Mass: ${healthMetrics.muscleMass.current} lbs
        
        ${userData.medicalConditions ? `Medical Conditions: ${userData.medicalConditions.join(', ')}` : ''}
        ${userData.allergies ? `Allergies: ${userData.allergies.join(', ')}` : ''}
        ${userData.medications ? `Medications: ${userData.medications.join(', ')}` : ''}
        
        Provide insights in the following categories:
        1. Progress Analysis
        2. Workout Efficiency
        3. Nutrition Insights
        4. Health Warnings
        5. Sleep Analysis
        
        Format the response as a JSON object with these categories as keys, each containing a title and content field.
      `;
      
      console.log('OpenAI prompt:', prompt);
      
      // Get API key from environment variable or use the provided key
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      
      // Get model from environment variable or use the specified model
      const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini-2024-07-18';
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a health and fitness expert AI assistant that provides personalized insights based on user data.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('OpenAI API error:', data.error);
        throw new Error(data.error.message);
      }
      
      // Parse the response as JSON
      try {
        const insights = JSON.parse(data.choices[0].message.content);
        return insights;
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        // If parsing fails, return the raw text
        return {
          progress: { 
            title: 'Progress Analysis', 
            content: data.choices[0].message.content 
          }
        };
      }
    } catch (error) {
      console.error('OpenAI service error:', error);
      
      // Fallback to mock data if API call fails
      return {
        progress: {
          title: 'Progress Analysis',
          content: `You're making good progress toward your ${userData.goal?.replace('-', ' ') || 'health'} goal. Your current weight of ${healthMetrics.weight.current} lbs shows a ${healthMetrics.weight.current < healthMetrics.weight.previous ? 'decrease' : 'increase'} of ${Math.abs(healthMetrics.weight.current - healthMetrics.weight.previous)} lbs since your last measurement.`
        },
        workout: {
          title: 'Workout Efficiency',
          content: `Based on your goal of ${userData.goal?.replace('-', ' ') || 'overall fitness'}, focusing on ${userData.goal === 'fat-loss' ? 'HIIT and strength training' : userData.goal === 'muscle-gain' ? 'progressive overload in strength training' : 'a mix of cardio and strength training'} will be most effective for you.`
        },
        nutrition: {
          title: 'Nutrition Insights',
          content: `Your current protein intake of ${healthMetrics.nutrition.avgProtein}g (${Math.round((healthMetrics.nutrition.avgProtein * 4 / healthMetrics.nutrition.avgCalories) * 100)}% of calories) is ${healthMetrics.nutrition.avgProtein > userData.weight * 0.8 ? 'adequate' : 'below optimal'} for your goals. Consider ${healthMetrics.nutrition.avgProtein > userData.weight * 0.8 ? 'maintaining this level' : 'increasing to at least 0.8g per pound of body weight'}.`
        },
        health: {
          title: 'Health Warnings',
          content: userData.medicalConditions?.length > 0 
            ? `With your ${userData.medicalConditions[0]} condition, it's important to monitor your ${userData.medicalConditions[0] === 'diabetes' ? 'blood sugar levels' : userData.medicalConditions[0] === 'hypertension' ? 'blood pressure' : 'symptoms'} regularly and consult with your healthcare provider about your fitness routine.`
            : 'No specific health concerns detected based on your current data. Continue your current approach and consider regular check-ups to monitor your progress.'
        },
        sleep: {
          title: 'Sleep Analysis',
          content: `Your average sleep duration of ${healthMetrics.sleep.avgDuration} hours is ${healthMetrics.sleep.avgDuration >= 7 ? 'within' : 'below'} the recommended 7-9 hours. ${healthMetrics.sleep.avgDuration < 7 ? 'Aim to increase your sleep time by going to bed 30 minutes earlier.' : 'Maintaining this sleep schedule will support your recovery and overall health goals.'}`
        }
      };
    }
  }
}; 