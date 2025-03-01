import React from "react";
import { Bell, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import useLanguage from "@/lib/useLanguage";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NotificationsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const NotificationsStep: React.FC<NotificationsStepProps> = ({
  formData,
  updateFormData,
}) => {
  const { t } = useLanguage();

  const handleNotificationMethodToggle = (method: string) => {
    const updatedMethods = formData.notificationMethods.includes(method)
      ? formData.notificationMethods.filter((m: string) => m !== method)
      : [...formData.notificationMethods, method];

    updateFormData({ ...formData, notificationMethods: updatedMethods });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          {t("notificationMethods") || "Notification Methods"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("notificationMethodsDescription") ||
            "Choose how participants will be notified about this meeting"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-all",
              formData.notificationMethods.includes("email")
                ? "border-primary bg-primary/5"
                : "",
            )}
            onClick={() => handleNotificationMethodToggle("email")}
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.notificationMethods.includes("email")}
                onCheckedChange={() => handleNotificationMethodToggle("email")}
                id="email-notification"
              />
              <Label
                htmlFor="email-notification"
                className="cursor-pointer flex items-center"
              >
                <Mail className="h-4 w-4 mr-2" />
                {t("email") || "Email"}
              </Label>
            </div>
          </div>

          <div
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-all",
              formData.notificationMethods.includes("sms")
                ? "border-primary bg-primary/5"
                : "",
            )}
            onClick={() => handleNotificationMethodToggle("sms")}
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.notificationMethods.includes("sms")}
                onCheckedChange={() => handleNotificationMethodToggle("sms")}
                id="sms-notification"
              />
              <Label
                htmlFor="sms-notification"
                className="cursor-pointer flex items-center"
              >
                <Phone className="h-4 w-4 mr-2" />
                {t("sms") || "SMS"}
              </Label>
            </div>
          </div>

          <div
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-all",
              formData.notificationMethods.includes("inApp")
                ? "border-primary bg-primary/5"
                : "",
            )}
            onClick={() => handleNotificationMethodToggle("inApp")}
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.notificationMethods.includes("inApp")}
                onCheckedChange={() => handleNotificationMethodToggle("inApp")}
                id="inapp-notification"
              />
              <Label
                htmlFor="inapp-notification"
                className="cursor-pointer flex items-center"
              >
                <Bell className="h-4 w-4 mr-2" />
                {t("inAppNotification") || "In-App Notification"}
              </Label>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">
          {t("reminderSettings") || "Reminder Settings"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("reminderSettingsDescription") ||
            "Configure when reminders will be sent"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="initialReminder">
              {t("initialReminder") || "Initial Reminder"}
            </Label>
            <Select
              value={formData.initialReminder}
              onValueChange={(value) =>
                updateFormData({ ...formData, initialReminder: value })
              }
            >
              <SelectTrigger id="initialReminder">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1day">
                  {t("1DayBefore") || "1 Day Before"}
                </SelectItem>
                <SelectItem value="3days">
                  {t("3DaysBefore") || "3 Days Before"}
                </SelectItem>
                <SelectItem value="1week">
                  {t("1WeekBefore") || "1 Week Before"}
                </SelectItem>
                <SelectItem value="2weeks">
                  {t("2WeeksBefore") || "2 Weeks Before"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="followUpReminder">
              {t("followUpReminder") || "Follow-up Reminder"}
            </Label>
            <Select
              value={formData.followUpReminder}
              onValueChange={(value) =>
                updateFormData({ ...formData, followUpReminder: value })
              }
            >
              <SelectTrigger id="followUpReminder">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {t("noReminder") || "No Reminder"}
                </SelectItem>
                <SelectItem value="1hour">
                  {t("1HourBefore") || "1 Hour Before"}
                </SelectItem>
                <SelectItem value="3hours">
                  {t("3HoursBefore") || "3 Hours Before"}
                </SelectItem>
                <SelectItem value="1day">
                  {t("1DayBefore") || "1 Day Before"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">
          {t("additionalSettings") || "Additional Settings"}
        </h3>

        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="requireRsvp"
              checked={formData.requireRsvp}
              onCheckedChange={(checked) =>
                updateFormData({ ...formData, requireRsvp: checked })
              }
            />
            <div>
              <Label htmlFor="requireRsvp" className="cursor-pointer">
                {t("requireRsvp") || "Require RSVP"}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("requireRsvpDescription") ||
                  "Participants must confirm their attendance"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="allowProxies"
              checked={formData.allowProxies}
              onCheckedChange={(checked) =>
                updateFormData({ ...formData, allowProxies: checked })
              }
            />
            <div>
              <Label htmlFor="allowProxies" className="cursor-pointer">
                {t("allowProxies") || "Allow Proxies"}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("allowProxiesDescription") ||
                  "Board members can designate someone to attend on their behalf"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="sendMeetingMaterials"
              checked={formData.sendMeetingMaterials}
              onCheckedChange={(checked) =>
                updateFormData({ ...formData, sendMeetingMaterials: checked })
              }
            />
            <div>
              <Label htmlFor="sendMeetingMaterials" className="cursor-pointer">
                {t("sendMeetingMaterials") || "Send Meeting Materials"}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("sendMeetingMaterialsDescription") ||
                  "Automatically send meeting materials with the invitation"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recordMeeting"
              checked={formData.recordMeeting}
              onCheckedChange={(checked) =>
                updateFormData({ ...formData, recordMeeting: checked })
              }
            />
            <div>
              <Label htmlFor="recordMeeting" className="cursor-pointer">
                {t("recordMeeting") || "Record Meeting"}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("recordMeetingDescription") ||
                  "Automatically record the meeting for future reference"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsStep;
