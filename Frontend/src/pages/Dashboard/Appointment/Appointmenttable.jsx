import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/lightswind/table";
import {
  IndianRupee,
  Filter,
  Wallet,
  ChevronDown,
  ChevronUp,
  Loader2,
  Search,
  Phone,
  User,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import StatusBadge from "./StatusBadge";
import PaymentMethodBadge from "./PaymentMethodBadge";
import TreatmentRoadmap from "./TreatmentRoadmap";

// --- 1. Custom Hook for Logic & Data ---
const useAppointmentLogic = (user) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [filters, setFilters] = useState({
    doctor: "All Doctors",
    method: "All Methods",
    search: "",
  });
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  useEffect(() => {
    if (!user) return;
    const fetchTreatments = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/treatments?role=${user?.role}&userId=${user?._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTreatments();
  }, [user]);

  const uniqueDoctors = useMemo(
    () => ["All Doctors", ...new Set(appointments.map((i) => i.doctor))],
    [appointments]
  );
  const uniqueMethods = useMemo(
    () => [
      "All Methods",
      ...new Set(
        appointments.map(
          (i) =>
            i.treatmentHistory?.[i.treatmentHistory.length - 1]
              ?.paymentMethod || "Pending"
        )
      ),
    ],
    [appointments]
  );

  const filteredData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments
      .filter((appt) => {
        const d = new Date(appt.lastVisit);
        d.setHours(0, 0, 0, 0);

        // Date Logic
        let dateMatch = true;
        if (filter === "Today") dateMatch = d.getTime() === today.getTime();
        else if (filter === "Week") {
          const s = new Date(today);
          s.setDate(today.getDate() - today.getDay());
          const e = new Date(today);
          e.setDate(today.getDate() + (6 - today.getDay()));
          dateMatch = d >= s && d <= e;
        } else if (filter === "Month")
          dateMatch =
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
        else if (filter === "Custom" && customRange.start && customRange.end) {
          const s = new Date(customRange.start);
          const e = new Date(customRange.end);
          e.setHours(23, 59, 59);
          dateMatch = d >= s && d <= e;
        }

        // Search & Dropdown Logic
        const q = filters.search.toLowerCase();
        const searchMatch =
          !q ||
          appt.patient?.toLowerCase().includes(q) ||
          appt.doctor?.toLowerCase().includes(q) ||
          appt.phone?.includes(q);
        const docMatch =
          filters.doctor === "All Doctors" || appt.doctor === filters.doctor;
        const lastMethod =
          appt.treatmentHistory?.slice(-1)[0]?.paymentMethod || "Pending";
        const methodMatch =
          filters.method === "All Methods" || lastMethod === filters.method;

        return dateMatch && docMatch && methodMatch && searchMatch;
      })
      .map((appt) => {
        const hist = appt.treatmentHistory || [];
        const cost = hist.reduce((s, v) => s + (parseFloat(v.cost) || 0), 0);
        const paid = hist.reduce(
          (s, v) => s + (parseFloat(v.paidAmount) || 0),
          0
        );
        return {
          ...appt,
          invoice: `INV-${appt.id.slice(-4).toUpperCase()}`,
          amount: `₹${cost.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          paid: `₹${paid.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          due: `₹${(cost - paid).toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          isDue: cost - paid > 0,
          paidRaw: paid,
        };
      });
  }, [appointments, filter, customRange, filters]);

  const revenue = filteredData.reduce(
    (acc, curr) => acc + (curr.paidRaw || 0),
    0
  );

  return {
    loading,
    filteredData,
    revenue,
    uniqueDoctors,
    uniqueMethods,
    filter,
    setFilter,
    filters,
    setFilters,
    customRange,
    setCustomRange,
  };
};

// --- 2. Main Component ---
export default function AppointmentTable() {
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState(null);
  const logic = useAppointmentLogic(user);

  if (logic.loading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <FilterSection logic={logic} revenue={logic.revenue} />

      {/* Desktop View */}
      <div className="hidden overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm md:block">
        <DesktopTable
          data={logic.filteredData}
          expandedId={expandedId}
          toggleRow={(id) => setExpandedId(expandedId === id ? null : id)}
        />
      </div>

      {/* Mobile View */}
      <div className="space-y-3 md:hidden">
        <MobileList
          data={logic.filteredData}
          expandedId={expandedId}
          toggleRow={(id) => setExpandedId(expandedId === id ? null : id)}
        />
      </div>
    </div>
  );
}

// --- 3. Sub-Components (Clean UI) ---

const FilterSection = ({ logic, revenue }) => (
  <div className="flex flex-col gap-4 p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
    <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-xs">
        <Search className="absolute w-4 h-4 text-gray-400 pointer-events-none left-3 top-3" />
        <input
          className="block w-full h-10 pl-10 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:ring-black"
          placeholder="Search..."
          value={logic.filters.search}
          onChange={(e) =>
            logic.setFilters({ ...logic.filters, search: e.target.value })
          }
        />
      </div>
      <div className="flex items-center gap-3 px-4 py-2 border border-green-100 rounded-lg bg-green-50">
        <div className="p-1.5 bg-white rounded-full">
          <IndianRupee className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <span className="block text-xs font-semibold text-green-700 uppercase">
            Revenue
          </span>
          <span className="block text-lg font-bold text-gray-900">
            ₹{revenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="flex p-1 overflow-x-auto bg-gray-100 rounded-lg w-max">
        {["All", "Today", "Week", "Month", "Custom"].map((f) => (
          <button
            key={f}
            onClick={() => logic.setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              logic.filter === f
                ? "bg-white text-black shadow-sm"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {logic.filter === "Custom" && (
        <div className="flex gap-2">
          <input
            type="date"
            className="p-1 text-xs border rounded"
            onChange={(e) =>
              logic.setCustomRange({
                ...logic.customRange,
                start: e.target.value,
              })
            }
          />
          <input
            type="date"
            className="p-1 text-xs border rounded"
            onChange={(e) =>
              logic.setCustomRange({
                ...logic.customRange,
                end: e.target.value,
              })
            }
          />
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 lg:ml-auto">
        <select
          className="px-2 text-xs bg-white border rounded-lg h-9"
          onChange={(e) =>
            logic.setFilters({ ...logic.filters, doctor: e.target.value })
          }
        >
          {logic.uniqueDoctors.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          className="px-2 text-xs bg-white border rounded-lg h-9"
          onChange={(e) =>
            logic.setFilters({ ...logic.filters, method: e.target.value })
          }
        >
          {logic.uniqueMethods.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

const DesktopTable = ({ data, expandedId, toggleRow }) => (
  <Table className="bg-white">
    <TableHeader>
      <TableRow className="bg-black hover:bg-black! border-none">
        {[
          "Invoice",
          "Patient",
          "Doctor",
          "Date",
          "Method",
          "Paid",
          "Due",
          "Status",
          "Total",
        ].map((h, i) => (
          <TableHead
            key={h}
            className={`h-10 text-xs font-medium text-white ${
              i === 5 || i === 6 || i === 8 ? "text-right" : ""
            } ${i === 8 ? "pr-4" : ""} ${i === 0 ? "pl-4" : ""} ${
              i === 7 ? "text-center" : ""
            }`}
          >
            {h}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.length === 0 ? (
        <TableRow>
          <TableCell colSpan={9} className="h-24 text-center text-gray-500">
            No results found.
          </TableCell>
        </TableRow>
      ) : (
        data.map((appt) => (
          <React.Fragment key={appt.id}>
            <TableRow
              onClick={() => toggleRow(appt.id)}
              className={`cursor-pointer border-b border-gray-100 bg-white! hover:bg-white! text-black! ${
                expandedId === appt.id ? "bg-gray-50!" : ""
              }`}
            >
              <TableCell className="py-3 pl-4 text-xs font-mono text-black!">
                {appt.invoice}
              </TableCell>
              <TableCell className="py-3">
                <div className="font-medium text-black!">{appt.patient}</div>
                <div className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Phone className="w-2.5 h-2.5" /> {appt.phone}
                </div>
              </TableCell>
              <TableCell className="py-3 text-xs text-black!">
                {appt.doctor}
              </TableCell>
              <TableCell className="py-3 text-xs text-black!">
                {new Date(appt.lastVisit).toLocaleDateString()}
              </TableCell>
              <TableCell className="py-3">
                <PaymentMethodBadge
                  method={appt.treatmentHistory?.slice(-1)[0]?.paymentMethod}
                />
              </TableCell>
              <TableCell className="py-3 text-xs font-medium text-right text-green-600!">
                {appt.paid}
              </TableCell>
              <TableCell
                className={`py-3 text-xs font-medium text-right ${
                  appt.isDue ? "text-red-600!" : "text-gray-400!"
                }`}
              >
                {appt.due}
              </TableCell>
              <TableCell className="py-3 text-center">
                <StatusBadge status={appt.status} />
              </TableCell>
              <TableCell className="py-3 pr-4 text-sm font-medium text-right text-black!">
                {appt.amount}
              </TableCell>
            </TableRow>
            {expandedId === appt.id && (
              <TableRow className="hover:bg-white!">
                <TableCell
                  colSpan={9}
                  className="p-0 border-b border-gray-200 bg-gray-50"
                >
                  <div className="p-4 border-l-4 border-black">
                    <TreatmentRoadmap history={appt.treatmentHistory} />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))
      )}
    </TableBody>
  </Table>
);

const MobileList = ({ data, expandedId, toggleRow }) => (
  <>
    {data.length === 0 ? (
      <div className="p-8 text-center text-gray-500 bg-white border border-dashed rounded-xl">
        No results found.
      </div>
    ) : (
      data.map((appt) => (
        <div
          key={appt.id}
          onClick={() => toggleRow(appt.id)}
          className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl"
        >
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-xs font-bold text-blue-600 rounded-full bg-blue-50">
                  {appt.patient.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-black">
                    {appt.patient}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-mono">{appt.invoice}</span>•
                    <span>{new Date(appt.lastVisit).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-sm font-bold text-black">
                  {appt.amount}
                </span>
                <StatusBadge status={appt.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-2 text-xs rounded-lg bg-gray-50">
              <div>
                <span className="text-gray-400">Paid</span>
                <div className="font-medium text-green-600">{appt.paid}</div>
              </div>
              <div className="text-right">
                <span className="text-gray-400">Due</span>
                <div
                  className={`font-medium ${
                    appt.isDue ? "text-red-600" : "text-gray-400"
                  }`}
                >
                  {appt.due}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-black">
                <User className="w-3 h-3" />
                {appt.doctor}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                {expandedId === appt.id ? "Close" : "Details"}{" "}
                {expandedId === appt.id ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </div>
            </div>
          </div>
          {expandedId === appt.id && (
            <div
              className="p-3 border-t border-gray-100 bg-gray-50"
              onClick={(e) => e.stopPropagation()}
            >
              <TreatmentRoadmap history={appt.treatmentHistory} />
            </div>
          )}
        </div>
      ))
    )}
  </>
);
