import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:5000/api";

export const useDoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // NEW: Track errors
  const [showErrorAlert, setShowErrorAlert] = useState(false); // NEW: Track ErrorAlert visibility

  // UI State
  const [expandedId, setExpandedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter State
  const [filter, setFilter] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState("All Doctors");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [searchQuery, setSearchQuery] = useState("");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  // 1. Fetch Data
  const fetchTreatments = async () => {
    // Guard: Ensure user exists
    if (!user || !user._id) return;

    try {
      setError(null);
      setLoading(true);

      const token = sessionStorage.getItem("token");
      const roleParam = user.role ? user.role.toLowerCase() : "";

      const response = await fetch(
        `${API_URL}/treatments?role=${roleParam}&userId=${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      const errorMessage = error.message || "Failed to load appointments";
      setError(errorMessage);
      setShowErrorAlert(true); // NEW: Show ErrorAlert
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTreatments();
  }, [user]);

  // --- Handle Logout ---
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 2. Handlers
  const toggleRow = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleNewAppointmentSubmit = async () => {
    await fetchTreatments();
    setIsModalOpen(false);
  };

  const handleUpdateRoadmap = async (id, newHistory) => {
    // --- FIX: Sanitize History to ensure Capitalized Statuses (Backend Requirement) ---
    const sanitizedHistory = newHistory.map((step) => {
      if (!step.status) return step;
      const status =
        step.status.charAt(0).toUpperCase() +
        step.status.slice(1).toLowerCase();
      return { ...step, status };
    });

    // --- 1. Calculate New Status (Frontend Logic) ---
    let newStatus = "Pending";
    const total = sanitizedHistory.length;

    if (total > 0) {
      const completed = sanitizedHistory.filter(
        (s) => s.status === "Completed"
      ).length;
      const cancelled = sanitizedHistory.filter(
        (s) => s.status === "Cancelled"
      ).length;
      const ongoing = sanitizedHistory.filter(
        (s) => s.status === "Ongoing"
      ).length;
      const scheduled = sanitizedHistory.filter(
        (s) => s.status === "Scheduled"
      ).length;

      if (completed === total) {
        newStatus = "Completed";
      } else if (cancelled === total) {
        newStatus = "Cancelled";
      } else if (completed > 0 || ongoing > 0) {
        newStatus = "Ongoing";
      } else if (scheduled > 0) {
        newStatus = "Scheduled";
      }
    }

    // --- 2. Optimistic Update (Immediate UI Feedback) ---
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id
          ? {
              ...appt,
              treatmentHistory: sanitizedHistory,
              status: newStatus,
            }
          : appt
      )
    );

    try {
      setError(null);
      const token = localStorage.getItem("token");

      // --- 3. Save Roadmap ---
      const roadmapResponse = await fetch(
        `${API_URL}/treatments/${id}/roadmap`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ treatmentHistory: sanitizedHistory }),
        }
      );

      if (!roadmapResponse.ok) {
        throw new Error("Failed to save roadmap");
      }

      // --- 4. Force Status Update ---
      const statusResponse = await fetch(
        `${API_URL}/treatments/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!statusResponse.ok) {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Update failed", error);
      const errorMessage = error.message || "Failed to update roadmap";
      setError(errorMessage);
      setShowErrorAlert(true); // NEW: Show ErrorAlert
      await fetchTreatments(); // Revert on error
    }
  };

  // 3. Helper: Currency Formatter
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // 4. Dynamic Options
  const uniqueDoctors = useMemo(() => {
    const doctors = new Set(appointments.map((item) => item.doctor));
    return ["All Doctors", ...Array.from(doctors)];
  }, [appointments]);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(appointments.map((item) => item.status));
    return ["All Statuses", ...Array.from(statuses)];
  }, [appointments]);

  // 5. Filtering Logic
  const filteredData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments
      .filter((appt) => {
        const apptDate = new Date(appt.lastVisit);
        apptDate.setHours(0, 0, 0, 0);

        let dateMatch = true;

        if (filter === "Today") {
          dateMatch = apptDate.getTime() === today.getTime();
        } else if (filter === "Week") {
          const start = new Date(today);
          start.setDate(today.getDate() - today.getDay());
          const end = new Date(today);
          end.setDate(today.getDate() + (6 - today.getDay()));
          dateMatch = apptDate >= start && apptDate <= end;
        } else if (filter === "Month") {
          dateMatch =
            apptDate.getMonth() === today.getMonth() &&
            apptDate.getFullYear() === today.getFullYear();
        } else if (
          filter === "Custom" &&
          customRange.start &&
          customRange.end
        ) {
          const start = new Date(customRange.start);
          const end = new Date(customRange.end);
          end.setHours(23, 59, 59);
          dateMatch = apptDate >= start && apptDate <= end;
        }

        const doctorMatch =
          selectedDoctor === "All Doctors" || appt.doctor === selectedDoctor;
        const statusMatch =
          selectedStatus === "All Statuses" || appt.status === selectedStatus;

        let searchMatch = true;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          searchMatch =
            appt.patient.toLowerCase().includes(query) ||
            appt.doctor.toLowerCase().includes(query) ||
            appt.diagnosis.toLowerCase().includes(query) ||
            (appt.phone && appt.phone.includes(query));
        }

        return dateMatch && doctorMatch && statusMatch && searchMatch;
      })
      .map((appt) => {
        const history = appt.treatmentHistory || [];

        const totalCost = history.reduce(
          (sum, v) => sum + (parseFloat(v.cost) || 0),
          0
        );

        const totalPaid = history.reduce(
          (sum, v) => sum + (parseFloat(v.paidAmount) || 0),
          0
        );

        const dueAmount = totalCost - totalPaid;

        const currentMethod =
          history.length > 0
            ? history[history.length - 1].paymentMethod
            : "Pending";

        // --- FIX: Derive Status Dynamically for Display ---
        let displayStatus = appt.status;

        if (history.length > 0) {
          const steps = history.map((s) => ({
            ...s,
            status:
              (s.status || "").charAt(0).toUpperCase() +
              (s.status || "").slice(1).toLowerCase(),
          }));

          const allComp = steps.every((s) => s.status === "Completed");
          const allCanc = steps.every((s) => s.status === "Cancelled");
          const anyProg = steps.some(
            (s) => s.status === "Ongoing" || s.status === "Completed"
          );

          if (allComp) displayStatus = "Completed";
          else if (allCanc) displayStatus = "Cancelled";
          else if (anyProg) displayStatus = "Ongoing";
          else displayStatus = "Scheduled";
        } else {
          displayStatus = "Pending";
        }

        return {
          ...appt,
          invoice: `INV-${appt.id.slice(-4).toUpperCase()}`,
          method: currentMethod,
          status: displayStatus,
          amountRaw: totalCost,
          paidRaw: totalPaid,
          dueRaw: dueAmount,
          amount: formatCurrency(totalCost),
          paid: formatCurrency(totalPaid),
          due: formatCurrency(dueAmount),
          isDue: dueAmount > 0,
        };
      });
  }, [
    appointments,
    filter,
    customRange,
    selectedDoctor,
    selectedStatus,
    searchQuery,
  ]);

  // 6. Financial Totals
  const financials = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => ({
        total: acc.total + (curr.amountRaw || 0),
        paid: acc.paid + (curr.paidRaw || 0),
        due: acc.due + (curr.dueRaw || 0),
      }),
      { total: 0, paid: 0, due: 0 }
    );
  }, [filteredData]);

  return {
    user,
    filteredData,
    financials,
    uniqueDoctors,
    uniqueStatuses,
    expandedId,
    isModalOpen,
    setIsModalOpen,
    toggleRow,
    handleUpdateRoadmap,
    handleNewAppointmentSubmit,
    handleLogout,
    loading,
    error, // NEW: Return error state
    showErrorAlert, // NEW: Return alert state
    setShowErrorAlert, // NEW: Return alert setter
    filters: {
      filter,
      setFilter,
      selectedDoctor,
      setSelectedDoctor,
      selectedStatus,
      setSelectedStatus,
      searchQuery,
      setSearchQuery,
      customRange,
      setCustomRange,
    },
  };
};