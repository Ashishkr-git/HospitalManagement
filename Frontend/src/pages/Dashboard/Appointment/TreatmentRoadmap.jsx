// src/components/appointments/TreatmentRoadmap.jsx
import React from "react";
import { Activity, CheckCircle2, Circle, Calendar } from "lucide-react";

const TreatmentRoadmap = ({ history }) => {
  // If no history exists, show a placeholder
  if (!history || history.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500">
        No treatment history available.
      </div>
    );
  }

  // Helper to format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 sm:p-6">
      {/* Roadmap Header Summary */}
      <div className="flex flex-col justify-between gap-4 pb-4 mb-8 border-b border-gray-200 sm:flex-row sm:items-center">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-bold tracking-wide text-gray-900 uppercase">
            <Activity className="w-4 h-4 text-blue-600" />
            Treatment Roadmap
          </h4>
          <p className="mt-1 text-xs text-gray-500">
            Total Treatment Plan Overview
          </p>
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-2 sm:pl-4">
        {/* Continuous Line */}
        <div className="absolute top-2 bottom-0 left-[19px] sm:left-[27px] w-0.5 bg-gray-200" />

        <div className="space-y-8">
          {history.map((step, index) => {
            const isCompleted = step.status === "completed";
            // Map backend 'visitNumber' to frontend 'visit'
            const visitNum = step.visitNumber || index + 1;

            return (
              <div key={index} className="relative flex items-start group">
                {/* Timeline Dot/Icon */}
                <div
                  className={`
                    absolute left-2 sm:left-4 -ml-px w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center z-10 bg-white
                    ${
                      isCompleted
                        ? "border-green-500 text-green-600"
                        : "border-gray-300 text-gray-400"
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <Circle className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </div>

                {/* Content Card */}
                <div className="w-full ml-12 sm:ml-16">
                  <div className="flex flex-col gap-1 mb-1 sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 inline-block
                            ${
                              isCompleted
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-50 text-blue-700"
                            }
                        `}
                      >
                        Visit {visitNum < 10 ? `0${visitNum}` : visitNum}
                      </span>
                      <h5
                        className={`text-sm sm:text-base font-semibold ${
                          isCompleted ? "text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {step.title}
                      </h5>
                    </div>
                    <div className="flex items-center gap-3 mt-1 sm:mt-0">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {/* Use the helper function here */}
                        {formatDate(step.date)}
                      </span>
                      <span className="text-sm font-medium text-gray-900 border border-gray-200 bg-white px-2 py-0.5 rounded shadow-sm">
                        ₹{(step.cost || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="p-3 text-xs leading-relaxed text-gray-600 bg-white border border-gray-100 rounded-md shadow-sm sm:text-sm">
                    {step.description || "No notes available."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TreatmentRoadmap;
