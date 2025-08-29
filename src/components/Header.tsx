import React from "react";
import "../styles/header.css";
import logo from "../assets/logo.png";

const Header: React.FC = () => {
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
              <a href="/login">Ingresar</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
