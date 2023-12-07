import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import topicosIcon from "../image/icon-topicos.png";
import iconTemas from "../image/icon-temas.png";
import iconDiscurso from "../image/icon-discurso.png";
import "./Sacramento.css";

const Topicos = () => {
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
    navigate("/topicos-evangelho");
  };

  const handleBlessingWaterCardClick = () => {
    navigate("/discursantes");
  };

  return (
    <nav>
      <div className="sacramento-container">
        <>
          <img
            src={topicosIcon}
            alt="sacramento"
            className="sacramento-image"
          />
          <span className="sacramento-info-name">Ala {nomeUnidade}</span>
          <span className="sacramento-info-number">{numeroUnidade}</span>
          <h3 className="sacramento-subtítulo">Tópicos e Discursantes</h3>
          <br />
          <i className="sacramento-paragrafo">
            Aprende de mim e ouve minhas palavras; anda na mansidão de meu
            Espírito e terás paz em mim. (Doutrina e Convênios 19:23).
          </i>
        </>

        <div className="sacramento-cards-container">
          <div className="sacramento-card" onClick={handleBlessingCardClick}>
            <img src={iconTemas} alt="Temas" />
            <span className="sacramento-card-title">Tópicos</span>
          </div>
          <div
            className="sacramento-card"
            onClick={handleBlessingWaterCardClick}
          >
            <img src={iconDiscurso} alt="discurso" />
            <span className="sacramento-card-title">Discursantes</span>
          </div>
        </div>
      </div>
      <Menu />
    </nav>
  );
};

export default Topicos;
