import React, { useState } from "react";
import { FileText, Upload, Link, Trash } from "lucide-react";
import useLanguage from "@/lib/useLanguage";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

const DocumentsStep: React.FC<DocumentsStepProps> = ({
  formData,
  updateFormData,
}) => {
  const { t } = useLanguage();
  const [selectedAgendaItem, setSelectedAgendaItem] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [documentAccess, setDocumentAccess] = useState("all");

  const handleAddDocument = () => {
    if (documentName) {
      const newDocument = {
        id: Date.now().toString(),
        name: documentName,
        size: "1.2 MB", // Mock file size
        type: documentName.split(".").pop() || "pdf",
        uploadDate: new Date().toISOString(),
        agendaItemId: selectedAgendaItem || null,
        access: documentAccess,
      };

      updateFormData({
        ...formData,
        documents: [...formData.documents, newDocument],
      });

      // Reset form
      setDocumentName("");
      setSelectedAgendaItem("");
      setDocumentAccess("all");
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    const updatedDocuments = formData.documents.filter(
      (doc: any) => doc.id !== documentId,
    );
    updateFormData({ ...formData, documents: updatedDocuments });
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "ppt":
      case "pptx":
        return <FileText className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {t("documentsAndMaterials") || "Documents and Materials"}
        </h3>
        <Badge variant="outline" className="flex items-center">
          <FileText className="h-3 w-3 mr-1" />
          {formData.documents.length} {t("documents") || "documents"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="documentName">
              {t("documentName") || "Document Name"}
            </Label>
            <Input
              id="documentName"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder={t("enterDocumentName") || "Enter document name"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agendaItem">
              {t("linkToAgendaItem") || "Link to Agenda Item"}
            </Label>
            <Select
              value={selectedAgendaItem}
              onValueChange={setSelectedAgendaItem}
            >
              <SelectTrigger id="agendaItem">
                <SelectValue
                  placeholder={t("selectAgendaItem") || "Select agenda item"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t("noAgendaItem") || "No specific agenda item"}
                </SelectItem>
                {formData.agendaItems
                  .filter((item: any) => item.selected)
                  .map((item: any) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentAccess">
              {t("accessRestrictions") || "Access Restrictions"}
            </Label>
            <Select
              id="documentAccess"
              value={documentAccess}
              onValueChange={setDocumentAccess}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("allParticipants") || "All Participants"}
                </SelectItem>
                <SelectItem value="boardOnly">
                  {t("boardMembersOnly") || "Board Members Only"}
                </SelectItem>
                <SelectItem value="specificRoles">
                  {t("specificRoles") || "Specific Roles"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button
              type="button"
              onClick={handleAddDocument}
              disabled={!documentName}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {t("uploadDocument") || "Upload Document"}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {t("orDragAndDrop") || "or drag and drop files here"}
            </p>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted p-3 font-medium">
            {t("uploadedDocuments") || "Uploaded Documents"}
          </div>
          {formData.documents.length > 0 ? (
            <div className="divide-y">
              {formData.documents.map((doc: any) => {
                const agendaItem = formData.agendaItems.find(
                  (item: any) => item.id.toString() === doc.agendaItemId,
                );

                return (
                  <div
                    key={doc.id}
                    className="p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {getFileIcon(doc.type)}
                      <div className="ml-3">
                        <p className="font-medium">{doc.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>{doc.size}</span>
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
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="h-8 w-8 text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                {t("noDocumentsYet") || "No documents uploaded yet"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="restrictDownloads"
            checked={formData.restrictDownloads}
            onCheckedChange={(checked) =>
              updateFormData({ ...formData, restrictDownloads: checked })
            }
          />
          <div>
            <Label htmlFor="restrictDownloads" className="cursor-pointer">
              {t("restrictDownloads") || "Restrict Downloads"}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t("restrictDownloadsDescription") ||
                "Prevent participants from downloading sensitive documents"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsStep;
