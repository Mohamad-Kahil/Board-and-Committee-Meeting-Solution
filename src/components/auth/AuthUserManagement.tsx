import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  User,
  Plus,
  Trash,
  Edit,
  Check,
  X,
  Globe,
  Calendar as CalendarIcon,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockRoles, mockPermissions, mockUsers } from "@/lib/mockData";
import useLanguage from "@/lib/useLanguage";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
        <div className={`h-2 w-full ${color}`} />
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {title}
              </p>
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
            </div>
            <div
              className={`p-3 rounded-full ${color} bg-opacity-20 text-gray-800 dark:text-white`}
            >
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface RoleFormProps {
  onSave: (role: any) => void;
  onCancel: () => void;
  initialRole?: any;
}

const RoleForm = ({ onSave, onCancel, initialRole }: RoleFormProps) => {
  const { t } = useLanguage();
  const [roleName, setRoleName] = useState(initialRole?.name || "");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    initialRole?.permissions || [],
  );

  const handlePermissionToggle = (permission: string) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(
        selectedPermissions.filter((p) => p !== permission),
      );
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialRole?.id || Date.now().toString(),
      name: roleName,
      permissions: selectedPermissions,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="roleName">{t("roleName")}</Label>
        <Input
          id="roleName"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>{t("permissions")}</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-4">
          {mockPermissions.map((permission) => (
            <div key={permission.id} className="flex items-center space-x-2">
              <Checkbox
                id={`permission-${permission.id}`}
                checked={selectedPermissions.includes(permission.id)}
                onCheckedChange={() => handlePermissionToggle(permission.id)}
              />
              <label
                htmlFor={`permission-${permission.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {permission.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="submit">{t("save")}</Button>
      </div>
    </form>
  );
};

interface UserFormProps {
  onSave: (user: any) => void;
  onCancel: () => void;
  initialUser?: any;
}

const UserForm = ({ onSave, onCancel, initialUser }: UserFormProps) => {
  const { t } = useLanguage();
  const [name, setName] = useState(initialUser?.name || "");
  const [email, setEmail] = useState(initialUser?.email || "");
  const [role, setRole] = useState(initialUser?.role || "");
  const [isActive, setIsActive] = useState(initialUser?.isActive || true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialUser?.id || Date.now().toString(),
      name,
      email,
      role,
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("username")}</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">{t("role")}</Label>
        <Select value={role} onValueChange={setRole} required>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {mockRoles.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
        <Label htmlFor="isActive">{t("active")}</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="submit">{t("save")}</Button>
      </div>
    </form>
  );
};

interface AuthUserManagementProps {
  defaultTab?: string;
  isRTL?: boolean;
}

const AuthUserManagement = ({
  defaultTab = "login",
  isRTL = false,
}: AuthUserManagementProps) => {
  const { language, t, toggleLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [roles, setRoles] = useState(mockRoles);
  const [users, setUsers] = useState(mockUsers);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Force language update when component mounts
  useEffect(() => {
    // This will trigger the useEffect in useLanguage to apply RTL/LTR styles
    const event = new Event("languagechange");
    window.dispatchEvent(event);
  }, []);

  // This effect is no longer needed as RTL/LTR is handled by useLanguage

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (email === "admin@example.com" && password === "password") {
        setActiveTab("admin-dashboard");
      } else if (email === "board@example.com" && password === "password") {
        setActiveTab("board-dashboard");
      } else if (email === "committee@example.com" && password === "password") {
        setActiveTab("committee-dashboard");
      } else if (email === "secretary@example.com" && password === "password") {
        setActiveTab("secretary-dashboard");
      } else {
        setError("Invalid email or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSaveRole = (role: any) => {
    if (currentRole) {
      setRoles(roles.map((r) => (r.id === role.id ? role : r)));
    } else {
      setRoles([...roles, role]);
    }
    setIsRoleDialogOpen(false);
    setCurrentRole(null);
  };

  const handleSaveUser = (user: any) => {
    if (currentUser) {
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
    } else {
      setUsers([...users, user]);
    }
    setIsUserDialogOpen(false);
    setCurrentUser(null);
  };

  const handleEditRole = (role: any) => {
    setCurrentRole(role);
    setIsRoleDialogOpen(true);
  };

  const handleEditUser = (user: any) => {
    setCurrentUser(user);
    setIsUserDialogOpen(true);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((r) => r.id !== roleId));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
  };

  // Animation variants
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={false} />
      <div className="flex-1 overflow-auto bg-gradient-to-br from-background to-background/80">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              onClick={toggleLanguage}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {language === "en" ? t("switchToArabic") : t("switchToEnglish")}
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-6xl mx-auto"
          >
            <Card className="w-full bg-white/80 dark:bg-gray-800/80 shadow-xl border-0 backdrop-blur-md overflow-hidden">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 p-0 rounded-none border-b">
                  <TabsTrigger value="login" className="rounded-none py-3">
                    {t("login")}
                  </TabsTrigger>
                  <TabsTrigger value="mfa" className="rounded-none py-3">
                    {t("mfaAuthentication")}
                  </TabsTrigger>
                  <TabsTrigger value="roles" className="rounded-none py-3">
                    {t("roleManagement")}
                  </TabsTrigger>
                  <TabsTrigger value="users" className="rounded-none py-3">
                    {t("userManagement")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="admin-dashboard"
                    className="rounded-none py-3"
                  >
                    {t("adminDashboard")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="board-dashboard"
                    className="rounded-none py-3"
                  >
                    {t("boardMemberDashboard")}
                  </TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login" className="p-6">
                  <div className="max-w-md mx-auto">
                    <div className="text-center mb-6">
                      <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                          <Lock className="h-6 w-6 text-primary-foreground" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold">{t("welcomeBack")}</h2>
                      <p className="text-muted-foreground">
                        {t("accessSystem")}
                      </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("email")}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">{t("password")}</Label>
                          <Button
                            variant="link"
                            size="sm"
                            className="px-0 font-normal"
                            type="button"
                          >
                            {t("forgotPassword")}
                          </Button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 h-8 w-8"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) =>
                            setRememberMe(checked as boolean)
                          }
                        />
                        <label
                          htmlFor="remember"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t("rememberMe")}
                        </label>
                      </div>

                      {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                          {error}
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? t("signingIn") : t("signIn")}
                      </Button>

                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            {t("orContinueWith")}
                          </span>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full">
                        {t("ssoLogin")}
                      </Button>
                    </form>
                  </div>
                </TabsContent>

                {/* MFA Tab */}
                <TabsContent value="mfa" className="p-6">
                  <div className="max-w-md mx-auto">
                    <div className="text-center mb-6">
                      <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Shield className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold">
                        {t("mfaAuthentication")}
                      </h2>
                      <p className="text-muted-foreground">
                        {t("mfaDescription")}
                      </p>
                    </div>

                    <Card className="border-0 shadow-md bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              {t("mfaAuthentication")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {mfaEnabled ? t("disable") : t("enable")}{" "}
                              {t("mfaAuthentication").toLowerCase()}
                            </p>
                          </div>
                          <Switch
                            checked={mfaEnabled}
                            onCheckedChange={setMfaEnabled}
                          />
                        </div>

                        {mfaEnabled && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t"
                          >
                            <div className="flex justify-center mb-4">
                              <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                                <span className="text-sm text-muted-foreground">
                                  QR Code
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-center mb-4">
                              Scan this QR code with your authenticator app
                            </p>
                            <div className="space-y-2">
                              <Label htmlFor="verification-code">
                                Verification Code
                              </Label>
                              <Input
                                id="verification-code"
                                placeholder="Enter 6-digit code"
                                className="text-center tracking-widest"
                                maxLength={6}
                              />
                            </div>
                            <Button className="w-full mt-4">Verify</Button>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Roles Tab */}
                <TabsContent value="roles" className="p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">
                      {t("roleManagement")}
                    </h2>
                    <p className="text-muted-foreground">
                      {t("roleDescription")}
                    </p>
                  </div>

                  <div className="flex justify-end mb-4">
                    <Dialog
                      open={isRoleDialogOpen}
                      onOpenChange={setIsRoleDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button onClick={() => setCurrentRole(null)}>
                          <Plus className="h-4 w-4 mr-2" />
                          {t("createRole")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {currentRole
                              ? `Edit ${currentRole.name}`
                              : t("createRole")}
                          </DialogTitle>
                          <DialogDescription>
                            {t("roleDescription")}
                          </DialogDescription>
                        </DialogHeader>
                        <RoleForm
                          onSave={handleSaveRole}
                          onCancel={() => setIsRoleDialogOpen(false)}
                          initialRole={currentRole}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid gap-4">
                    {roles.map((role) => (
                      <Card key={role.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle>{role.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.map((permId: string) => {
                              const permission = mockPermissions.find(
                                (p) => p.id === permId,
                              );
                              return permission ? (
                                <Badge key={permId} variant="secondary">
                                  {permission.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditRole(role)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">
                      {t("userManagement")}
                    </h2>
                    <p className="text-muted-foreground">
                      {t("userDescription")}
                    </p>
                  </div>

                  <div className="flex justify-end mb-4">
                    <Dialog
                      open={isUserDialogOpen}
                      onOpenChange={setIsUserDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button onClick={() => setCurrentUser(null)}>
                          <Plus className="h-4 w-4 mr-2" />
                          {t("addUser")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {currentUser ? t("editUser") : t("addUser")}
                          </DialogTitle>
                          <DialogDescription>
                            {t("userDescription")}
                          </DialogDescription>
                        </DialogHeader>
                        <UserForm
                          onSave={handleSaveUser}
                          onCancel={() => setIsUserDialogOpen(false)}
                          initialUser={currentUser}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>

                  <Card>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">{t("username")}</th>
                          <th className="text-left p-4">{t("email")}</th>
                          <th className="text-left p-4">{t("role")}</th>
                          <th className="text-left p-4">{t("status")}</th>
                          <th className="text-right p-4">{t("actions")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => {
                          const userRole = roles.find(
                            (r) => r.id === user.role,
                          );
                          return (
                            <tr
                              key={user.id}
                              className="border-b hover:bg-muted/50"
                            >
                              <td className="p-4">{user.name}</td>
                              <td className="p-4">{user.email}</td>
                              <td className="p-4">{userRole?.name || "--"}</td>
                              <td className="p-4">
                                <Badge
                                  variant={
                                    user.isActive ? "default" : "secondary"
                                  }
                                >
                                  {user.isActive ? t("active") : t("inactive")}
                                </Badge>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditUser(user)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </Card>
                </TabsContent>

                {/* Admin Dashboard Tab */}
                <TabsContent value="admin-dashboard" className="p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">
                      {t("adminDashboard")}
                    </h2>
                    <p className="text-muted-foreground">
                      {t("dashboardDescription")}
                    </p>
                  </div>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                  >
                    <StatCard
                      title={t("totalUsers")}
                      value={users.length}
                      icon={<User className="h-5 w-5" />}
                      color="bg-blue-500"
                    />
                    <StatCard
                      title={t("activeUsers")}
                      value={users.filter((u) => u.isActive).length}
                      icon={<Check className="h-5 w-5" />}
                      color="bg-green-500"
                    />
                    <StatCard
                      title={t("pendingApprovals")}
                      value={3}
                      icon={<Clock className="h-5 w-5" />}
                      color="bg-amber-500"
                    />
                    <StatCard
                      title={t("recentActivities")}
                      value={12}
                      icon={<Activity className="h-5 w-5" />}
                      color="bg-purple-500"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>{t("recentActivities")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="flex items-center space-x-4"
                            >
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  User Activity {i}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date().toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Board Member Dashboard Tab */}
                <TabsContent value="board-dashboard" className="p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">
                      {t("boardMemberDashboard")}
                    </h2>
                    <p className="text-muted-foreground">
                      {t("dashboardDescription")}
                    </p>
                  </div>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                  >
                    <StatCard
                      title="Upcoming Meetings"
                      value={4}
                      icon={<CalendarIcon className="h-5 w-5" />}
                      color="bg-blue-500"
                    />
                    <StatCard
                      title="Pending Votes"
                      value={2}
                      icon={<Check className="h-5 w-5" />}
                      color="bg-amber-500"
                    />
                    <StatCard
                      title="Documents to Review"
                      value={7}
                      icon={<File className="h-5 w-5" />}
                      color="bg-purple-500"
                    />
                  </motion.div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthUserManagement;

// Missing icon imports
const Activity = ({ className }: { className?: string }) => (
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
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
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
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
