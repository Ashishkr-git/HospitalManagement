import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  X,
  Phone,
  Stethoscope,
  Clock,
  Activity,
  Loader2,
  FileText, // Changed Activity to FileText for Diagnosis clarity
} from "lucide-react";

// Import Auth Context
import { useAuth } from "../../context/AuthContext";

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

const appointmentSchema = z.object({
  patient: z.string().min(2, { message: "Required" }),
  phone: z
    .string()
    .min(10, { message: "Min 10 digits" })
    .regex(/^\d+$/, { message: "Numbers only" }),
  age: z.coerce.number().min(1, { message: "Required" }).max(120),
  date: z.string().min(1, { message: "Required" }),
  doctor: z.string().min(1, { message: "Select a doctor" }),
  diagnosis: z.string().min(2, { message: "Required" }),
});

export const AppointmentFormModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const isDoctor = user?.role === "doctor";

  const form = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient: "",
      phone: "",
      age: "",
      date: new Date().toISOString().split("T")[0],
      doctor: isDoctor ? user._id : "",
      diagnosis: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        patient: "",
        phone: "",
        age: "",
        date: new Date().toISOString().split("T")[0],
        doctor: isDoctor ? user._id : "",
        diagnosis: "",
      });
    }
  }, [isOpen, user, isDoctor, form]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchDoctors = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${API_URL}/doctors/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        }
      } catch (error) {
        console.error("Failed to load doctors", error);
        setServerError("Failed to load doctors list");
        setShowErrorAlert(true);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [isOpen]);

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message || "Failed to create appointment");

      form.reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setServerError(error.message);
      setShowErrorAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
        {/* max-w-lg for slightly wider layout, max-h-[90vh] for small screens */}
        <div className="w-full max-w-lg overflow-hidden bg-white shadow-2xl rounded-xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50 shrink-0">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                New Appointment
              </h2>
              <p className="text-xs text-gray-500">Book a new slot</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 transition-colors rounded-full hover:text-gray-900 hover:bg-gray-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Form Area */}
          <div className="p-5 overflow-y-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="grid grid-cols-2 gap-x-4 gap-y-3"
              >
                {/* Patient Name - Full Width */}
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="patient"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                          Patient Name
                        </FormLabel>
                        <div className="relative">
                          <User className="absolute w-3.5 h-3.5 text-gray-400 left-3 top-3" />
                          <FormControl>
                            <Input
                              placeholder="Full name"
                              className="text-sm pl-9 h-9" // Compact height
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

                {/* Phone & Age - Side by Side */}
                <div className="col-span-2 sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                          Phone
                        </FormLabel>
                        <div className="relative">
                          <Phone className="absolute w-3.5 h-3.5 text-gray-400 left-3 top-3" />
                          <FormControl>
                            <Input
                              placeholder="10 digits"
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

                <div className="col-span-2 sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                          Age
                        </FormLabel>
                        <div className="relative">
                          <Activity className="absolute w-3.5 h-3.5 text-gray-400 left-3 top-3" />
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Yrs"
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

                {/* Date & Doctor - Side by Side */}
                <div className="col-span-2 sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                          Date
                        </FormLabel>
                        <div className="relative">
                          {/* Calendar icon tricky with date inputs, keeping minimal */}
                          <FormControl>
                            <Input
                              type="date"
                              className="text-sm h-9"
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

                <div className="col-span-2 sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="doctor"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                          Doctor
                        </FormLabel>
                        <div className="relative">
                          <Stethoscope className="absolute w-3.5 h-3.5 text-gray-400 left-3 top-3 pointer-events-none" />
                          <FormControl>
                            <select
                              disabled={loadingDoctors || isSubmitting}
                              className="w-full pr-3 text-sm bg-white border border-gray-200 rounded-md h-9 pl-9 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                              {...field}
                            >
                              <option value="">
                                {loadingDoctors ? "Loading..." : "Select..."}
                              </option>
                              {doctors.map((doc) => (
                                <option key={doc._id} value={doc._id}>
                                  {doc.name}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                        </div>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Diagnosis - Full Width */}
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="diagnosis"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                          Diagnosis
                        </FormLabel>
                        <div className="relative">
                          <FileText className="absolute w-3.5 h-3.5 text-gray-400 left-3 top-3" />
                          <FormControl>
                            <Input
                              placeholder="Chief complaint..."
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

                {/* Footer Actions - Full Width */}
                <div className="grid grid-cols-2 col-span-2 gap-3 pt-2 mt-2 border-t border-gray-50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="w-full text-sm h-9"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-sm text-white bg-black h-9 hover:bg-gray-800"
                  >
                    {isSubmitting ? (
                      <Loader2 size={14} className="mr-2 animate-spin" />
                    ) : (
                      "Confirm Booking"
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
};