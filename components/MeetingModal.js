'use client';

import { useState, useEffect } from 'react';
import { meetingsApi } from '@/lib/api';

export default function MeetingModal({ meeting, onClose }) {
  const [note, setNote] = useState(meeting.note);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If meeting is completed but note not loaded, fetch it
    if (meeting.status === 'completed' && !note) {
      setLoading(true);
      meetingsApi.getMeetingNote(meeting.id)
        .then((response) => {
          setNote(response.note);
        })
        .catch((err) => {
          console.error('Error fetching note:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [meeting.id, meeting.status, note]);

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Meeting Details</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Meeting URL:</strong>{' '}
              <a
                href={meeting.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="meeting-url"
              >
                {meeting.meetingUrl}
              </a>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Status:</strong>{' '}
              <span className={getStatusClass(meeting.status)}>
                {meeting.status}
              </span>
            </div>
            {meeting.progress && (
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Progress:</strong> {meeting.progress.message}
                <div className="progress-bar" style={{ marginTop: '0.5rem' }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${meeting.progress.percentage}%` }}
                  />
                </div>
              </div>
            )}
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Created: {formatDate(meeting.createdAt)}
              {meeting.updatedAt && meeting.updatedAt !== meeting.createdAt && (
                <> • Updated: {formatDate(meeting.updatedAt)}</>
              )}
            </div>
          </div>

          {meeting.status === 'completed' && (
            <div>
              {loading ? (
                <div className="empty-state">
                  <p>Loading note...</p>
                </div>
              ) : note ? (
                <>
                  <div className="note-section">
                    <h3>Summary</h3>
                    <div className="note-summary">{note.summary}</div>
                  </div>

                  {note.keyPoints && note.keyPoints.length > 0 && (
                    <div className="note-section">
                      <h3>Key Points</h3>
                      <ul className="key-points">
                        {note.keyPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {note.participants && note.participants.length > 0 && (
                    <div className="note-section">
                      <h3>Participants</h3>
                      <div className="participants">
                        {note.participants.map((participant, index) => (
                          <span key={index} className="participant-tag">
                            {participant}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="note-section">
                    <h3>Meeting Stats</h3>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
                      <div>
                        <strong>Duration:</strong> {formatDuration(note.duration)}
                      </div>
                      {note.wordCount && (
                        <div>
                          <strong>Word Count:</strong> {note.wordCount}
                        </div>
                      )}
                      {note.generatedAt && (
                        <div>
                          <strong>Generated:</strong> {formatDate(note.generatedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <p>Note not available yet.</p>
                </div>
              )}
            </div>
          )}

          {meeting.status !== 'completed' && meeting.status !== 'failed' && (
            <div className="empty-state">
              <p>Meeting is still in progress. The note will be available once the meeting completes.</p>
            </div>
          )}

          {meeting.status === 'failed' && (
            <div className="alert alert-error">
              The meeting recording failed. Please try adding the meeting again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

