import React, { useState } from "react";
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
} from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({
  icon,
  label,
  active = false,
  onClick = () => {},
}: NavItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 px-3 py-2 text-left",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
      )}
      onClick={onClick}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
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
  const [activeItem, setActiveItem] = useState("dashboard");

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
              <span className="text-primary-foreground font-bold">BM</span>
            </div>
            <span className="font-semibold">Meeting Manager</span>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">BM</span>
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

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4">
        {collapsed ? (
          <div className="px-2 space-y-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeItem === "dashboard" ? "secondary" : "ghost"}
                    size="icon"
                    className="w-10 h-10 mb-1"
                    onClick={() => setActiveItem("dashboard")}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Dashboard</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeItem === "meetings" ? "secondary" : "ghost"}
                    size="icon"
                    className="w-10 h-10 mb-1"
                    onClick={() => setActiveItem("meetings")}
                  >
                    <Calendar className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Meeting Management</TooltipContent>
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
                <TooltipContent side="right">Real-time Features</TooltipContent>
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
                  Analytics & Reporting
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
                <TooltipContent side="right">User Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <div className="space-y-1 px-3">
            <NavItem
              icon={<LayoutDashboard className="h-5 w-5" />}
              label="Dashboard"
              active={activeItem === "dashboard"}
              onClick={() => setActiveItem("dashboard")}
            />
            <NavItem
              icon={<Calendar className="h-5 w-5" />}
              label="Meeting Management"
              active={activeItem === "meetings"}
              onClick={() => setActiveItem("meetings")}
            />
            <NavItem
              icon={<Video className="h-5 w-5" />}
              label="Real-time Features"
              active={activeItem === "realtime"}
              onClick={() => setActiveItem("realtime")}
            />
            <NavItem
              icon={<BarChart3 className="h-5 w-5" />}
              label="Analytics & Reporting"
              active={activeItem === "analytics"}
              onClick={() => setActiveItem("analytics")}
            />
            <NavItem
              icon={<Settings className="h-5 w-5" />}
              label="User Settings"
              active={activeItem === "settings"}
              onClick={() => setActiveItem("settings")}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-border p-4">
        {!collapsed && (
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
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
              <TooltipContent side="right">Logout</TooltipContent>
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
