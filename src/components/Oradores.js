import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, setDoc, doc, arrayUnion } from "firebase/firestore";
import Menu from "./Menu";
import topicosIcon from "../image/icon-topicos.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Topicos = () => {
  const [nomeUnidade, setNomeUnidade] = useState("");
  const [numeroUnidade, setNumeroUnidade] = useState("");
  const [data, setData] = useState("");
  const [ordem, setOrdem] = useState(1);
  const [orador, setOrador] = useState("");
  const [tema, setTema] = useState("");
  const [limiteAtingido, setLimiteAtingido] = useState(false);
  const [dataDiscurso, setDataDiscurso] = useState(new Date());
  const [showOradoresForm, setShowOradoresForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedNomeUnidade = localStorage.getItem("nomeUnidade");
    const storedNumeroUnidade = localStorage.getItem("numeroUnidade");

    if (storedNomeUnidade && storedNumeroUnidade) {
      setNomeUnidade(storedNomeUnidade);
      setNumeroUnidade(storedNumeroUnidade);
    }
  }, []);

  const handleAdicionarOradoresClick = () => {
    setShowOradoresForm(true);
  };

  const handleBlessingCardClick = async () => {
    const uid = getAuth().currentUser.uid;

    if (ordem <= 3) {
      if (dataDiscurso.getDay() !== 0) {
        console.log("Selecione uma data de domingo.");
        return;
      }

      if (!orador.trim() || !tema.trim()) {
        console.log("Preencha todos os campos.");
        return;
      }

      const db = getFirestore();
      const oradoresRef = doc(db, "discursantes", uid);
      await setDoc(
        oradoresRef,
        {
          oradores: arrayUnion({ ordem, orador, tema, dataDiscurso }),
        },
        { merge: true }
      );

      setOrdem(ordem + 1);
      setOrador("");
      setTema("");
      setDataDiscurso(new Date());

      if (ordem === 3) {
        setLimiteAtingido(true);
      }
    } else {
      console.log("Limite de 3 oradores atingido!");
    }
  };

  const handleCancelarClick = () => {
    setShowOradoresForm(false);
    navigate(-1);
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
          {showOradoresForm ? (
            <>
              <h3 className="sacramento-subtítulo">Discursantes</h3>
              <br />
              <div className="orador-tema-container">
                <label className="frequencia-label" htmlFor="orador">
                  Orador:
                </label>
                <input
                  type="text"
                  id="orador"
                  className="frequencia-input"
                  value={orador}
                  onChange={(e) => setOrador(e.target.value)}
                />
                <label className="frequencia-label" htmlFor="tema">
                  Tema:
                </label>
                <input
                  type="text"
                  id="tema"
                  className="frequencia-input"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                />
              </div>
              <div className="buttons-container">
                <button
                  className="profile-edit-cancel-btn"
                  onClick={handleCancelarClick}
                >
                  Cancelar
                </button>
                <button
                  className="profile-edit-save-btn"
                  onClick={handleBlessingCardClick}
                >
                  Próximo
                </button>
              </div>
              {limiteAtingido && (
                <p className="error-message">
                  Limite de 3 oradores atingido!
                </p>
              )}
            </>
          ) : (
            <>
              <h3 className="titulo-frequencia">Adicionar Oradores</h3>
              <br />
              <label className="frequencia-label" htmlFor="dataDiscurso">
                Data dos Discursos:
              </label>
              <DatePicker
                selected={data}
                className="frequencia-input"
                onChange={(date) => setData(date)}
                filterDate={(date) => date.getDay() === 0}
                dateFormat="dd/MM/yyyy"
              />
              <br />
              <button
                className="profile-edit-save-btn"
                onClick={handleAdicionarOradoresClick}
              >
                Adicionar
              </button>
            </>
          )}
        </>
      </div>
      <Menu />
    </nav>
  );
};

export default Topicos;
