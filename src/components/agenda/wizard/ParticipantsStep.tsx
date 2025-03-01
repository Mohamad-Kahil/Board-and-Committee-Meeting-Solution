import React, { useState } from "react";
import { Users, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import useLanguage from "@/lib/useLanguage";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { boardMembers, invitees } from "../data/participantsData";

interface ParticipantsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  errors: any;
}

const ParticipantsStep: React.FC<ParticipantsStepProps> = ({
  formData,
  updateFormData,
  errors,
}) => {
  const { t } = useLanguage();
  const [selectedInvitee, setSelectedInvitee] = useState("");

  const handleMemberToggle = (memberId: string) => {
    const updatedMembers = formData.boardMembers.includes(memberId)
      ? formData.boardMembers.filter((id: string) => id !== memberId)
      : [...formData.boardMembers, memberId];

    updateFormData({ ...formData, boardMembers: updatedMembers });
  };

  const handleRoleChange = (memberId: string, role: string) => {
    const updatedRoles = { ...formData.memberRoles, [memberId]: role };
    updateFormData({ ...formData, memberRoles: updatedRoles });
  };

  const handleAddInvitee = () => {
    if (selectedInvitee && !formData.invitees.includes(selectedInvitee)) {
      updateFormData({
        ...formData,
        invitees: [...formData.invitees, selectedInvitee],
        inviteeAccess: {
          ...formData.inviteeAccess,
          [selectedInvitee]: "view",
        },
      });
      setSelectedInvitee("");
    }
  };

  const handleRemoveInvitee = (inviteeId: string) => {
    const updatedInvitees = formData.invitees.filter(
      (id: string) => id !== inviteeId,
    );
    const updatedAccess = { ...formData.inviteeAccess };
    delete updatedAccess[inviteeId];

    updateFormData({
      ...formData,
      invitees: updatedInvitees,
      inviteeAccess: updatedAccess,
    });
  };

  const handleAccessChange = (inviteeId: string, access: string) => {
    updateFormData({
      ...formData,
      inviteeAccess: {
        ...formData.inviteeAccess,
        [inviteeId]: access,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Board Members Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {t("selectBoardMembers") || "Select Board Members"}
          </h3>
          <Badge variant="outline" className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            {formData.boardMembers.length} {t("selected") || "selected"}
          </Badge>
        </div>

        {errors.boardMembers && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm mb-4">
            {errors.boardMembers}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {boardMembers.map((member) => (
            <div
              key={member.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-all",
                formData.boardMembers.includes(member.id)
                  ? "border-primary bg-primary/5"
                  : "border-border",
              )}
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`member-${member.id}`}
                  checked={formData.boardMembers.includes(member.id)}
                  onCheckedChange={() => handleMemberToggle(member.id)}
                />
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar}`}
                      alt={member.name}
                    />
                    <AvatarFallback>
                      {member.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>

              {formData.boardMembers.includes(member.id) && (
                <Select
                  value={formData.memberRoles[member.id] || ""}
                  onValueChange={(value) => handleRoleChange(member.id, value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue
                      placeholder={t("assignRole") || "Assign Role"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chairperson">
                      {t("chairperson") || "Chairperson"}
                    </SelectItem>
                    <SelectItem value="secretary">
                      {t("secretary") || "Secretary"}
                    </SelectItem>
                    <SelectItem value="treasurer">
                      {t("treasurer") || "Treasurer"}
                    </SelectItem>
                    <SelectItem value="member">
                      {t("member") || "Member"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              updateFormData({
                ...formData,
                boardMembers: [],
                memberRoles: {},
              })
            }
          >
            {t("clearAll") || "Clear All"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              updateFormData({
                ...formData,
                boardMembers: boardMembers.map((m) => m.id),
                memberRoles: {},
              })
            }
          >
            {t("selectAll") || "Select All"}
          </Button>
        </div>
      </div>

      {/* Invitees Section */}
      <div className="space-y-6 pt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {t("addInvitees") || "Add Invitees"}
          </h3>
          <Badge variant="outline" className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            {formData.invitees.length} {t("invitees") || "invitees"}
          </Badge>
        </div>

        <div className="flex space-x-2">
          <div className="flex-1">
            <Select value={selectedInvitee} onValueChange={setSelectedInvitee}>
              <SelectTrigger>
                <SelectValue
                  placeholder={t("selectInvitee") || "Select invitee"}
                />
              </SelectTrigger>
              <SelectContent>
                {invitees
                  .filter((invitee) => !formData.invitees.includes(invitee.id))
                  .map((invitee) => (
                    <SelectItem key={invitee.id} value={invitee.id}>
                      {invitee.name} ({invitee.role})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            onClick={handleAddInvitee}
            disabled={!selectedInvitee}
            className="shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("add") || "Add"}
          </Button>
        </div>

        {formData.invitees.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3">{t("name") || "Name"}</th>
                  <th className="text-left p-3">{t("role") || "Role"}</th>
                  <th className="text-left p-3">{t("access") || "Access"}</th>
                  <th className="text-right p-3">
                    {t("actions") || "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.invitees.map((inviteeId: string) => {
                  const invitee = invitees.find((i) => i.id === inviteeId);
                  if (!invitee) return null;

                  return (
                    <tr key={invitee.id} className="border-t">
                      <td className="p-3">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${invitee.avatar}`}
                              alt={invitee.name}
                            />
                            <AvatarFallback>
                              {invitee.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{invitee.name}</span>
                        </div>
                      </td>
                      <td className="p-3">{invitee.role}</td>
                      <td className="p-3">
                        <Select
                          value={formData.inviteeAccess[invitee.id] || "view"}
                          onValueChange={(value) =>
                            handleAccessChange(invitee.id, value)
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="view">
                              {t("viewOnly") || "View Only"}
                            </SelectItem>
                            <SelectItem value="edit">
                              {t("canEdit") || "Can Edit"}
                            </SelectItem>
                            <SelectItem value="comment">
                              {t("canComment") || "Can Comment"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveInvitee(invitee.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-dashed rounded-md p-8 text-center">
            <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              {t("noInviteesYet") || "No invitees added yet"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t("useDropdownToAdd") ||
                "Use the dropdown above to add invitees"}
            </p>
          </div>
        )}

        <div className="flex items-center space-x-2 pt-4">
          <Switch
            id="temporaryAccess"
            checked={formData.temporaryAccess}
            onCheckedChange={(checked) =>
              updateFormData({ ...formData, temporaryAccess: checked })
            }
          />
          <div>
            <Label htmlFor="temporaryAccess" className="cursor-pointer">
              {t("temporaryAccess") || "Temporary Access"}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("temporaryAccessDescription") ||
                "Invitee access will expire after the meeting"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsStep;
