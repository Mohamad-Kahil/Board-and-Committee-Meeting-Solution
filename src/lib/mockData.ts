// Mock data for the AuthUserManagement component

export const mockRoles = [
  {
    id: "admin",
    name: "Administrator",
    permissions: [
      "view_users",
      "edit_users",
      "delete_users",
      "view_meetings",
      "create_meetings",
      "edit_meetings",
      "delete_meetings",
      "view_reports",
      "create_reports",
      "edit_reports",
      "delete_reports",
      "manage_roles",
    ],
  },
  {
    id: "board",
    name: "Board Member",
    permissions: [
      "view_users",
      "view_meetings",
      "create_meetings",
      "edit_meetings",
      "view_reports",
      "create_reports",
    ],
  },
  {
    id: "committee",
    name: "Committee Member",
    permissions: ["view_meetings", "view_reports"],
  },
  {
    id: "secretary",
    name: "Secretary",
    permissions: [
      "view_users",
      "view_meetings",
      "create_meetings",
      "edit_meetings",
      "view_reports",
      "create_reports",
      "edit_reports",
    ],
  },
];

export const mockPermissions = [
  { id: "view_users", name: "View Users" },
  { id: "edit_users", name: "Edit Users" },
  { id: "delete_users", name: "Delete Users" },
  { id: "view_meetings", name: "View Meetings" },
  { id: "create_meetings", name: "Create Meetings" },
  { id: "edit_meetings", name: "Edit Meetings" },
  { id: "delete_meetings", name: "Delete Meetings" },
  { id: "view_reports", name: "View Reports" },
  { id: "create_reports", name: "Create Reports" },
  { id: "edit_reports", name: "Edit Reports" },
  { id: "delete_reports", name: "Delete Reports" },
  { id: "manage_roles", name: "Manage Roles" },
];

export const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    isActive: true,
  },
  {
    id: "2",
    name: "Board Member",
    email: "board@example.com",
    role: "board",
    isActive: true,
  },
  {
    id: "3",
    name: "Committee Member",
    email: "committee@example.com",
    role: "committee",
    isActive: true,
  },
  {
    id: "4",
    name: "Secretary",
    email: "secretary@example.com",
    role: "secretary",
    isActive: true,
  },
  {
    id: "5",
    name: "Inactive User",
    email: "inactive@example.com",
    role: "committee",
    isActive: false,
  },
];

export const mockMeetings = [
  {
    id: "1",
    title: "Board Meeting Q2",
    date: "2023-06-15",
    time: "10:00 AM",
    participants: ["1", "2", "4"],
    status: "upcoming",
  },
  {
    id: "2",
    title: "Committee Review",
    date: "2023-06-12",
    time: "2:30 PM",
    participants: ["3", "4", "5"],
    status: "in-progress",
  },
  {
    id: "3",
    title: "Annual Strategy Meeting",
    date: "2023-06-10",
    time: "9:00 AM",
    participants: ["1", "2", "3", "4"],
    status: "completed",
  },
];
