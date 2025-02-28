import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import AppShell from "./layout/AppShell";
import DashboardContent from "./dashboard/DashboardContent";
import LoginForm from "./auth/LoginForm";
import MFAVerification from "./auth/MFAVerification";
import useLanguage from "@/lib/useLanguage";

const Home = () => {
  const { language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true to show dashboard by default
  const [showMFA, setShowMFA] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Force language update when component mounts
  useEffect(() => {
    // This will trigger the useEffect in useLanguage to apply RTL/LTR styles
    const event = new Event("languagechange");
    window.dispatchEvent(event);
  }, []);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const handleLogin = (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    setLoginError("");

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, show MFA for specific credentials
      if (
        credentials.email === "admin@example.com" &&
        credentials.password === "password"
      ) {
        setShowMFA(true);
      } else if (
        credentials.email === "user@example.com" &&
        credentials.password === "password"
      ) {
        // Direct login without MFA
        setIsAuthenticated(true);
      } else {
        setLoginError("Invalid email or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleMFAVerification = (code: string) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (code === "123456") {
        setIsAuthenticated(true);
        setShowMFA(false);
      } else {
        setLoginError("Invalid verification code");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowMFA(false);
  };

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {!isAuthenticated ? (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background to-background/80">
          {!showMFA ? (
            <LoginForm
              onLogin={handleLogin}
              loading={isLoading}
              error={loginError}
              showMFA={false}
              onMFARequired={() => setShowMFA(true)}
            />
          ) : (
            <MFAVerification
              onVerify={handleMFAVerification}
              onCancel={() => setShowMFA(false)}
              isLoading={isLoading}
              error={loginError}
              verificationMethod="app"
            />
          )}
        </div>
      ) : (
        <AppShell>
          <DashboardContent
            userName="John Doe"
            userRole="Board Member"
            upcomingMeetings={5}
            pendingTasks={12}
            recentActivities={24}
            notifications={8}
          />
        </AppShell>
      )}
    </motion.div>
  );
};

export default Home;
