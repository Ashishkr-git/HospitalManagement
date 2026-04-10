import React from "react";
import { Plus, LogOut, Loader2, User, Stethoscope } from "lucide-react";

// Import components
import { AppointmentFormModal } from "./AppointmentFormModal.jsx";
import { DashboardFilters } from "./DashboardFilters.jsx";
import { AppointmentsTable } from "./AppointmentsTable.jsx";
import { AppointmentsMobileList } from "./AppointmentsMobileList.jsx";
import ErrorAlert from "../../components/common/ErrorAlert";

// Import the local hook
import { useDoctorDashboard } from "./useDoctorDashboard.jsx";

export default function DoctorDashboard() {
  const {
    user,
    filteredData,
    financials,
    uniqueStatuses,
    expandedId,
    isModalOpen,
    setIsModalOpen,
    toggleRow,
    handleUpdateRoadmap,
    handleNewAppointmentSubmit,
    handleLogout,
    filters,
    loading,
    error,
    showErrorAlert,
    setShowErrorAlert,
  } = useDoctorDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full px-4 py-6 mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8 sm:py-10">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          
          {/* Title & User Info */}
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              <Stethoscope className="w-6 h-6 text-gray-400 md:w-8 md:h-8" />
              Clinical Dashboard
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Manage treatments & logs for</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 font-medium text-gray-700 bg-gray-100 rounded-full">
                <User className="w-3 h-3" />
                {user?.name || "Doctor"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {/* Mobile: Grid (2 equal cols), Desktop: Flex Row */}
          <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
            
            {/* Sign Out */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors border border-transparent rounded-xl bg-red-50 hover:bg-red-100 active:bg-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="sm:hidden md:inline">Sign Out</span>
              <span className="hidden sm:inline md:hidden">Out</span>
            </button>

            {/* New Appointment (Primary Action) */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center col-span-1 gap-2 px-5 py-2.5 text-sm font-medium text-white transition-all bg-gray-900 shadow-lg rounded-xl shadow-gray-900/10 hover:bg-black hover:shadow-gray-900/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="whitespace-nowrap">New Appointment</span>
            </button>
          </div>
        </div>

        {/* --- Filters & Stats --- */}
        {/* We wrap this to ensure spacing consistency */}
        <div className="py-2">
            <DashboardFilters
            filters={filters}
            uniqueStatuses={uniqueStatuses}
            financials={financials}
            />
        </div>

        {/* --- Data Display --- */}
        {/* Logic: Hide Table on Mobile, Hide List on Desktop */}
        
        {/* Desktop View (md and up) */}
        <div className="hidden md:block">
          <AppointmentsTable
            filteredData={filteredData}
            expandedId={expandedId}
            toggleRow={toggleRow}
            handleUpdateRoadmap={handleUpdateRoadmap}
          />
        </div>

        {/* Mobile View (below md) */}
        <div className="block md:hidden">
          <AppointmentsMobileList
            filteredData={filteredData}
            expandedId={expandedId}
            toggleRow={toggleRow}
            handleUpdateRoadmap={handleUpdateRoadmap}
          />
        </div>
      </div>

      {/* --- Modals & Alerts --- */}
      <AppointmentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleNewAppointmentSubmit}
      />
      
      <ErrorAlert
        isOpen={showErrorAlert}
        onClose={() => setShowErrorAlert(false)}
        title="Dashboard Error"
        message={error}
      />
    </>
  );
}