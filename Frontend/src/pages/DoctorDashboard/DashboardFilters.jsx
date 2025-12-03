import React from "react";
import { Search, Filter, Activity } from "lucide-react";

export const DashboardFilters = ({
  filters,
  uniqueStatuses,
  financials,
}) => {
  const {
    filter,
    setFilter,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    customRange,
    setCustomRange,
  } = filters;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          {/* Date Tabs */}
          <div className="px-4 pb-2 -mx-4 overflow-x-auto sm:pb-0 sm:mx-0 sm:px-0 no-scrollbar">
            <div className="flex items-center p-1 bg-gray-100 rounded-lg w-max sm:w-fit">
              {["All", "Today", "Week", "Month", "Custom"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                    filter === f
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px] max-w-md px-4 sm:px-0">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none sm:pl-3">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient or diagnosis..."
              className="w-full py-1.5 pl-9 pr-4 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 px-4 sm:px-0">
            {/* REMOVED: Doctor Dropdown */}

            {/* Status Dropdown */}
            <div className="relative h-9 flex-1 sm:flex-none min-w-[130px]">
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <Activity className="w-3 h-3 text-gray-500" />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-full py-1 pl-8 pr-8 text-sm bg-white border border-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {filter === "Custom" && (
              <div className="flex flex-wrap items-center w-full gap-2 mt-2 animate-in fade-in slide-in-from-left-2 sm:w-auto sm:mt-0">
                <input
                  type="date"
                  value={customRange.start}
                  onChange={(e) =>
                    setCustomRange({ ...customRange, start: e.target.value })
                  }
                  className="flex-1 sm:flex-none px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black bg-white text-black"
                />
                <span className="hidden text-gray-400 sm:inline">-</span>
                <input
                  type="date"
                  value={customRange.end}
                  onChange={(e) =>
                    setCustomRange({ ...customRange, end: e.target.value })
                  }
                  className="flex-1 sm:flex-none px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-black bg-white text-black"
                />
              </div>
            )}
          </div>
        </div>

        {/* Revenue Summary Card */}
        <div className="px-4 sm:px-0">
          <div className="flex items-center gap-4 px-4 py-2 border border-gray-100 rounded-lg bg-gray-50">
            <div>
              <p className="text-[10px] font-medium text-gray-500 uppercase">
                Total Value
              </p>
              <p className="text-sm font-bold text-gray-900">
                ₹{financials.total.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div>
              <p className="text-[10px] font-medium text-green-600 uppercase">
                Paid
              </p>
              <p className="text-sm font-bold text-green-700">
                ₹{financials.paid.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div>
              <p className="text-[10px] font-medium text-red-500 uppercase">
                Due
              </p>
              <p className="text-sm font-bold text-red-600">
                ₹{financials.due.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
