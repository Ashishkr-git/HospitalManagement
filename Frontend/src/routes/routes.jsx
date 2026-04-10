import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// FIX: Changed "./" to "../" to step out of the routes folder
import Layout from "../components/Layout";
import Home from "../pages/Homepage/Homepage";
import Login from "../pages/credentials/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import DoctorDashboard from "../pages/DoctorDashboard/DoctorDashboard";
import AppointmentDetails from "../pages/Homepage/AppointmentDetails"; // <--- 1. Import the new page

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      {
        path: "/login",
        element: <Login />,
      },

      // --- NEW: PUBLIC TRACKING ROUTE ---
      {
        path: "/appointment/:id", // <--- 2. Add Dynamic Route
        element: <AppointmentDetails />,
      },

      // --- PROTECTED ADMIN ROUTE ---
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      // --- PROTECTED DOCTOR ROUTE ---
      {
        path: "/doctordashboard",
        element: (
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
