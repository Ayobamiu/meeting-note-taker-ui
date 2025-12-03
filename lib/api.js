import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const meetingsApi = {
  // Add a new meeting
  addMeeting: async (meetingUrl, grantId) => {
    const response = await api.post('/meetings', {
      meetingUrl,
      grantId,
    });
    return response.data;
  },

  // Get all meetings
  getAllMeetings: async () => {
    const response = await api.get('/meetings');
    return response.data;
  },

  // Get meeting status
  getMeetingStatus: async (meetingId) => {
    const response = await api.get(`/meetings/${meetingId}`);
    return response.data;
  },

  // Get meeting note
  getMeetingNote: async (meetingId) => {
    const response = await api.get(`/meetings/${meetingId}/note`);
    return response.data;
  },

  // Regenerate meeting note
  regenerateNote: async (meetingId) => {
    const url = `/meetings/${meetingId}/regenerate-note`;
    console.log('📡 Calling API:', url);
    console.log('📡 Full URL:', `${api.defaults.baseURL}${url}`);
    const response = await api.post(url);
    return response.data;
  },
};

export default api;

