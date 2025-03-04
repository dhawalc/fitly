import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Loader2, Save, Bell } from 'lucide-react';

export default function NotificationsSettings() {
  const [notifications, setNotifications] = useState({
    email: {
      workoutReminders: true,
      weeklyReports: true,
      goalAchievements: true,
      newFeatures: false
    },
    push: {
      workoutReminders: true,
      dailyGoalProgress: true,
      goalAchievements: true,
      friendActivity: false
    },
    sms: {
      workoutReminders: false,
      goalAchievements: false
    },
    frequency: "daily"
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success toast
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Manage how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-workout-reminders">Workout Reminders</Label>
                  <p className="text-sm text-muted-foreground">Receive reminders about scheduled workouts</p>
                </div>
                <Switch 
                  id="email-workout-reminders" 
                  checked={notifications.email.workoutReminders}
                  onCheckedChange={(checked) => 
                    setNotifications({
                      ...notifications,
                      email: {
                        ...notifications.email,
                        workoutReminders: checked
                      }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-weekly-reports">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly summaries of your activity</p>
                </div>
                <Switch 
                  id="email-weekly-reports" 
                  checked={notifications.email.weeklyReports}
                  onCheckedChange={(checked) => 
                    setNotifications({
                      ...notifications,
                      email: {
                        ...notifications.email,
                        weeklyReports: checked
                      }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-goal-achievements">Goal Achievements</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications when you reach your goals</p>
                </div>
                <Switch 
                  id="email-goal-achievements" 
                  checked={notifications.email.goalAchievements}
                  onCheckedChange={(checked) => 
                    setNotifications({
                      ...notifications,
                      email: {
                        ...notifications.email,
                        goalAchievements: checked
                      }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-new-features">New Features</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new app features</p>
                </div>
                <Switch 
                  id="email-new-features" 
                  checked={notifications.email.newFeatures}
                  onCheckedChange={(checked) => 
                    setNotifications({
                      ...notifications,
                      email: {
                        ...notifications.email,
                        newFeatures: checked
                      }
                    })
                  }
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-workout-reminders">Workout Reminders</Label>
                  <p className="text-sm text-muted-foreground">Receive reminders about scheduled workouts</p>
                </div>
                <Switch 
                  id="push-workout-reminders" 
                  checked={notifications.push.workoutReminders}
                  onCheckedChange={(checked) => 
                    setNotifications({
                      ...notifications,
                      push: {
                        ...notifications.push,
                        workoutReminders: checked
                      }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-daily-goal-progress">Daily Goal Progress</Label>
                  <p className="text-sm text-muted-foreground">Receive updates on your daily goal progress</p>
                </div>
                <Switch 
                  id="push-daily-goal-progress" 
                  checked={notifications.push.dailyGoalProgress}
                  onCheckedChange={(checked) => 
                    setNotifications({
                      ...notifications,
                      push: {
                        ...notifications.push,
                        dailyGoalProgress: checked
                      }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-goal-achievements">Goal Achievements</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications when you reach your goals</p>
                </div>
                <Switch 
                  id="push-goal-achievements" 
                  checked={notifications.push.goalAchievements}
                  onCheckedChange={(checked) => 
                    setNotifications({
                      ...notifications,
                      push: {
                        ...notifications.push,
                        goalAchievements: checked
                      }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-friend-activity">Friend Activity</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications about your friends' activity</p>
                </div>
                <Switch 
                  id="push-friend-activity" 
                  checked={notifications.push.friendActivity}
                  onCheckedChange={(checked) => 
                    setNotifications({
                      ...notifications,
                      push: {
                        ...notifications.push,
                        friendActivity: checked
                      }
                    })
                  }
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">SMS Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-workout-reminders">Workout Reminders</Label>
                  <p className="text-sm text-muted-foreground">Receive SMS reminders about scheduled workouts</p>
                </div>
                <Switch 
                  id="sms-workout-reminders" 
                  checked={notifications.sms.workoutReminders}
                  onCheckedChange={(checked) => 
                    setNotifications({
                      ...notifications,
                      sms: {
                        ...notifications.sms,
                        workoutReminders: checked
                      }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-goal-achievements">Goal Achievements</Label>
                  <p className="text-sm text-muted-foreground">Receive SMS notifications when you reach your goals</p>
                </div>
                <Switch 
                  id="sms-goal-achievements" 
                  checked={notifications.sms.goalAchievements}
                  onCheckedChange={(checked) => 
                    setNotifications({
                      ...notifications,
                      sms: {
                        ...notifications.sms,
                        goalAchievements: checked
                      }
                    })
                  }
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Notification Frequency</h3>
            <div className="space-y-2">
              <Label htmlFor="notification-frequency">Frequency</Label>
              <Select 
                value={notifications.frequency}
                onValueChange={(value) => setNotifications({...notifications, frequency: value})}
              >
                <SelectTrigger id="notification-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This affects how often you receive non-critical notifications.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 