'use client';

import { useState } from 'react';

export default function MeetingForm({ onSubmit }) {
  const [meetingUrl, setMeetingUrl] = useState('');
  const [grantId, setGrantId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!meetingUrl || !grantId) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(meetingUrl, grantId);
      // Reset form on success
      setMeetingUrl('');
      setGrantId('');
    } catch (err) {
      // Error is handled by parent
      console.error('Error adding meeting:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Add New Meeting</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="meetingUrl">Google Meet URL</label>
          <input
            type="url"
            id="meetingUrl"
            value={meetingUrl}
            onChange={(e) => setMeetingUrl(e.target.value)}
            placeholder="https://meet.google.com/abc-defg-hij"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="grantId">Nylas Grant ID</label>
          <input
            type="text"
            id="grantId"
            value={grantId}
            onChange={(e) => setGrantId(e.target.value)}
            placeholder="Enter your Nylas Grant ID"
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"></span>
              Adding...
            </>
          ) : (
            'Add Meeting'
          )}
        </button>
      </form>
    </section>
  );
}

