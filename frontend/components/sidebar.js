import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Activity, 
  Dumbbell, 
  Utensils, 
  Moon, 
  Droplet, 
  FileText, 
  Settings, 
  Scale,
  Heart
} from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  
  const isActive = (path) => {
    if (path === '/settings') {
      return router.pathname.startsWith('/settings');
    }
    return router.pathname === path;
  };
  
  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: 'Body Composition', 
      href: '/body-composition', 
      icon: <Scale className="h-5 w-5" /> 
    },
    { 
      name: 'Nutrition', 
      href: '/nutrition', 
      icon: <Utensils className="h-5 w-5" /> 
    },
    { 
      name: 'Workouts', 
      href: '/workouts', 
      icon: <Dumbbell className="h-5 w-5" /> 
    },
    { 
      name: 'Sleep', 
      href: '/sleep', 
      icon: <Moon className="h-5 w-5" /> 
    },
    { 
      name: 'Blood Work', 
      href: '/blood-work', 
      icon: <Droplet className="h-5 w-5" /> 
    },
    { 
      name: 'Activity', 
      href: '/activity', 
      icon: <Activity className="h-5 w-5" /> 
    },
    { 
      name: 'Health Reports', 
      href: '/reports', 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: <Settings className="h-5 w-5" /> 
    }
  ];
  
  return (
    <div className="h-screen border-r bg-background flex flex-col">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center">
          <Heart className="h-6 w-6 text-primary mr-2" />
          <span className="text-xl font-bold">VitalSync</span>
        </Link>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm ${
                  isActive(item.href) 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            DC
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Dhawal Chheda</p>
            <p className="text-xs text-muted-foreground">View Profile</p>
          </div>
        </div>
      </div>
    </div>
  );
} 