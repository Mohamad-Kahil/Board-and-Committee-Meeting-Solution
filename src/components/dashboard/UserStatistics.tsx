import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, CheckCircle, Bell, Activity } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard = ({
  title = "Stat Title",
  value = "0",
  icon = <Activity className="h-5 w-5" />,
  trend,
  className = "",
}: StatCardProps) => {
  return (
    <Card className={`bg-white dark:bg-gray-800 overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {trend && (
              <p
                className={`text-xs mt-1 flex items-center ${trend.isPositive ? "text-green-500" : "text-red-500"}`}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
                <span className="text-gray-500 dark:text-gray-400 ml-1">
                  from last month
                </span>
              </p>
            )}
          </div>
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface UserStatisticsProps {
  upcomingMeetings?: number;
  pendingTasks?: number;
  recentActivities?: number;
  notifications?: number;
  className?: string;
}

const UserStatistics = ({
  upcomingMeetings = 5,
  pendingTasks = 12,
  recentActivities = 24,
  notifications = 8,
  className = "",
}: UserStatisticsProps) => {
  return (
    <div className={`w-full bg-background ${className}`}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Your Statistics</h2>
        <p className="text-muted-foreground">
          Overview of your recent activities and upcoming events
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Upcoming Meetings"
          value={upcomingMeetings}
          icon={<CalendarClock className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
        />

        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon={<CheckCircle className="h-5 w-5" />}
          trend={{ value: 5, isPositive: false }}
        />

        <StatCard
          title="Recent Activities"
          value={recentActivities}
          icon={<Activity className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
        />

        <StatCard
          title="Notifications"
          value={notifications}
          icon={<Bell className="h-5 w-5" />}
          trend={{ value: 25, isPositive: true }}
        />
      </div>
    </div>
  );
};

export default UserStatistics;
