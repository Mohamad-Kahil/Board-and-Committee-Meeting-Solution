import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import {
  FileText,
  Globe,
  Plus,
  Trash,
  Edit,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Upload,
  RotateCcw,
  Save,
  Paperclip,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import useLanguage from "@/lib/useLanguage";

// Mock data for agendas
const mockAgendas = [
  {
    id: "1",
    title: "Q2 Board Meeting Agenda",
    meetingDate: "2023-06-15",
    createdBy: "Ahmed Al-Mansour",
    lastModified: "2023-06-10T14:30:00",
    status: "draft",
    items: [
      {
        id: "item-1",
        title: "Call to Order",
        description: "Welcome and roll call",
        duration: 5,
        category: "procedural",
        attachments: [],
        votes: { up: 0, down: 0 },
        required: true,
      },
      {
        id: "item-2",
        title: "Approval of Previous Minutes",
        description: "Review and approve minutes from last meeting",
        duration: 10,
        category: "procedural",
        attachments: [{ name: "Minutes-May-2023.pdf", size: "245 KB" }],
        votes: { up: 3, down: 0 },
        required: true,
      },
      {
        id: "item-3",
        title: "Q2 Financial Report",
        description: "Presentation of Q2 financial results",
        duration: 30,
        category: "financial",
        attachments: [
          { name: "Q2-Financials.xlsx", size: "1.2 MB" },
          { name: "Financial-Analysis.pdf", size: "3.5 MB" },
        ],
        votes: { up: 5, down: 1 },
        required: false,
      },
      {
        id: "item-4",
        title: "Strategic Initiative Update",
        description: "Progress report on key strategic initiatives",
        duration: 25,
        category: "strategic",
        attachments: [{ name: "Strategic-Update.pptx", size: "4.7 MB" }],
        votes: { up: 4, down: 0 },
        required: false,
      },
      {
        id: "item-5",
        title: "New Business",
        description: "Discussion of new items not on the agenda",
        duration: 15,
        category: "discussion",
        attachments: [],
        votes: { up: 2, down: 1 },
        required: true,
      },
      {
        id: "item-6",
        title: "Adjournment",
        description: "Close the meeting",
        duration: 5,
        category: "procedural",
        attachments: [],
        votes: { up: 0, down: 0 },
        required: true,
      },
    ],
    collaborators: [
      { id: "1", name: "Ahmed Al-Mansour", role: "Chair" },
      { id: "2", name: "Sarah Johnson", role: "Secretary" },
      { id: "3", name: "Mohammed Al-Farsi", role: "Member" },
    ],
    versionHistory: [
      {
        version: 1,
        timestamp: "2023-06-08T10:15:00",
        editor: "Ahmed Al-Mansour",
      },
      { version: 2, timestamp: "2023-06-09T11:30:00", editor: "Sarah Johnson" },
      {
        version: 3,
        timestamp: "2023-06-10T14:30:00",
        editor: "Ahmed Al-Mansour",
      },
    ],
  },
  {
    id: "2",
    title: "Strategic Planning Committee Agenda",
    meetingDate: "2023-06-20",
    createdBy: "Fatima Al-Zahra",
    lastModified: "2023-06-12T09:45:00",
    status: "final",
    items: [
      {
        id: "item-1",
        title: "Call to Order",
        description: "Welcome and roll call",
        duration: 5,
        category: "procedural",
        attachments: [],
        votes: { up: 0, down: 0 },
        required: true,
      },
      {
        id: "item-2",
        title: "Approval of Previous Minutes",
        description: "Review and approve minutes from last meeting",
        duration: 10,
        category: "procedural",
        attachments: [{ name: "Minutes-May-2023.pdf", size: "245 KB" }],
        votes: { up: 4, down: 0 },
        required: true,
      },
      {
        id: "item-3",
        title: "5-Year Strategic Plan Review",
        description: "Comprehensive review of the 5-year strategic plan",
        duration: 45,
        category: "strategic",
        attachments: [
          { name: "Strategic-Plan-Draft.pdf", size: "5.2 MB" },
          { name: "Market-Analysis.pptx", size: "3.8 MB" },
        ],
        votes: { up: 6, down: 0 },
        required: false,
      },
      {
        id: "item-4",
        title: "Budget Allocation for Strategic Initiatives",
        description: "Discussion on budget allocation for key initiatives",
        duration: 30,
        category: "financial",
        attachments: [{ name: "Budget-Proposal.xlsx", size: "980 KB" }],
        votes: { up: 3, down: 2 },
        required: false,
      },
      {
        id: "item-5",
        title: "Adjournment",
        description: "Close the meeting",
        duration: 5,
        category: "procedural",
        attachments: [],
        votes: { up: 0, down: 0 },
        required: true,
      },
    ],
    collaborators: [
      { id: "4", name: "Fatima Al-Zahra", role: "Chair" },
      { id: "5", name: "John Smith", role: "Member" },
      { id: "6", name: "Layla Mahmoud", role: "Member" },
      { id: "7", name: "Robert Chen", role: "Member" },
    ],
    versionHistory: [
      {
        version: 1,
        timestamp: "2023-06-05T13:20:00",
        editor: "Fatima Al-Zahra",
      },
      { version: 2, timestamp: "2023-06-08T15:45:00", editor: "John Smith" },
      {
        version: 3,
        timestamp: "2023-06-12T09:45:00",
        editor: "Fatima Al-Zahra",
      },
    ],
  },
];

// Mock data for agenda templates
const mockAgendaTemplates = [
  {
    id: "template-1",
    name: "Standard Board Meeting",
    description: "Standard template for regular board meetings",
    items: [
      {
        title: "Call to Order",
        category: "procedural",
        duration: 5,
        required: true,
      },
      {
        title: "Roll Call",
        category: "procedural",
        duration: 5,
        required: true,
      },
      {
        title: "Approval of Previous Minutes",
        category: "procedural",
        duration: 10,
        required: true,
      },
      {
        title: "Financial Report",
        category: "financial",
        duration: 30,
        required: false,
      },
      {
        title: "Committee Reports",
        category: "reporting",
        duration: 30,
        required: false,
      },
      {
        title: "Old Business",
        category: "discussion",
        duration: 20,
        required: false,
      },
      {
        title: "New Business",
        category: "discussion",
        duration: 20,
        required: false,
      },
      {
        title: "Announcements",
        category: "informational",
        duration: 10,
        required: false,
      },
      {
        title: "Adjournment",
        category: "procedural",
        duration: 5,
        required: true,
      },
    ],
  },
  {
    id: "template-2",
    name: "Strategic Planning Meeting",
    description: "Template for strategic planning sessions",
    items: [
      {
        title: "Call to Order",
        category: "procedural",
        duration: 5,
        required: true,
      },
      {
        title: "Review of Strategic Objectives",
        category: "strategic",
        duration: 30,
        required: true,
      },
      {
        title: "SWOT Analysis Review",
        category: "strategic",
        duration: 45,
        required: false,
      },
      {
        title: "Strategic Initiatives Discussion",
        category: "strategic",
        duration: 60,
        required: true,
      },
      {
        title: "Resource Allocation",
        category: "financial",
        duration: 30,
        required: false,
      },
      {
        title: "Action Items and Next Steps",
        category: "action",
        duration: 20,
        required: true,
      },
      {
        title: "Adjournment",
        category: "procedural",
        duration: 5,
        required: true,
      },
    ],
  },
  {
    id: "template-3",
    name: "Committee Meeting",
    description: "Template for committee meetings",
    items: [
      {
        title: "Call to Order",
        category: "procedural",
        duration: 5,
        required: true,
      },
      {
        title: "Approval of Previous Minutes",
        category: "procedural",
        duration: 10,
        required: true,
      },
      {
        title: "Progress Updates",
        category: "reporting",
        duration: 30,
        required: true,
      },
      {
        title: "Discussion Items",
        category: "discussion",
        duration: 30,
        required: false,
      },
      {
        title: "Action Items",
        category: "action",
        duration: 15,
        required: true,
      },
      {
        title: "Next Meeting Date",
        category: "procedural",
        duration: 5,
        required: true,
      },
      {
        title: "Adjournment",
        category: "procedural",
        duration: 5,
        required: true,
      },
    ],
  },
];

// Mock data for categories with AI suggestions
const mockCategories = [
  { id: "procedural", name: "Procedural", color: "bg-gray-500" },
  { id: "financial", name: "Financial", color: "bg-green-500" },
  { id: "strategic", name: "Strategic", color: "bg-blue-500" },
  { id: "reporting", name: "Reporting", color: "bg-amber-500" },
  { id: "discussion", name: "Discussion", color: "bg-purple-500" },
  { id: "action", name: "Action Items", color: "bg-red-500" },
  { id: "informational", name: "Informational", color: "bg-teal-500" },
];

interface AgendaCardProps {
  agenda: (typeof mockAgendas)[0];
  onClick: () => void;
}

const AgendaCard = ({ agenda, onClick }: AgendaCardProps) => {
  const { t, language } = useLanguage();
  const dateLocale = language === "ar" ? ar : enUS;

  const formattedDate = format(
    new Date(agenda.meetingDate),
    "EEEE, MMMM d, yyyy",
    {
      locale: dateLocale,
    },
  );

  const totalDuration = agenda.items.reduce(
    (total, item) => total + item.duration,
    0,
  );
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return { variant: "secondary" as const, label: t("draft") };
      case "final":
        return { variant: "default" as const, label: t("final") };
      default:
        return { variant: "outline" as const, label: status };
    }
  };

  const statusBadge = getStatusBadge(agenda.status);

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
          className={`h-2 w-full ${agenda.status === "draft" ? "bg-amber-500" : "bg-green-500"}`}
        />
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{agenda.title}</CardTitle>
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          </div>
          <CardDescription className="text-sm">{formattedDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                {hours > 0 ? `${hours}h ` : ""}
                {minutes}m {t("duration")}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="h-4 w-4 mr-2" />
              <span>
                {agenda.items.length} {t("agendaItems")}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Edit className="h-4 w-4 mr-2" />
              <span>
                {t("lastModified")}:{" "}
                {format(new Date(agenda.lastModified), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex -space-x-2">
            {agenda.collaborators.slice(0, 3).map((collaborator, index) => (
              <Avatar
                key={index}
                className="border-2 border-background h-8 w-8"
              >
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${collaborator.name}`}
                />
                <AvatarFallback>
                  {collaborator.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            ))}
            {agenda.collaborators.length > 3 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                +{agenda.collaborators.length - 3}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

interface AgendaItemProps {
  item: (typeof mockAgendas)[0]["items"][0];
  index: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onVote: (type: "up" | "down") => void;
  isFirst: boolean;
  isLast: boolean;
  isEditing: boolean;
}

const AgendaItem = ({
  item,
  index,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
  onVote,
  isFirst,
  isLast,
  isEditing,
}: AgendaItemProps) => {
  const { t } = useLanguage();
  const category = mockCategories.find((c) => c.id === item.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border rounded-md p-4 mb-4 bg-white dark:bg-gray-800 shadow-sm"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="mr-2 font-bold text-lg">{index + 1}.</div>
          <div>
            <div className="font-medium text-lg">{item.title}</div>
            <div className="flex items-center mt-1">
              <Badge
                variant="outline"
                className={`${category?.color} bg-opacity-20 text-xs`}
              >
                {category?.name || item.category}
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                {item.duration} {t("minutes")}
              </span>
              {item.required && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {t("required")}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {!isFirst && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoveUp}
              className="h-8 w-8"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          )}
          {!isLast && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoveDown}
              className="h-8 w-8"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mb-3">
        {item.description}
      </div>

      {item.attachments.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-medium mb-1">{t("attachments")}:</div>
          <div className="flex flex-wrap gap-2">
            {item.attachments.map((attachment, idx) => (
              <div
                key={idx}
                className="flex items-center text-xs bg-muted px-2 py-1 rounded-md"
              >
                <Paperclip className="h-3 w-3 mr-1" />
                <span className="truncate max-w-[150px]">
                  {attachment.name}
                </span>
                <span className="ml-1 text-muted-foreground">
                  ({attachment.size})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 h-8"
            onClick={() => onVote("up")}
          >
            <ThumbsUp className="h-3 w-3" />
            <span>{item.votes.up}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 h-8"
            onClick={() => onVote("down")}
          >
            <ThumbsDown className="h-3 w-3" />
            <span>{item.votes.down}</span>
          </Button>
        </div>

        {isEditing && (
          <Badge
            variant="outline"
            className="bg-blue-500 bg-opacity-20 text-blue-700 dark:text-blue-300"
          >
            {t("editing")}
          </Badge>
        )}
      </div>
    </motion.div>
  );
};

interface AgendaItemFormProps {
  onSave: (item: any) => void;
  onCancel: () => void;
  initialItem?: (typeof mockAgendas)[0]["items"][0];
}

const AgendaItemForm = ({
  onSave,
  onCancel,
  initialItem,
}: AgendaItemFormProps) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState(initialItem?.title || "");
  const [description, setDescription] = useState(
    initialItem?.description || "",
  );
  const [duration, setDuration] = useState(
    initialItem?.duration?.toString() || "15",
  );
  const [category, setCategory] = useState(
    initialItem?.category || "discussion",
  );
  const [required, setRequired] = useState(initialItem?.required || false);
  const [attachments, setAttachments] = useState(
    initialItem?.attachments || [],
  );
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialItem?.id || `item-${Date.now()}`,
      title,
      description,
      duration: parseInt(duration),
      category,
      required,
      attachments,
      votes: initialItem?.votes || { up: 0, down: 0 },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const aiSuggestedCategories = [
    { id: "financial", score: 0.92 },
    { id: "strategic", score: 0.85 },
    { id: "reporting", score: 0.67 },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">{t("itemTitle")}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("itemDescription")}</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="category">{t("category")}</Label>
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
          {showAISuggestions ? (
            <div className="border rounded-md p-3 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-sm font-medium">
                  {t("suggestedCategories")}
                </span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {t("aiOptimized")}
                </Badge>
              </div>
              {aiSuggestedCategories.map((suggestion) => {
                const cat = mockCategories.find((c) => c.id === suggestion.id);
                return (
                  <div
                    key={suggestion.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => {
                      setCategory(suggestion.id);
                      setShowAISuggestions(false);
                    }}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${cat?.color} mr-2`}
                      />
                      <span>{cat?.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round(suggestion.score * 100)}% match
                    </div>
                  </div>
                );
              })}
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
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {mockCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full ${cat.color} mr-2`}
                      />
                      <span>{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">
            {t("duration")} ({t("minutes")})
          </Label>
          <Input
            id="duration"
            type="number"
            min="1"
            max="180"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="required"
          checked={required}
          onCheckedChange={(checked) => setRequired(!!checked)}
        />
        <label
          htmlFor="required"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t("requiredItem")}
        </label>
      </div>

      <div className="space-y-2">
        <Label>{t("attachments")}</Label>
        <div className="border rounded-md p-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center bg-muted px-2 py-1 rounded-md text-sm"
              >
                <Paperclip className="h-4 w-4 mr-1" />
                <span>{attachment.name}</span>
                <span className="mx-1 text-muted-foreground">
                  ({attachment.size})
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-1"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center border-2 border-dashed rounded-md p-4">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center cursor-pointer"
            >
              <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
              <span className="text-sm font-medium">{t("dragDropFiles")}</span>
              <span className="text-xs text-muted-foreground">{t("or")}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
              >
                {t("browseFiles")}
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
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

interface CreateAgendaFormProps {
  onSubmit: (agenda: any) => void;
  onCancel: () => void;
  initialAgenda?: (typeof mockAgendas)[0];
}

const CreateAgendaForm = ({
  onSubmit,
  onCancel,
  initialAgenda,
}: CreateAgendaFormProps) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState(initialAgenda?.title || "");
  const [meetingDate, setMeetingDate] = useState<string>(
    initialAgenda?.meetingDate || format(new Date(), "yyyy-MM-dd"),
  );
  const [items, setItems] = useState<(typeof mockAgendas)[0]["items"]>(
    initialAgenda?.items || [],
  );
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [currentItem, setCurrentItem] = useState<
    (typeof mockAgendas)[0]["items"][0] | undefined
  >(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialAgenda?.id || Date.now().toString(),
      title,
      meetingDate,
      createdBy: "Ahmed Al-Mansour", // Current user
      lastModified: new Date().toISOString(),
      status: "draft",
      items,
      collaborators: initialAgenda?.collaborators || [
        { id: "1", name: "Ahmed Al-Mansour", role: "Chair" },
      ],
      versionHistory: initialAgenda?.versionHistory || [
        {
          version: 1,
          timestamp: new Date().toISOString(),
          editor: "Ahmed Al-Mansour",
        },
      ],
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    if (templateId) {
      const template = mockAgendaTemplates.find((t) => t.id === templateId);
      if (template) {
        const templateItems = template.items.map((item) => ({
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: item.title,
          description: "",
          duration: item.duration,
          category: item.category,
          attachments: [],
          votes: { up: 0, down: 0 },
          required: item.required,
        }));
        setItems(templateItems);
      }
    }
    setSelectedTemplate("");
  };

  const handleAddItem = () => {
    setCurrentItem(undefined);
    setShowItemForm(true);
  };

  const handleEditItem = (item: (typeof mockAgendas)[0]["items"][0]) => {
    setCurrentItem(item);
    setEditingItemId(item.id);
    setShowItemForm(true);
  };

  const handleSaveItem = (item: (typeof mockAgendas)[0]["items"][0]) => {
    if (currentItem) {
      // Update existing item
      setItems(items.map((i) => (i.id === item.id ? item : i)));
    } else {
      // Add new item
      setItems([...items, item]);
    }
    setShowItemForm(false);
    setCurrentItem(undefined);
    setEditingItemId(null);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...items];
    if (direction === "up" && index > 0) {
      [newItems[index], newItems[index - 1]] = [
        newItems[index - 1],
        newItems[index],
      ];
    } else if (direction === "down" && index < items.length - 1) {
      [newItems[index], newItems[index + 1]] = [
        newItems[index + 1],
        newItems[index],
      ];
    }
    setItems(newItems);
  };

  const handleVote = (itemId: string, voteType: "up" | "down") => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            votes: {
              ...item.votes,
              [voteType]: item.votes[voteType] + 1,
            },
          };
        }
        return item;
      }),
    );
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="title">{t("agendaTitle")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetingDate">{t("meetingDate")}</Label>
            <Input
              id="meetingDate"
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{t("agendaItems")}</h3>
            <div className="flex items-center space-x-2">
              <Select
                value={selectedTemplate}
                onValueChange={handleTemplateSelect}
              >
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder={t("selectTemplate")} />
                </SelectTrigger>
                <SelectContent>
                  {mockAgendaTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-2" />
                {t("addItem")}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showItemForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border rounded-md p-4 mb-6 bg-muted/50"
              >
                <h4 className="text-md font-medium mb-4">
                  {currentItem ? t("editItem") : t("addItem")}
                </h4>
                <AgendaItemForm
                  onSave={handleSaveItem}
                  onCancel={() => {
                    setShowItemForm(false);
                    setCurrentItem(undefined);
                    setEditingItemId(null);
                  }}
                  initialItem={currentItem}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="text-center p-8 border rounded-md border-dashed">
                <p className="text-muted-foreground">{t("noAgendaItems")}</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={handleAddItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("addFirstItem")}
                </Button>
              </div>
            ) : (
              <div>
                {items.map((item, index) => (
                  <AgendaItem
                    key={item.id}
                    item={item}
                    index={index}
                    onMoveUp={() => handleMoveItem(index, "up")}
                    onMoveDown={() => handleMoveItem(index, "down")}
                    onEdit={() => handleEditItem(item)}
                    onDelete={() => handleDeleteItem(item.id)}
                    onVote={(type) => handleVote(item.id, type)}
                    isFirst={index === 0}
                    isLast={index === items.length - 1}
                    isEditing={editingItemId === item.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button type="submit">{t("saveAgenda")}</Button>
        </div>
      </form>
    </div>
  );
};

interface AgendaDetailProps {
  agenda: (typeof mockAgendas)[0];
  onEdit: () => void;
  onBack: () => void;
}

const AgendaDetail = ({ agenda, onEdit, onBack }: AgendaDetailProps) => {
  const { t, language } = useLanguage();
  const dateLocale = language === "ar" ? ar : enUS;
  const [activeVersion, setActiveVersion] = useState<number>(
    agenda.versionHistory.length,
  );

  const formattedDate = format(
    new Date(agenda.meetingDate),
    "EEEE, MMMM d, yyyy",
    {
      locale: dateLocale,
    },
  );

  const totalDuration = agenda.items.reduce(
    (total, item) => total + item.duration,
    0,
  );
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return { variant: "secondary" as const, label: t("draft") };
      case "final":
        return { variant: "default" as const, label: t("final") };
      default:
        return { variant: "outline" as const, label: status };
    }
  };

  const statusBadge = getStatusBadge(agenda.status);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t("back")}
        </Button>
        <Button onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          {t("edit")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{agenda.title}</CardTitle>
                  <CardDescription>{formattedDate}</CardDescription>
                </div>
                <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {hours > 0 ? `${hours}h ` : ""}
                      {minutes}m {t("duration")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {agenda.items.length} {t("agendaItems")}
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    {t("agendaItems")}
                  </h3>
                  <div className="space-y-4">
                    {agenda.items.map((item, index) => (
                      <div
                        key={item.id}
                        className="border rounded-md p-4 bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-center mb-2">
                          <div className="mr-2 font-bold">{index + 1}.</div>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="flex items-center mt-1">
                              <Badge
                                variant="outline"
                                className={`${mockCategories.find((c) => c.id === item.category)?.color} bg-opacity-20 text-xs`}
                              >
                                {mockCategories.find(
                                  (c) => c.id === item.category,
                                )?.name || item.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground ml-2">
                                {item.duration} {t("minutes")}
                              </span>
                              {item.required && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs"
                                >
                                  {t("required")}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground mb-3">
                          {item.description}
                        </div>

                        {item.attachments.length > 0 && (
                          <div className="mb-3">
                            <div className="text-xs font-medium mb-1">
                              {t("attachments")}:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {item.attachments.map((attachment, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center text-xs bg-muted px-2 py-1 rounded-md"
                                >
                                  <Paperclip className="h-3 w-3 mr-1" />
                                  <span>{attachment.name}</span>
                                  <span className="ml-1 text-muted-foreground">
                                    ({attachment.size})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{item.votes.up}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ThumbsDown className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{item.votes.down}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("collaborators")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agenda.collaborators.map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${collaborator.name}`}
                      />
                      <AvatarFallback>
                        {collaborator.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">
                        {collaborator.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {collaborator.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("versionHistory")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {agenda.versionHistory.map((version, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${activeVersion === version.version ? "bg-muted" : "hover:bg-muted/50"}`}
                    onClick={() => setActiveVersion(version.version)}
                  >
                    <div className="flex items-center">
                      <RotateCcw className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">
                          {t("version")} {version.version}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(
                            new Date(version.timestamp),
                            "MMM d, yyyy h:mm a",
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs">{version.editor}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface AgendaManagementProps {
  isRTL?: boolean;
}

const AgendaManagement = ({ isRTL = false }: AgendaManagementProps) => {
  const { language, t, toggleLanguage } = useLanguage();
  const [agendas, setAgendas] = useState(mockAgendas);
  const [activeView, setActiveView] = useState<"list" | "detail" | "create">(
    "list",
  );
  const [selectedAgenda, setSelectedAgenda] = useState<
    (typeof mockAgendas)[0] | null
  >(null);
  const [dir, setDir] = useState(isRTL ? "rtl" : "ltr");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setDir(language === "ar" ? "rtl" : "ltr");
  }, [language]);

  const handleCreateAgenda = (agenda: any) => {
    if (selectedAgenda) {
      // Update existing agenda
      setAgendas(agendas.map((a) => (a.id === agenda.id ? agenda : a)));
    } else {
      // Create new agenda
      setAgendas([...agendas, agenda]);
    }
    setActiveView("list");
    setSelectedAgenda(null);
  };

  const handleAgendaClick = (agenda: (typeof mockAgendas)[0]) => {
    setSelectedAgenda(agenda);
    setActiveView("detail");
  };

  const handleEditAgenda = () => {
    setActiveView("create");
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
              <h1 className="text-3xl font-bold">{t("agendaManagement")}</h1>
              <p className="text-muted-foreground">
                {t("createManageAgendas")}
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
              {activeView === "list" && (
                <Button
                  onClick={() => {
                    setSelectedAgenda(null);
                    setActiveView("create");
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("createAgenda")}
                </Button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeView === "list" && (
              <motion.div
                key="list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {agendas.map((agenda) => (
                    <motion.div key={agenda.id} variants={itemVariants}>
                      <AgendaCard
                        agenda={agenda}
                        onClick={() => handleAgendaClick(agenda)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeView === "detail" && selectedAgenda && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AgendaDetail
                  agenda={selectedAgenda}
                  onEdit={handleEditAgenda}
                  onBack={() => setActiveView("list")}
                />
              </motion.div>
            )}

            {activeView === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>
                        {selectedAgenda ? t("editAgenda") : t("createAgenda")}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setActiveView(selectedAgenda ? "detail" : "list");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CreateAgendaForm
                      onSubmit={handleCreateAgenda}
                      onCancel={() => {
                        setActiveView(selectedAgenda ? "detail" : "list");
                      }}
                      initialAgenda={selectedAgenda || undefined}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AgendaManagement;
