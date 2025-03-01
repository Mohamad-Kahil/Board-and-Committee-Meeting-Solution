import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import useLanguage from "@/lib/useLanguage";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Import step components
import MeetingDetailsStep from "./wizard/MeetingDetailsStep";
import ParticipantsStep from "./wizard/ParticipantsStep";
import AgendaStep from "./wizard/AgendaStep";
import DocumentsStep from "./wizard/DocumentsStep";
import NotificationsStep from "./wizard/NotificationsStep";
import ReviewStep from "./wizard/ReviewStep";

// Import helper function
import { getDefaultAgendaItems } from "./data/meetingData";

interface BoardMeetingWizardProps {
  onComplete?: (meetingData: any) => void;
}

const BoardMeetingWizard: React.FC<BoardMeetingWizardProps> = ({
  onComplete = () => {},
}) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    meetingType: "",
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    venueDetails: "",
    isPublic: false,
    description: "",
    boardMembers: [],
    memberRoles: {},
    invitees: [],
    inviteeAccess: {},
    temporaryAccess: false,
    agendaItems: [],
    documents: [],
    restrictDownloads: false,
    notificationMethods: ["email", "inApp"],
    initialReminder: "1day",
    followUpReminder: "1hour",
    requireRsvp: false,
    allowProxies: false,
    sendMeetingMaterials: false,
    recordMeeting: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (newData: any) => {
    setFormData(newData);

    // If meeting type changes, update agenda items
    if (newData.meetingType && newData.meetingType !== formData.meetingType) {
      const defaultAgendaItems = getDefaultAgendaItems(newData.meetingType);
      setFormData({
        ...newData,
        agendaItems: defaultAgendaItems,
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Validate meeting details
      if (!formData.meetingType) {
        newErrors.meetingType =
          t("meetingTypeRequired") || "Meeting type is required";
      }
      if (!formData.title) {
        newErrors.title = t("titleRequired") || "Title is required";
      }
      if (!formData.date) {
        newErrors.date = t("dateRequired") || "Date is required";
      }
      if (!formData.startTime) {
        newErrors.startTime =
          t("startTimeRequired") || "Start time is required";
      }
      if (!formData.endTime) {
        newErrors.endTime = t("endTimeRequired") || "End time is required";
      }
      if (!formData.venue) {
        newErrors.venue = t("venueRequired") || "Venue is required";
      }
      if (formData.venue && !formData.venueDetails) {
        newErrors.venueDetails =
          t("venueDetailsRequired") || "Venue details are required";
      }
    } else if (step === 2) {
      // Validate participants
      if (formData.boardMembers.length === 0) {
        newErrors.boardMembers =
          t("boardMembersRequired") || "At least one board member is required";
      }
    } else if (step === 3) {
      // Validate agenda items
      if (
        formData.agendaItems.filter((item: any) => item.selected).length === 0
      ) {
        newErrors.agendaItems =
          t("agendaItemsRequired") || "At least one agenda item is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onComplete(formData);
    }
  };

  const steps = [
    { id: 1, title: t("meetingDetails") || "Meeting Details" },
    { id: 2, title: t("participants") || "Participants" },
    { id: 3, title: t("agenda") || "Agenda" },
    { id: 4, title: t("documents") || "Documents" },
    { id: 5, title: t("notifications") || "Notifications" },
    { id: 6, title: t("review") || "Review" },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <MeetingDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 2:
        return (
          <ParticipantsStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <AgendaStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 4:
        return (
          <DocumentsStep formData={formData} updateFormData={updateFormData} />
        );
      case 5:
        return (
          <NotificationsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 6:
        return (
          <ReviewStep
            formData={formData}
            onSubmit={handleSubmit}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            {t("createBoardMeeting") || "Create Board Meeting"}
          </h2>
        </div>

        <div className="flex items-center justify-between bg-muted p-2 rounded-lg">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center",
                step.id < steps.length && "flex-1",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep > step.id
                      ? "bg-primary/20 text-primary"
                      : "bg-muted-foreground/20 text-muted-foreground",
                )}
              >
                {step.id}
              </div>
              <span
                className={cn(
                  "ml-2 text-sm font-medium hidden md:inline-block",
                  currentStep === step.id
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {step.title}
              </span>
              {step.id < steps.length && (
                <div className="flex-1 border-t mx-2 border-border hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6">{renderStepContent()}</Card>

      <div className="flex justify-between mt-6">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t("previous") || "Previous"}
          </Button>
        ) : (
          <div></div>
        )}

        {currentStep < steps.length ? (
          <Button
            type="button"
            onClick={handleNext}
            className="flex items-center"
          >
            {t("next") || "Next"}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default BoardMeetingWizard;
