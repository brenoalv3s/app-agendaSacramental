import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getFirestore,
  updateDoc,
  doc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Menu from "./Menu";
import "./Frequencia.css";
import frequenciaIcon from "../image/icon-frequencia.png";
import FecharIcon from "../image/fechar.png"

const Frequencia = () => {
  const [nomeUnidade, setNomeUnidade] = useState("");
  const [numeroUnidade, setNumeroUnidade] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [data, setData] = useState("");
  const [exibirHistorico, setExibirHistorico] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [editandoFrequencia, setEditandoFrequencia] = useState("");
  const [editandoData, setEditandoData] = useState(null);
  const [invalidDataMessage, setInvalidDataMessage] = useState("");
  const [frequenciaExistente, setfrequenciaExistente] = useState("");
  const [InvalidQuantidadeMessage, setInvalidQuantidadeMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [indiceEditando, setIndiceEditando] = useState(null);
  const [reloadTable, setReloadTable] = useState(false);

  useEffect(() => {
    const storedNomeUnidade = localStorage.getItem("nomeUnidade");
    const storedNumeroUnidade = localStorage.getItem("numeroUnidade");

    if (storedNomeUnidade && storedNumeroUnidade) {
      setNomeUnidade(storedNomeUnidade);
      setNumeroUnidade(storedNumeroUnidade);

      fetchDataFromFirestore();
      fetchHistoricoFromFirestore();
    }
  }, [reloadTable]);

  const fetchDataFromFirestore = async () => {
    try {
      const firestore = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const unidadeDocPath = `alas/${user.uid}`;
        const unidadeDoc = doc(firestore, unidadeDocPath);

        const unidadeSnap = await getDoc(unidadeDoc);

        if (unidadeSnap.exists()) {
          const data = unidadeSnap.data();
          setQuantidade(data.quantidade || "");

          const firestoreData = data.data ? data.data.toDate() : null;
          setData(firestoreData || "");
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados do Firestore:", error);
    }
  };

  const fetchHistoricoFromFirestore = async () => {
    try {
      const firestore = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const historicoDocPath = `alas/${user.uid}`;
        const historicoDoc = doc(firestore, historicoDocPath);

        const historicoSnap = await getDoc(historicoDoc);

        if (historicoSnap.exists()) {
          const historicoData = historicoSnap.data();
          const historicoArray = historicoData.frequencia || [];

          setHistorico(historicoArray);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar histórico do Firestore:", error);
    }
  };

  const handleSave = async () => {
    try {
      const firestore = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const historicoDocPath = `alas/${user.uid}`;
        const historicoDoc = doc(firestore, historicoDocPath);

        if (!(data instanceof Date) || isNaN(data.getTime())) {
          setInvalidDataMessage("Data inválida.");
          setTimeout(() => {
            setInvalidDataMessage("");
          }, 3000);
          return;
        }

        if (!quantidade || isNaN(quantidade)) {
          setInvalidQuantidadeMessage("Preencha a frequência.");
          setTimeout(() => {
            setInvalidQuantidadeMessage("");
          }, 3000);
          return;
        }

        const historicoSnap = await getDoc(historicoDoc);
        const historicoData = historicoSnap.exists()
          ? historicoSnap.data().frequencia || []
          : [];

        const novaDataValida = data instanceof Date ? data : new Date();

        const frequenciaExistente = historicoData.find(
          (item) =>
            item.data.toDate().toLocaleDateString() ===
            novaDataValida.toLocaleDateString()
        );

        if (frequenciaExistente) {
          setfrequenciaExistente(
            "Já existe uma frequência registrada para a data."
          );
          setTimeout(() => {
            setfrequenciaExistente("");
          }, 5000);
          return;
        }

        await updateDoc(historicoDoc, {
          frequencia: arrayUnion({
            quantidade: parseInt(quantidade),
            data: data,
          }),
        });

        if (quantidade && data) {
          setSuccessMessage("Frequência registrada com sucesso!");
          setTimeout(() => {
            setSuccessMessage("");
            setQuantidade("");
            setData(null);
          }, 3000);
          return;
        }

        fetchDataFromFirestore();
        fetchHistoricoFromFirestore();
      }
    } catch (error) {
      console.error("Erro ao salvar no banco de dados:", error);
    }
  };

  const handleEditHistorico = (index) => {
    setModoEdicao(true);
    setIndiceEditando(index);
    setReloadTable((prev) => !prev);

    const itemEditando = historico[index];
    setEditandoFrequencia(itemEditando.quantidade);
    setEditandoData(new Date(itemEditando.data.seconds * 1000));
  };

  const handleExcluirHistorico = async (index) => {
    try {
      const firestore = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const historicoDocPath = `alas/${user.uid}`;
        const historicoDoc = doc(firestore, historicoDocPath);

        const historicoSnap = await getDoc(historicoDoc);

        if (historicoSnap.exists()) {
          const historicoData = historicoSnap.data();
          const historicoAtual = historicoData.frequencia || [];

          historicoAtual.splice(index, 1);

          await updateDoc(historicoDoc, {
            frequencia: historicoAtual,
          });

          fetchHistoricoFromFirestore();
        }
      }
    } catch (error) {
      console.error("Erro ao excluir item do histórico:", error);
    }
  };

  const handleSalvarEdicao = async () => {
    try {
      const firestore = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const historicoDocPath = `alas/${user.uid}`;
        const historicoDoc = doc(firestore, historicoDocPath);

        const historicoSnap = await getDoc(historicoDoc);

        if (historicoSnap.exists()) {
          const historicoData = historicoSnap.data();
          const novoHistorico = [...historicoData.frequencia];

          if (indiceEditando !== null) {
            const novaDataValida =
              editandoData instanceof Date ? editandoData : new Date();

            novoHistorico[indiceEditando] = {
              quantidade: parseInt(editandoFrequencia),
              data: novaDataValida,
            };

            await updateDoc(historicoDoc, {
              frequencia: novoHistorico,
            });

            setModoEdicao(false);
            setIndiceEditando(null);
            setEditandoFrequencia("");
            setEditandoData("");

            setHistorico(novoHistorico);

            fetchDataFromFirestore();
            fetchHistoricoFromFirestore();
          }
        }
      }
    } catch (error) {
      console.error("Erro ao salvar a edição no histórico:", error);
    }
  };

  const handleCancelarEdicao = () => {
    setModoEdicao(false);
    setIndiceEditando(null);
    setEditandoFrequencia("");
    setEditandoData("");
    setExibirHistorico(true);
  };

  const handleShowHistoricoClick = () => {
    setExibirHistorico(true);
    setModoEdicao(false);
    setReloadTable((prev) => !prev);
  };

  const handleVoltarClick = () => {
    setExibirHistorico(false);
    setModoEdicao(false);
  };

  return (
    <div>
      <div
        className={`frequencia-container ${
          exibirHistorico ? "historico-visible" : ""
        }`}
      >
        <img
          src={frequenciaIcon}
          alt="frequencia"
          className="frequencia-image"
        />
        <span className="frequencia-info-name">Ala {nomeUnidade}</span>
        <span className="frequencia-info-number">{numeroUnidade}</span>

        {exibirHistorico ? (
          <>
            {modoEdicao ? (
              <>
                <h3 className="titulo-frequencia">Editar Frequência</h3>
                <br />
                <label className="frequencia-label">
                  Nova Frequência:
                  <input
                    type="text"
                    className="frequencia-input"
                    value={editandoFrequencia}
                    onChange={(e) => setEditandoFrequencia(e.target.value)}
                  />
                </label>
                <label className="frequencia-label">Nova Data:</label>
                <DatePicker
                  className="frequencia-input"
                  selected={editandoData}
                  onChange={(date) => setEditandoData(date)}
                  dateFormat="dd/MM/yyyy"
                  filterDate={(date) => date.getDay() === 0}
                />

                <button
                  className="profile-edit-close"
                  onClick={handleVoltarClick}
                >
                  X
                </button>
                <br />
                <div className="buttons-container">
                  <button
                    className="profile-edit-cancel-btn"
                    onClick={handleCancelarEdicao}
                  >
                    Cancelar
                  </button>
                  <button className="profile-edit-save-btn" onClick={handleSalvarEdicao}>
                    Salvar
                  </button>
                </div>
              </>
            ) : (
              <>
                <img
                  className="profile-edit-close"
                  src={FecharIcon}
                  alt="Fechar"
                  onClick={handleVoltarClick}
                />
                <h3 className="titulo-frequencia">Histórico de Frequências</h3>
                <br />
                <label className="frequencia-label">Pesquisar por data</label>
                <DatePicker
                  className="frequencia-input"
                  selected={searchTerm}
                  onChange={(date) => setSearchTerm(date)}
                  dateFormat="dd/MM/yyyy"
                  filterDate={(date) => date.getDay() === 0}
                />
                <table className="historico-table">
                  <thead>
                    <tr>
                      <th>Frequência</th>
                      <th>Data</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(historico) && historico.length > 0
                      ? historico
                          .filter((item) => {
                            if (!searchTerm) {
                              return true;
                            } else {
                              const itemDate = new Date(
                                item.data.seconds * 1000
                              );
                              return (
                                itemDate.toLocaleDateString() ===
                                searchTerm.toLocaleDateString()
                              );
                            }
                          })
                          .map((item, index) => (
                            <tr key={index}>
                              <td>{item.quantidade}</td>
                              <td>
                                {new Date(
                                  item.data.seconds * 1000
                                ).toLocaleDateString()}
                              </td>
                              <td>
                                <img
                                  className="image-button-editar"
                                  src="./editar.png"
                                  alt="Editar"
                                  onClick={() => handleEditHistorico(index)}
                                />
                                <img
                                  className="image-button-excluir"
                                  src="./excluir.png"
                                  alt="Excluir"
                                  onClick={() => handleExcluirHistorico(index)}
                                />
                              </td>
                            </tr>
                          ))
                      : !searchTerm && (
                          <tr>
                            <td colSpan="3" className="error-message">
                              {searchTerm
                                ? "Nenhuma frequência registrada para a data pesquisada"
                                : "Nenhum registro no histórico."}
                            </td>
                          </tr>
                        )}

                    {searchTerm &&
                      Array.isArray(historico) &&
                      historico.length > 0 &&
                      historico.every(
                        (item) =>
                          new Date(item.data.seconds * 1000)
                            .toLocaleDateString()
                            .localeCompare(searchTerm.toLocaleDateString()) !==
                          0
                      ) && (
                        <tr>
                          <td colSpan="3" className="error-message">
                            Nenhuma frequência registrada para a data
                            pesquisada.
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </>
            )}
          </>
        ) : (
          <>
            <h3 className="titulo-frequencia">Registrar Frequência</h3>
            <br />
            <label className="frequencia-label">
              Frequência:
              <input
                type="text"
                className="frequencia-input"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </label>
            <label className="frequencia-label">Selecionar Data:</label>
            <DatePicker
              selected={data}
              className="frequencia-input"
              onChange={(date) => setData(date)}
              filterDate={(date) => date.getDay() === 0}
              dateFormat="dd/MM/yyyy"
            />

            <div className="buttons-container">
              <button
                className="frequencia-btn-historico"
                onClick={handleShowHistoricoClick}
              >
                Histórico
              </button>
              <button className="frequencia-btn" onClick={handleSave}>
                Registrar
              </button>
            </div>
          </>
        )}
      </div>

      {InvalidQuantidadeMessage && (
        <p className="error-message">{InvalidQuantidadeMessage}</p>
      )}

      {invalidDataMessage && (
        <div className="error-message">{invalidDataMessage}</div>
      )}

      {frequenciaExistente && (
        <div className="error-message">{frequenciaExistente}</div>
      )}

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <Menu />
    </div>
  );
};

export default Frequencia;
