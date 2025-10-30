import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import ProfilePicture from "./ProfilePicture";
import { useAuth } from "../../auth/useAuth";
import {
  EventAvailable as EventIcon,
  AddCircleOutline as AddEventIcon,
  Sports as SportsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Login as LoginIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as FinishEventIcon,
} from "@mui/icons-material";
import "../../styles/header.css";

const Header: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { logout, status, user } = useAuth();
  const isAuthenticated = status === "auth";
  const isOrganizer = user?.role === "ORGANIZER";

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => {
    if (!isMobile) {
      setIsCollapsed((prev) => !prev);
    }
  };

  const toggleMobileMenu = () => {
    if (isMobile) {
      setIsMenuOpen((prev) => !prev);
    }
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const LogoutButton = () => (
    <button onClick={logout} className="logout-button">
      <LogoutIcon className="nav-icon" />
      {!isCollapsed && !isMobile && <span>Cerrar Sesión</span>}
      {isMobile && <span>Cerrar Sesión</span>}
    </button>
  );

  return (
    <header
      className={`app-header ${isCollapsed && !isMobile ? "collapsed" : ""} ${
        isMobile ? "mobile" : ""
      }`}
    >
      <div className="header-container">
        <div className="logo-section">
          {!isCollapsed && (
            <NavLink
              to="/"
              className="logo-container"
              onClick={closeMobileMenu}
            >
              <img src={logo} alt="Sportbook Logo" className="logo" />
            </NavLink>
          )}

          {isMobile ? (
            <button
              className="collapse-toggle"
              onClick={toggleMobileMenu}
              aria-label="Abrir/cerrar menú"
            >
              <MenuIcon fontSize="medium" />
            </button>
          ) : (
            <button
              className="collapse-toggle"
              onClick={toggleCollapse}
              aria-label="Colapsar menú lateral"
            >
              {isCollapsed ? (
                <ChevronRightIcon fontSize="medium" />
              ) : (
                <MenuIcon fontSize="medium" />
              )}
            </button>
          )}
        </div>

        <nav
          className={`nav ${
            isMobile ? (isMenuOpen ? "nav-open" : "nav-closed") : ""
          }`}
        >
          <ul className="nav-links">
            {isAuthenticated ? (
              <>
                <li>
                  <NavLink
                    to="/events"
                    className={({ isActive }) => (isActive ? "active" : "")}
                    end
                    onClick={closeMobileMenu}
                  >
                    <EventIcon className="nav-icon" />
                    {!isCollapsed && <span>Eventos</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/events/finished"
                    className={({ isActive }) => (isActive ? "active" : "")}
                    onClick={closeMobileMenu}
                  >
                    <FinishEventIcon className="nav-icon" />
                    {!isCollapsed && <span>Finalizados</span>}
                  </NavLink>
                </li>
                {isOrganizer && (
                  <li>
                    <NavLink
                      to="/events/create"
                      className={({ isActive }) => (isActive ? "active" : "")}
                      onClick={closeMobileMenu}
                    >
                      <AddEventIcon className="nav-icon" />
                      {!isCollapsed && <span>Crear Evento</span>}
                    </NavLink>
                  </li>
                )}
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => (isActive ? "active" : "")}
                    onClick={closeMobileMenu}
                  >
                    <SportsIcon className="nav-icon" />
                    {!isCollapsed && <span>Preferencias Deportivas</span>}
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
                  onClick={closeMobileMenu}
                >
                  <LoginIcon className="nav-icon" />
                  {!isCollapsed && <span>Ingresar</span>}
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {!isMobile && isAuthenticated && (
          <div className="logout-container">
            <LogoutButton />
          </div>
        )}

        {isAuthenticated && (
          <div className="header-profile">
            <ProfilePicture size={50} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
