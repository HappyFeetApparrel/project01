"use client"

import { Suspense, useEffect, useState } from "react";
import type React from "react";

import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { api } from "@/lib/axios";

import { ThreeDots } from "react-loader-spinner";

import { AxiosError } from "axios";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // Get token from URL after component mounts
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = searchParams.get("token");
    setToken(tokenFromUrl);
  }, []);

  // Password validation criteria
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== "";

  const isValidPassword =
    hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPassword || !passwordsMatch) {
      toast({
        title: "Invalid password",
        description:
          "Please make sure your password meets all requirements and both passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      toast({
        title: "Invalid reset link",
        description: "Your password reset link appears to be invalid or expired.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // This is where you would make an API call to your backend
      const response = await api.post("/reset-password", {
        password: password,
        token: token,
      });

      if (response.status === 200) {
        setIsLoading(false);
        toast({
          title: "Password reset successful",
          description:
            "Your password has been reset successfully. You can now log in with your new password.",
        });
      }

      // Redirect to login page after successful reset
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data as string); // ✅ Ensures response exists before accessing `data`

        const error_message = error.response?.data.error;
        toast({
          title: "Something went wrong", //
          description: `${error && error_message ? error_message : "There was an error resetting your password"}. Please try again.`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                placeholder="Enter your new password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
                placeholder="Confirm your new password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showConfirmPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Password requirements:</p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                {hasMinLength ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className={hasMinLength ? "text-green-700" : "text-red-700"}>
                  At least 8 characters
                </span>
              </li>
              <li className="flex items-center gap-2">
                {hasUppercase ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className={hasUppercase ? "text-green-700" : "text-red-700"}>
                  At least one uppercase letter
                </span>
              </li>
              <li className="flex items-center gap-2">
                {hasLowercase ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className={hasLowercase ? "text-green-700" : "text-red-700"}>
                  At least one lowercase letter
                </span>
              </li>
              <li className="flex items-center gap-2">
                {hasNumber ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className={hasNumber ? "text-green-700" : "text-red-700"}>
                  At least one number
                </span>
              </li>
              <li className="flex items-center gap-2">
                {hasSpecialChar ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className={hasSpecialChar ? "text-green-700" : "text-red-700"}>
                  At least one special character
                </span>
              </li>
              <li className="flex items-center gap-2 pt-2">
                {passwordsMatch ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className={passwordsMatch ? "text-green-700" : "text-red-700"}>
                  Passwords match
                </span>
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            disabled={!isValidPassword || !passwordsMatch || isLoading}
            className="w-full"
          >
            {isLoading ? <ThreeDots width="30" color="#fff" /> : <>Reset Password</>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
