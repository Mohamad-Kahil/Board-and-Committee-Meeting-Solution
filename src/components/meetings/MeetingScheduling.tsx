import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import {
  Clock,
  Users,
  Globe,
  Check,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  format,
  addDays,
  addHours,
  setHours,
  setMinutes,
  parseISO,
} from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import useLanguage from "@/lib/useLanguage";

// Mock data for meetings
const mockMeetings = [
  {
    id: "1",
    title: "Board Meeting Q2",
    description:
      "Quarterly board meeting to discuss financial results and strategy",
    date: "2023-06-15",
    startTime: "10:00",
    endTime: "12:00",
    participants: ["Ahmed Al-Mansour", "Sarah Johnson", "Mohammed Al-Farsi"],
    location: "Conference Room A",
    type: "physical",
    visibility: "private",
    isRecurring: false,
    organizer: "Ahmed Al-Mansour",
  },
  {
    id: "2",
    title: "Strategic Planning Committee",
    description: "Monthly strategic planning committee meeting",
    date: "2023-06-12",
    startTime: "14:30",
    endTime: "16:00",
    participants: [
      "Fatima Al-Zahra",
      "John Smith",
      "Layla Mahmoud",
      "Robert Chen",
    ],
    location: "Zoom Meeting",
    type: "virtual",
    visibility: "private",
    isRecurring: true,
    recurringPattern: "monthly",
    organizer: "Fatima Al-Zahra",
  },
  {
    id: "3",
    title: "Board of Directors Monthly Meeting",
    description: "Regular monthly board meeting",
    date: "2023-06-10",
    startTime: "09:00",
    endTime: "11:30",
    participants: [
      "Khalid Al-Saud",
      "Emma Wilson",
      "Tariq Hassan",
      "Sophia Lee",
    ],
    location: "Conference Room B + Zoom",
    type: "hybrid",
    visibility: "public",
    isRecurring: true,
    recurringPattern: "monthly",
    organizer: "Khalid Al-Saud",
  },
];

// Mock data for users/participants
const mockUsers = [
  {
    id: "1",
    name: "Ahmed Al-Mansour",
    email: "ahmed@example.com",
    role: "CEO",
  },
  { id: "2", name: "Sarah Johnson", email: "sarah@example.com", role: "CFO" },
  {
    id: "3",
    name: "Mohammed Al-Farsi",
    email: "mohammed@example.com",
    role: "CTO",
  },
  {
    id: "4",
    name: "Fatima Al-Zahra",
    email: "fatima@example.com",
    role: "COO",
  },
  {
    id: "5",
    name: "John Smith",
    email: "john@example.com",
    role: "Board Member",
  },
  {
    id: "6",
    name: "Layla Mahmoud",
    email: "layla@example.com",
    role: "Board Member",
  },
  {
    id: "7",
    name: "Robert Chen",
    email: "robert@example.com",
    role: "Board Member",
  },
  {
    id: "8",
    name: "Khalid Al-Saud",
    email: "khalid@example.com",
    role: "Chairman",
  },
  {
    id: "9",
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "Board Member",
  },
  {
    id: "10",
    name: "Tariq Hassan",
    email: "tariq@example.com",
    role: "Board Member",
  },
  {
    id: "11",
    name: "Sophia Lee",
    email: "sophia@example.com",
    role: "Secretary",
  },
];

// Mock data for meeting rooms
const mockRooms = [
  {
    id: "1",
    name: "Conference Room A",
    capacity: 20,
    hasVideoConference: true,
  },
  {
    id: "2",
    name: "Conference Room B",
    capacity: 15,
    hasVideoConference: true,
  },
  { id: "3", name: "Meeting Room 1", capacity: 8, hasVideoConference: false },
  { id: "4", name: "Meeting Room 2", capacity: 6, hasVideoConference: false },
  { id: "5", name: "Board Room", capacity: 12, hasVideoConference: true },
];

// Mock AI suggested times
const mockAISuggestedTimes = [
  { date: "2023-06-16", startTime: "10:00", endTime: "11:30", score: 0.95 },
  { date: "2023-06-16", startTime: "14:00", endTime: "15:30", score: 0.9 },
  { date: "2023-06-17", startTime: "09:00", endTime: "10:30", score: 0.85 },
  { date: "2023-06-17", startTime: "15:00", endTime: "16:30", score: 0.8 },
  { date: "2023-06-18", startTime: "11:00", endTime: "12:30", score: 0.75 },
];

// Mock AI suggested participants
const mockAISuggestedParticipants = [
  { id: "1", name: "Ahmed Al-Mansour", role: "CEO", score: 0.95 },
  { id: "2", name: "Sarah Johnson", role: "CFO", score: 0.9 },
  { id: "8", name: "Khalid Al-Saud", role: "Chairman", score: 0.85 },
  { id: "4", name: "Fatima Al-Zahra", role: "COO", score: 0.8 },
  { id: "11", name: "Sophia Lee", role: "Secretary", score: 0.75 },
];

interface MeetingCardProps {
  meeting: (typeof mockMeetings)[0];
  onClick?: () => void;
}

const MeetingCard = ({ meeting, onClick }: MeetingCardProps) => {
  const { t, language } = useLanguage();
  const dateLocale = language === "ar" ? ar : enUS;

  const formattedDate = format(new Date(meeting.date), "EEEE, MMMM d, yyyy", {
    locale: dateLocale,
  });

  const getTypeIcon = () => {
    switch (meeting.type) {
      case "virtual":
        return <Video className="h-4 w-4" />;
      case "physical":
        return <MapPin className="h-4 w-4" />;
      case "hybrid":
        return <MonitorSmartphone className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card
        className="h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800"
        onClick={onClick}
      >
        <div
          className={`h-2 w-full ${meeting.visibility === "private" ? "bg-amber-500" : "bg-green-500"}`}
        />
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{meeting.title}</CardTitle>
            <Badge
              variant={meeting.visibility === "private" ? "outline" : "default"}
            >
              {meeting.visibility === "private" ? t("private") : t("public")}
            </Badge>
          </div>
          <CardDescription className="text-sm">
            {formattedDate} • {meeting.startTime} - {meeting.endTime}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span>
                {meeting.participants.length} {t("participants")}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              {getTypeIcon()}
              <span className="ml-2">{meeting.location}</span>
            </div>
            {meeting.isRecurring && (
              <div className="flex items-center text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 mr-2" />
                <span>{t(meeting.recurringPattern as any)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface CalendarViewProps {
  meetings: typeof mockMeetings;
  onMeetingClick: (meeting: (typeof mockMeetings)[0]) => void;
  onDateClick: (date: Date) => void;
}

const CalendarView = ({
  meetings,
  onMeetingClick,
  onDateClick,
}: CalendarViewProps) => {
  const { language, t } = useLanguage();
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [yearInput, setYearInput] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [monthInput, setMonthInput] = useState<string>(
    (new Date().getMonth() + 1).toString(),
  );

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  // Jump to specific month and year
  const jumpToDate = () => {
    const year = parseInt(yearInput);
    const month = parseInt(monthInput) - 1; // JavaScript months are 0-indexed

    if (!isNaN(year) && !isNaN(month) && month >= 0 && month <= 11) {
      setCurrentMonth(new Date(year, month, 1));
    }
  };

  // Format the current month and year for display
  const formattedMonthYear = format(currentMonth, "MMMM yyyy", {
    locale: language === "ar" ? ar : enUS,
  });

  // Get days for the current month view
  const getDaysForMonthView = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // Day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDayOfMonth.getDay();

    // Last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    // Last day of previous month
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Add days from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: lastDayOfPrevMonth - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, lastDayOfPrevMonth - i),
      });
    }

    // Add days from current month
    for (let i = 1; i <= lastDayOfMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    // Add days from next month to fill the grid (up to 42 cells for 6 rows)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  const days = getDaysForMonthView();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
            {t("previous")}
          </Button>

          <h3 className="text-lg font-semibold">{formattedMonthYear}</h3>

          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            {t("next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Input
              className="w-16"
              value={monthInput}
              onChange={(e) => setMonthInput(e.target.value)}
              placeholder="MM"
            />
            <span>/</span>
            <Input
              className="w-20"
              value={yearInput}
              onChange={(e) => setYearInput(e.target.value)}
              placeholder="YYYY"
            />
          </div>
          <Button variant="outline" size="sm" onClick={jumpToDate}>
            {t("go")}
          </Button>
        </div>

        <div className="flex space-x-2 justify-center">
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("month")}
          >
            {t("month")}
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("week")}
          >
            {t("week")}
          </Button>
          <Button
            variant={view === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("day")}
          >
            {t("day")}
          </Button>
        </div>
      </div>

      <div className="p-4 overflow-auto">
        {view === "month" && (
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium py-2">
                {day}
              </div>
            ))}

            {days.map((dayInfo, i) => {
              const hasEvents =
                dayInfo.isCurrentMonth &&
                meetings.some((m) => {
                  const meetingDate = new Date(m.date);
                  return (
                    meetingDate.getDate() === dayInfo.day &&
                    meetingDate.getMonth() === currentMonth.getMonth() &&
                    meetingDate.getFullYear() === currentMonth.getFullYear()
                  );
                });

              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "aspect-square p-1 rounded-md cursor-pointer",
                    dayInfo.isCurrentMonth
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500",
                    hasEvents &&
                      "ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800",
                  )}
                  onClick={() => {
                    if (dayInfo.isCurrentMonth) {
                      onDateClick(dayInfo.date);
                    }
                  }}
                >
                  <div className="h-full w-full flex flex-col items-center justify-center">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        dayInfo.isCurrentMonth &&
                          dayInfo.day === new Date().getDate() &&
                          currentMonth.getMonth() === new Date().getMonth() &&
                          currentMonth.getFullYear() ===
                            new Date().getFullYear() &&
                          "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center",
                      )}
                    >
                      {dayInfo.day}
                    </span>
                    {hasEvents && (
                      <div className="mt-1 flex space-x-1">
                        {meetings
                          .filter((m) => {
                            const meetingDate = new Date(m.date);
                            return (
                              meetingDate.getDate() === dayInfo.day &&
                              meetingDate.getMonth() ===
                                currentMonth.getMonth() &&
                              meetingDate.getFullYear() ===
                                currentMonth.getFullYear()
                            );
                          })
                          .slice(0, 3)
                          .map((meeting, idx) => (
                            <div
                              key={idx}
                              className={`w-1.5 h-1.5 rounded-full ${meeting.visibility === "private" ? "bg-amber-500" : "bg-green-500"}`}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        {view === "week" && (
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Week View</h3>
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => (
                  <div key={day} className="border rounded-md p-2">
                    <div className="font-medium text-center pb-2 border-b">
                      {day}
                    </div>
                    <div className="mt-2 space-y-2">
                      {meetings
                        .filter((m) => {
                          const meetingDate = new Date(m.date);
                          const dayOfWeek = meetingDate.getDay();
                          return dayOfWeek === index;
                        })
                        .map((meeting, idx) => (
                          <div
                            key={idx}
                            className="text-xs p-1 rounded cursor-pointer bg-primary/10 hover:bg-primary/20"
                            onClick={() => onMeetingClick(meeting)}
                          >
                            {meeting.startTime} - {meeting.title}
                          </div>
                        ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
        {view === "day" && (
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Day View</h3>
            <div className="space-y-4">
              {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => {
                const hourMeetings = meetings.filter((m) => {
                  const startHour = parseInt(m.startTime.split(":")[0]);
                  return startHour === hour;
                });

                return (
                  <div key={hour} className="flex">
                    <div className="w-20 text-right pr-4 text-muted-foreground">
                      {hour}:00
                    </div>
                    <div className="flex-1 border-l pl-4 min-h-[60px]">
                      {hourMeetings.map((meeting, idx) => (
                        <div
                          key={idx}
                          className="mb-2 p-2 rounded cursor-pointer bg-primary/10 hover:bg-primary/20"
                          onClick={() => onMeetingClick(meeting)}
                        >
                          {meeting.title} ({meeting.startTime} -{" "}
                          {meeting.endTime})
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface CreateMeetingFormProps {
  onSubmit: (meeting: any) => void;
  onCancel: () => void;
  initialMeeting?: (typeof mockMeetings)[0];
}

const CreateMeetingForm = ({
  onSubmit,
  onCancel,
  initialMeeting,
}: CreateMeetingFormProps) => {
  const { t, language } = useLanguage();
  const [title, setTitle] = useState(initialMeeting?.title || "");
  const [description, setDescription] = useState(
    initialMeeting?.description || "",
  );
  const [date, setDate] = useState<Date | undefined>(
    initialMeeting ? new Date(initialMeeting.date) : new Date(),
  );
  const [startTime, setStartTime] = useState(
    initialMeeting?.startTime || "09:00",
  );
  const [endTime, setEndTime] = useState(initialMeeting?.endTime || "10:00");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    initialMeeting?.participants || [],
  );
  const [location, setLocation] = useState(initialMeeting?.location || "");
  const [type, setType] = useState<"virtual" | "physical" | "hybrid">(
    (initialMeeting?.type as "virtual" | "physical" | "hybrid") || "physical",
  );
  const [visibility, setVisibility] = useState<"public" | "private">(
    (initialMeeting?.visibility as "public" | "private") || "private",
  );
  const [isRecurring, setIsRecurring] = useState(
    initialMeeting?.isRecurring || false,
  );
  const [recurringPattern, setRecurringPattern] = useState(
    initialMeeting?.recurringPattern || "weekly",
  );
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [isUsingAISuggestion, setIsUsingAISuggestion] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialMeeting?.id || Date.now().toString(),
      title,
      description,
      date: date ? format(date, "yyyy-MM-dd") : "",
      startTime,
      endTime,
      participants: selectedParticipants,
      location,
      type,
      visibility,
      isRecurring,
      recurringPattern: isRecurring ? recurringPattern : null,
      organizer: "Ahmed Al-Mansour", // Current user
    });
  };

  const handleAISuggestionSelect = (
    suggestion: (typeof mockAISuggestedTimes)[0],
  ) => {
    setDate(new Date(suggestion.date));
    setStartTime(suggestion.startTime);
    setEndTime(suggestion.endTime);
    setIsUsingAISuggestion(true);
  };

  const handleParticipantSelect = (participantName: string) => {
    if (selectedParticipants.includes(participantName)) {
      setSelectedParticipants(
        selectedParticipants.filter((p) => p !== participantName),
      );
    } else {
      setSelectedParticipants([...selectedParticipants, participantName]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">{t("meetingTitle")}</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t("meetingDescription")}</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">{t("date")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", {
                      locale: language === "ar" ? ar : enUS,
                    })
                  ) : (
                    <span>{t("selectDate")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>{t("time")}</Label>
            <div className="flex space-x-2">
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("selectTime")} />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, "0");
                    return [
                      <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                        {`${hour}:00`}
                      </SelectItem>,
                      <SelectItem key={`${hour}:30`} value={`${hour}:30`}>
                        {`${hour}:30`}
                      </SelectItem>,
                    ];
                  }).flat()}
                </SelectContent>
              </Select>
              <span className="flex items-center">-</span>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("selectTime")} />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, "0");
                    return [
                      <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                        {`${hour}:00`}
                      </SelectItem>,
                      <SelectItem key={`${hour}:30`} value={`${hour}:30`}>
                        {`${hour}:30`}
                      </SelectItem>,
                    ];
                  }).flat()}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="participants">{t("participants")}</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              className="flex items-center gap-1 text-primary"
            >
              <Sparkles className="h-4 w-4" />
              {t("aiSuggestions")}
            </Button>
          </div>
          <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
            {showAISuggestions ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-sm font-medium">
                    {t("suggestedParticipants")}
                  </span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {t("aiOptimized")}
                  </Badge>
                </div>
                {mockAISuggestedParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`participant-${participant.id}`}
                        checked={selectedParticipants.includes(
                          participant.name,
                        )}
                        onCheckedChange={() =>
                          handleParticipantSelect(participant.name)
                        }
                      />
                      <label
                        htmlFor={`participant-${participant.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {participant.name} ({participant.role})
                      </label>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round(participant.score * 100)}% match
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setShowAISuggestions(false)}
                >
                  {t("cancel")}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedParticipants.includes(user.name)}
                      onCheckedChange={() => handleParticipantSelect(user.name)}
                    />
                    <label
                      htmlFor={`user-${user.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {user.name} ({user.role})
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">{t("location")}</Label>
            <Select
              value={type}
              onValueChange={(value: "virtual" | "physical" | "hybrid") =>
                setType(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("location")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physical">{t("physical")}</SelectItem>
                <SelectItem value="virtual">{t("virtual")}</SelectItem>
                <SelectItem value="hybrid">{t("hybrid")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">{t("meetingRoom")}</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    type === "virtual" ? t("videoConference") : t("meetingRoom")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {type === "virtual" ? (
                  <>
                    <SelectItem value="Zoom Meeting">Zoom Meeting</SelectItem>
                    <SelectItem value="Microsoft Teams">
                      Microsoft Teams
                    </SelectItem>
                    <SelectItem value="Google Meet">Google Meet</SelectItem>
                  </>
                ) : (
                  mockRooms.map((room) => (
                    <SelectItem key={room.id} value={room.name}>
                      {room.name} (Capacity: {room.capacity})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="visibility">{t("visibility")}</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="visibility"
                  checked={visibility === "public"}
                  onCheckedChange={(checked) =>
                    setVisibility(checked ? "public" : "private")
                  }
                />
                <Label htmlFor="visibility">
                  {visibility === "public" ? t("public") : t("private")}
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="recurring">{t("recurring")}</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
                <Label htmlFor="recurring">
                  {isRecurring ? t("recurring") : t("cancel")}
                </Label>
              </div>
            </div>
            {isRecurring && (
              <Select
                value={recurringPattern}
                onValueChange={setRecurringPattern}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("recurring")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{t("daily")}</SelectItem>
                  <SelectItem value="weekly">{t("weekly")}</SelectItem>
                  <SelectItem value="monthly">{t("monthly")}</SelectItem>
                  <SelectItem value="custom">{t("custom")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {isUsingAISuggestion && (
          <div className="bg-primary/10 p-4 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 text-primary mr-2" />
              <div>
                <p className="text-sm font-medium">{t("aiOptimized")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("bestTimeSlot")}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsUsingAISuggestion(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>{t("suggestedTimes")}</Label>
            <Badge variant="outline" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {t("aiOptimized")}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {mockAISuggestedTimes.map((suggestion, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                className={cn(
                  "flex flex-col items-start h-auto p-3",
                  isUsingAISuggestion &&
                    date &&
                    format(date, "yyyy-MM-dd") === suggestion.date &&
                    startTime === suggestion.startTime &&
                    "border-primary bg-primary/10",
                )}
                onClick={() => handleAISuggestionSelect(suggestion)}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-medium">
                    {format(new Date(suggestion.date), "EEE, MMM d", {
                      locale: language === "ar" ? ar : enUS,
                    })}
                  </span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    {Math.round(suggestion.score * 100)}%
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {suggestion.startTime} - {suggestion.endTime}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="submit">{t("save")}</Button>
      </div>
    </form>
  );
};

interface MeetingSchedulingProps {
  defaultView?: "calendar" | "list";
  isRTL?: boolean;
}

const MeetingScheduling = ({
  defaultView = "calendar",
  isRTL = false,
}: MeetingSchedulingProps) => {
  const { language, t, toggleLanguage } = useLanguage();
  const [activeView, setActiveView] = useState<"calendar" | "list">(
    defaultView,
  );
  const [meetings, setMeetings] = useState(mockMeetings);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<
    (typeof mockMeetings)[0] | null
  >(null);
  const [dir, setDir] = useState(isRTL ? "rtl" : "ltr");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setDir(language === "ar" ? "rtl" : "ltr");
  }, [language]);

  const handleCreateMeeting = (meeting: any) => {
    if (selectedMeeting) {
      // Update existing meeting
      setMeetings(meetings.map((m) => (m.id === meeting.id ? meeting : m)));
    } else {
      // Create new meeting
      setMeetings([...meetings, meeting]);
    }
    setIsCreateDialogOpen(false);
    setSelectedMeeting(null);
  };

  const handleMeetingClick = (meeting: (typeof mockMeetings)[0]) => {
    setSelectedMeeting(meeting);
    setIsCreateDialogOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedMeeting(null);
    setIsCreateDialogOpen(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="flex h-screen overflow-hidden" dir={dir}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 overflow-auto bg-gradient-to-br from-background to-background/80">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">{t("meetingScheduling")}</h1>
              <p className="text-muted-foreground">
                {t("schedule")} {t("meetingDescription").toLowerCase()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={toggleLanguage}
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                {language === "en" ? t("switchToArabic") : t("switchToEnglish")}
              </Button>
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("createMeeting")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedMeeting ? t("meetingTitle") : t("createMeeting")}
                    </DialogTitle>
                    <DialogDescription>
                      {t("meetingDescription")}
                    </DialogDescription>
                  </DialogHeader>
                  <CreateMeetingForm
                    onSubmit={handleCreateMeeting}
                    onCancel={() => setIsCreateDialogOpen(false)}
                    initialMeeting={selectedMeeting || undefined}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mb-6">
            <Tabs
              value={activeView}
              onValueChange={(value: "calendar" | "list") =>
                setActiveView(value)
              }
            >
              <TabsList>
                <TabsTrigger value="calendar">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {t("calendar")}
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-2" />
                  {t("list")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {activeView === "calendar" ? (
              <CalendarView
                meetings={meetings}
                onMeetingClick={handleMeetingClick}
                onDateClick={handleDateClick}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meetings.map((meeting) => (
                  <motion.div key={meeting.id} variants={itemVariants}>
                    <MeetingCard
                      meeting={meeting}
                      onClick={() => handleMeetingClick(meeting)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MeetingScheduling;

// Missing icon imports
const Video = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </svg>
);

const MapPin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const MonitorSmartphone = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" />
    <path d="M10 19v-3.96 3.15" />
    <path d="M7 19h5" />
    <rect width="6" height="10" x="16" y="12" rx="2" />
  </svg>
);

const RefreshCw = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

const List = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const Plus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
