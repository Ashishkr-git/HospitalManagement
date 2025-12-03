import React from "react";

export const StatusBadge = ({ status }) => {
  const baseClasses =
    "px-2.5 py-0.5 text-xs font-medium rounded-full inline-flex items-center shadow-sm border whitespace-nowrap";

  if (status === "Ongoing") {
    return (
      <span
        className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-100`}
      >
        <span className="w-1.5 h-1.5 mr-1.5 bg-blue-500 rounded-full animate-pulse"></span>
        {status}
      </span>
    );
  }
  if (status === "Completed") {
    return (
      <span
        className={`${baseClasses} bg-green-50 text-green-700 border-green-100`}
      >
        {status}
      </span>
    );
  }

  // NEW: Red badge for Cancelled
  if (status === "Cancelled") {
    return (
      <span className={`${baseClasses} bg-red-50 text-red-700 border-red-100`}>
        {status}
      </span>
    );
  }

  // NEW: Yellowish badge for Scheduled (and Pending fallback)
  if (status === "Pending" || status === "Scheduled") {
    return (
      <span
        className={`${baseClasses} bg-yellow-50 text-yellow-700 border-yellow-100`}
      >
        {status}
      </span>
    );
  }

  // Default Fallback
  return (
    <span className={`${baseClasses} bg-gray-50 text-gray-700 border-gray-100`}>
      {status}
    </span>
  );
};

export const PaymentMethodBadge = ({ method }) => {
  const m = method ? method.toLowerCase() : "n/a";
  let classes = "bg-gray-100 text-gray-600 border-gray-200";

  if (m.includes("upi") || m.includes("online"))
    classes = "bg-purple-50 text-purple-700 border-purple-100";
  if (m.includes("cash"))
    classes = "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (m.includes("card"))
    classes = "bg-orange-50 text-orange-700 border-orange-100";

  return (
    <span
      className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wide rounded border ${classes}`}
    >
      {method || "-"}
    </span>
  );
};
