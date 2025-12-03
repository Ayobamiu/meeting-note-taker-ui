'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { meetingsApi } from '@/lib/api';
import MeetingDetailView from '@/components/meeting/MeetingDetailView';
import AppLayout from '@/components/layout/AppLayout';

function MeetingsContent() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchMeetings = async () => {
    try {
      const response = await meetingsApi.getAllMeetings();
      setMeetings(response.meetings || []);
      
      // If there's an ID in the URL, select that meeting
      const meetingId = searchParams?.get('id');
      if (meetingId) {
        const meeting = response.meetings?.find(m => m.id === meetingId);
        if (meeting) {
          handleMeetingSelect(meeting);
        }
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    const meetingId = searchParams?.get('id');
    if (meetingId && meetings.length > 0) {
      const meeting = meetings.find(m => m.id === meetingId);
      if (meeting && meeting.id !== selectedMeeting?.id) {
        handleMeetingSelect(meeting);
      }
    } else if (!meetingId && meetings.length > 0 && !selectedMeeting) {
      // Automatically select the first meeting if no meeting is selected
      const firstMeeting = meetings[0];
      router.replace(`/meetings?id=${firstMeeting.id}`, { scroll: false });
      handleMeetingSelect(firstMeeting);
    }
  }, [searchParams, meetings]);

  const handleMeetingSelect = async (meeting) => {
    setSelectedMeeting(meeting);
    
    if (meeting.status === 'completed' && !meeting.note) {
      try {
        const response = await meetingsApi.getMeetingNote(meeting.id);
        setSelectedMeeting({
          ...meeting,
          note: response.note,
          transcript: response.transcript,
        });
      } catch (err) {
        console.error('Error fetching note:', err);
      }
    }
  };

  return (
    <MeetingDetailView 
      meeting={selectedMeeting}
      onAddMeeting={() => setShowAddDialog(true)}
    />
  );
}

export default function MeetingsPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
        <MeetingsContent />
      </Suspense>
    </AppLayout>
  );
}
