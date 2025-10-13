import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../../styles/header.css";
import logo3 from "../../assets/logo3.png";
import { clearAuthData } from "../../api/axios";

const Header: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const LogoutButton = () => (
    <button onClick={handleLogout} className="logout-button">
      Cerrar Sesión
    </button>
  );

  return (
    <header className="app-header">
      <div className="header-container">
        <NavLink to="/" className="logo-container">
          <img src={logo3} alt="Sportbook Logo" className="logo" />
        </NavLink>

        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="hamburger"></span>
        </button>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-links">
            {isAuthenticated ? (
              <>
                <li>
                  <NavLink
                    to="/events"
                    className={({ isActive }) => isActive ? 'active' : ''}
                    end
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Eventos
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/events/create"
                    className={({ isActive }) => isActive ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Crear Evento
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => isActive ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mi Perfil
                  </NavLink>
                </li>
                {isMobile && (
                  <li>
                    <LogoutButton />
                  </li>
                )}
              </>
            ) : (
              <li>
                <NavLink
                  to="/auth"
                  className={({ isActive }) => isActive ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ingresar
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {isAuthenticated && !isMobile && (
          <div className="logout-container">
            <LogoutButton />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
