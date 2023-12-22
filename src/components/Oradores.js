import React, { useState, useEffect, useCallback } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import OradorIcon from "../image/icon-discurso.png";
import PesquisarTema from "../image/lupa.png";
import FecharIcon from "../image/fechar.png";
import DatePicker from "react-datepicker";
import { startOfWeek } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "./Oradores.css";

const Oradores = () => {
  const navigate = useNavigate();
  const [nomeUnidade, setNomeUnidade] = useState("");
  const [numeroUnidade, setNumeroUnidade] = useState("");
  const [ordem, setOrdem] = useState(1);
  const [orador, setOrador] = useState("");
  const [tema, setTema] = useState("");
  const [dataDiscurso, setDataDiscurso] = useState(() => {
    const today = new Date();
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + ((7 - today.getDay() + 0) % 7));
    return nextSunday;
  });
  const [exibirHistorico, setExibirHistorico] = useState(false);
  const [historicoOradores, setHistoricoOradores] = useState([]);
  const [searchDate, setSearchDate] = useState(null);
  const [editandoOrdem, setEditandoOrdem] = useState(false);
  const [erroRegistro, setErroRegistro] = useState(null);

  const fetchHistoricoOradoresFromFirestore = useCallback(async () => {
    try {
      const firestore = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const historicoDocPath = `discursantes/${user.uid}`;
        const historicoDoc = doc(firestore, historicoDocPath);

        const historicoSnap = await getDoc(historicoDoc);

        if (historicoSnap.exists()) {
          const historicoData = historicoSnap.data();

          if (historicoData && historicoData.dataDiscurso) {
            let historicoArray = [];

            if (Array.isArray(historicoData.dataDiscurso)) {
              historicoArray = historicoData.dataDiscurso;
            } else if (typeof historicoData.dataDiscurso === "object") {
              historicoArray = Object.keys(historicoData.dataDiscurso).map(
                (data) => {
                  const oradoresObjeto = historicoData.dataDiscurso[data];

                  const oradoresArray = Object.keys(oradoresObjeto).map(
                    (ordem) => {
                      const oradorInfo = oradoresObjeto[ordem];
                      return {
                        ordem: parseInt(ordem, 10),
                        orador: oradorInfo.orador,
                        tema: oradorInfo.tema,
                        dataDiscurso: oradorInfo.dataDiscurso,
                      };
                    }
                  );

                  return {
                    dataDiscurso: isValidDate(data) ? new Date(data) : null,
                    oradores: oradoresArray,
                  };
                }
              );
            }

            if (searchDate) {
              const formattedSearchDate = formatarData(searchDate);
              historicoArray = historicoArray.filter((item) =>
                item.oradores.some(
                  (oradorItem) =>
                    oradorItem.dataDiscurso &&
                    oradorItem.dataDiscurso === formattedSearchDate
                )
              );
            }
            setHistoricoOradores(historicoArray);
            return;
          }
        }
      }

      // Se não houver dados ou se ocorrer algum erro, define o histórico como vazio
      setHistoricoOradores([]);
    } catch (error) {
      console.error(
        "Erro ao buscar histórico de oradores do Firestore:",
        error
      );
      // Em caso de erro, também define o histórico como vazio
      setHistoricoOradores([]);
    }
  }, [searchDate]);

  useEffect(() => {
    const storedNomeUnidade = localStorage.getItem("nomeUnidade");
    const storedNumeroUnidade = localStorage.getItem("numeroUnidade");

    if (storedNomeUnidade && storedNumeroUnidade) {
      setNomeUnidade(storedNomeUnidade);
      setNumeroUnidade(storedNumeroUnidade);
      fetchHistoricoOradoresFromFirestore();
    }

    const storedTemaSelecionado = localStorage.getItem("conjuntoSelecionado");
    if (storedTemaSelecionado) {
      setTema(storedTemaSelecionado);
    }
  }, [fetchHistoricoOradoresFromFirestore]);

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return dateString.match(regex) !== null;
  };

  const handleHistoricoOradoresClick = () => {
    setExibirHistorico(true);
  };

  const handleVoltarClick = () => {
    setExibirHistorico(false);

    fetchHistoricoOradoresFromFirestore();
  };

  const formatarData = (data) => {
    if (data instanceof Date && !isNaN(data.getDate())) {
      const dia = String(data.getDate()).padStart(2, "0");
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;
    } else {
      console.error("Data inválida:", data);
      return null;
    }
  };

  const handleRegistrarOrador = async () => {
    try {
      const firestore = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (user) {
        const historicoDocPath = `discursantes/${user.uid}`;
        const historicoDoc = doc(firestore, historicoDocPath);
        const historicoSnap = await getDoc(historicoDoc);
  
        if (!historicoSnap.exists()) {
          await setDoc(historicoDoc, { dataDiscurso: {} });
        }
  
        const historicoData = historicoSnap.data();
        const historicoObjeto = historicoData.dataDiscurso || {};
  
        const dataFormatada = formatarData(dataDiscurso);
  
        if (
          editandoOrdem || // Permitir mais de 3 oradores se estiver editando a ordem
          !historicoObjeto[dataFormatada] || // Adicionado para corrigir o problema ao registrar o primeiro orador
          Object.keys(historicoObjeto[dataFormatada]).length < 3
        ) {
          if (
            historicoObjeto[dataFormatada] &&
            historicoObjeto[dataFormatada][ordem] &&
            historicoObjeto[dataFormatada][ordem].orador
          ) {
            setErroRegistro(
              "Já existe discursante registrado para a ordem e data desejada"
            );
  
            setTimeout(() => {
              setErroRegistro(null);
              handleLimparCampos();
              setOrdem(null);
              setDataDiscurso("");
            }, 3000);
  
            return;
          }
  
          if (historicoObjeto[dataFormatada]) {
            const ordensRegistradas = Object.keys(
              historicoObjeto[dataFormatada]
            ).map((ordem) => parseInt(ordem, 10));
  
            const proximaOrdem = encontrarProximaOrdem(ordensRegistradas);
            const ordemAtualizada =
              proximaOrdem > ordem ? proximaOrdem : ordem;
  
            setOrdem(ordemAtualizada);
            const ordemStrAtualizada = ordemAtualizada.toString();
  
            historicoObjeto[dataFormatada][ordemStrAtualizada] = {
              orador,
              tema,
              dataDiscurso: dataFormatada,
            };
          } else {
            historicoObjeto[dataFormatada] = {
              1: {
                orador,
                tema,
                dataDiscurso: dataFormatada,
              },
            };
          }
  
          setErroRegistro(null);
          await updateDoc(historicoDoc, {
            dataDiscurso: historicoObjeto,
          });
  
          handleLimparCampos();
          setDataDiscurso(new Date(dataDiscurso));
          fetchHistoricoOradoresFromFirestore();
          localStorage.removeItem("conjuntoSelecionado");
        } else {
          setErroRegistro("Alerta: 3 oradores registrados");
  
          setTimeout(() => {
            setErroRegistro(null);
            handleLimparCampos();
            setDataDiscurso("");
            setOrdem("");
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Erro ao salvar registro no histórico de oradores:", error);
    }
  };
  

  const handleLimparCampos = (e) => {
    setOrador("");
    setTema("");
    setDataDiscurso(new Date());
    setEditandoOrdem(false);
    setOrdem(ordem + 1)
  };

  const handleRegistrarClick = () => {
    handleRegistrarOrador();
    setEditandoOrdem(false);
  };

  const handleOrdemChange = (e) => {
    setOrdem(e.target.value);
    setEditandoOrdem(true);
  };


  const handlePesquisarTema = () => {
    navigate("/topicos-evangelho");
  };

  const encontrarProximaOrdem = (ordensRegistradas) => {
    let proximaOrdem = 1;
    const ordensOrdenadas = ordensRegistradas.sort((a, b) => a - b);

    for (let i = 0; i < ordensOrdenadas.length; i++) {
      if (ordensOrdenadas[i] !== proximaOrdem) {
        break;
      }
      proximaOrdem++;
    }

    return proximaOrdem;
  };

  return (
    <div>
      <div
        className={`sacramento-container ${
          exibirHistorico ? "historico-visible" : ""
        }`}
      >
        <img src={OradorIcon} alt="orador" className="sacramento-image" />
        <span className="sacramento-info-name">Ala {nomeUnidade}</span>
        <span className="sacramento-info-number">{numeroUnidade}</span>

        {exibirHistorico ? (
          <>
            <img
              className="profile-edit-close"
              src={FecharIcon}
              alt="Fechar"
              onClick={handleVoltarClick}
            />
            <h3 className="titulo-frequencia">Histórico de Oradores</h3>
            <br />
            <label className="frequencia-label">Pesquisar por data</label>
            <DatePicker
              className="frequencia-input"
              selected={searchDate}
              onChange={(date) => setSearchDate(date)}
              dateFormat="dd/MM/yyyy"
              filterDate={(date) => date.getDay() === 0}
            />
            {Array.isArray(historicoOradores) &&
            historicoOradores.length > 0 ? (
              <table className="historico-table">
                <thead>
                  <tr>
                    <th>Orador</th>
                    <th>Tema</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {historicoOradores.map((item, index) => (
                    <React.Fragment key={index}>
                      {Array.isArray(item.oradores) &&
                      item.oradores.length > 0 ? (
                        item.oradores.map((oradorItem, oradorIndex) => (
                          <tr key={`${index}-${oradorIndex}`}>
                            <td>{`${oradorItem.ordem}º Orador: ${oradorItem.orador}`}</td>
                            <td>{oradorItem.tema}</td>
                            <td>{oradorItem.dataDiscurso}</td>
                          </tr>
                        ))
                      ) : (
                        <tr key={index}>
                          <td colSpan="3">Nenhum discursante registrado</td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="historico-table">
                <tbody>
                  <tr>
                    <td colSpan="3">
                      {searchDate
                        ? "Nenhum discursante registrado para a data pesquisada"
                        : "Nenhum discursante registrado"}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </>
        ) : (
          <>
            <h3 className="titulo-frequencia">Registrar Oradores</h3>
            <br />
            <div>
              <label className="frequencia-label" htmlFor="ordem">
                Ordem:
              </label>
              <div className="ordem-container">
                <input
                  type="number"
                  id="ordem"
                  className={`frequencia-input ${
                    editandoOrdem ? "editavel" : ""
                  }`}
                  value={ordem}
                  onChange={handleOrdemChange}
                />
              </div>
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
              <div>
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
                <img
                  className="image-button-pesquisar-ordem"
                  src={PesquisarTema}
                  alt="Pesquisa"
                  onClick={handlePesquisarTema}
                />
              </div>
              <br />
              <label className="frequencia-label">Selecionar Data:</label>
            </div>
            <DatePicker
              selected={dataDiscurso}
              className="frequencia-input"
              onChange={(date) => setDataDiscurso(startOfWeek(date))}
              filterDate={(date) => date.getDay() === 0}
              dateFormat="dd/MM/yyyy"
            />
            <div className="buttons-container">
              <button
                className="frequencia-btn-historico"
                onClick={handleHistoricoOradoresClick}
              >
                Histórico
              </button>
              <button className="frequencia-btn" onClick={handleRegistrarClick}>
                Registrar
              </button>
            </div>
            {erroRegistro && <p className="error-message">{erroRegistro}</p>}
          </>
        )}
      </div>
      <Menu />
    </div>
  );
};

export default Oradores;
