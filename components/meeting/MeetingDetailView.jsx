"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  Share2,
  Calendar,
  Users as UsersIcon,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
  getPlatformName,
} from "@/lib/meetingPlatform";
import { meetingsApi } from "@/lib/api";

export default function MeetingDetailView({ meeting, onAddMeeting }) {
  const [fullMeeting, setFullMeeting] = useState(meeting);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  // Fetch full meeting data if needed
  useEffect(() => {
    if (meeting && (!meeting.note || !meeting.transcript)) {
      const fetchFullMeeting = async () => {
        try {
          const response = await meetingsApi.getMeetingStatus(meeting.id);
          setFullMeeting(response.meeting);

          if (
            response.meeting.status === "completed" &&
            !response.meeting.note
          ) {
            try {
              const noteResponse = await meetingsApi.getMeetingNote(meeting.id);
              setFullMeeting((prev) => ({
                ...prev,
                note: noteResponse.note,
                transcript: noteResponse.transcript,
              }));
            } catch (err) {
              console.error("Error fetching note:", err);
            }
          }
        } catch (err) {
          console.error("Error fetching meeting:", err);
        }
      };
      fetchFullMeeting();
    } else {
      setFullMeeting(meeting);
    }
  }, [meeting]);

  // Poll for updates if meeting is active
  useEffect(() => {
    if (
      !fullMeeting ||
      fullMeeting.status === "completed" ||
      fullMeeting.status === "failed"
    ) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await meetingsApi.getMeetingStatus(fullMeeting.id);
        setFullMeeting(response.meeting);
      } catch (err) {
        console.error("Error updating meeting:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fullMeeting]);

  if (!fullMeeting) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <Empty>
          <EmptyMedia variant="icon">
            <Video />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No meeting selected</EmptyTitle>
            <EmptyDescription>
              Select a meeting from the sidebar or add a new one to get started
            </EmptyDescription>
          </EmptyHeader>
          <Button
            onClick={onAddMeeting}
            className="bg-black text-white hover:bg-gray-900"
          >
            Add Your First Meeting
          </Button>
        </Empty>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopyNote = async () => {
    if (!fullMeeting.note) return;

    const noteText = [
      fullMeeting.note.summary,
      "",
      "Key Points:",
      ...fullMeeting.note.keyPoints.map((p) => `• ${p}`),
      "",
      `Participants: ${fullMeeting.note.participants.join(", ")}`,
      `Duration: ${Math.floor(fullMeeting.note.duration / 60)}m ${
        fullMeeting.note.duration % 60
      }s`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(noteText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (!fullMeeting.note) return;

    const noteText = [
      fullMeeting.note.summary,
      "",
      "Key Points:",
      ...fullMeeting.note.keyPoints.map((p) => `• ${p}`),
    ].join("\n");

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Meeting Notes",
          text: noteText,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      handleCopyNote();
    }
  };

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

  const platform = getMeetingPlatform(fullMeeting.meetingUrl);
  const PlatformIcon = getPlatformIcon(platform);
  const platformName = getPlatformName(platform);

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Title on Top - Outside White Box */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            {PlatformIcon && <PlatformIcon size={28} />}
            <h1 className="text-3xl font-semibold text-black">
              {fullMeeting.meetingUrl?.split("/").pop() || "Meeting"}
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(fullMeeting.createdAt)}</span>
            </div>
            <Badge className={getStatusColor(fullMeeting.status)}>
              {fullMeeting.status}
            </Badge>
          </div>
        </div>

        {/* Participants */}
        {fullMeeting.note?.participants &&
          fullMeeting.note.participants.length > 0 && (
            <Card className="p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <UsersIcon size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-black">
                  Participants
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {fullMeeting.note.participants.map((participant, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full"
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs bg-white text-black">
                        {participant.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-black">{participant}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

        {/* Audio Player */}
        {(fullMeeting.recording || fullMeeting.recording_url) && (
          <Card className="p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-black">Recording</h2>
            <audio controls className="w-full">
              <source
                src={fullMeeting.recording || fullMeeting.recording_url}
                type="audio/mpeg"
              />
              Your browser does not support the audio element.
            </audio>
          </Card>
        )}

        {/* Note Actions */}
        {fullMeeting.note && (
          <Card className="p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-black">
                Meeting Notes
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyNote}
                  className={
                    copied ? "bg-gray-100 border-gray-300" : "border-gray-200"
                  }
                >
                  <Copy size={16} className="mr-2" />
                  {copied ? "Copied!" : "Copy Note"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="border-gray-200"
                >
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <Separator className="mb-6 bg-gray-200" />

            {/* Note Content */}
            <div className="space-y-6">
              {/* Summary */}
              {fullMeeting.note.summary && (
                <div>
                  <h3 className="text-sm font-semibold text-black mb-2">
                    Summary
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {fullMeeting.note.summary}
                  </p>
                </div>
              )}

              {/* Key Points */}
              {fullMeeting.note.keyPoints &&
                fullMeeting.note.keyPoints.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-black mb-3">
                      Key Points
                    </h3>
                    <ul className="space-y-2">
                      {fullMeeting.note.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-black mt-1">•</span>
                          <span className="text-gray-600 flex-1">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Meeting Stats */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                {fullMeeting.note.duration && (
                  <div>
                    <span className="text-xs text-gray-500">Duration</span>
                    <p className="text-sm font-medium text-black">
                      {Math.floor(fullMeeting.note.duration / 60)}m{" "}
                      {fullMeeting.note.duration % 60}s
                    </p>
                  </div>
                )}
                {fullMeeting.note.wordCount && (
                  <div>
                    <span className="text-xs text-gray-500">Words</span>
                    <p className="text-sm font-medium text-black">
                      {fullMeeting.note.wordCount}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Loading/Processing State */}
        {!fullMeeting.note && fullMeeting.status !== "failed" && (
          <Card className="p-6 border border-gray-200">
            <div className="text-center py-8">
              {fullMeeting.progress && (
                <>
                  <div className="mb-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden max-w-md mx-auto">
                      <div
                        className="h-full bg-black transition-all duration-300"
                        style={{ width: `${fullMeeting.progress.percentage}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {fullMeeting.progress.message}
                  </p>
                </>
              )}
              {!fullMeeting.progress && (
                <p className="text-gray-500">Processing meeting...</p>
              )}
            </div>
          </Card>
        )}

        {/* Error State */}
        {fullMeeting.status === "failed" && (
          <Card className="p-6 border border-gray-300 bg-gray-50">
            <p className="text-gray-700">
              Meeting recording failed. Please try again.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
