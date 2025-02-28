import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  BarChart3,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  color: string;
}

const ModuleCard = ({
  title = "Module Title",
  description = "Module description goes here",
  icon = <Calendar />,
  onClick = () => {},
  color = "bg-blue-500",
}: ModuleCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card
        className="h-full cursor-pointer bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg"
        onClick={onClick}
      >
        <div className={`h-2 w-full ${color}`} />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${color} bg-opacity-20 text-gray-800 dark:text-white`}
            >
              {icon}
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Access Module →
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

interface ModuleCardsProps {
  modules?: ModuleCardProps[];
}

const ModuleCards = ({ modules }: ModuleCardsProps) => {
  const defaultModules: ModuleCardProps[] = [
    {
      title: "Meeting Management",
      description:
        "Schedule meetings, build agendas, and manage documents with AI-powered suggestions.",
      icon: <Calendar className="h-6 w-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Real-time Features",
      description:
        "Join live meetings with speaker queue, sentiment analysis, and integrated messaging.",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "bg-green-500",
    },
    {
      title: "Analytics & Reporting",
      description:
        "View interactive charts for meeting efficiency, task completion, and committee performance.",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "bg-purple-500",
    },
    {
      title: "User Settings",
      description:
        "Manage your profile, password, MFA settings, and application preferences.",
      icon: <Settings className="h-6 w-6" />,
      color: "bg-amber-500",
    },
    {
      title: "Committee Management",
      description:
        "Manage committee members, roles, and permissions for your organization.",
      icon: <Users className="h-6 w-6" />,
      color: "bg-rose-500",
    },
  ];

  const displayModules = modules || defaultModules;

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Quick Access
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayModules.map((module, index) => (
          <ModuleCard
            key={index}
            title={module.title}
            description={module.description}
            icon={module.icon}
            onClick={module.onClick}
            color={module.color}
          />
        ))}
      </div>
    </div>
  );
};

export default ModuleCards;
