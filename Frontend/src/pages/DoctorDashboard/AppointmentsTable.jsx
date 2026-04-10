import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/lightswind/table";
import { Calendar, User, Phone } from "lucide-react";
import { StatusBadge, PaymentMethodBadge } from "./DashboardBadges";
import RoadmapEditor from "./RoadmapEditor";

export const AppointmentsTable = ({
  filteredData,
  expandedId,
  toggleRow,
  handleUpdateRoadmap,
  handleUpdateStatus, // New Prop
}) => {
  return (
    <div className="hidden overflow-hidden border border-gray-200 rounded-lg shadow-sm md:block">
      <Table className="bg-white!">
        <TableHeader>
          <TableRow className="bg-black! hover:bg-black! border-none">
            <TableHead className="text-white! pl-6">Invoice</TableHead>
            <TableHead className="text-white!">Patient</TableHead>
            <TableHead className="text-white!">Doctor</TableHead>
            <TableHead className="text-white!">Last Visit</TableHead>
            <TableHead className="text-white!">Method</TableHead>
            <TableHead className="text-white! text-right">Paid</TableHead>
            <TableHead className="text-white! text-right">Due</TableHead>
            <TableHead className="text-white! text-center">Status</TableHead>
            <TableHead className="text-white! text-right pr-6">Total</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="h-24 text-center text-gray-500!"
              >
                No appointments found.
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((appt) => (
              <React.Fragment key={appt.id}>
                <TableRow
                  onClick={() => toggleRow(appt.id)}
                  className={`cursor-pointer border-b border-gray-100 ${
                    expandedId === appt.id
                      ? "bg-gray-50!"
                      : "bg-white! hover:bg-gray-50!"
                  }`}
                >
                  <TableCell className="font-medium pl-6 text-black!">
                    <span className="font-mono text-xs">{appt.invoice}</span>
                  </TableCell>
                  <TableCell className="font-medium text-black!">
                    {appt.patient}
                    <span className="block text-xs text-gray-400 font-normal mt-0.5">
                      <Phone className="inline w-3 h-3 mr-1" />
                      {appt.phone}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-black!">
                    {appt.doctor}
                  </TableCell>
                  <TableCell className="text-sm text-black!">
                    {appt.lastVisit !== "-"
                      ? new Date(appt.lastVisit).toLocaleDateString("en-IN")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <PaymentMethodBadge method={appt.method} />
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600!">
                    {appt.paid}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      appt.isDue ? "text-red-500!" : "text-gray-400!"
                    }`}
                  >
                    {appt.due}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={appt.status} />
                  </TableCell>
                  <TableCell className="text-right pr-6 font-bold text-black!">
                    {appt.amount}
                  </TableCell>
                </TableRow>

                {expandedId === appt.id && (
                  <TableRow className="border-b border-gray-200">
                    <TableCell colSpan={9} className="p-0">
                      <div className="px-6 py-6 bg-white">
                        {/* Passed new handler here */}
                        <RoadmapEditor
                          appointment={appt}
                          onUpdate={handleUpdateRoadmap}
                          onStatusUpdate={handleUpdateStatus}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
