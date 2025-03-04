// This service provides mock data for development and testing

// Generate random sleep data for the past days
export const generateMockSleepData = (days = 7) => {
  const sleepData = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random sleep duration between 5-9 hours (in minutes)
    const sleepDuration = Math.floor(Math.random() * (9 * 60 - 5 * 60 + 1) + 5 * 60);
    
    // Random deep sleep percentage between 10-30%
    const deepSleepPercentage = Math.floor(Math.random() * (30 - 10 + 1) + 10);
    const deepSleep = Math.floor(sleepDuration * (deepSleepPercentage / 100));
    
    // Random REM sleep percentage between 15-25%
    const remSleepPercentage = Math.floor(Math.random() * (25 - 15 + 1) + 15);
    const remSleep = Math.floor(sleepDuration * (remSleepPercentage / 100));
    
    // Light sleep is the remainder
    const lightSleep = sleepDuration - deepSleep - remSleep;
    
    // Random sleep efficiency between 75-95%
    const efficiency = Math.floor(Math.random() * (95 - 75 + 1) + 75);
    
    // Random bedtime between 9 PM and midnight
    const bedtimeHour = Math.floor(Math.random() * (24 - 21 + 1) + 21);
    const bedtimeMinute = Math.floor(Math.random() * 60);
    const bedtime = new Date(date);
    bedtime.setHours(bedtimeHour, bedtimeMinute, 0, 0);
    
    // Wake time based on sleep duration
    const wakeTime = new Date(bedtime);
    wakeTime.setMinutes(wakeTime.getMinutes() + sleepDuration);
    
    sleepData.push({
      date: date.toISOString().split('T')[0],
      summary: {
        duration: sleepDuration,
        efficiency: efficiency,
        deepSleep: deepSleep,
        lightSleep: lightSleep,
        remSleep: remSleep,
        awake: Math.floor(sleepDuration * (1 - efficiency / 100))
      },
      bedtime: bedtime.toISOString(),
      wakeTime: wakeTime.toISOString()
    });
  }
  
  return sleepData;
};

// Generate random activity data for the past days
export const generateMockActivityData = (days = 7) => {
  const activityData = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random steps between 3000-15000
    const steps = Math.floor(Math.random() * (15000 - 3000 + 1) + 3000);
    
    // Random distance based on steps (roughly 0.0008 km per step)
    const distance = parseFloat((steps * 0.0008).toFixed(2));
    
    // Random calories burned between 1500-3000
    const calories = Math.floor(Math.random() * (3000 - 1500 + 1) + 1500);
    
    // Random active minutes between 30-120
    const activeMinutes = Math.floor(Math.random() * (120 - 30 + 1) + 30);
    
    activityData.push({
      date: date.toISOString().split('T')[0],
      summary: {
        steps: steps,
        distance: distance,
        calories: calories,
        activeMinutes: activeMinutes,
        floors: Math.floor(steps / 2000)
      },
      hourly: Array.from({ length: 24 }, (_, hour) => ({
        hour: hour,
        steps: hour >= 7 && hour <= 22 ? Math.floor(Math.random() * (steps / 10)) : Math.floor(Math.random() * 100)
      }))
    });
  }
  
  return activityData;
};

// Generate random heart rate data for the past days
export const generateMockHeartRateData = (days = 7) => {
  const heartRateData = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random resting heart rate between 55-75
    const restingHR = Math.floor(Math.random() * (75 - 55 + 1) + 55);
    
    // Random max heart rate between 120-180
    const maxHR = Math.floor(Math.random() * (180 - 120 + 1) + 120);
    
    // Generate hourly data
    const hourly = Array.from({ length: 24 }, (_, hour) => {
      // Lower heart rate during sleep hours (11 PM - 6 AM)
      const baseHR = (hour >= 23 || hour < 6) ? restingHR : restingHR + 10;
      const variance = (hour >= 23 || hour < 6) ? 5 : 20;
      
      return {
        hour: hour,
        average: Math.floor(Math.random() * variance + baseHR)
      };
    });
    
    // Generate zones data
    const zones = {
      outOfRange: Math.floor(Math.random() * 600), // minutes
      fatBurn: Math.floor(Math.random() * 300),
      cardio: Math.floor(Math.random() * 60),
      peak: Math.floor(Math.random() * 30)
    };
    
    heartRateData.push({
      date: date.toISOString().split('T')[0],
      summary: {
        restingHeartRate: restingHR,
        maxHeartRate: maxHR,
        minHeartRate: Math.floor(restingHR * 0.9),
        averageHeartRate: Math.floor((restingHR + maxHR) / 2)
      },
      hourly: hourly,
      zones: zones
    });
  }
  
  return heartRateData;
};

// Generate random workout data for the past month
export const generateMockWorkoutData = (days = 30) => {
  const workoutTypes = [
    'Running', 'Walking', 'Cycling', 'Swimming', 'Strength Training', 
    'HIIT', 'Yoga', 'Pilates', 'Elliptical', 'Rowing'
  ];
  
  const workoutData = [];
  const now = new Date();
  
  // Generate 2-5 workouts per week
  const workoutsPerWeek = Math.floor(Math.random() * (5 - 2 + 1) + 2);
  const totalWorkouts = Math.floor(workoutsPerWeek * (days / 7));
  
  for (let i = 0; i < totalWorkouts; i++) {
    // Random day within the period
    const dayOffset = Math.floor(Math.random() * days);
    const date = new Date(now);
    date.setDate(date.getDate() - dayOffset);
    
    // Random workout type
    const workoutType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
    
    // Random duration between 15-90 minutes
    const duration = Math.floor(Math.random() * (90 - 15 + 1) + 15);
    
    // Random calories burned based on duration and type
    const caloriesPerMinute = 
      workoutType === 'HIIT' ? 10 :
      workoutType === 'Running' ? 8 :
      workoutType === 'Cycling' ? 7 :
      workoutType === 'Swimming' ? 7 :
      workoutType === 'Strength Training' ? 6 :
      workoutType === 'Rowing' ? 6 :
      workoutType === 'Elliptical' ? 5 :
      workoutType === 'Walking' ? 4 :
      workoutType === 'Yoga' ? 3 :
      workoutType === 'Pilates' ? 3 : 5;
    
    const calories = Math.floor(duration * caloriesPerMinute);
    
    // Random heart rate data
    const avgHR = Math.floor(Math.random() * (160 - 110 + 1) + 110);
    const maxHR = avgHR + Math.floor(Math.random() * 30);
    
    // Random distance for applicable workouts
    let distance = null;
    if (['Running', 'Walking', 'Cycling', 'Swimming'].includes(workoutType)) {
      const speedFactor = 
        workoutType === 'Running' ? 0.15 :
        workoutType === 'Walking' ? 0.08 :
        workoutType === 'Cycling' ? 0.3 :
        workoutType === 'Swimming' ? 0.03 : 0.1;
      
      distance = parseFloat((duration * speedFactor).toFixed(2));
    }
    
    workoutData.push({
      id: `workout-${i}`,
      date: date.toISOString(),
      type: workoutType,
      duration: duration,
      calories: calories,
      heartRate: {
        average: avgHR,
        max: maxHR
      },
      distance: distance
    });
  }
  
  // Sort by date (newest first)
  workoutData.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return workoutData;
}; 