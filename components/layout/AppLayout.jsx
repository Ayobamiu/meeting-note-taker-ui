'use client';

import { useState, useEffect, createContext, useContext, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { meetingsApi } from '@/lib/api';
import TinySidebar from './TinySidebar';
import SidebarWrapper from './SidebarWrapper';
import AddMeetingDialog from '@/components/meeting/AddMeetingDialog';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export default function AppLayout({ children }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  // Fetch all meetings
  const fetchMeetings = async () => {
    try {
      setError(null);
      const response = await meetingsApi.getAllMeetings();
      setMeetings(response.meetings || []);
    } catch (err) {
      console.error('Error fetching meetings:', err);
      setError('Failed to load meetings. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMeetings();
  }, []);

  // Poll for updates on active meetings
  useEffect(() => {
    const activeMeetings = meetings.filter(
      m => m.status !== 'completed' && m.status !== 'failed'
    );

    if (activeMeetings.length === 0) return;

    const interval = setInterval(async () => {
      for (const meeting of activeMeetings) {
        try {
          const response = await meetingsApi.getMeetingStatus(meeting.id);
          setMeetings(prev => 
            prev.map(m => m.id === meeting.id ? response.meeting : m)
          );
        } catch (err) {
          console.error(`Error updating meeting ${meeting.id}:`, err);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [meetings]);

  const handleAddMeeting = async () => {
    await fetchMeetings();
  };

  const handleNavigation = (view) => {
    const routes = {
      meetings: '/meetings',
      profile: '/profile',
      settings: '/settings',
    };
    if (routes[view]) {
      router.push(routes[view]);
    }
  };

  const handleMeetingSelect = (meeting) => {
    // This will be handled by the meetings page
    router.push(`/meetings?id=${meeting.id}`);
  };

  const getCurrentView = () => {
    if (pathname?.startsWith('/meetings')) return 'meetings';
    if (pathname?.startsWith('/profile')) return 'profile';
    if (pathname?.startsWith('/settings')) return 'settings';
    return 'meetings';
  };

  return (
    <AppContext.Provider value={{ meetings, fetchMeetings }}>
      <div className="flex h-screen overflow-hidden bg-white">
        {/* Tiny Left Sidebar */}
        <TinySidebar 
          activeView={getCurrentView()} 
          onViewChange={handleNavigation} 
        />

        {/* Main Content with Collapsible Sidebar */}
        <div className="flex-1 flex relative">
          {/* Collapsible Right Sidebar */}
          <Suspense fallback={null}>
            <SidebarWrapper
              isCollapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              view={getCurrentView()}
              meetings={meetings}
              onMeetingSelect={handleMeetingSelect}
              onAddMeeting={() => setShowAddDialog(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </Suspense>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden relative">
            {/* Collapse Button - Top Left of Main Content */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute left-4 top-6 z-20 w-8 h-8 text-black flex items-center justify-center transition-all hover:text-gray-600"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen size={20} />
              ) : (
                <PanelLeftClose size={20} />
              )}
            </button>
            {children}
          </div>
        </div>

        {/* Add Meeting Dialog */}
        <AddMeetingDialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSuccess={handleAddMeeting}
        />
      </div>
    </AppContext.Provider>
  );
}

