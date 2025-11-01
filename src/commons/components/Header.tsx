import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import ProfilePicture from "./ProfilePicture";
import { useAuth } from "../../auth/useAuth";
import {
  EventAvailable as EventIcon,
  AddCircleOutline as AddEventIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Login as LoginIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as FinishEventIcon,
  Settings,
} from "@mui/icons-material";
import "../../styles/header.css";

const Header: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { logout, status, user } = useAuth();
  const isAuthenticated = status === "auth";
  const isOrganizer = user?.role === "ORGANIZER";

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const LogoutButton = () => (
    <button onClick={logout} className="logout-button">
      <LogoutIcon className="nav-icon" />
      {!isCollapsed && <span>Cerrar Sesión</span>}
    </button>
  );

  return (
    <header className={`app-header ${isCollapsed ? "collapsed" : ""}`}>
      <div className="header-container">
        <div className="logo-section">
          {!isCollapsed && (
            <NavLink to="/" className="logo-container">
              <img src={logo} alt="Sportbook Logo" className="logo" />
            </NavLink>
          )}

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
        </div>

        <nav className="nav">
          <ul className="nav-links">
            {isAuthenticated ? (
              <>
                <li>
                  <NavLink
                    to="/events"
                    data-tooltip="Eventos"
                    className={({ isActive }) => (isActive ? "active" : "")}
                    end
                  >
                    <EventIcon className="nav-icon" />
                    {!isCollapsed && <span>Eventos</span>}
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/events/finished"
                    data-tooltip="Finalizados"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <FinishEventIcon className="nav-icon" />
                    {!isCollapsed && <span>Finalizados</span>}
                  </NavLink>
                </li>

                {isOrganizer && (
                  <li>
                    <NavLink
                      to="/events/create"
                      data-tooltip="Crear Evento"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <AddEventIcon className="nav-icon" />
                      {!isCollapsed && <span>Crear Evento</span>}
                    </NavLink>
                  </li>
                )}

                <li>
                  <NavLink
                    to="/profile"
                    data-tooltip="Preferencias Deportivas"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <Settings className="nav-icon" />
                    {!isCollapsed && <span>Preferencias Deportivas</span>}
                  </NavLink>
                </li>
              </>
            ) : (
              <li>
                <NavLink
                  to="/auth"
                  data-tooltip="Ingresar"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <LoginIcon className="nav-icon" />
                  {!isCollapsed && <span>Ingresar</span>}
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {isAuthenticated && (
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
