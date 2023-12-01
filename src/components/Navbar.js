// Navbar.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Navbar.css'

const Navbar = ({ nomeUnidade }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleProfileClick = () => {
    navigate("/perfil");
    
  };

  const handleAboutClick = () => {
    navigate("/sobre");
    
  };

  const handleLogout = () => {
    localStorage.removeItem("numeroUnidade");
    navigate("/");
  };

  return (
    <div>
      <div className={`profile-menu ${menuOpen ? "open" : ""}`} onClick={handleMenuClick}>
        <div className="profile-info">
          <img className="profile-icon" src="/icon-profile.png" alt="Perfil" />
        </div>
        <div className="profile-dropdown">
          <span className="tituloSubmenu">
            Ala {nomeUnidade || "Não encontrado"}
          </span>
          <div className="submenu-perfil" onClick={handleProfileClick}>
            <img
              className="profile-icon-submenu"
              src="/icon-profile.png"
              alt="Perfil"
            />
            <span>Perfil</span>
          </div>
          <div className="submenu-sobre" onClick={handleAboutClick}>
            <img
              className="about-icon-submenu"
              src="/about-icon.png"
              alt="Sobre"
            />
            <span className="span-sobre">Sobre</span>
          </div>
          <div className="submenu-exit" onClick={handleLogout}>
            <img
              className="exit-icon-submenu"
              src="/exit-icon.png"
              alt="Exit"
            />
            <span>Sair</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
