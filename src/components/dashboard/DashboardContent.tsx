import React from "react";
import UserStatistics from "./UserStatistics";
import ModuleCards from "./ModuleCards";
import RecentMeetings from "./RecentMeetings";
import { motion } from "framer-motion";

interface DashboardContentProps {
  userName?: string;
  userRole?: string;
  upcomingMeetings?: number;
  pendingTasks?: number;
  recentActivities?: number;
  notifications?: number;
}

const DashboardContent = ({
  userName = "John Doe",
  userRole = "Board Member",
  upcomingMeetings = 5,
  pendingTasks = 12,
  recentActivities = 24,
  notifications = 8,
}: DashboardContentProps) => {
  // Animation variants for staggered animations
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
    <div className="w-full h-full bg-background overflow-auto p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {userName}</h1>
          <p className="text-muted-foreground">
            {userRole} |{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </motion.div>

        {/* User Statistics */}
        <motion.div variants={itemVariants}>
          <UserStatistics
            upcomingMeetings={upcomingMeetings}
            pendingTasks={pendingTasks}
            recentActivities={recentActivities}
            notifications={notifications}
          />
        </motion.div>

        {/* Module Cards */}
        <motion.div variants={itemVariants}>
          <ModuleCards />
        </motion.div>

        {/* Recent Meetings */}
        <motion.div variants={itemVariants} className="mb-8">
          <RecentMeetings />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardContent;
