import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Calendar,
  Video,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Users,
  FileText,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import useLanguage from "@/lib/useLanguage";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
}

const NavItem = ({
  icon,
  label,
  active = false,
  onClick = () => {},
  href,
}: NavItemProps) => {
  const { language } = useLanguage();
  const content =
    language === "ar" ? (
      <>
        <span className="shrink-0 ml-auto">{icon}</span>
        <span className="truncate">{label}</span>
      </>
    ) : (
      <>
        <span className="shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </>
    );

  return href ? (
    <a href={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 px-3 py-2 text-left",
          active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
        )}
      >
        {content}
      </Button>
    </a>
  ) : (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 px-3 py-2 text-left",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
      )}
      onClick={onClick}
    >
      {content}
    </Button>
  );
};

interface NavGroupProps {
  title: string;
  children: React.ReactNode;
  collapsed?: boolean;
}

const NavGroup = ({ title, children, collapsed = false }: NavGroupProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (collapsed) {
    return (
      <TooltipProvider>
        <div className="px-2 py-2">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 mb-1"
                    >
                      {child.props.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {child.props.label}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return null;
          })}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center px-3 py-2">
          <h4 className="text-sm font-medium text-muted-foreground flex-1">
            {title}
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="space-y-1 px-1">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar = ({
  collapsed = false,
  onToggleCollapse = () => {},
}: SidebarProps) => {
  const { language, t, toggleLanguage } = useLanguage();
  const [activeItem, setActiveItem] = useState(
    window.location.pathname === "/"
      ? "dashboard"
      : window.location.pathname === "/meeting-scheduling"
        ? "meetings"
        : window.location.pathname === "/auth-user-management"
          ? "committee"
          : window.location.pathname === "/agenda-management"
            ? "agenda"
            : "dashboard",
  );

  useEffect(() => {
    // Update active item based on current path when component mounts or path changes
    const path = window.location.pathname;
    if (path === "/") setActiveItem("dashboard");
    else if (path === "/meeting-scheduling") setActiveItem("meetings");
    else if (path === "/auth-user-management") setActiveItem("committee");
    else if (path === "/agenda-management") setActiveItem("agenda");
  }, [window.location.pathname]);

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-background border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-border px-4",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">M</span>
            </div>
            <span className="font-semibold">MicroDigits Meetings</span>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">M</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className={
            collapsed
              ? "absolute top-16 -right-3 h-6 w-6 rounded-full border border-border bg-background"
              : ""
          }
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Language and Theme Toggle */}
      <div className="px-4 py-2 border-b border-border">
        {!collapsed && (
          <div className="flex space-x-2 mb-2">
            {/* Language Toggle */}
            <Button
              variant="outline"
              className="flex-1 justify-start gap-2"
              onClick={() => toggleLanguage()}
            >
              <Globe className="h-4 w-4" />
              <span>{language === "ar" ? "English" : "العربية"}</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              className="flex-1 justify-start gap-2"
              onClick={() => document.documentElement.classList.toggle("dark")}
            >
              <Sun className="h-4 w-4" />
              <span>{language === "ar" ? "الوضع الداكن" : "Dark Mode"}</span>
            </Button>
          </div>
        )}
        {collapsed && (
          <div className="space-y-2">
            {/* Language Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-full"
                    onClick={() => toggleLanguage()}
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {language === "ar" ? "English" : "العربية"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Theme Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-full"
                    onClick={() =>
                      document.documentElement.classList.toggle("dark")
                    }
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {language === "ar" ? "الوضع الداكن" : "Dark Mode"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4">
        {collapsed ? (
          <div className="px-2 space-y-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="/">
                    <Button
                      variant={
                        activeItem === "dashboard" ? "secondary" : "ghost"
                      }
                      size="icon"
                      className="w-10 h-10 mb-1"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {language === "ar" ? "لوحة التحكم" : "Dashboard"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="/meeting-scheduling">
                    <Button
                      variant={
                        activeItem === "meetings" ? "secondary" : "ghost"
                      }
                      size="icon"
                      className="w-10 h-10 mb-1"
                    >
                      <Calendar className="h-5 w-5" />
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {language === "ar" ? "التقويم" : "Calendar"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="/meeting-dashboard">
                    <Button
                      variant={
                        activeItem === "meetingDashboard"
                          ? "secondary"
                          : "ghost"
                      }
                      size="icon"
                      className="w-10 h-10 mb-1"
                    >
                      <Users className="h-5 w-5" />
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {language === "ar" ? "لوحة الاجتماعات" : "Meeting Dashboard"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="/agenda-management">
                    <Button
                      variant={activeItem === "agenda" ? "secondary" : "ghost"}
                      size="icon"
                      className="w-10 h-10 mb-1"
                    >
                      <FileText className="h-5 w-5" />
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {language === "ar"
                    ? "إدارة جدول الأعمال"
                    : "Agenda Management"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeItem === "realtime" ? "secondary" : "ghost"}
                    size="icon"
                    className="w-10 h-10 mb-1"
                    onClick={() => setActiveItem("realtime")}
                  >
                    <Video className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {language === "ar" ? "الميزات الفورية" : "Real-time Features"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeItem === "analytics" ? "secondary" : "ghost"}
                    size="icon"
                    className="w-10 h-10 mb-1"
                    onClick={() => setActiveItem("analytics")}
                  >
                    <BarChart3 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {language === "ar"
                    ? "التحليلات والتقارير"
                    : "Analytics & Reporting"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="/auth-user-management">
                    <Button
                      variant={
                        activeItem === "committee" ? "secondary" : "ghost"
                      }
                      size="icon"
                      className="w-10 h-10 mb-1"
                    >
                      <Users className="h-5 w-5" />
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {language === "ar" ? "إدارة اللجان" : "Committee Management"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeItem === "settings" ? "secondary" : "ghost"}
                    size="icon"
                    className="w-10 h-10 mb-1"
                    onClick={() => setActiveItem("settings")}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {language === "ar" ? "إعدادات المستخدم" : "User Settings"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <div className="space-y-1 px-3">
            <NavItem
              icon={<LayoutDashboard className="h-5 w-5" />}
              label={language === "ar" ? "لوحة التحكم" : "Dashboard"}
              active={activeItem === "dashboard"}
              href="/"
            />
            <NavItem
              icon={<Calendar className="h-5 w-5" />}
              label={language === "ar" ? "التقويم" : "Calendar"}
              active={activeItem === "meetings"}
              href="/meeting-scheduling"
            />
            <NavItem
              icon={<Users className="h-5 w-5" />}
              label={
                language === "ar" ? "لوحة الاجتماعات" : "Meeting Dashboard"
              }
              active={activeItem === "meetingDashboard"}
              href="/meeting-dashboard"
            />
            <NavItem
              icon={<FileText className="h-5 w-5" />}
              label={
                language === "ar" ? "إدارة جدول الأعمال" : "Agenda Management"
              }
              active={activeItem === "agenda"}
              href="/agenda-management"
            />
            <NavItem
              icon={<Video className="h-5 w-5" />}
              label={
                language === "ar" ? "الميزات الفورية" : "Real-time Features"
              }
              active={activeItem === "realtime"}
              onClick={() => setActiveItem("realtime")}
            />
            <NavItem
              icon={<BarChart3 className="h-5 w-5" />}
              label={
                language === "ar"
                  ? "التحليلات والتقارير"
                  : "Analytics & Reporting"
              }
              active={activeItem === "analytics"}
              onClick={() => setActiveItem("analytics")}
            />
            <NavItem
              icon={<Users className="h-5 w-5" />}
              label={
                language === "ar" ? "إدارة اللجان" : "Committee Management"
              }
              active={activeItem === "committee"}
              href="/auth-user-management"
            />
            <NavItem
              icon={<Settings className="h-5 w-5" />}
              label={language === "ar" ? "إعدادات المستخدم" : "User Settings"}
              active={activeItem === "settings"}
              onClick={() => setActiveItem("settings")}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-border p-4">
        {/* Logout Button */}
        {!collapsed && (
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            <span>{language === "ar" ? "تسجيل الخروج" : "Logout"}</span>
          </Button>
        )}
        {collapsed && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="w-full">
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {language === "ar" ? "تسجيل الخروج" : "Logout"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

// Missing ChevronDown icon import, adding it here
const ChevronDown = ({ className }: { className?: string }) => (
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
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default Sidebar;
