import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/header.css";
import logo3 from "../../assets/logo3.png";
import { clearAuthData } from "../../api/axios";

const Header: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

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
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <NavLink to="/">
          <img src={logo3} alt="Sportbook Logo" className="logo" />
        </NavLink>

        <nav className="nav">
          <ul className="nav-links">
            <li>
              <NavLink
                to="/events"
                className={({ isActive }) => isActive ? 'active' : ''}
                end
              >
                Eventos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/events/create"
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Crear Evento
              </NavLink>
            </li>
            {isAuthenticated ? (
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  Mi Perfil
                </NavLink>
              </li>
            ) : (
              <li>
                <NavLink
                  to="/auth"
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  Ingresar
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {isAuthenticated && (
          <div className="logout-container">
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
