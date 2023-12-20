import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sobre.css";

const About = () => {
  const navigate = useNavigate();
  const handleClose = () => {
    navigate(-1);
  };
  const anoAtual = new Date().getFullYear();

  return (
    <div className="profile-edit-container">
      <img src="/about-icon.png" alt="About" className="about-image" />
      <span className="unit-info-name">Agenda Sacramental</span>
      <p className="unit-description">
        O Agenda Sacramental é uma aplicação móvel concebida para simplificar a
        elaboração da agenda da reunião sacramental, oferecendo uma ferramenta
        eficaz para os bispados das alas.
        <br />
        <br />
        Desenvolvido por um membro de A Igreja de Jesus Cristo dos Santos dos
        Últimos Dias,{" "}
        <strong>
          {" "}
          aplicativo não possui qualquer vínculo oficial com a Igreja
        </strong>
        , sendo uma iniciativa independente e inovadora.
        <br />
        <br />
        Esta aplicação destaca-se por proporcionar uma abordagem prática e
        organizada na preparação das atas da reunião mais importante ocorrida
        nas capelas. Ela visa otimizar o processo, permitindo que os líderes da
        ala gerenciem as designações, hinos, discursos e outros elementos
        essenciais de maneira eficiente.
        <br />
        <br />
        Ao utilizar o Agenda Sacramental, os líderes das alas têm a oportunidade
        de otimizar seus processos internos, garantindo que as reuniões
        sacramentais transcorram com suavidade e sejam momentos significativos
        para toda a congregação. Este aplicativo é uma prova do comprometimento
        dos membros da igreja em buscar soluções inovadoras para melhor servir à
        comunidade e fortalecer os princípios do evangelho.
      </p>
      <br />
      <br />
      <p style={{ textAlign: "center" }}>
        <strong>Agenda Sacramental - {anoAtual}</strong>
        <br />
        <br />
        Developed by Breno Alves
        <br />
        <i>
          agendasacramental@gmail.com
        </i>
      </p>
      <div className="buttons-container">
        <img
          className="profile-edit-close"
          src="./Fechar.png"
          alt="Fechar"
          onClick={handleClose}
        />
      </div>
    </div>
  );
};

export default About;
