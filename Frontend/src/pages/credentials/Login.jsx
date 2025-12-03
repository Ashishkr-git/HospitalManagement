import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Lock, Phone, UserCog, Stethoscope, Loader2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

// Import the ErrorAlert component
import ErrorAlert from "../../components/common/ErrorAlert";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/lightswind/form";
import { Input } from "@/components/lightswind/input";
import { Button } from "@/components/lightswind/button";

const loginSchema = z.object({
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^\d+$/, { message: "Numbers only" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  // State for the Error Alert Popup
  const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: "" });

  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const handleFormSubmit = async (data) => {
    setLoading(true);
    form.clearErrors("root");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: data.phone,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      // --- FIX: Check Role BEFORE Logging In or Redirecting ---
      const userRole = result.user.role;

      if (userRole === "admin") {
        login(result.user, result.token);
        navigate("/dashboard");
      } else if (userRole === "doctor") {
        login(result.user, result.token);
        navigate("/doctordashboard");
      } else {
        // If role is 'patient' or anything else, DENY ACCESS
        // Do NOT call login() here, or AuthContext will persist the session
        throw new Error(
          "Access Denied: You do not have permission to access the dashboard."
        );
      }
    } catch (error) {
      // Show the Error Alert Popup
      setErrorAlert({
        isOpen: true,
        message: error.message || "Invalid credentials or access denied.",
      });

      // Ensure we are logged out if a partial login occurred
      // (Optional, depends on if 'login' was called before error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-50/50"
      style={{ fontFamily: '"Work Sans", sans-serif' }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600&display=swap');`}</style>

      <div className="w-full max-w-sm overflow-hidden duration-300 bg-white border border-gray-100 shadow-xl rounded-2xl animate-in fade-in zoom-in-95">
        {/* Header Section */}
        <div className="p-8 pb-0 text-center">
          <div className="flex justify-center gap-2 mb-4">
            <div className="p-3 text-white bg-black rounded-full shadow-sm">
              <UserCog size={20} />
            </div>
            <div className="p-3 text-blue-600 bg-blue-100 rounded-full shadow-sm">
              <Stethoscope size={20} />
            </div>
          </div>
          <h1 className="text-2xl font-medium text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium tracking-wide text-gray-700 uppercase">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="9876543210"
                          className="bg-white pl-9"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^\d+$/.test(value)) {
                              field.onChange(value);
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium tracking-wide text-gray-700 uppercase">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="bg-white pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-2 text-white bg-black hover:bg-gray-800 h-11"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Render the ErrorAlert Component */}
      <ErrorAlert
        isOpen={errorAlert.isOpen}
        message={errorAlert.message}
        onClose={() => setErrorAlert({ ...errorAlert, isOpen: false })}
      />
    </div>
  );
};

export default Login;
