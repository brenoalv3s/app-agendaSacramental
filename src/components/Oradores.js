import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import Menu from "./Menu";
import OradorIcon from "../image/icon-discurso.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Oradores = () => {
  const [nomeUnidade, setNomeUnidade] = useState("");
  const [numeroUnidade, setNumeroUnidade] = useState("");
  const [ordem, setOrdem] = useState(1);
  const [orador, setOrador] = useState("");
  const [tema, setTema] = useState("");
  const [dataDiscurso, setDataDiscurso] = useState(new Date());
  const [exibirHistorico, setExibirHistorico] = useState(false);
  const [historicoOradores, setHistoricoOradores] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [indiceEditando, setIndiceEditando] = useState(null);
  const [editandoOrador, setEditandoOrador] = useState("");
  const [editandoTema, setEditandoTema] = useState("");
  const [editandoData, setEditandoData] = useState(null);
  const [limiteAtingido, setLimiteAtingido] = useState(false);
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    const storedNomeUnidade = localStorage.getItem("nomeUnidade");
    const storedNumeroUnidade = localStorage.getItem("numeroUnidade");

    if (storedNomeUnidade && storedNumeroUnidade) {
      setNomeUnidade(storedNomeUnidade);
      setNumeroUnidade(storedNumeroUnidade);
      fetchHistoricoOradoresFromFirestore();
    }
  }, []);

  const fetchHistoricoOradoresFromFirestore = async () => {
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
            const historicoObjeto = historicoData.dataDiscurso;

            const historicoArray = Object.entries(historicoObjeto).map(
              ([data, valores]) => {
                // Verifica se 'data' é uma string no formato de data
                if (
                  typeof data === "string" &&
                  !isNaN(new Date(data).getTime())
                ) {
                  const dataFormatada = new Date(data).toLocaleDateString(
                    "pt-BR",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  );

                  const oradores = Object.entries(valores).map(
                    ([ordem, oradorInfo]) => {
                      return {
                        ordem: parseInt(ordem, 10), // Converte a ordem para número
                        orador: oradorInfo.orador,
                        tema: oradorInfo.tema,
                      };
                    }
                  );

                  return {
                    dataDiscurso: new Date(dataFormatada),
                    oradores: oradores,
                  };
                } else {
                  // Se 'data' não for uma string no formato de data, mantém como está
                  return {
                    dataDiscurso: data,
                    oradores: [],
                  };
                }
              }
            );

            setHistoricoOradores(historicoArray);
          }
        }
      }
    } catch (error) {
      console.error(
        "Erro ao buscar histórico de oradores do Firestore:",
        error
      );
    }
  };

  const handleHistoricoOradoresClick = () => {
    setExibirHistorico(true);
    fetchHistoricoOradoresFromFirestore();
  };

  const handleVoltarClick = () => {
    setExibirHistorico(false);
    setModoEdicao(false);
    fetchHistoricoOradoresFromFirestore();
  };

  const handleEditHistoricoOradores = (index) => {
    setModoEdicao(true);
    setIndiceEditando(index);

    const itemEditando = historicoOradores[index];
    setEditandoOrador(itemEditando.orador);
    setEditandoTema(itemEditando.tema);
    setEditandoData(itemEditando.dataDiscurso);
  };

  const handleExcluirHistoricoOradores = async (index) => {
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
          const historicoAtual = historicoData.dataDiscurso || {};
  
          if (typeof historicoAtual !== "object" || historicoAtual === null) {
            console.error("Histórico de oradores não é um objeto:", historicoAtual);
            return;
          }
  
          // Cria uma cópia do objeto
          const novoHistorico = { ...historicoAtual };
  
          // Obtém a data e a ordem do orador a ser excluído
          const { dataDiscurso, oradores } = historicoOradores[index];
          const ordemExcluir = oradores[index].ordem; // Supondo que a ordem é a mesma para todos os oradores da mesma data
  
          // Formata a data no formato desejado "dd/MM/yyyy"
          const dataFormatada = dataDiscurso.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
  
          // Verifica se a data existe no histórico
          if (!novoHistorico.hasOwnProperty(dataFormatada)) {
            console.error(`Data ${dataFormatada} não encontrada no histórico.`);
            return;
          }
  
          // Verifica se a ordem existe na data específica
          if (!novoHistorico[dataFormatada].hasOwnProperty(ordemExcluir)) {
            console.error(`Ordem ${ordemExcluir} não encontrada na data ${dataFormatada}.`);
            return;
          }
  
          // Remove o orador com a ordem correspondente na data específica
          delete novoHistorico[dataFormatada][ordemExcluir];
  
          // Se não houver mais oradores na data, remova a data
          if (Object.keys(novoHistorico[dataFormatada]).length === 0) {
            delete novoHistorico[dataFormatada];
          }
  
          // Atualiza o documento no Firestore
          await updateDoc(historicoDoc, {
            dataDiscurso: novoHistorico,
          });
  
          fetchHistoricoOradoresFromFirestore();
        }
      }
    } catch (error) {
      console.error("Erro ao excluir item do histórico de oradores:", error);
    }
  };
  

  const handleSalvarEdicao = async () => {
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
          const historicoArray = historicoData.dataDiscurso || [];

          if (!Array.isArray(historicoArray)) {
            console.error(
              "Histórico de oradores não é um array:",
              historicoArray
            );
            return;
          }

          if (indiceEditando !== null) {
            const novaDataValida =
              editandoData instanceof Date ? editandoData : new Date();

            const dataFormatada = novaDataValida.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            historicoArray[indiceEditando] = {
              ordem: indiceEditando + 1,
              orador: editandoOrador,
              tema: editandoTema,
              data: dataFormatada,
            };

            await updateDoc(historicoDoc, {
              dataDiscurso: historicoArray,
            });

            setModoEdicao(false);
            setIndiceEditando(null);
            setEditandoOrador("");
            setEditandoTema("");
            setEditandoData("");

            fetchHistoricoOradoresFromFirestore();
          }
        }
      }
    } catch (error) {
      console.error("Erro ao salvar a edição no histórico de oradores:", error);
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

        if (historicoSnap.exists()) {
          const historicoData = historicoSnap.data();
          const historicoObjeto = historicoData.dataDiscurso || {};

          // Certifique-se de que historicoObjeto é um objeto
          if (typeof historicoObjeto !== "object" || historicoObjeto === null) {
            console.error(
              "Histórico de oradores não é um objeto:",
              historicoObjeto
            );
            return;
          }

          // Formata a data no formato desejado "dd/MM/yyyy"
          const dataFormatada = dataDiscurso.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          // Obtém a data selecionada no campo 'Selecionar Data'
          const chaveData = dataDiscurso instanceof Date ? dataFormatada : "";

          // Verifica se já existe um objeto para a data selecionada
          const dadosDataSelecionada = historicoObjeto[chaveData] || {};

          // Verifica se já existem 3 oradores registrados
          if (Object.keys(dadosDataSelecionada).length >= 3) {
            console.log("Limite de 3 oradores atingido!");
            setLimiteAtingido(true);

            // Limpa o estado de limite atingido após 3 segundos
            setTimeout(() => {
              setLimiteAtingido(false);
            }, 3000);

            return;
          }

          // Adiciona os novos dados ao objeto específico da data selecionada
          const novaEntradaHistorico = {
            ...dadosDataSelecionada,
            [ordem]: {
              orador,
              tema,
            },
          };

          // Atualiza o documento no Firestore
          await updateDoc(historicoDoc, {
            dataDiscurso: {
              ...historicoObjeto,
              [chaveData]: novaEntradaHistorico,
            },
          });

          fetchHistoricoOradoresFromFirestore();
        }
      }
    } catch (error) {
      console.error("Erro ao salvar registro no histórico de oradores:", error);
    }
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
            {/* Conteúdo do modo de exibição do histórico de oradores */}
            <button className="profile-edit-close" onClick={handleVoltarClick}>
              X
            </button>
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
            <table className="historico-table">
              <thead>
                <tr>
                  <th>Orador</th>
                  <th>Tema</th>
                  <th>Data</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(historicoOradores) &&
                  historicoOradores.length > 0 &&
                  historicoOradores
                    .filter((item) => {
                      if (!searchDate) {
                        return true;
                      } else {
                        const itemDate =
                          item.dataDiscurso instanceof Date
                            ? item.dataDiscurso
                            : null;
                        return (
                          itemDate &&
                          itemDate.toLocaleDateString() ===
                            searchDate.toLocaleDateString()
                        );
                      }
                    })
                    .map((item, index) => (
                      <React.Fragment key={index}>
                        {Array.isArray(item.oradores) &&
                        item.oradores.length > 0 ? (
                          item.oradores.map((oradorItem, oradorIndex) => (
                            <tr key={`${index}-${oradorIndex}`}>
                              <td>{`${oradorItem.ordem}º Orador: ${oradorItem.orador}`}</td>
                              <td>{oradorItem.tema}</td>
                              <td>
                                {item.dataDiscurso instanceof Date
                                  ? item.dataDiscurso.toLocaleDateString(
                                      "pt-BR"
                                    )
                                  : ""}
                              </td>
                              <td>
                                <img
                                  className="image-button-editar"
                                  src="./editar.png"
                                  alt="Editar"
                                  onClick={() =>
                                    handleEditHistoricoOradores(index)
                                  }
                                />
                                <img
                                  className="image-button-excluir"
                                  src="./excluir.png"
                                  alt="Excluir"
                                  onClick={() =>
                                    handleExcluirHistoricoOradores(index)
                                  }
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr key={index}>
                            <td></td>
                            <td></td>
                            <td>
                              {item.dataDiscurso instanceof Date
                                ? item.dataDiscurso.toLocaleDateString("pt-BR")
                                : ""}
                            </td>
                            <td>
                              <img
                                className="image-button-editar"
                                src="./editar.png"
                                alt="Editar"
                                onClick={() =>
                                  handleEditHistoricoOradores(index)
                                }
                              />
                              <img
                                className="image-button-excluir"
                                src="./excluir.png"
                                alt="Excluir"
                                onClick={() =>
                                  handleExcluirHistoricoOradores(index)
                                }
                              />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                {Array.isArray(historicoOradores) &&
                  historicoOradores.length === 0 && (
                    <tr>
                      <td colSpan="5" className="error-message">
                        Nenhum registro no histórico de oradores.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </>
        ) : (
          <>
            {/* Conteúdo do modo de registro de oradores */}
            <h3 className="titulo-frequencia">Registrar Oradores</h3>
            <br />
            <div>
              <label className="frequencia-label" htmlFor="ordem">
                Ordem:
              </label>
              <input
                type="text"
                id="ordem"
                className="frequencia-input"
                value={ordem}
                onChange={(e) => setOrdem(e.target.value)}
              />
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
              <label className="frequencia-label">Selecionar Data:</label>
            </div>
            <DatePicker
              selected={dataDiscurso}
              className="frequencia-input"
              onChange={(date) => setDataDiscurso(date)}
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
              <button
                className="frequencia-btn"
                onClick={
                  modoEdicao ? handleSalvarEdicao : handleRegistrarOrador
                }
              >
                {modoEdicao ? "Salvar Edição" : "Registrar"}
              </button>
            </div>
            {limiteAtingido && (
              <p className="error-message">Limite de 3 oradores atingido!</p>
            )}
          </>
        )}
      </div>
      <Menu />
    </div>
  );
};

export default Oradores;
