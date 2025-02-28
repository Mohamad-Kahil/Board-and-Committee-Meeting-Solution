import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye, Video } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: string[];
  status: "upcoming" | "completed" | "cancelled" | "in-progress";
}

interface RecentMeetingsProps {
  meetings?: Meeting[];
  title?: string;
}

const RecentMeetings = ({
  meetings = [
    {
      id: "1",
      title: "Q2 Budget Review",
      date: "2023-06-15",
      time: "10:00 AM",
      participants: ["Ahmed Al-Mansour", "Sarah Johnson", "Mohammed Al-Farsi"],
      status: "upcoming",
    },
    {
      id: "2",
      title: "Strategic Planning Committee",
      date: "2023-06-12",
      time: "2:30 PM",
      participants: [
        "Fatima Al-Zahra",
        "John Smith",
        "Layla Mahmoud",
        "Robert Chen",
      ],
      status: "in-progress",
    },
    {
      id: "3",
      title: "Board of Directors Monthly Meeting",
      date: "2023-06-10",
      time: "9:00 AM",
      participants: [
        "Khalid Al-Saud",
        "Emma Wilson",
        "Tariq Hassan",
        "Sophia Lee",
      ],
      status: "completed",
    },
    {
      id: "4",
      title: "IT Infrastructure Review",
      date: "2023-06-05",
      time: "11:00 AM",
      participants: ["Omar Farooq", "Jessica Miller", "Zainab Al-Qahtani"],
      status: "cancelled",
    },
  ],
  title = "Recent & Upcoming Meetings",
}: RecentMeetingsProps) => {
  // Function to get badge variant based on meeting status
  const getStatusBadge = (status: Meeting["status"]) => {
    switch (status) {
      case "upcoming":
        return { variant: "secondary" as const, label: "Upcoming" };
      case "in-progress":
        return { variant: "default" as const, label: "In Progress" };
      case "completed":
        return { variant: "outline" as const, label: "Completed" };
      case "cancelled":
        return { variant: "destructive" as const, label: "Cancelled" };
      default:
        return { variant: "secondary" as const, label: "Unknown" };
    }
  };

  // Function to format date in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meeting</TableHead>
              <TableHead className="hidden md:table-cell">
                <Calendar className="h-4 w-4 mr-2 inline-block" />
                Date
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Clock className="h-4 w-4 mr-2 inline-block" />
                Time
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                Participants
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meetings.map((meeting) => {
              const statusBadge = getStatusBadge(meeting.status);
              return (
                <TableRow key={meeting.id}>
                  <TableCell className="font-medium">{meeting.title}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(meeting.date)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {meeting.time}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {meeting.participants
                        .slice(0, 2)
                        .map((participant, index) => (
                          <span key={index} className="text-xs">
                            {participant}
                            {index <
                            Math.min(2, meeting.participants.length) - 1
                              ? ", "
                              : ""}
                          </span>
                        ))}
                      {meeting.participants.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{meeting.participants.length - 2} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadge.variant}>
                      {statusBadge.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View Meeting Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {(meeting.status === "upcoming" ||
                        meeting.status === "in-progress") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Join Meeting"
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {meetings.length === 0 && (
        <div className="py-6 text-center text-muted-foreground">
          No meetings found
        </div>
      )}
    </div>
  );
};

export default RecentMeetings;
