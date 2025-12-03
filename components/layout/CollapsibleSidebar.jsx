"use client";

import { useState } from "react";
import { Search, Plus, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import {
  getMeetingPlatform,
  getPlatformIcon,
  getPlatformColor,
} from "@/lib/meetingPlatform";
import { cn } from "@/lib/utils";

export default function CollapsibleSidebar({
  isCollapsed,
  onToggle,
  view,
  meetings = [],
  onMeetingSelect,
  onAddMeeting,
  searchQuery,
  onSearchChange,
  selectedMeetingId,
}) {
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const handleSearch = (value) => {
    setLocalSearchQuery(value);
    onSearchChange(value);
  };

  const filteredMeetings = meetings.filter((meeting) => {
    if (!localSearchQuery) return true;
    const query = localSearchQuery.toLowerCase();
    return (
      meeting.meetingUrl?.toLowerCase().includes(query) ||
      meeting.status?.toLowerCase().includes(query)
    );
  });

  if (view === "meetings") {
    return (
      <div
        className={cn(
          "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative",
          isCollapsed ? "w-0 overflow-hidden" : "w-80"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-black">Meetings</h2>
        </div>

        {/* Search and Add Button */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search meetings..."
              value={localSearchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 bg-white border-gray-200"
            />
          </div>
          <Button
            onClick={onAddMeeting}
            className="w-full bg-black text-white hover:bg-gray-900"
            size="sm"
          >
            <Plus size={16} className="mr-2" />
            Add Meeting
          </Button>
        </div>

        {/* Meetings List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredMeetings.length === 0 ? (
              <Empty>
                <EmptyMedia variant="icon">
                  <Calendar />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>
                    {localSearchQuery ? "No meetings found" : "No meetings yet"}
                  </EmptyTitle>
                  <EmptyDescription>
                    {localSearchQuery
                      ? "Try adjusting your search terms"
                      : "Get started by adding your first meeting"}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="space-y-2">
                {filteredMeetings.map((meeting) => (
                  <MeetingListItem
                    key={meeting.id}
                    meeting={meeting}
                    onClick={() => onMeetingSelect(meeting)}
                    isSelected={meeting.id === selectedMeetingId}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Profile or Settings view
  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative",
        isCollapsed ? "w-0 overflow-hidden" : "w-80"
      )}
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-black capitalize">{view}</h2>
      </div>
      <div className="p-4">
        <p className="text-gray-500 text-sm">Coming soon...</p>
      </div>
    </div>
  );
}

function MeetingListItem({ meeting, onClick, isSelected }) {
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-gray-100 text-gray-700",
      joining: "bg-gray-100 text-gray-700",
      recording: "bg-gray-100 text-gray-700",
      processing: "bg-gray-100 text-gray-700",
      completed: "bg-black text-white",
      failed: "bg-gray-100 text-gray-700",
    };
    return colors[status] || colors.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const platform = getMeetingPlatform(meeting.meetingUrl);
  const PlatformIcon = getPlatformIcon(platform);

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-3 rounded-lg border cursor-pointer transition-colors",
        isSelected
          ? "border-black bg-gray-50"
          : "border-gray-200 hover:border-black hover:bg-gray-50"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {PlatformIcon && (
            <PlatformIcon size={18} className="mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black truncate">
              {meeting.meetingUrl?.split("/").pop() || "Meeting"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(meeting.createdAt)}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium capitalize ml-2 flex-shrink-0",
            getStatusColor(meeting.status)
          )}
        >
          {meeting.status}
        </span>
      </div>
      {meeting.progress && (
        <div className="mt-2">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${meeting.progress.percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {meeting.progress.message}
          </p>
        </div>
      )}
    </div>
  );
}
