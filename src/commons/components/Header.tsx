import React, { useState, useEffect } from "react";
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
  Person as PersonIcon,
} from "@mui/icons-material";
import "../../styles/header.css";

const Header: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 900);
  const { logout, status, user } = useAuth();
  const isAuthenticated = status === "auth";
  const isOrganizer = user?.role === "ORGANIZER";

  const COLLAPSE_BREAKPOINT = 900;

  useEffect(() => {
    const handleResize = () => {
      const shouldCollapse = window.innerWidth <= COLLAPSE_BREAKPOINT;
      setIsCollapsed(shouldCollapse);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const LogoutButton = () => (
    <button onClick={logout} className="logout-button nav-item">
      <LogoutIcon className="nav-icon" />
      {!isCollapsed && <span>Cerrar Sesión</span>}
    </button>
  );

  return (
    <header className={`app-header ${isCollapsed ? "collapsed" : ""}`}>
      <div className="header-container">
        <div className="logo-section">
          {!isCollapsed && (
            <NavLink to="/events" className="logo-container">
              <img src={logo} alt="Sportbook Logo" className="logo" />
            </NavLink>
          )}

          <button
            className="collapse-toggle"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
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
                  <NavLink to="/events" data-tooltip="Eventos" end>
                    <EventIcon className="nav-icon" />
                    {!isCollapsed && <span>Eventos</span>}
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/events/finished" data-tooltip="Finalizados">
                    <FinishEventIcon className="nav-icon" />
                    {!isCollapsed && <span>Finalizados</span>}
                  </NavLink>
                </li>

                {isOrganizer && (
                  <li>
                    <NavLink to="/events/create" data-tooltip="Crear Evento">
                      <AddEventIcon className="nav-icon" />
                      {!isCollapsed && <span>Crear Evento</span>}
                    </NavLink>
                  </li>
                )}

                <li>
                  <NavLink to="/profile" data-tooltip="Configurar perfiles">
                    <PersonIcon className="nav-icon" />
                    {!isCollapsed && <span>Configurar perfiles</span>}
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/my-data" data-tooltip="Mis datos">
                    <Settings className="nav-icon" />
                    {!isCollapsed && <span>Mis datos</span>}
                  </NavLink>
                </li>
              </>
            ) : (
              <li>
                <NavLink to="/auth" data-tooltip="Ingresar">
                  <LoginIcon className="nav-icon" />
                  {!isCollapsed && <span>Ingresar</span>}
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {isAuthenticated && (
          <div className="user-and-logout-section">
            <div className="logout-container">
              <LogoutButton />
            </div>
            <div className="header-profile">
              <ProfilePicture size={36} />
              {!isCollapsed && (
                <span className="profile-name">{user?.username}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
