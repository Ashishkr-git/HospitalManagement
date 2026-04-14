import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Navbar from "../Header/navbar";

export default function AppointmentDetails() {
  // 1. Get the invoice ID from the URL (e.g., /appointment/INV-123)
  const { id } = useParams();

  const [appointmentData, setAppointmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch the data when the page loads
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        setError(null);

        const API_BASE_URL =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";

        const response = await fetch(`${API_BASE_URL}/treatments/track/${id}`);

        if (!response.ok) {
          throw new Error(
            "Could not find an appointment with that Invoice Number.",
          );
        }

        const result = await response.json();
        setAppointmentData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gray-50">
      <Navbar />

      <div className="max-w-3xl px-4 py-32 mx-auto sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center mb-8 text-sm font-medium text-gray-500 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <Loader2 className="w-10 h-10 mb-4 text-blue-600 animate-spin" />
            <p className="text-gray-500">Searching for Invoice {id}...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-red-100 shadow-sm rounded-2xl">
            <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Invoice Not Found
            </h2>
            <p className="mb-6 text-gray-500">{error}</p>
            <Link
              to="/"
              className="px-6 py-2 text-white bg-black rounded-lg hover:bg-gray-800"
            >
              Try Another Invoice
            </Link>
          </div>
        )}

        {/* SUCCESS STATE */}
        {!loading && appointmentData && (
          <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
            <div className="p-8 border-b border-gray-100 bg-blue-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold tracking-wider text-blue-600 uppercase">
                  Invoice Details
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" /> Found
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{id}</h1>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-semibold text-gray-900">
                    {appointmentData.patientName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-semibold text-gray-900">
                    {appointmentData.doctorName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">
                    {appointmentData.date
                      ? new Date(appointmentData.date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {appointmentData.status || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
