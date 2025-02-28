import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bell,
  Moon,
  Sun,
  Globe,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import useLanguage from "@/lib/useLanguage";

interface HeaderProps {
  isDarkMode?: boolean;
  isRTL?: boolean;
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  onThemeToggle?: () => void;
  onLanguageToggle?: () => void;
  onLogout?: () => void;
}

const Header = ({
  isDarkMode = false,
  isRTL = false,
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  notificationCount = 3,
  onThemeToggle = () => {},
  onLanguageToggle = () => {},
  onLogout = () => {},
}: HeaderProps) => {
  const { language, t } = useLanguage();

  const handleThemeToggle = () => {
    onThemeToggle();
  };

  const handleLanguageToggle = () => {
    onLanguageToggle();
  };

  return (
    <header className="w-full h-20 bg-background border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1"></div>

      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                {isDarkMode ? (
                  <Moon className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Sun className="h-5 w-5 text-muted-foreground" />
                )}
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isDarkMode
                  ? "التبديل إلى الوضع الفاتح"
                  : "التبديل إلى الوضع الداكن"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Notifications */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {notificationCount}
                  </motion.span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {language === "ar"
                  ? `لديك ${notificationCount} إشعارات`
                  : `You have ${notificationCount} notifications`}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full overflow-hidden border border-border">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-medium">{userName}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {language === "ar" ? "حسابي" : "My Account"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>{language === "ar" ? "الملف الشخصي" : "Profile"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>{language === "ar" ? "الإعدادات" : "Settings"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{language === "ar" ? "تسجيل الخروج" : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
