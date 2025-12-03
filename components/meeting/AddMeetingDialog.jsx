'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { meetingsApi } from '@/lib/api';

export default function AddMeetingDialog({ open, onClose, onSuccess }) {
  const [meetingUrl, setMeetingUrl] = useState('');
  const [grantId, setGrantId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!meetingUrl || !grantId) {
      setError('Both fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await meetingsApi.addMeeting(meetingUrl, grantId);
      setMeetingUrl('');
      setGrantId('');
      onSuccess();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to add meeting';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 m-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add New Meeting</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="meetingUrl" className="block text-sm font-medium text-black mb-1.5">
              Google Meet URL
            </label>
            <Input
              id="meetingUrl"
              type="url"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              placeholder="https://meet.google.com/abc-defg-hij"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="grantId" className="block text-sm font-medium text-black mb-1.5">
              Nylas Grant ID
            </label>
            <Input
              id="grantId"
              type="text"
              value={grantId}
              onChange={(e) => setGrantId(e.target.value)}
              placeholder="Enter your Nylas Grant ID"
              required
              disabled={loading}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button type="submit" disabled={loading} className="flex-1 bg-black text-white hover:bg-gray-900">
              {loading ? 'Adding...' : 'Add Meeting'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="border-gray-200">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

