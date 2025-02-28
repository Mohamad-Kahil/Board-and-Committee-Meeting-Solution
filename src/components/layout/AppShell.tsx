import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppShellProps {
  children?: React.ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
  defaultDarkMode?: boolean;
  defaultRTL?: boolean;
}

const AppShell = ({
  children,
  className,
  defaultCollapsed = false,
  defaultDarkMode = false,
  defaultRTL = false,
}: AppShellProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(defaultCollapsed);
  const [isDarkMode, setIsDarkMode] = useState(defaultDarkMode);
  const [isRTL, setIsRTL] = useState(defaultRTL);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would apply the theme to the document here
    // document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    setIsRTL(!isRTL);
    // In a real app, you would change the document direction here
    // document.documentElement.dir = isRTL ? 'ltr' : 'rtl';
  };

  return (
    <div
      className={cn(
        "flex h-screen w-full overflow-hidden bg-background",
        isDarkMode ? "dark" : "",
        className,
      )}
    >
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          isDarkMode={isDarkMode}
          isRTL={isRTL}
          onThemeToggle={toggleTheme}
          onLanguageToggle={toggleLanguage}
        />

        {/* Content Area with Glassmorphism Effect */}
        <main
          className={cn(
            "flex-1 overflow-auto p-6",
            "bg-gradient-to-br from-background to-background/80",
            "backdrop-blur-sm transition-all duration-300",
          )}
        >
          <div
            className={cn(
              "mx-auto w-full max-w-7xl rounded-xl",
              "bg-background/70 backdrop-blur-md",
              "shadow-sm border border-border/50",
              "p-6",
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
