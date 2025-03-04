// This service provides workout recommendations based on user profile
export class WorkoutRecommendationService {
  // Get workout recommendations based on user profile
  static getRecommendations(userData) {
    // Default to beginner level if no data available
    const fitnessLevel = this.determineFitnessLevel(userData);
    const focusAreas = this.determineFocusAreas(userData);
    const workoutDuration = this.determineWorkoutDuration(userData);
    
    // Return recommendations based on user profile
    return this.getRecommendedWorkouts(fitnessLevel, focusAreas, workoutDuration);
  }
  
  // Determine user's fitness level based on their data
  static determineFitnessLevel(userData) {
    if (!userData) return 'beginner';
    
    // Check workout frequency
    const workoutFrequency = userData.workoutFrequency || 0;
    
    if (workoutFrequency >= 4) return 'advanced';
    if (workoutFrequency >= 2) return 'intermediate';
    return 'beginner';
  }
  
  // Determine focus areas based on user goals and body composition
  static determineFocusAreas(userData) {
    if (!userData) return ['full-body'];
    
    const focusAreas = [];
    const goal = userData.goal || 'general-fitness';
    
    // Add focus areas based on goal
    if (goal === 'fat-loss') {
      focusAreas.push('hiit', 'cardio');
    } else if (goal === 'muscle-gain') {
      focusAreas.push('strength', 'hypertrophy');
    } else if (goal === 'general-fitness') {
      focusAreas.push('full-body', 'functional');
    }
    
    // Add focus areas based on problem areas (if specified)
    if (userData.problemAreas) {
      if (userData.problemAreas.includes('core')) focusAreas.push('abs');
      if (userData.problemAreas.includes('arms')) focusAreas.push('arms');
      if (userData.problemAreas.includes('legs')) focusAreas.push('legs');
    }
    
    return focusAreas.length > 0 ? focusAreas : ['full-body'];
  }
  
  // Determine recommended workout duration
  static determineWorkoutDuration(userData) {
    if (!userData) return 30;
    
    // Base on available time
    const availableTime = userData.availableTime || 30;
    
    // Adjust based on fitness level
    const fitnessLevel = this.determineFitnessLevel(userData);
    
    if (fitnessLevel === 'advanced') {
      return Math.max(45, availableTime);
    } else if (fitnessLevel === 'intermediate') {
      return Math.max(30, availableTime);
    } else {
      return Math.min(30, availableTime);
    }
  }
  
  // Get recommended workouts based on profile analysis
  static getRecommendedWorkouts(fitnessLevel, focusAreas, duration) {
    // Curated list of popular, high-quality workout videos
    const workouts = {
      beginner: {
        'full-body': [
          {
            id: '1',
            title: '20 Minute Full Body Workout - Beginner Version',
            channel: 'MadFit',
            duration: 20,
            youtubeId: 'UItWltVZZmE',
            thumbnail: 'https://img.youtube.com/vi/UItWltVZZmE/hqdefault.jpg',
            description: 'A full body workout that can be done at home with no equipment. Perfect for beginners.'
          },
          {
            id: '2',
            title: '30-Minute No-Equipment Full-Body Toning Workout',
            channel: 'POPSUGAR Fitness',
            duration: 30,
            youtubeId: 'Ev6yE55kYGw',
            thumbnail: 'https://img.youtube.com/vi/Ev6yE55kYGw/hqdefault.jpg',
            description: 'A beginner-friendly toning workout that targets all major muscle groups.'
          }
        ],
        'cardio': [
          {
            id: '3',
            title: '15 Min Low Impact Cardio Workout for Beginners',
            channel: 'Body Project',
            duration: 15,
            youtubeId: 'VHyGqsPOUHs',
            thumbnail: 'https://img.youtube.com/vi/VHyGqsPOUHs/hqdefault.jpg',
            description: 'Low impact, beginner-friendly cardio workout that\'s easy on the joints.'
          },
          {
            id: '4',
            title: '20 Minute Walking Workout For Beginners',
            channel: 'growwithjo',
            duration: 20,
            youtubeId: 'enrj6YlAzew',
            thumbnail: 'https://img.youtube.com/vi/enrj6YlAzew/hqdefault.jpg',
            description: 'Indoor walking workout that\'s perfect for beginners looking to improve cardio fitness.'
          }
        ]
      },
      intermediate: {
        'full-body': [
          {
            id: '5',
            title: '30 Minute Full Body HIIT Workout - Intermediate Level',
            channel: 'SELF',
            duration: 30,
            youtubeId: 'ml6cT4AZdqI',
            thumbnail: 'https://img.youtube.com/vi/ml6cT4AZdqI/hqdefault.jpg',
            description: 'A challenging full body HIIT workout for intermediate fitness levels.'
          },
          {
            id: '6',
            title: '40 Minute Total Body Workout - Intermediate Level',
            channel: 'Heather Robertson',
            duration: 40,
            youtubeId: 'NFY3cmaTGdY',
            thumbnail: 'https://img.youtube.com/vi/NFY3cmaTGdY/hqdefault.jpg',
            description: 'A comprehensive total body workout with minimal equipment.'
          }
        ],
        'strength': [
          {
            id: '7',
            title: 'Dumbbell Full Body Workout',
            channel: 'Juice & Toya',
            duration: 35,
            youtubeId: 'WJm9zA2NY8E',
            thumbnail: 'https://img.youtube.com/vi/WJm9zA2NY8E/hqdefault.jpg',
            description: 'Full body strength workout using dumbbells for intermediate fitness levels.'
          },
          {
            id: '8',
            title: '30 Min Full Body Workout with Weights',
            channel: 'Caroline Girvan',
            duration: 30,
            youtubeId: 'cM0k49LcXnQ',
            thumbnail: 'https://img.youtube.com/vi/cM0k49LcXnQ/hqdefault.jpg',
            description: 'Intermediate strength training workout targeting all major muscle groups.'
          }
        ]
      },
      advanced: {
        'full-body': [
          {
            id: '9',
            title: '45 Minute HIIT Workout - Advanced',
            channel: 'Fitness Blender',
            duration: 45,
            youtubeId: 'cZnsLVArIt8',
            thumbnail: 'https://img.youtube.com/vi/cZnsLVArIt8/hqdefault.jpg',
            description: 'High-intensity interval training for advanced fitness enthusiasts.'
          },
          {
            id: '10',
            title: 'Advanced Full Body Workout - 60 Minutes',
            channel: 'Sydney Cummings',
            duration: 60,
            youtubeId: 'oAPCPjnU1wA',
            thumbnail: 'https://img.youtube.com/vi/oAPCPjnU1wA/hqdefault.jpg',
            description: 'Challenging full body workout for those with advanced fitness levels.'
          }
        ],
        'strength': [
          {
            id: '11',
            title: 'Advanced Full Body Strength Workout',
            channel: 'Thenx',
            duration: 45,
            youtubeId: 'Ks-lKvKQ8f4',
            thumbnail: 'https://img.youtube.com/vi/Ks-lKvKQ8f4/hqdefault.jpg',
            description: 'Advanced calisthenics and strength training workout.'
          },
          {
            id: '12',
            title: 'Advanced HIIT Workout - Insane 30 Min HIIT',
            channel: 'THENX',
            duration: 30,
            youtubeId: 'mmq5zD_ZBWo',
            thumbnail: 'https://img.youtube.com/vi/mmq5zD_ZBWo/hqdefault.jpg',
            description: 'Intense HIIT workout for advanced fitness levels.'
          }
        ]
      }
    };
    
    // Get recommendations based on fitness level and focus areas
    let recommendations = [];
    
    // Add workouts from primary focus area
    const primaryFocus = focusAreas[0] || 'full-body';
    
    if (workouts[fitnessLevel] && workouts[fitnessLevel][primaryFocus]) {
      recommendations = recommendations.concat(workouts[fitnessLevel][primaryFocus]);
    } else if (workouts[fitnessLevel] && workouts[fitnessLevel]['full-body']) {
      // Fallback to full-body if specific focus area not found
      recommendations = recommendations.concat(workouts[fitnessLevel]['full-body']);
    }
    
    // If we need more recommendations, add from other focus areas or fitness levels
    if (recommendations.length < 4) {
      // Try other focus areas
      for (const focus of focusAreas.slice(1)) {
        if (workouts[fitnessLevel] && workouts[fitnessLevel][focus]) {
          recommendations = recommendations.concat(workouts[fitnessLevel][focus]);
        }
      }
      
      // If still not enough, try adjacent fitness levels
      if (recommendations.length < 4) {
        const adjacentLevel = fitnessLevel === 'beginner' ? 'intermediate' : 
                             fitnessLevel === 'advanced' ? 'intermediate' : 'beginner';
        
        if (workouts[adjacentLevel] && workouts[adjacentLevel][primaryFocus]) {
          recommendations = recommendations.concat(workouts[adjacentLevel][primaryFocus]);
        } else if (workouts[adjacentLevel] && workouts[adjacentLevel]['full-body']) {
          recommendations = recommendations.concat(workouts[adjacentLevel]['full-body']);
        }
      }
    }
    
    // Limit to 6 recommendations
    return recommendations.slice(0, 6);
  }
} 