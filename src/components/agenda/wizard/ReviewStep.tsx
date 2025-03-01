import React from "react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Clock, CheckCircle, FileText, Link } from "lucide-react";
import useLanguage from "@/lib/useLanguage";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { boardMembers, invitees } from "../data/participantsData";
import { venues } from "../data/meetingData";

interface ReviewStepProps {
  formData: any;
  onSubmit: () => void;
  errors: any;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  onSubmit,
  errors,
}) => {
  const { t, language } = useLanguage();
  const dateLocale = language === "ar" ? ar : enUS;

  // Count selected agenda items
  const selectedAgendaItems = formData.agendaItems.filter(
    (item: any) => item.selected,
  ).length;

  // Calculate total duration
  const totalDuration = formData.agendaItems
    .filter((item: any) => item.selected)
    .reduce((total: number, item: any) => total + (item.duration || 0), 0);

  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {t("reviewAndCreate") || "Review and Create"}
        </h3>
        <Badge variant="outline" className="flex items-center">
          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
          {t("readyToCreate") || "Ready to Create"}
        </Badge>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md mb-4">
          <h4 className="font-medium mb-2">
            {t("pleaseFixErrors") || "Please fix the following errors:"}
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(errors).map(([key, value]) => (
              <li key={key}>{value as string}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("meetingDetails") || "Meeting Details"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("meetingType") || "Meeting Type"}
                </p>
                <p>{formData.meetingType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("visibility") || "Visibility"}
                </p>
                <p>
                  {formData.isPublic
                    ? t("public") || "Public"
                    : t("private") || "Private"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("title") || "Title"}
              </p>
              <p className="font-medium">{formData.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("date") || "Date"}
                </p>
                <p>
                  {formData.date
                    ? format(new Date(formData.date), "PPP", {
                        locale: dateLocale,
                      })
                    : "--"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("time") || "Time"}
                </p>
                <p>
                  {formData.startTime} - {formData.endTime}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("venue") || "Venue"}
              </p>
              <p>
                {formData.venue} -{" "}
                {venues.find((v) => v.id === formData.venueDetails)?.name || ""}
              </p>
            </div>

            {formData.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("description") || "Description"}
                </p>
                <p className="text-sm">{formData.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("participants") || "Participants"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t("boardMembers") || "Board Members"}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.boardMembers.map((memberId: string) => {
                  const member = boardMembers.find((m) => m.id === memberId);
                  return member ? (
                    <Badge key={member.id} variant="outline">
                      {member.name}
                      {formData.memberRoles[member.id] &&
                        ` (${formData.memberRoles[member.id]})`}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

            {formData.invitees.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("invitees") || "Invitees"}
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.invitees.map((inviteeId: string) => {
                    const invitee = invitees.find((i) => i.id === inviteeId);
                    return invitee ? (
                      <Badge key={invitee.id} variant="secondary">
                        {invitee.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t("agendaOverview") || "Agenda Overview"}</CardTitle>
            <Badge variant="outline" className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {hours > 0 ? `${hours}h ` : ""}
              {minutes}m {t("totalDuration") || "total duration"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {selectedAgendaItems} {t("itemsSelected") || "items selected"}
            </p>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="w-12 p-3">#</th>
                    <th className="text-left p-3">{t("item") || "Item"}</th>
                    <th className="w-24 text-center p-3">
                      {t("duration") || "Duration"}
                    </th>
                    <th className="w-32 text-center p-3">
                      {t("presenter") || "Presenter"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.agendaItems
                    .filter((item: any) => item.selected)
                    .map((item: any, index: number) => {
                      const presenter = boardMembers.find(
                        (m) => m.id === item.presenter,
                      );

                      return (
                        <tr key={item.id} className="border-t">
                          <td className="p-3 text-center">{index + 1}</td>
                          <td className="p-3">{item.title}</td>
                          <td className="p-3 text-center">
                            {item.duration} {t("min") || "min"}
                          </td>
                          <td className="p-3 text-center">
                            {presenter ? presenter.name : "--"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {t("documentsAndMaterials") || "Documents and Materials"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formData.documents.length > 0 ? (
              <div className="space-y-2">
                {formData.documents.map((doc: any) => {
                  const agendaItem = formData.agendaItems.find(
                    (item: any) => item.id.toString() === doc.agendaItemId,
                  );

                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 border-b last:border-0"
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>{doc.name}</span>
                        {agendaItem && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs flex items-center"
                          >
                            <Link className="h-3 w-3 mr-1" />
                            {agendaItem.title}
                          </Badge>
                        )}
                      </div>
                      <Badge
                        variant={doc.access === "all" ? "default" : "secondary"}
                      >
                        {doc.access === "all"
                          ? t("allParticipants") || "All Participants"
                          : doc.access === "boardOnly"
                            ? t("boardMembersOnly") || "Board Members Only"
                            : t("specificRoles") || "Specific Roles"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                {t("noDocumentsUploaded") || "No documents uploaded"}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {t("notificationsAndSettings") || "Notifications and Settings"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("notificationMethods") || "Notification Methods"}
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.notificationMethods.map((method: string) => (
                    <Badge key={method} variant="outline">
                      {method === "email"
                        ? t("email") || "Email"
                        : method === "sms"
                          ? t("sms") || "SMS"
                          : t("inAppNotification") || "In-App Notification"}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("initialReminder") || "Initial Reminder"}
                  </p>
                  <p>
                    {formData.initialReminder === "1day"
                      ? t("1DayBefore") || "1 Day Before"
                      : formData.initialReminder === "3days"
                        ? t("3DaysBefore") || "3 Days Before"
                        : formData.initialReminder === "1week"
                          ? t("1WeekBefore") || "1 Week Before"
                          : t("2WeeksBefore") || "2 Weeks Before"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("followUpReminder") || "Follow-up Reminder"}
                  </p>
                  <p>
                    {formData.followUpReminder === "none"
                      ? t("noReminder") || "No Reminder"
                      : formData.followUpReminder === "1hour"
                        ? t("1HourBefore") || "1 Hour Before"
                        : formData.followUpReminder === "3hours"
                          ? t("3HoursBefore") || "3 Hours Before"
                          : t("1DayBefore") || "1 Day Before"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-2 w-2 rounded-full ${formData.requireRsvp ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  <span>
                    {formData.requireRsvp
                      ? t("rsvpRequired") || "RSVP Required"
                      : t("rsvpNotRequired") || "RSVP Not Required"}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <div
                    className={`h-2 w-2 rounded-full ${formData.allowProxies ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  <span>
                    {formData.allowProxies
                      ? t("proxiesAllowed") || "Proxies Allowed"
                      : t("proxiesNotAllowed") || "Proxies Not Allowed"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-6">
        <Button
          onClick={onSubmit}
          disabled={Object.keys(errors).length > 0}
          className="w-full md:w-auto px-8 py-6 text-lg relative overflow-hidden group"
        >
          <span className="relative z-10">
            {t("createBoardMeeting") || "Create Board Meeting"}
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/80 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
