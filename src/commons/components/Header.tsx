import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo3 from "../../assets/logo3.png";
import ProfilePicture from "./ProfilePicture";
import { useAuth } from "../../auth/useAuth";
import "../../styles/header.css";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const { logout, status } = useAuth();
  const isAuthenticated = status === "auth";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const LogoutButton = () => (
    <button onClick={logout} className="logout-button">
      Cerrar Sesión
    </button>
  );

  return (
    <>
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

          <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
            <ul className="nav-links">
              {isAuthenticated ? (
                <>
                  <li>
                    <NavLink
                      to="/events"
                      className={({ isActive }) => (isActive ? "active" : "")}
                      end
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Eventos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/events/create"
                      className={({ isActive }) => (isActive ? "active" : "")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Crear Evento
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) => (isActive ? "active" : "")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Preferencias Deportivas
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
                    className={({ isActive }) => (isActive ? "active" : "")}
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
      {isAuthenticated && (
        <div className="header-profile">
          <ProfilePicture size={50} />
        </div>
      )}
    </>
  );
};

export default Header;
