import React from "react";
import {
  ChevronDown,
  ChevronUp,
  Phone,
  User,
  Activity,
  CreditCard,
} from "lucide-react";
import { StatusBadge, PaymentMethodBadge } from "./DashboardBadges";
import RoadmapEditor from "./RoadmapEditor";

export const AppointmentsMobileList = ({
  filteredData,
  expandedId,
  toggleRow,
  handleUpdateRoadmap,
}) => {
  return (
    <div className="space-y-3 md:hidden">
      {filteredData.length === 0 && (
        <div className="py-8 text-center text-gray-500 bg-white border border-gray-200 border-dashed rounded-xl">
          <p className="text-sm">No appointments found.</p>
        </div>
      )}

      {filteredData.map((appt) => {
        // --- Calculations ---
        const totalCost =
          appt.treatmentHistory?.reduce(
            (acc, curr) => acc + (parseFloat(curr.cost) || 0),
            0
          ) || 0;
        const totalPaid =
          appt.treatmentHistory?.reduce(
            (acc, curr) => acc + (parseFloat(curr.paidAmount) || 0),
            0
          ) || 0;
        const remaining = totalCost - totalPaid;
        const lastVisitWithPayment = [...(appt.treatmentHistory || [])]
          .reverse()
          .find((h) => h.paymentMethod);
        const paymentMethod = lastVisitWithPayment
          ? lastVisitWithPayment.paymentMethod
          : null;

        const isExpanded = expandedId === appt.id;

        return (
          <div
            key={appt.id}
            onClick={() => toggleRow(appt.id)}
            className="overflow-hidden transition-colors bg-white border border-gray-200 shadow-sm rounded-xl active:bg-gray-50"
          >
            {/* --- Main Card Content --- */}
            <div className="p-3">
              {/* Top Row: Avatar | Name/Phone | Price/Status */}
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="shrink-0">
                  <div className="flex items-center justify-center text-xs font-bold text-blue-700 border border-blue-100 rounded-full w-9 h-9 bg-blue-50">
                    {appt.patient?.charAt(0) || "P"}
                  </div>
                </div>

                {/* Middle: Name & Phone (Truncates if needed) */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {appt.patient}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="truncate">
                      {appt.mobile || appt.phone || "No Number"}
                    </span>
                  </div>
                </div>

                {/* Right: Price & Status (Fixed width, does not shrink) */}
                <div className="flex flex-col items-end gap-1 text-right shrink-0">
                  <span className="text-sm font-bold text-gray-900">
                    ₹{totalCost.toLocaleString("en-IN")}
                  </span>
                  <StatusBadge status={appt.status} />
                </div>
              </div>

              {/* Middle Row: Diagnosis & Doctor (Compact Line) */}
              <div className="flex items-center justify-between pb-2 mt-3 text-xs text-gray-600 border-b border-gray-50">
                <div className="flex items-center gap-1.5 truncate pr-2 max-w-[60%]">
                  <Activity className="w-3 h-3 text-gray-400" />
                  <span className="truncate">
                    {appt.diagnosis || "No Diagnosis"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <User className="w-3 h-3 text-gray-400" />
                  <span>{appt.doctor}</span>
                </div>
              </div>

              {/* Bottom Row: Compact Financial Grid */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                {/* Paid */}
                <div className="bg-gray-50 rounded-lg p-1.5 text-center">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wide">
                    Paid
                  </span>
                  <span className="text-xs font-semibold text-green-600">
                    ₹{totalPaid.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Due */}
                <div className="bg-gray-50 rounded-lg p-1.5 text-center">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wide">
                    Due
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      remaining > 0 ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    ₹{remaining.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Method / Toggle */}
                <div className="bg-gray-50 rounded-lg p-1.5 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                  {paymentMethod ? (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
                        Via
                      </span>
                      <PaymentMethodBadge
                        method={paymentMethod}
                        compact={true}
                      />
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-400">Unpaid</span>
                  )}
                </div>
              </div>

              {/* Toggle Hint */}
              <div className="flex justify-center mt-2 -mb-1">
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3 text-gray-300" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-gray-300" />
                )}
              </div>
            </div>

            {/* --- Expanded Editor --- */}
            {isExpanded && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="p-3 border-t border-gray-200 bg-gray-50 animate-in slide-in-from-top-2"
              >
                <RoadmapEditor
                  appointment={appt}
                  onUpdate={handleUpdateRoadmap}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
