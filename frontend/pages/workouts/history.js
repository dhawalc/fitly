import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import WorkoutProgressChart from "../../components/workout-progress-chart";
import WorkoutStreak from "../../components/workout-streak";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "../../components/ui/use-toast";

export default function WorkoutHistory() {
  const router = useRouter();
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [notes, setNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    // Load workout history from localStorage
    const storedHistory = localStorage.getItem('workoutHistory');
    if (storedHistory) {
      setWorkoutHistory(JSON.parse(storedHistory));
    } else {
      // Mock data if no history exists
      const mockHistory = [
        {
          id: '1',
          title: '30 Minute Full Body HIIT Workout',
          date: '2023-08-15T10:30:00Z',
          duration: 30,
          youtubeId: 'ml6cT4AZdqI',
          completed: true,
          channel: 'SELF',
          notes: 'Felt great, increased weights on squats'
        },
        {
          id: '2',
          title: '20 Minute Full Body Workout - Beginner Version',
          date: '2023-08-12T09:15:00Z',
          duration: 20,
          youtubeId: 'UItWltVZZmE',
          completed: true,
          channel: 'MadFit',
          notes: 'Good recovery workout'
        }
      ];
      setWorkoutHistory(mockHistory);
      localStorage.setItem('workoutHistory', JSON.stringify(mockHistory));
    }
  }, []);
  
  const openNotesDialog = (workout) => {
    setSelectedWorkout(workout);
    setNotes(workout.notes || "");
    setDialogOpen(true);
  };
  
  const saveNotes = () => {
    if (!selectedWorkout) return;
    
    // Update the workout with new notes
    const updatedHistory = workoutHistory.map(workout => {
      if (workout.id === selectedWorkout.id) {
        return { ...workout, notes };
      }
      return workout;
    });
    
    setWorkoutHistory(updatedHistory);
    localStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));
    setDialogOpen(false);
    
    toast({
      title: "Notes Saved",
      description: "Your workout notes have been updated.",
      variant: "success",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Workout History</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <WorkoutStreak />
        <WorkoutProgressChart />
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Completed Workouts</h2>
        <p className="text-gray-600">
          Track your completed workouts and see your progress over time.
        </p>
      </div>
      
      {workoutHistory.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500">No workout history yet. Complete a workout to see it here!</p>
            <Button 
              className="mt-4"
              onClick={() => router.push('/workouts/recommendations')}
            >
              Find a Workout
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {workoutHistory.map(workout => (
            <Card key={workout.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative">
                  <div className="pb-[56.25%] md:pb-0 md:h-full bg-gray-100 relative">
                    <img 
                      src={`https://img.youtube.com/vi/${workout.youtubeId}/hqdefault.jpg`}
                      alt={workout.title}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-2/3 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{workout.title}</h3>
                    <Badge variant="outline" className="ml-2">
                      {workout.duration} min
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {workout.channel} • Completed on {format(new Date(workout.date), 'MMM d, yyyy')}
                  </p>
                  {workout.notes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600">{workout.notes}</p>
                    </div>
                  )}
                  <div className="mt-4 flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${workout.youtubeId}`, '_blank')}
                    >
                      Watch Again
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openNotesDialog(workout)}
                    >
                      {workout.notes ? "Edit Notes" : "Add Notes"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Workout Notes</DialogTitle>
            <DialogDescription>
              Add notes about how you felt, weights used, or anything else you want to remember.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did this workout feel? What weights did you use? Any modifications?"
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveNotes}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 