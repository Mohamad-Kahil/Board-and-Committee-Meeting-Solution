import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  Video,
  Plus,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import useLanguage from "@/lib/useLanguage";
import BoardMeetingWizard from "../agenda/BoardMeetingWizard";

// Mock data for meetings
const mockMeetings = [
  {
    id: "1",
    title: "Q2 Board Meeting",
    description:
      "Quarterly board meeting to discuss financial results and strategy",
    date: "2023-06-15",
    startTime: "10:00",
    endTime: "12:00",
    participants: ["Ahmed Al-Mansour", "Sarah Johnson", "Mohammed Al-Farsi"],
    location: "Conference Room A",
    type: "board", // Special type for board meetings
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
    type: "committee",
    visibility: "private",
    isRecurring: true,
    recurringPattern: "monthly",
    organizer: "Fatima Al-Zahra",
  },
  {
    id: "3",
    title: "Annual General Meeting",
    description: "Annual general meeting for all shareholders",
    date: "2023-07-10",
    startTime: "09:00",
    endTime: "11:30",
    participants: [
      "Khalid Al-Saud",
      "Emma Wilson",
      "Tariq Hassan",
      "Sophia Lee",
    ],
    location: "Conference Room B + Zoom",
    type: "board", // Special type for board meetings
    visibility: "public",
    isRecurring: false,
    organizer: "Khalid Al-Saud",
  },
  {
    id: "4",
    title: "Executive Committee Meeting",
    description: "Monthly executive committee meeting",
    date: "2023-06-20",
    startTime: "13:00",
    endTime: "15:00",
    participants: ["Ahmed Al-Mansour", "Fatima Al-Zahra", "Mohammed Al-Farsi"],
    location: "Executive Conference Room",
    type: "committee",
    visibility: "private",
    isRecurring: true,
    recurringPattern: "monthly",
    organizer: "Ahmed Al-Mansour",
  },
  {
    id: "5",
    title: "Special Board Meeting",
    description: "Special board meeting to discuss urgent matters",
    date: "2023-06-25",
    startTime: "11:00",
    endTime: "13:00",
    participants: [
      "Ahmed Al-Mansour",
      "Sarah Johnson",
      "Mohammed Al-Farsi",
      "Fatima Al-Zahra",
      "John Smith",
    ],
    location: "Main Boardroom",
    type: "board", // Special type for board meetings
    visibility: "private",
    isRecurring: false,
    organizer: "Ahmed Al-Mansour",
  },
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
      case "board":
        return <Users className="h-4 w-4" />;
      case "committee":
        return <Users className="h-4 w-4" />;
      case "virtual":
        return <Video className="h-4 w-4" />;
      case "physical":
        return <MapPin className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  // Special styling for board meetings
  const isBoardMeeting = meeting.type === "board";
  const cardBorderClass = isBoardMeeting ? "border-primary" : "";
  const headerBgClass = isBoardMeeting
    ? "bg-primary"
    : meeting.visibility === "private"
      ? "bg-amber-500"
      : "bg-green-500";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card
        className={cn(
          "h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800",
          cardBorderClass,
        )}
        onClick={onClick}
      >
        <div className={`h-2 w-full ${headerBgClass}`} />
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{meeting.title}</CardTitle>
            <Badge
              variant={meeting.visibility === "private" ? "outline" : "default"}
            >
              {meeting.visibility === "private"
                ? t("private") || "Private"
                : t("public") || "Public"}
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
                {meeting.participants.length}{" "}
                {t("participants") || "participants"}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              {getTypeIcon()}
              <span className="ml-2">{meeting.location}</span>
            </div>
            {meeting.isRecurring && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  {t(meeting.recurringPattern as any) ||
                    meeting.recurringPattern}
                </span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex -space-x-2">
            {meeting.participants.slice(0, 3).map((participant, index) => (
              <Avatar
                key={index}
                className="border-2 border-background h-8 w-8"
              >
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant}`}
                />
                <AvatarFallback>{participant.substring(0, 2)}</AvatarFallback>
              </Avatar>
            ))}
            {meeting.participants.length > 3 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                +{meeting.participants.length - 3}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const MeetingDashboard = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const [meetings, setMeetings] = useState(mockMeetings);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Force language update when component mounts
  React.useEffect(() => {
    // This will trigger the useEffect in useLanguage to apply RTL/LTR styles
    const event = new Event("languagechange");
    window.dispatchEvent(event);
  }, []);

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

  const handleCreateMeeting = (meetingData: any) => {
    // In a real app, this would send data to the backend
    console.log("New meeting created:", meetingData);
    setIsWizardOpen(false);
    // Optionally add the new meeting to the list
    // setMeetings([...meetings, meetingData]);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 overflow-auto bg-gradient-to-br from-background to-background/80">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">
                {t("meetingDashboard") || "Meeting Dashboard"}
              </h1>
              <p className="text-muted-foreground">
                {t("viewAllMeetings") || "View and manage all meetings"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={toggleLanguage}
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                {language === "en"
                  ? t("switchToArabic") || "Switch to Arabic"
                  : t("switchToEnglish") || "Switch to English"}
              </Button>

              <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("newBoardMeeting") || "New Board Meeting"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                  <BoardMeetingWizard onComplete={handleCreateMeeting} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("upcomingMeetings") || "Upcoming Meetings"}
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {meetings.map((meeting) => (
                <motion.div key={meeting.id} variants={itemVariants}>
                  <MeetingCard meeting={meeting} />
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("boardMeetings") || "Board Meetings"}
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {meetings
                .filter((meeting) => meeting.type === "board")
                .map((meeting) => (
                  <motion.div key={meeting.id} variants={itemVariants}>
                    <MeetingCard meeting={meeting} />
                  </motion.div>
                ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDashboard;
