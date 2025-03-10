import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Стили для навигации (опционально)

const logOut = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
};

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/home" className="navbar-link">
            Главная
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/services" className="navbar-link">
            Услуги
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/users" className="navbar-link">
            Пользователи
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/legal_entities" className="navbar-link">
            Юр. лица
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/contracts" className="navbar-link">
            Контракты
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/bank_accounts" className="navbar-link">
            Банк
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/bills" className="navbar-link">
            Счета
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/acts" className="navbar-link">
            Акты
          </Link>
        </li>
        <li className="navbar-item">
          <button onClick={logOut} className="logout-button">
            Выйти
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
