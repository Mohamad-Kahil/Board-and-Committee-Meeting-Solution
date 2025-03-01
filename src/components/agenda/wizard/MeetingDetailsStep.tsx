import React, { useState, useEffect } from "react";
import { format, addMinutes, parse } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import useLanguage from "@/lib/useLanguage";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, EyeOff } from "lucide-react";

import { meetingTypes, venues } from "../data/meetingData";

interface MeetingDetailsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  errors: any;
}

const MeetingDetailsStep: React.FC<MeetingDetailsStepProps> = ({
  formData,
  updateFormData,
  errors,
}) => {
  const { t, language } = useLanguage();
  const dateLocale = language === "ar" ? ar : enUS;
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [duration, setDuration] = useState(60); // Default 60 minutes

  // Set default start time to 6 AM if not already set
  useEffect(() => {
    if (!formData.startTime) {
      updateFormData({ ...formData, startTime: "06:00" });
    }
  }, []);

  // Calculate end time based on start time and duration
  useEffect(() => {
    if (formData.startTime) {
      try {
        // Parse the start time
        const startTimeParts = formData.startTime.split(":");
        const hours = parseInt(startTimeParts[0]);
        const minutes = parseInt(startTimeParts[1]);

        // Create a date object with today's date and the start time
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);

        // Add the duration to get the end time
        const endDate = addMinutes(startDate, duration);

        // Format the end time as HH:MM
        const endTime = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;

        updateFormData({ ...formData, endTime });
      } catch (error) {
        console.error("Error calculating end time:", error);
      }
    }
  }, [formData.startTime, duration]);

  const handleDateSelect = (date: Date | undefined) => {
    updateFormData({ ...formData, date: date?.toISOString() });
    setIsCalendarOpen(false); // Close the calendar after selection
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(e.target.value) || 60;
    setDuration(newDuration);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="meetingType">
            {t("meetingType") || "Meeting Type"}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={formData.meetingType}
            onValueChange={(value) => {
              updateFormData({
                ...formData,
                meetingType: value,
              });
            }}
          >
            <SelectTrigger
              id="meetingType"
              className={cn(
                "w-full",
                errors.meetingType ? "border-red-500" : "",
              )}
            >
              <SelectValue
                placeholder={t("selectMeetingType") || "Select Meeting Type"}
              />
            </SelectTrigger>
            <SelectContent>
              {meetingTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.meetingType && (
            <p className="text-red-500 text-sm mt-1">{errors.meetingType}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">
            {t("meetingTitle") || "Meeting Title"}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              updateFormData({ ...formData, title: e.target.value })
            }
            className={cn(errors.title ? "border-red-500" : "")}
            placeholder={t("enterMeetingTitle") || "Enter meeting title"}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date">
            {t("date") || "Date"}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.date && "text-muted-foreground",
                  errors.date ? "border-red-500" : "",
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {formData.date ? (
                  format(new Date(formData.date), "PPP", {
                    locale: dateLocale,
                  })
                ) : (
                  <span>{t("selectDate") || "Select date"}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={formData.date ? new Date(formData.date) : undefined}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">
              {t("startTime") || "Start Time"}
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={formData.startTime}
              onValueChange={(value) =>
                updateFormData({ ...formData, startTime: value })
              }
            >
              <SelectTrigger
                id="startTime"
                className={cn(errors.startTime ? "border-red-500" : "")}
              >
                <SelectValue placeholder={t("selectTime") || "Select time"} />
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
            {errors.startTime && (
              <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">
              {t("endTime") || "End Time"}
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="endTime"
              value={formData.endTime}
              readOnly
              className="bg-muted"
            />
            {errors.endTime && (
              <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="duration">
            {t("duration") || "Duration (minutes)"}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="duration"
              type="number"
              min="15"
              max="480"
              value={duration}
              onChange={handleDurationChange}
              className="w-full"
            />
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {Math.floor(duration / 60) > 0 &&
                  `${Math.floor(duration / 60)}h `}
                {duration % 60 > 0 && `${duration % 60}m`}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue">
            {t("venue") || "Venue"}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={formData.venue}
            onValueChange={(value) =>
              updateFormData({ ...formData, venue: value })
            }
          >
            <SelectTrigger
              id="venue"
              className={cn(errors.venue ? "border-red-500" : "")}
            >
              <SelectValue placeholder={t("selectVenue") || "Select venue"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="physical">
                {t("physical") || "Physical"}
              </SelectItem>
              <SelectItem value="virtual">
                {t("virtual") || "Virtual"}
              </SelectItem>
              <SelectItem value="hybrid">{t("hybrid") || "Hybrid"}</SelectItem>
            </SelectContent>
          </Select>
          {errors.venue && (
            <p className="text-red-500 text-sm mt-1">{errors.venue}</p>
          )}
        </div>
      </div>

      {formData.venue && (
        <div className="space-y-2">
          <Label htmlFor="venueDetails">
            {t("venueDetails") || "Venue Details"}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={formData.venueDetails}
            onValueChange={(value) =>
              updateFormData({ ...formData, venueDetails: value })
            }
          >
            <SelectTrigger
              id="venueDetails"
              className={cn(errors.venueDetails ? "border-red-500" : "")}
            >
              <SelectValue
                placeholder={t("selectVenueDetails") || "Select venue details"}
              />
            </SelectTrigger>
            <SelectContent>
              {venues
                .filter((v) => {
                  if (formData.venue === "physical") return !v.isVirtual;
                  if (formData.venue === "virtual") return v.isVirtual;
                  return true; // For hybrid, show all
                })
                .map((venue) => (
                  <SelectItem key={venue.id} value={venue.id}>
                    {venue.name}{" "}
                    {venue.capacity && `(Capacity: ${venue.capacity})`}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.venueDetails && (
            <p className="text-red-500 text-sm mt-1">{errors.venueDetails}</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="isPublic"
            checked={formData.isPublic}
            onCheckedChange={(checked) =>
              updateFormData({ ...formData, isPublic: checked })
            }
          />
          <Label htmlFor="isPublic" className="cursor-pointer">
            {formData.isPublic
              ? t("publicMeeting") || "Public Meeting"
              : t("privateMeeting") || "Private Meeting"}
          </Label>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                {formData.isPublic ? (
                  <Eye className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <EyeOff className="h-4 w-4 text-amber-500 mr-1" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {formData.isPublic
                  ? t("publicMeetingTooltip") ||
                    "Public meetings are visible to all users"
                  : t("privateMeetingTooltip") ||
                    "Private meetings are only visible to invited participants"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("description") || "Description"}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            updateFormData({ ...formData, description: e.target.value })
          }
          placeholder={
            t("enterMeetingDescription") || "Enter meeting description"
          }
          rows={4}
        />
      </div>
    </div>
  );
};

export default MeetingDetailsStep;
