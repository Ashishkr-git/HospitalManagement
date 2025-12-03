// src/components/appointments/PaymentMethodBadge.jsx
import React from "react";
import {
  CreditCard,
  Banknote,
  Smartphone,
  Landmark,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

const PaymentMethodBadge = ({ method }) => {
  // Normalize string to handle case sensitivity if needed
  const type = method ? method.toString() : "";

  switch (type) {
    case "Cash":
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 w-fit">
          <Banknote className="w-3 h-3" />
          Cash
        </div>
      );

    case "UPI":
    case "Online": // Legacy support
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 w-fit">
          <Smartphone className="w-3 h-3" />
          UPI
        </div>
      );

    case "Card":
    case "Debit Card":
    case "Credit Card":
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 w-fit">
          <CreditCard className="w-3 h-3" />
          Card
        </div>
      );

    case "Net Banking":
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 w-fit">
          <Landmark className="w-3 h-3" />
          Net Banking
        </div>
      );

    case "Insurance":
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 w-fit">
          <ShieldCheck className="w-3 h-3" />
          Insurance
        </div>
      );

    case "Pending":
    case "N/A":
    default:
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 w-fit">
          <HelpCircle className="w-3 h-3" />
          {type || "N/A"}
        </div>
      );
  }
};

export default PaymentMethodBadge;
