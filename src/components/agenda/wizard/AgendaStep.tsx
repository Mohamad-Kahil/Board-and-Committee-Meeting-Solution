import React, { useState } from "react";
import {
  Clock,
  Plus,
  ChevronUp,
  ChevronDown,
  Trash,
  Edit,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useLanguage from "@/lib/useLanguage";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { boardMembers } from "../data/participantsData";

interface AgendaStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  errors: any;
}

const AgendaStep: React.FC<AgendaStepProps> = ({
  formData,
  updateFormData,
  errors,
}) => {
  const { t } = useLanguage();
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const handleItemToggle = (itemId: number) => {
    const updatedItems = formData.agendaItems.map((item: any) =>
      item.id === itemId ? { ...item, selected: !item.selected } : item,
    );
    updateFormData({ ...formData, agendaItems: updatedItems });
  };

  const handleItemUpdate = (itemId: number, field: string, value: any) => {
    const updatedItems = formData.agendaItems.map((item: any) =>
      item.id === itemId ? { ...item, [field]: value } : item,
    );
    updateFormData({ ...formData, agendaItems: updatedItems });
  };

  const handleAddCustomItem = () => {
    const newItem = {
      id: Date.now(),
      title: "",
      selected: true,
      duration: 15,
      presenter: "",
      notes: "",
      isCustom: true,
    };
    updateFormData({
      ...formData,
      agendaItems: [...formData.agendaItems, newItem],
    });
    setEditingItemId(newItem.id);
  };

  const handleRemoveItem = (itemId: number) => {
    const updatedItems = formData.agendaItems.filter(
      (item: any) => item.id !== itemId,
    );
    updateFormData({ ...formData, agendaItems: updatedItems });
  };

  const handleMoveItem = (itemId: number, direction: "up" | "down") => {
    const itemIndex = formData.agendaItems.findIndex(
      (item: any) => item.id === itemId,
    );
    if (itemIndex === -1) return;

    const newItems = [...formData.agendaItems];
    if (direction === "up" && itemIndex > 0) {
      [newItems[itemIndex], newItems[itemIndex - 1]] = [
        newItems[itemIndex - 1],
        newItems[itemIndex],
      ];
    } else if (direction === "down" && itemIndex < newItems.length - 1) {
      [newItems[itemIndex], newItems[itemIndex + 1]] = [
        newItems[itemIndex + 1],
        newItems[itemIndex],
      ];
    }

    updateFormData({ ...formData, agendaItems: newItems });
  };

  // Calculate total duration of selected items
  const totalDuration = formData.agendaItems
    .filter((item: any) => item.selected)
    .reduce((total: number, item: any) => total + (item.duration || 0), 0);

  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">
            {t("agendaItems") || "Agenda Items"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("meetingType") || "Meeting Type"}: {formData.meetingType}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {hours > 0 ? `${hours}h ` : ""}
            {minutes}m {t("totalDuration") || "total duration"}
          </Badge>
          <Button type="button" variant="outline" onClick={handleAddCustomItem}>
            <Plus className="h-4 w-4 mr-2" />
            {t("addCustomItem") || "Add Custom Item"}
          </Button>
        </div>
      </div>

      {errors.agendaItems && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm mb-4">
          {errors.agendaItems}
        </div>
      )}

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
              <th className="w-20 text-center p-3">
                {t("include") || "Include"}
              </th>
              <th className="w-24 text-right p-3">
                {t("actions") || "Actions"}
              </th>
            </tr>
          </thead>
          <tbody>
            {formData.agendaItems.map((item: any, index: number) => (
              <tr
                key={item.id}
                className={cn(
                  "border-t",
                  item.selected ? "bg-primary/5" : "opacity-60",
                )}
              >
                <td className="p-3 text-center">{index + 1}</td>
                <td className="p-3">
                  {editingItemId === item.id ? (
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        handleItemUpdate(item.id, "title", e.target.value)
                      }
                      placeholder={t("enterItemTitle") || "Enter item title"}
                      className="w-full"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="cursor-pointer"
                      onClick={() => setEditingItemId(item.id)}
                    >
                      {item.title}
                    </div>
                  )}
                  {editingItemId === item.id && (
                    <Textarea
                      value={item.notes || ""}
                      onChange={(e) =>
                        handleItemUpdate(item.id, "notes", e.target.value)
                      }
                      placeholder={t("notes") || "Notes"}
                      className="w-full mt-2"
                      rows={2}
                    />
                  )}
                </td>
                <td className="p-3">
                  <Input
                    type="number"
                    min="1"
                    max="180"
                    value={item.duration}
                    onChange={(e) =>
                      handleItemUpdate(
                        item.id,
                        "duration",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="w-20 mx-auto text-center"
                  />
                </td>
                <td className="p-3">
                  <Select
                    value={item.presenter || ""}
                    onValueChange={(value) =>
                      handleItemUpdate(item.id, "presenter", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("select") || "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.boardMembers.map((memberId: string) => {
                        const member = boardMembers.find(
                          (m) => m.id === memberId,
                        );
                        return member ? (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ) : null;
                      })}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3 text-center">
                  <Checkbox
                    checked={item.selected}
                    onCheckedChange={() => handleItemToggle(item.id)}
                    className="mx-auto"
                  />
                </td>
                <td className="p-3">
                  <div className="flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveItem(item.id, "up")}
                      disabled={index === 0}
                      className="h-8 w-8"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveItem(item.id, "down")}
                      disabled={index === formData.agendaItems.length - 1}
                      className="h-8 w-8"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    {item.isCustom && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="h-8 w-8 text-red-500"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                    {editingItemId === item.id ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingItemId(null)}
                        className="h-8 w-8 text-green-500"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingItemId(item.id)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const updatedItems = formData.agendaItems.map((item: any) => ({
              ...item,
              selected: false,
            }));
            updateFormData({ ...formData, agendaItems: updatedItems });
          }}
        >
          {t("deselectAll") || "Deselect All"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const updatedItems = formData.agendaItems.map((item: any) => ({
              ...item,
              selected: true,
            }));
            updateFormData({ ...formData, agendaItems: updatedItems });
          }}
        >
          {t("selectAll") || "Select All"}
        </Button>
      </div>
    </div>
  );
};

export default AgendaStep;
