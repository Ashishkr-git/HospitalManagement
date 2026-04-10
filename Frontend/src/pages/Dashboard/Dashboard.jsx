import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Import Custom Components
import AppointmentTab from "./Appointment/Appointmenttable.jsx";
import UsersTable from "./User.jsx";

export default function Dashboard() {
  const { logout, user } = useAuth();

  // Custom state to control tabs manually
  const [activeTab, setActiveTab] = useState("appointments");

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* 1. Force a hardware-accelerated fade animation */}
      <style>{`
        .tab-content-enter {
          animation: fadeSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main className="w-full px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-10 min-h-[600px]">
        {/* --- Header Section --- */}
        <div className="flex flex-col gap-5 mb-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Welcome back,{" "}
              <span className="font-semibold text-gray-700">
                {user?.name || "Admin"}
              </span>
              .
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center justify-center w-full gap-2 px-5 py-2.5 text-sm font-medium text-red-600 transition-colors rounded-lg bg-red-50 hover:bg-red-100 active:bg-red-200 md:w-auto"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* --- CUSTOM TABS SYSTEM --- */}
        <div className="w-full space-y-6">
          {/* 1. The Switcher (Visual Replica of your TabsList) */}
          {/* We use standard HTML buttons to ensure 0 lag */}
          <div className="grid w-full grid-cols-2 gap-2 p-1 rounded-xl bg-gray-200/50 md:w-fit md:inline-flex md:rounded-full">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`
                w-full md:w-auto md:px-6 py-2.5 text-sm font-medium rounded-lg md:rounded-full transition-all duration-200 ease-out
                ${
                  activeTab === "appointments"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-black hover:bg-gray-200/50"
                }
              `}
            >
              Appointments
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`
                w-full md:w-auto md:px-6 py-2.5 text-sm font-medium rounded-lg md:rounded-full transition-all duration-200 ease-out
                ${
                  activeTab === "users"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-black hover:bg-gray-200/50"
                }
              `}
            >
              User Management
            </button>
          </div>

          {/* 2. The Content Area (Keep-Alive Strategy) */}
          <div className="relative w-full">
            {/* Appointment Tab Container */}
            <div
              className={
                activeTab === "appointments"
                  ? "block tab-content-enter"
                  : "hidden"
              }
            >
              {/* This component STAYS mounted, preventing re-fetch lag */}
              <div className="w-full pb-2 overflow-x-auto">
                <AppointmentTab />
              </div>
            </div>

            {/* Users Tab Container */}
            <div
              className={
                activeTab === "users" ? "block tab-content-enter" : "hidden"
              }
            >
              {/* This component STAYS mounted, preventing re-fetch lag */}
              <div className="w-full pb-2 overflow-x-auto">
                <UsersTable />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
