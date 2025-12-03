'use client';

import { useState, useEffect } from 'react';
import { meetingsApi } from '@/lib/api';
import MeetingForm from '@/components/MeetingForm';
import MeetingsList from '@/components/MeetingsList';
import MeetingModal from '@/components/MeetingModal';

export default function Home() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

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
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [meetings]);

  const handleAddMeeting = async (meetingUrl, grantId) => {
    try {
      setError(null);
      const response = await meetingsApi.addMeeting(meetingUrl, grantId);
      await fetchMeetings(); // Refresh list
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to add meeting';
      setError(errorMsg);
      throw err;
    }
  };

  const handleMeetingClick = async (meeting) => {
    setSelectedMeeting(meeting);
    setShowModal(true);

    // If meeting is completed, try to fetch the note
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

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMeeting(null);
  };

  return (
    <div className="container">
      <header>
        <h1>📝 Meeting Note Taker</h1>
        <p className="subtitle">Automatically join Google Meet meetings and generate notes</p>
      </header>

      <main>
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <MeetingForm onSubmit={handleAddMeeting} />

        <div className="card">
          <div className="section-header">
            <h2>Meetings</h2>
            <button className="btn btn-secondary" onClick={fetchMeetings}>
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="empty-state">
              <p>Loading meetings...</p>
            </div>
          ) : (
            <MeetingsList 
              meetings={meetings} 
              onMeetingClick={handleMeetingClick}
            />
          )}
        </div>
      </main>

      {showModal && selectedMeeting && (
        <MeetingModal
          meeting={selectedMeeting}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

