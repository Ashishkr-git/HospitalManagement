import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/lightswind/table";
import {
  ChevronDown,
  Clock,
  Shield,
  Loader2,
  Phone,
  Plus,
  Search,
  Briefcase,
} from "lucide-react";

import AddMemberModal from "./AddMemberModal";
import ErrorAlert from "../../components/common/ErrorAlert";

const StatusBadge = ({ status }) => {
  const isOnline = status === "Active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
        isOnline
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-gray-50 text-gray-500 border-gray-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
        }`}
      />
      {status}
    </span>
  );
};

const AVAILABLE_ROLES = ["Admin", "Doctor", "Patient"];

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: "" });
  const [mobileExpandedId, setMobileExpandedId] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else throw new Error("Failed to load users");
    } catch (error) {
      setErrorAlert({ isOpen: true, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    setCurrentUserRole(storedUser.role);
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    if (currentUserRole !== "admin") {
      setErrorAlert({ isOpen: true, message: "Unauthorized: Admins only." });
      return;
    }
    const previousUsers = [...users];
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/users/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Update failed");
    } catch (error) {
      setUsers(previousUsers);
      setErrorAlert({ isOpen: true, message: "Role update failed" });
    }
  };

  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(q) ||
      user.department?.toLowerCase().includes(q) ||
      user.phone?.includes(q)
    );
  });

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );

  return (
    <div className="w-full space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col justify-between gap-3 p-3 bg-white border border-gray-200 shadow-sm sm:flex-row sm:items-center rounded-xl">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            className="w-full py-2 pr-4 text-sm border border-gray-200 rounded-lg pl-9 bg-gray-50 focus:ring-1 focus:ring-black focus:border-black"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {currentUserRole === "admin" && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-black rounded-lg shadow-sm hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Member</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      {/* --- DESKTOP TABLE --- */}
      <div className="hidden overflow-hidden bg-white border border-gray-200 shadow-sm md:block rounded-xl">
        <Table className="w-full bg-white">
          <TableHeader>
            {/* HEADER: Kept Black Background / White Text */}
            <TableRow className="bg-black hover:bg-black! border-none">
              <TableHead className="h-10 pl-6 text-xs font-medium text-white! w-[30%]">
                User Details
              </TableHead>
              <TableHead className="h-10 text-xs font-medium text-white!">
                Department
              </TableHead>
              <TableHead className="h-10 text-xs font-medium text-white!">
                Role
              </TableHead>
              <TableHead className="h-10 text-xs font-medium text-white!">
                Status
              </TableHead>
              <TableHead className="h-10 text-xs font-medium text-white! text-right pr-6">
                Last Active
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-gray-500"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  // FORCE STYLES: White BG, Black Text, No Hover effect
                  className="bg-white! hover:bg-white! text-black! border-b border-gray-100 last:border-0"
                  style={{ backgroundColor: "white", color: "black" }}
                >
                  <TableCell className="py-3 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center text-xs font-bold text-black bg-gray-100 border border-gray-200 rounded-full w-9 h-9">
                        {user.initials || user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-black!">
                          {user.name}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {user.phone || "--"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-black! font-medium px-2 py-1 rounded bg-gray-50 w-fit border border-gray-100">
                      <Briefcase className="w-3 h-3 text-gray-400" />
                      {user.department || "General"}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="relative w-32">
                      {currentUserRole === "admin" ? (
                        <div className="relative group/select">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            // Forced text black for dropdown
                            className="w-full pl-2 pr-8 py-1 text-xs font-medium text-black! bg-white border border-gray-200 rounded-md cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-black appearance-none"
                            style={{ color: "black" }}
                          >
                            {AVAILABLE_ROLES.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-black! px-2 py-1 bg-gray-50 rounded">
                          {user.role}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>

                  <TableCell className="pr-6 font-mono! text-xs text-right text-gray-500!">
                    {user.lastActive || "Never"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- MOBILE CARDS --- */}
      <div className="space-y-3 md:hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-white border border-dashed rounded-xl">
            No users found.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl"
            >
              <div
                onClick={() =>
                  setMobileExpandedId(
                    mobileExpandedId === user.id ? null : user.id,
                  )
                }
                className="flex items-center justify-between p-4 transition-colors cursor-pointer active:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 text-sm font-medium text-black bg-gray-100 border border-gray-200 rounded-full">
                    {user.initials || user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-black! leading-tight">
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                      <Briefcase className="w-3 h-3" /> {user.department}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={user.status} />
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      mobileExpandedId === user.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {mobileExpandedId === user.id && (
                <div className="px-4 pt-0 pb-4 space-y-3 bg-white animate-in slide-in-from-top-2">
                  <div className="w-full h-px mb-3 bg-gray-100" />
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 rounded-lg bg-gray-50">
                      <span className="block mb-1 text-gray-400">Phone</span>
                      <div className="flex items-center gap-1 font-medium text-black">
                        <Phone className="w-3 h-3" /> {user.phone || "--"}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50">
                      <span className="block mb-1 text-gray-400">
                        Last Active
                      </span>
                      <div className="flex items-center gap-1 font-medium text-black">
                        <Clock className="w-3 h-3" />{" "}
                        {user.lastActive || "Never"}
                      </div>
                    </div>
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="flex items-center gap-1 text-xs font-medium text-gray-500">
                        <Shield className="w-3 h-3" /> Role
                      </label>
                    </div>
                    {currentUserRole === "admin" ? (
                      <div className="relative">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          className="w-full py-2 pl-3 pr-8 text-sm bg-white text-black! border border-gray-200 rounded-lg appearance-none focus:ring-1 focus:ring-black focus:border-black"
                        >
                          {AVAILABLE_ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute w-4 h-4 text-gray-400 pointer-events-none right-3 top-3" />
                      </div>
                    ) : (
                      <div className="w-full px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-transparent rounded-lg">
                        {user.role}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchUsers}
      />
      <ErrorAlert
        isOpen={errorAlert.isOpen}
        message={errorAlert.message}
        onClose={() => setErrorAlert({ ...errorAlert, isOpen: false })}
      />
    </div>
  );
}
