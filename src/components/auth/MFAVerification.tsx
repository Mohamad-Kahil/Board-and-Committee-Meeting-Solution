import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface MFAVerificationProps {
  onVerify?: (code: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string;
  verificationMethod?: "app" | "sms" | "email";
}

const MFAVerification = ({
  onVerify = () => {},
  onCancel = () => {},
  isLoading = false,
  error = "",
  verificationMethod = "app",
}: MFAVerificationProps) => {
  const [code, setCode] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Timer for code expiration
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      // Simulate success for demo purposes
      if (code === "123456") {
        setIsSuccess(true);
        setTimeout(() => {
          onVerify(code);
        }, 1000);
      } else {
        onVerify(code);
      }
    }
  };

  const handleResendCode = () => {
    setTimeLeft(30);
    // Implementation would call the API to resend code
  };

  const getVerificationMethodText = () => {
    switch (verificationMethod) {
      case "sms":
        return "SMS";
      case "email":
        return "email";
      case "app":
      default:
        return "authentication app";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-3 rounded-full bg-primary/10 text-primary"
          >
            <Shield className="h-10 w-10" />
          </motion.div>
        </div>
        <CardTitle className="text-2xl font-bold">
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Enter the 6-digit code from your {getVerificationMethodText()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Input
                id="mfa-code"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/[^0-9]/g, "").substring(0, 6))
                }
                className="text-center text-lg tracking-widest"
                maxLength={6}
                autoFocus
                disabled={isLoading || isSuccess}
              />
              <div className="text-center text-sm text-muted-foreground">
                Code expires in {timeLeft} seconds
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>Verification successful!</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={code.length !== 6 || isLoading || isSuccess}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-center text-sm">
          <button
            type="button"
            onClick={handleResendCode}
            className="text-primary hover:underline focus:outline-none"
            disabled={timeLeft > 0}
          >
            {timeLeft > 0 ? `Resend code in ${timeLeft}s` : "Resend code"}
          </button>
        </div>
        <Button variant="ghost" onClick={onCancel} className="w-full">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MFAVerification;
