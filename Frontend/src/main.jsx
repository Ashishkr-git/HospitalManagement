import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@/components/lightswind.css";
import React from "react";

import { RouterProvider } from "react-router-dom";
import { router } from "../src/routes/routes";

import { AuthProvider } from "../src/context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* --- 2. WRAP YOUR APP --- */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
