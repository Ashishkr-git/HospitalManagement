// src/components/Layout.jsx
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <main>
        {/* This is the magic hole where Appointment/Login/Home will appear */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
