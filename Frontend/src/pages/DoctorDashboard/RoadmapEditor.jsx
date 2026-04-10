import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Save,
  Activity,
  XCircle,
} from "lucide-react";
import ErrorAlert from "../../components/common/ErrorAlert";

export default function RoadmapEditor({
  appointment,
  onUpdate,
  onStatusUpdate,
}) {
  // FIX: Helper to sanitize data
  // Converts "upcoming" (old data) or lowercase "scheduled" -> Capitalized "Scheduled"
  const sanitizeHistory = (data) => {
    return (data || []).map((step) => {
      let safeStatus = step.status;
      if (safeStatus === "upcoming" || safeStatus === "scheduled")
        safeStatus = "Scheduled";
      if (safeStatus === "completed") safeStatus = "Completed";
      if (safeStatus === "cancelled") safeStatus = "Cancelled";
      if (safeStatus === "ongoing") safeStatus = "Ongoing";
      return { ...step, status: safeStatus };
    });
  };

  // Initialize state with sanitized data
  const [history, setHistory] = useState(
    sanitizeHistory(appointment?.treatmentHistory)
  );
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null); // NEW: Track errors
  const [showErrorAlert, setShowErrorAlert] = useState(false); //

  useEffect(() => {
    setHistory(sanitizeHistory(appointment?.treatmentHistory));
  }, [appointment]);

  const handleStepChange = (index, field, value) => {
    const newHistory = [...history];
    newHistory[index] = { ...newHistory[index], [field]: value };
    setHistory(newHistory);
    setIsDirty(true);
  };

  const handleCostChange = (index, value) => {
    const newHistory = [...history];
    const newCost = parseFloat(value) || 0;
    newHistory[index].cost = value;
    const currentPaid = parseFloat(newHistory[index].paidAmount) || 0;
    if (currentPaid > newCost) {
      newHistory[index].paidAmount = newCost;
    }
    setHistory(newHistory);
    setIsDirty(true);
  };

  const handlePaidChange = (index, value) => {
    const newHistory = [...history];
    const currentCost = parseFloat(newHistory[index].cost) || 0;
    let newPaid = parseFloat(value);

    if (value === "") {
      newHistory[index].paidAmount = "";
      setHistory(newHistory);
      setIsDirty(true);
      return;
    }
    if (newPaid > currentCost) {
      newPaid = currentCost;
    }
    newHistory[index].paidAmount = newPaid;
    setHistory(newHistory);
    setIsDirty(true);
  };

  const toggleStatus = (index) => {
    const newHistory = [...history];
    const currentStatus = newHistory[index].status;

    // Logic: Scheduled -> Ongoing -> Completed -> Cancelled -> Scheduled
    let nextStatus = "Scheduled";
    if (currentStatus === "Scheduled") nextStatus = "Ongoing";
    else if (currentStatus === "Ongoing") nextStatus = "Completed";
    else if (currentStatus === "Completed") nextStatus = "Cancelled";
    else if (currentStatus === "Cancelled") nextStatus = "Scheduled";

    newHistory[index].status = nextStatus;
    setHistory(newHistory);
    setIsDirty(true);
  };

  const addNewVisit = () => {
    const newVisit = {
      visitNumber: history.length + 1,
      date: new Date().toISOString().split("T")[0],
      title: "",
      description: "",
      cost: 0,
      paidAmount: 0,
      paymentMethod: "Cash",
      // FIX: Default status is 'Scheduled' (Capitalized)
      status: "Scheduled",
    };
    setHistory([...history, newVisit]);
    setIsDirty(true);
  };

  const removeVisit = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    const reindexed = newHistory.map((step, i) => ({
      ...step,
      visitNumber: i + 1,
    }));
    setHistory(reindexed);
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      setError(null);
      await onUpdate(appointment.id, history);
      setIsDirty(false);
    } catch (err) {
      const errorMessage = err?.message || "Failed to save roadmap";
      setError(errorMessage);
      setShowErrorAlert(true);
    }
  };

  const totalCost = history.reduce(
    (sum, step) => sum + (parseFloat(step.cost) || 0),
    0
  );
  const totalPaid = history.reduce(
    (sum, step) => sum + (parseFloat(step.paidAmount) || 0),
    0
  );
  const totalDue = totalCost - totalPaid;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 mb-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Treatment Roadmap
          </h3>
          <p className="text-sm text-gray-500">Manage visits and payments.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Global Treatment Status Selector */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <Activity className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-500 uppercase">
              Status:
            </span>
            <select
              value={appointment.status}
              onChange={(e) =>
                onStatusUpdate && onStatusUpdate(appointment.id, e.target.value)
              }
              className="text-sm font-bold text-gray-900 bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {isDirty && (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all bg-black rounded-lg hover:bg-gray-800 animate-in fade-in"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          )}
        </div>
      </div>

      <div className="relative ml-3 space-y-8 border-l-2 border-gray-100 md:ml-6">
        {history.map((step, index) => {
          const stepCost = parseFloat(step.cost) || 0;
          const stepPaid = parseFloat(step.paidAmount) || 0;
          const stepDue = stepCost - stepPaid;
          const dateValue = step.date
            ? new Date(step.date).toISOString().split("T")[0]
            : "";

          return (
            <div key={index} className="relative pl-6 md:pl-8">
              <button
                onClick={() => toggleStatus(index)}
                className={`absolute -left-[9px] top-1 md:top-6 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all z-10 bg-white ${
                  step.status === "Completed"
                    ? "border-green-500 text-green-500"
                    : step.status === "Cancelled"
                    ? "border-red-500 text-red-500"
                    : "border-gray-300 text-gray-300 hover:border-blue-400"
                }`}
              >
                {step.status === "Completed" ? (
                  <CheckCircle2 className="w-3 h-3 fill-current md:w-4 md:h-4" />
                ) : step.status === "Cancelled" ? (
                  <XCircle className="w-3 h-3 fill-current md:w-4 md:h-4" />
                ) : (
                  <Circle className="w-3 h-3 fill-current md:w-4 md:h-4" />
                )}
              </button>

              <div
                className={`p-4 md:p-5 border rounded-xl transition-all ${
                  step.status === "Completed"
                    ? "bg-white border-gray-200 shadow-sm"
                    : "bg-gray-50 border-gray-200 border-dashed"
                }`}
              >
                <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-md">
                      Visit {step.visitNumber || index + 1}
                    </span>
                    <input
                      type="date"
                      value={dateValue}
                      onChange={(e) =>
                        handleStepChange(index, "date", e.target.value)
                      }
                      className="text-sm font-medium text-gray-600 bg-transparent border-b border-transparent focus:border-gray-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 md:justify-end">
                    <select
                      value={step.status}
                      onChange={(e) =>
                        handleStepChange(index, "status", e.target.value)
                      }
                      className={`text-xs font-bold uppercase p-1 rounded ${
                        step.status === "Completed"
                          ? "text-green-700 bg-green-50"
                          : step.status === "Ongoing"
                          ? "text-blue-700 bg-blue-50"
                          : step.status === "Cancelled"
                          ? "text-red-700 bg-red-50" // Red for Cancelled
                          : "text-yellow-700 bg-yellow-50" // Yellowish for Scheduled
                      }`}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => removeVisit(index)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) =>
                        handleStepChange(index, "title", e.target.value)
                      }
                      placeholder="Diagnosis / Treatment"
                      className="w-full px-3 py-2 text-sm font-medium border rounded-lg focus:ring-1 focus:ring-black text-black!"
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) =>
                        handleStepChange(index, "description", e.target.value)
                      }
                      placeholder="Notes..."
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-black text-black!"
                    />
                  </div>
                </div>

                {/* Financials Row */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Cost: ₹</span>
                    <input
                      type="number"
                      value={step.cost}
                      onChange={(e) => handleCostChange(index, e.target.value)}
                      className="w-20 font-semibold border-gray-300 text-black! border-b focus:border-black focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">Paid: ₹</span>
                    <input
                      type="number"
                      value={step.paidAmount}
                      onChange={(e) => handlePaidChange(index, e.target.value)}
                      className="w-20 font-semibold text-green-700 border-b border-green-200 focus:border-green-600 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <select
                      value={step.paymentMethod || "Cash"}
                      onChange={(e) =>
                        handleStepChange(index, "paymentMethod", e.target.value)
                      }
                      className="text-xs text-gray-500 bg-transparent border-none cursor-pointer focus:ring-0"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Card">Card</option>
                    </select>
                    <span
                      className={`font-bold ${
                        stepDue > 0 ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {stepDue > 0 ? `Due: ₹${stepDue}` : "Paid"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="pl-6 md:pl-8">
          <button
            onClick={addNewVisit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-100 rounded-lg bg-blue-50 hover:bg-blue-100"
          >
            <Plus className="w-4 h-4" />
            Add Follow-up
          </button>
        </div>
        <ErrorAlert
          isOpen={showErrorAlert}
          onClose={() => {
            setShowErrorAlert(false);
            setError(null);
          }}
          title="Roadmap Update Failed"
          message={error}
        />
      </div>

      <div className="flex justify-end gap-6 p-4 mt-4 border-t rounded-lg bg-gray-50">
        <div className="text-right">
          <p className="text-xs text-gray-500">TOTAL</p>
          <p className="font-bold text-black!">
            ₹{totalCost.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-green-600">PAID</p>
          <p className="font-bold text-green-600">
            ₹{totalPaid.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-red-500">DUE</p>
          <p className="font-bold text-red-600">
            ₹{totalDue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}
