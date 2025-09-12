import React, { useEffect, useState } from "react";
import "../styles/header.css";
import logo from "../assets/logo.png";
import { clearAuthData } from "../api/axios";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    setIsMenuOpen(false);
    navigate("/auth");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="app-header" style={{ zIndex: 2000 }}>
      <div className="header-container">
        <div className="logo-container">
          <a href="/" className="logo-link" onClick={closeMenu}>
            <img src={logo} alt="Sportbook Logo" className="logo" />
          </a>
        </div>
        <button
          className="hamburger-menu"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
          <ul className="nav-links">
            <li>
              <a href="/events" onClick={closeMenu}>
                Eventos
              </a>
            </li>
            <li>
              <a href="/events/create" onClick={closeMenu}>
                Crear Evento
              </a>
            </li>
            <li>
              {isAuthenticated ? (
                <button onClick={handleLogout} className="logout-button">
                  Cerrar sesión
                </button>
              ) : (
                <a href="/auth" onClick={closeMenu}>
                  Ingresar
                </a>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
