import React, { useState, useEffect } from 'react';
import { Bell, Settings, User, ChevronDown, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { AuthService } from '../services/auth-service';

export default function TopNav() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState({
    name: "Dhawal Chheda",
    email: "user@example.com",
    photoURL: null
  });
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New workout plan available", read: false },
    { id: 2, message: "You've reached your step goal today!", read: false },
    { id: 3, message: "Time to log your weight", read: true }
  ]);
  
  useEffect(() => {
    setMounted(true);
    // Get user data
    const userData = AuthService.getCurrentUser();
    if (userData) {
      setUser(userData);
    }
  }, []);
  
  const handleSignOut = () => {
    AuthService.signOut();
    router.push('/welcome');
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return 'DC';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Avoid hydration mismatch by not rendering theme-specific elements until mounted
  if (!mounted) {
    return (
      <div className="border-b bg-background">
        <div className="flex h-16 items-center px-4 justify-between">
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            {/* Placeholders for the UI elements */}
            <div className="w-9 h-9"></div>
            <div className="w-9 h-9"></div>
            <div className="w-8 h-8 rounded-full bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // For debugging - log the user data and initials
  console.log('User data:', user);
  console.log('User initials:', getInitials(user?.name));
  
  return (
    <div className="border-b bg-background">
      <div className="flex h-16 items-center px-4 justify-between">
        <div className="flex-1"></div>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-2">
                <h4 className="font-medium">Notifications</h4>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                <>
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className={`p-3 ${!notification.read ? 'bg-muted/50' : ''}`}>
                      <div className="flex flex-col space-y-1">
                        <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>{notification.message}</p>
                        <p className="text-xs text-muted-foreground">Just now</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center">
                    View all notifications
                  </DropdownMenuItem>
                </>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                  {user?.photoURL ? (
                    <AvatarImage src={user.photoURL} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
} 