'use client';

import { LayoutDashboard, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TinySidebar({ activeView, onViewChange }) {
  const navItems = [
    { id: 'meetings', icon: LayoutDashboard, label: 'Meetings' },
    { id: 'profile', icon: Users, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-16 h-screen bg-black flex flex-col items-center py-4 border-r border-gray-900">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black font-bold text-lg">
          M
        </div>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center transition-colors focus:outline-none",
                isActive
                  ? "bg-white text-black"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              )}
              title={item.label}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
