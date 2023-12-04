import React, { useState, useEffect } from "react";
import Menu from './Menu'
import sacramentoIcon from "../image/icon-sacramento.png";
import iconPao from "../image/icon-pao.png";
import iconAgua from "../image/icon-agua.png";
import "./Sacramento.css";

const Sacramento = () => {

  const [nomeUnidade, setNomeUnidade] = useState("");
  const [numeroUnidade, setNumeroUnidade] = useState("");

  useEffect(() => {
    const storedNomeUnidade = localStorage.getItem("nomeUnidade");
    const storedNumeroUnidade = localStorage.getItem("numeroUnidade");
  
    if (storedNomeUnidade && storedNumeroUnidade) {
      setNomeUnidade(storedNomeUnidade);
      setNumeroUnidade(storedNumeroUnidade);
    }
  },[]);

  return (
    <nav>
      <div className="sacramento-container">
        <img
          src={sacramentoIcon}
          alt="sacramento"
          className="sacramento-image"
        />
        <span className="sacramento-info-name">Ala {nomeUnidade}</span>
        <span className="sacramento-info-number">{numeroUnidade}</span>

        <h3 className="sacramento-subtítulo">Orações Sacramentais</h3>
        <br />
        <i className="sacramento-paragrafo">As orações sacramentais foram reveladas pelo Senhor. 
          Essas orações contêm convênios e uma promessa. 
          (D&C 20:77, 79.)
        </i>
        <div className="sacramento-cards-container">
          <div className="sacramento-card">
            <img src={iconPao} alt="Bênção do Pão" />
            <span className="sacramento-card-title">Bênção do Pão</span>
          </div>
          <div className="sacramento-card">
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
