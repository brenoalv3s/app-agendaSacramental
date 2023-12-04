import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Menu from "./Menu";
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

  const handleBlessingWaterCardClick = () => {
    navigate("/bencao-agua");
  };

  return (
    <nav>
      <div className="sacramento-container">
      <img
              className="sacramento-image"
              src={iconPao}
              alt="Bênção do Pão"
            />
            <span className="sacramento-info-name">Ala {nomeUnidade}</span>
            <span className="sacramento-info-number">{numeroUnidade}</span>
            <h3 className="sacramento-subtítulo">Bênção do Pão</h3>
            <br />
            <i className="sacramento-paragrafo">
              Ó Deus, Pai Eterno, nós te rogamos em nome de teu Filho, Jesus
              Cristo, que abençoes e santifiques este pão para as almas de todos
              os que partilharem dele, para que o comam em lembrança do corpo de
              teu Filho e testifiquem a ti, ó Deus, Pai Eterno, que desejam
              tomar sobre si o nome de teu Filho e recordá-lo sempre e guardar
              os mandamentos que ele lhes deu, para que possam ter sempre
              consigo o seu Espírito. Amém.
            </i>
        </div>
        <div className="sacramento-cards-container">
          <div className="sacramento-card" onClick={handleBlessingWaterCardClick}>
            <img src={iconAgua} alt="Bênção da Água" />
            <span className="sacramento-card-title">Bênção da Água</span>
          </div>
        </div>
      <Menu />
    </nav>
  );
};

export default Sacramento;