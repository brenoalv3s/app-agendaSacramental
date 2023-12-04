import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Menu from "./Menu";
import iconAgua from "../image/icon-agua.png";
import iconPao from "../image/icon-pao.png";
import "./Sacramento.css";

const Sacramento = () => {
  const [nomeUnidade, setNomeUnidade] = useState("");
  const [numeroUnidade, setNumeroUnidade] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedNomeUnidade = localStorage.getItem("nomeUnidade");
    const storedNumeroUnidade = localStorage.getItem("numeroUnidade");

    if (storedNomeUnidade && storedNumeroUnidade) {
      setNomeUnidade(storedNomeUnidade);
      setNumeroUnidade(storedNumeroUnidade);
    }
  }, []);

  const handleBlessingCardClick = () => {
    navigate("/bencao-pao");
  };

  return (
    <nav>
      <div className="sacramento-container">
        <img className="sacramento-image" src={iconAgua} alt="Bênção da Água" />
        <span className="sacramento-info-name">Ala {nomeUnidade}</span>
        <span className="sacramento-info-number">{numeroUnidade}</span>
        <h3 className="sacramento-subtítulo">Bênção da Água</h3>
        <br />
        <i className="sacramento-paragrafo">
          Ó Deus, Pai Eterno, nós te rogamos em nome de teu Filho, Jesus Cristo,
          que abençoes e santifiques esta água, para as almas de todos os que
          beberem dela, para que o façam em lembrança do sangue de teu Filho,
          que por eles foi derramado, e testifiquem a ti, ó Deus, Pai Eterno,
          que sempre se lembram dele, para que possam ter consigo o seu
          Espírito. Amém.
        </i>
      </div>
      <div className="sacramento-cards-container">
          <div className="sacramento-card" onClick={handleBlessingCardClick}>
            <img src={iconPao} alt="Bênção do Pão" />
            <span className="sacramento-card-title">Bênção do Pão</span>
          </div>
        </div>
      <Menu />
    </nav>
  );
};

export default Sacramento;
