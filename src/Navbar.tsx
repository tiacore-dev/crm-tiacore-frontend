import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css"; // Стили для навигации

const logOut = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
};

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
          >
            Главная
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/services"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
          >
            Услуги
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
          >
            Пользователи
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/legal_entities"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
          >
            Юр. лица
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/contracts"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
          >
            Контракты
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/bank_accounts"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
          >
            Банк
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/bills"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
          >
            Счета
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/acts"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
          >
            Акты
          </NavLink>
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
