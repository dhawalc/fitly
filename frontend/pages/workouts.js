import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";

export default function Workouts() {
  // Sample data - in a real app, this would come from your API
  const [workoutData, setWorkoutData] = useState({
    weeklyGoal: {
      workouts: 5,
      completed: 3,
      calories: 2500,
      burnedCalories: 1850
    },
    todayWorkout: {
      scheduled: true,
      type: "Strength Training",
      focus: "Upper Body",
      exercises: [
        { name: "Bench Press", sets: 4, reps: "8-10", weight: "185 lbs", completed: true },
        { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: "65 lbs", completed: true },
        { name: "Lat Pulldown", sets: 4, reps: "10-12", weight: "160 lbs", completed: false },
        { name: "Seated Cable Row", sets: 3, reps: "10-12", weight: "150 lbs", completed: false },
        { name: "Lateral Raises", sets: 3, reps: "12-15", weight: "25 lbs", completed: false },
        { name: "Tricep Pushdown", sets: 3, reps: "12-15", weight: "70 lbs", completed: false }
      ],
      duration: 60, // minutes
      caloriesBurned: 450
    },
    recentWorkouts: [
      { 
        id: 1, 
        date: "Yesterday", 
        type: "HIIT", 
        focus: "Full Body", 
        duration: 45, 
        caloriesBurned: 520,
        exercises: [
          { name: "Burpees", sets: 4, reps: "15", completed: true },
          { name: "Mountain Climbers", sets: 4, reps: "30 sec", completed: true },
          { name: "Kettlebell Swings", sets: 4, reps: "15", weight: "35 lbs", completed: true },
          { name: "Box Jumps", sets: 4, reps: "12", completed: true },
          { name: "Battle Ropes", sets: 4, reps: "30 sec", completed: true }
        ]
      },
      { 
        id: 2, 
        date: "2 days ago", 
        type: "Strength Training", 
        focus: "Lower Body", 
        duration: 65, 
        caloriesBurned: 480,
        exercises: [
          { name: "Squats", sets: 4, reps: "8-10", weight: "225 lbs", completed: true },
          { name: "Romanian Deadlift", sets: 3, reps: "10-12", weight: "185 lbs", completed: true },
          { name: "Leg Press", sets: 3, reps: "12-15", weight: "360 lbs", completed: true },
          { name: "Walking Lunges", sets: 3, reps: "12 each", weight: "30 lbs", completed: true },
          { name: "Calf Raises", sets: 4, reps: "15-20", weight: "150 lbs", completed: true }
        ]
      },
      { 
        id: 3, 
        date: "4 days ago", 
        type: "Cardio", 
        focus: "Endurance", 
        duration: 40, 
        caloriesBurned: 380,
        exercises: [
          { name: "Treadmill Run", duration: "30 min", distance: "4 miles", completed: true },
          { name: "Stair Climber", duration: "10 min", completed: true }
        ]
      }
    ],
    workoutPlans: [
      {
        id: 1,
        name: "Fat Loss Program",
        description: "High-intensity workouts focused on burning calories and preserving muscle",
        duration: "8 weeks",
        workoutsPerWeek: 5,
        active: true
      },
      {
        id: 2,
        name: "Strength Building",
        description: "Progressive overload focused on building strength and muscle mass",
        duration: "12 weeks",
        workoutsPerWeek: 4,
        active: false
      },
      {
        id: 3,
        name: "Endurance Training",
        description: "Cardio-focused program to improve stamina and heart health",
        duration: "6 weeks",
        workoutsPerWeek: 4,
        active: false
      }
    ],
    exerciseProgress: [
      { name: "Bench Press", starting: "165 lbs", current: "185 lbs", goal: "225 lbs" },
      { name: "Squat", starting: "185 lbs", current: "225 lbs", goal: "315 lbs" },
      { name: "Deadlift", starting: "225 lbs", current: "275 lbs", goal: "365 lbs" },
      { name: "Pull-ups", starting: "5 reps", current: "8 reps", goal: "15 reps" }
    ]
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Workouts</h1>
        <p className="text-gray-600">Track and plan your exercise routines</p>
      </header>
      
      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
          <CardDescription>Your workout goals for this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Workouts Completed</h3>
              <div className="flex justify-between mb-1">
                <span className="text-sm">{workoutData.weeklyGoal.completed} of {workoutData.weeklyGoal.workouts}</span>
                <span className="text-sm text-gray-500">{Math.round((workoutData.weeklyGoal.completed / workoutData.weeklyGoal.workouts) * 100)}%</span>
              </div>
              <Progress value={(workoutData.weeklyGoal.completed / workoutData.weeklyGoal.workouts) * 100} />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Calories Burned</h3>
              <div className="flex justify-between mb-1">
                <span className="text-sm">{workoutData.weeklyGoal.burnedCalories} of {workoutData.weeklyGoal.calories}</span>
                <span className="text-sm text-gray-500">{Math.round((workoutData.weeklyGoal.burnedCalories / workoutData.weeklyGoal.calories) * 100)}%</span>
              </div>
              <Progress value={(workoutData.weeklyGoal.burnedCalories / workoutData.weeklyGoal.calories) * 100} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View Detailed Stats</Button>
        </CardFooter>
      </Card>
      
      {/* Today's Workout */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Today's Workout</CardTitle>
              <CardDescription>{workoutData.todayWorkout.type} - {workoutData.todayWorkout.focus}</CardDescription>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {workoutData.todayWorkout.scheduled ? "Scheduled" : "Not Scheduled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <div>
                <span className="font-medium">Duration:</span> {workoutData.todayWorkout.duration} minutes
              </div>
              <div>
                <span className="font-medium">Calories:</span> {workoutData.todayWorkout.caloriesBurned} kcal
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Exercise</th>
                    <th className="px-4 py-2 text-center">Sets</th>
                    <th className="px-4 py-2 text-center">Reps</th>
                    <th className="px-4 py-2 text-center">Weight</th>
                    <th className="px-4 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {workoutData.todayWorkout.exercises.map((exercise, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 font-medium">{exercise.name}</td>
                      <td className="px-4 py-3 text-center">{exercise.sets}</td>
                      <td className="px-4 py-3 text-center">{exercise.reps}</td>
                      <td className="px-4 py-3 text-center">{exercise.weight || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={exercise.completed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {exercise.completed ? 'Completed' : 'Pending'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Modify Workout</Button>
          <Button>Start Workout</Button>
        </CardFooter>
      </Card>
      
      {/* Recent Workouts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
          <CardDescription>Your workout history</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={workoutData.recentWorkouts[0].id.toString()}>
            <TabsList className="mb-4">
              {workoutData.recentWorkouts.map(workout => (
                <TabsTrigger key={workout.id} value={workout.id.toString()}>
                  {workout.date}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {workoutData.recentWorkouts.map(workout => (
              <TabsContent key={workout.id} value={workout.id.toString()}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg">{workout.type} - {workout.focus}</h3>
                      <p className="text-sm text-gray-500">
                        Duration: {workout.duration} min | Calories: {workout.caloriesBurned} kcal
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Exercise</th>
                          <th className="px-4 py-2 text-center">Sets</th>
                          <th className="px-4 py-2 text-center">Reps/Duration</th>
                          <th className="px-4 py-2 text-center">Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workout.exercises.map((exercise, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 font-medium">{exercise.name}</td>
                            <td className="px-4 py-3 text-center">{exercise.sets || '-'}</td>
                            <td className="px-4 py-3 text-center">{exercise.reps || exercise.duration || '-'}</td>
                            <td className="px-4 py-3 text-center">{exercise.weight || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View All Workouts</Button>
        </CardFooter>
      </Card>
      
      {/* Workout Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Workout Plans</CardTitle>
          <CardDescription>Your current and available training programs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workoutData.workoutPlans.map(plan => (
              <div key={plan.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{plan.name}</h3>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                  <p className="text-sm mt-1">
                    <span className="text-gray-500">Duration:</span> {plan.duration} | 
                    <span className="text-gray-500"> Frequency:</span> {plan.workoutsPerWeek} workouts/week
                  </p>
                </div>
                <div>
                  {plan.active ? (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  ) : (
                    <Button variant="outline" size="sm">Activate</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Create Custom Plan</Button>
        </CardFooter>
      </Card>
      
      {/* Exercise Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Exercise Progress</CardTitle>
          <CardDescription>Track your strength gains over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workoutData.exerciseProgress.map((exercise, index) => {
              const startValue = parseInt(exercise.starting);
              const currentValue = parseInt(exercise.current);
              const goalValue = parseInt(exercise.goal);
              const progress = ((currentValue - startValue) / (goalValue - startValue)) * 100;
              
              return (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{exercise.name}</h3>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Started: {exercise.starting}</span>
                    <span>Goal: {exercise.goal}</span>
                  </div>
                  <Progress value={progress} />
                  <p className="text-center mt-2 font-medium">{exercise.current} ({Math.round(progress)}%)</p>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">Add Exercise to Track</Button>
        </CardFooter>
      </Card>
    </div>
  );
} 