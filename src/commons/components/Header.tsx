import React from "react";
import "../../styles/header.css";
import logo3 from "../../assets/logo3.png";
import { useAuth } from "../../auth/useAuth";

const Header: React.FC = () => {
  const { logout, status } = useAuth();

  return (
    <header className="app-header" style={{ zIndex: 2000 }}>
      <div className="header-container">
        <a href="/" style={{ display: "flex" }}>
          <img src={logo3} alt="Sportbook Logo" className="logo" />
        </a>
        <nav className={`nav`}>
          <ul className="nav-links">
            <li>
              <a href="/events">Eventos</a>
            </li>
            <li>
              <a href="/events/create">Crear Evento</a>
            </li>
            {status === "auth" ? (
              <>
                <li>
                  <a href="/profile">Configurar perfil</a>
                </li>
                <li>
                  <a href="/auth" onClick={logout}>
                    Cerrar sesión
                  </a>
                </li>
              </>
            ) : (
              <a href="/auth">Ingresar</a>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
