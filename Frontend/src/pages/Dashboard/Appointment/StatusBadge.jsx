// src/components/appointments/StatusBadge.jsx
import React from "react";

const StatusBadge = ({ status }) => {
  const baseClasses =
    "px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center shadow-sm border gap-1.5";

  // Normalize status string to handle case sensitivity
  const normalizedStatus = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "";

  switch (normalizedStatus) {
    case "Scheduled":
      return (
        <span
          className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-100`}
        >
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full bg-blue-400 rounded-full opacity-75 animate-ping"></span>
            <span className="relative inline-flex w-2 h-2 bg-blue-500 rounded-full"></span>
          </span>
          Scheduled
        </span>
      );

    case "Completed":
      return (
        <span
          className={`${baseClasses} bg-green-50 text-green-700 border-green-100`}
        >
          <svg
            className="w-3 h-3 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Completed
        </span>
      );

    case "Ongoing":
      return (
        <span
          className={`${baseClasses} bg-amber-50 text-amber-700 border-amber-100`}
        >
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
          Ongoing
        </span>
      );

    case "Cancelled":
      return (
        <span
          className={`${baseClasses} bg-red-50 text-red-700 border-red-100`}
        >
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          Cancelled
        </span>
      );

    default:
      return (
        <span
          className={`${baseClasses} bg-gray-50 text-gray-700 border-gray-100`}
        >
          {normalizedStatus || "Unknown"}
        </span>
      );
  }
};

export default StatusBadge;
