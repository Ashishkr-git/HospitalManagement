import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX: Check sessionStorage instead of localStorage
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);

    // FIX: Save to sessionStorage so it clears when tab closes
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    // FIX: Clear from sessionStorage
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    // Also clear localStorage just in case old data persists
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
