import React, { useEffect, useState } from "react";
import "../styles/header.css";
import logo from "../assets/logo.png";
import { clearAuthData } from "../api/axios";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    // Check initial auth state
    checkAuth();

    // Listen for storage changes
    window.addEventListener("storage", checkAuth);

    // Listen for custom auth events
    const handleAuthEvent = () => checkAuth();
    window.addEventListener("authStateChanged", handleAuthEvent);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authStateChanged", handleAuthEvent);
    };
  }, []);

  const handleLogout = () => {
    clearAuthData();
    setIsAuthenticated(false);
    navigate("/auth");
  };

  return (
    <header className="app-header" style={{ zIndex: 2000 }}>
      <div className="header-container">
        <a href="/" className="logo-link">
          <img src={logo} alt="Sportbook Logo" className="logo" />
        </a>
        <nav className="nav">
          <ul className="nav-links">
            <li>
              <a href="/events">Eventos</a>
            </li>
            <li>
              <a href="/events/create">Crear Evento</a>
            </li>
            <li>
              {isAuthenticated ? (
                <button onClick={handleLogout} className="logout-button">
                  Cerrar sesión
                </button>
              ) : (
                <a href="/auth">Ingresar</a>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
