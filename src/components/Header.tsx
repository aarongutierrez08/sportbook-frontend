import React, { useEffect, useState } from "react";
import "../styles/header.css";
import logo from "../assets/logo.png";
import { clearAuthData } from "../api/axios";

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
    <header className="app-header" style={{ zIndex: 2000 }}>
      <div className="header-container">
        <div className="logo-container">
          <a href="/" className="logo-link">
            <img src={logo} alt="Sportbook Logo" className="logo" />
          </a>
        </div>
        <nav className={`nav open`}>
          <ul className="nav-links">
            <li>
              <a href="/events">
                Eventos
              </a>
            </li>
            <li>
              <a href="/events/create">
                Crear Evento
              </a>
            </li>
            {
              isAuthenticated ? (
                <>
                  <li>
                    <a href="/profile" >
                      Configurar perfil
                    </a>
                  </li>
                  <li>
                    <a href="/auth" onClick={handleLogout}>
                      Cerrar sesión
                    </a>
                  </li>
                </>
                
              ) : (
                <a href="/auth">
                  Ingresar
                </a>
              )
            }
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
