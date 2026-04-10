import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  X,
  Loader2,
  User,
  Phone,
  Lock,
  Shield,
  Stethoscope,
  AlertCircle,
} from "lucide-react";

// Components
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
import ErrorAlert from "../../components/common/ErrorAlert";

const API_URL = "http://localhost:5000/api";

// --- Validation Schema ---
const memberSchema = z.object({
  name: z.string().min(2, { message: "Name required (min 2 chars)" }),
  phone: z
    .string()
    .min(10, { message: "Min 10 digits" })
    .regex(/^\d+$/, { message: "Numbers only" }),
  password: z.string().min(6, { message: "Min 6 characters" }),
  role: z.string().min(1, { message: "Role is required" }),
  department: z.string().optional(),
});

export default function AddMemberModal({ isOpen, onClose, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // Setup Form
  const form = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      phone: "",
      password: "",
      role: "doctor",
      department: "",
    },
  });

  // Watch role to disable/enable department field
  const selectedRole = form.watch("role");

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        phone: "",
        password: "",
        role: "doctor",
        department: "",
      });
      setServerError(null);
    }
  }, [isOpen, form]);

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/register-staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add member");
      }

      form.reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setServerError(err.message);
      setShowErrorAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
        {/* Compact Container: max-w-sm fits nicely on all screens */}
        <div className="w-full max-w-sm overflow-hidden bg-white shadow-2xl rounded-xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50 shrink-0">
            <h3 className="text-base font-medium text-gray-900">
              Add New Member
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 transition-colors rounded-full hover:text-gray-900 hover:bg-gray-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div className="p-5 overflow-y-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="grid grid-cols-2 gap-x-3 gap-y-3"
              >
                {/* Full Name - Full Width */}
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                          Full Name
                        </FormLabel>
                        <div className="relative">
                          <User className="absolute w-3.5 h-3.5 text-gray-400 left-3 top-3" />
                          <FormControl>
                            <Input
                              placeholder="Dr. John Doe"
                              className="text-sm pl-9 h-9"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Mobile - Col 1 */}
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                          Mobile
                        </FormLabel>
                        <div className="relative">
                          <Phone className="absolute w-3.5 h-3.5 text-gray-400 left-3 top-3" />
                          <FormControl>
                            <Input
                              placeholder="9876..."
                              className="text-sm pl-9 h-9"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password - Col 2 */}
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                          Password
                        </FormLabel>
                        <div className="relative">
                          <Lock className="absolute w-3.5 h-3.5 text-gray-400 left-3 top-3" />
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••"
                              className="text-sm pl-9 h-9"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Role - Col 1 */}
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                          Role
                        </FormLabel>
                        <div className="relative">
                          <Shield className="absolute w-3.5 h-3.5 text-gray-400 left-3 top-3 pointer-events-none" />
                          <FormControl>
                            <select
                              className="w-full pr-2 text-sm bg-white border border-gray-200 rounded-md h-9 pl-9 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                              disabled={isSubmitting}
                              {...field}
                            >
                              <option value="doctor">Doctor</option>
                              <option value="admin">Admin</option>
                            </select>
                          </FormControl>
                        </div>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Department - Col 2 */}
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                          Department
                        </FormLabel>
                        <div className="relative">
                          <Stethoscope className="absolute w-3.5 h-3.5 text-gray-400 left-3 top-3" />
                          <FormControl>
                            <Input
                              placeholder="General"
                              className="text-sm pl-9 h-9"
                              disabled={
                                isSubmitting || selectedRole !== "doctor"
                              }
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Footer Actions - Full Width */}
                <div className="col-span-2 pt-2 mt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-sm text-white bg-black h-9 hover:bg-gray-800"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    ) : (
                      "Create Member"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <ErrorAlert
        isOpen={showErrorAlert}
        onClose={() => {
          setShowErrorAlert(false);
          setServerError(null);
        }}
        title="Error"
        message={serverError}
      />
    </>
  );
}
