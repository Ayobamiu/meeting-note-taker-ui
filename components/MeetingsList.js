'use client';

export default function MeetingsList({ meetings, onMeetingClick }) {
  if (meetings.length === 0) {
    return (
      <div className="empty-state">
        <p>No meetings yet. Add a meeting to get started!</p>
      </div>
    );
  }

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="meetings-list">
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="meeting-item"
          onClick={() => onMeetingClick(meeting)}
        >
          <div className="meeting-header">
            <a
              href={meeting.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="meeting-url"
              onClick={(e) => e.stopPropagation()}
            >
              {meeting.meetingUrl}
            </a>
            <span className={getStatusClass(meeting.status)}>
              {meeting.status}
            </span>
          </div>

          {meeting.progress && (
            <div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${meeting.progress.percentage}%` }}
                />
              </div>
              <div className="progress-text">
                {meeting.progress.message}
              </div>
            </div>
          )}

          <div className="meeting-meta">
            <span>Created: {formatDate(meeting.createdAt)}</span>
            {meeting.updatedAt && meeting.updatedAt !== meeting.createdAt && (
              <span>Updated: {formatDate(meeting.updatedAt)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

