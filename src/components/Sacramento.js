import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import sacramentoIcon from "../image/icon-sacramento.png";
import iconPao from "../image/icon-pao.png";
import iconAgua from "../image/icon-agua.png";
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

  const handleBlessingWaterCardClick = () => {
    navigate("/bencao-agua");
  };

  return (
    <nav>
      <div className="sacramento-container">
        <>
          <img
            src={sacramentoIcon}
            alt="sacramento"
            className="sacramento-image"
          />
          <span className="sacramento-info-name">Ala {nomeUnidade}</span>
          <span className="sacramento-info-number">{numeroUnidade}</span>
          <h3 className="sacramento-subtítulo">Orações Sacramentais</h3>
          <br />
          <i className="sacramento-paragrafo">
            Durante Seu ministério entre os nefitas e lamanitas, Jesus Cristo
            deu autoridade a Seus discípulos e ordenou-lhes que administrassem o
            sacramento aos membros de Sua Igreja. Ele afirmou: “E sempre
            procurareis fazer isto tal como eu fiz, da mesma forma que eu parti
            o pão, abençoei-o e dei-o a vós” (3 Néfi 18:5 e 6). Reunir-se com
            frequência e participar dignamente do sacramento é também um
            mandamento do Senhor em nossos dias (Doutrina e Convênios 20:75 e
            59:9).
          </i>
        </>

        <div className="sacramento-cards-container">
          <div className="sacramento-card" onClick={handleBlessingCardClick}>
            <img src={iconPao} alt="Bênção do Pão" />
            <span className="sacramento-card-title">Bênção do Pão</span>
          </div>
          <div
            className="sacramento-card"
            onClick={handleBlessingWaterCardClick}
          >
            <img src={iconAgua} alt="Bênção da Água" />
            <span className="sacramento-card-title">Bênção da Água</span>
          </div>
        </div>
      </div>
      <Menu />
    </nav>
  );
};

export default Sacramento;
