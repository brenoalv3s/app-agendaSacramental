import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, updateDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import './ProfileEdit.css';
import iconProfile from '../image/icon-profile.png'

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [nomeUnidade, setNomeUnidade] = useState("");
  const [numeroUnidade, setNumeroUnidade] = useState("");
  const [bispo, setBispo] = useState("");
  const [conselheiro1, setConselheiro1] = useState("");
  const [conselheiro2, setConselheiro2] = useState("");
  const [secretarioFinanceiro, setSecretarioFinanceiro] = useState("");
  const [secretarioExecutivo, setSecretarioExecutivo] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const storedNomeUnidade = localStorage.getItem("nomeUnidade");
    const storedNumeroUnidade = localStorage.getItem("numeroUnidade");

    if (storedNomeUnidade && storedNumeroUnidade) {
      setNomeUnidade(storedNomeUnidade);
      setNumeroUnidade(storedNumeroUnidade);

      // Fetch existing data from Firestore when component mounts
      fetchDataFromFirestore();
    }
  }, []);

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
          setBispo(data.bispado?.bispo || "");
          setConselheiro1(data.bispado?.conselheiro1 || "");
          setConselheiro2(data.bispado?.conselheiro2 || "");
          setSecretarioFinanceiro(data.bispado?.secretarioFinanceiro || "");
          setSecretarioExecutivo(data.bispado?.secretarioExecutivo || "");
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados do Firestore:", error);
    }
  };

  const handleSave = async () => {
    try {
      const firestore = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const unidadeDocPath = `alas/${user.uid}`;
        const unidadeDoc = doc(firestore, unidadeDocPath);

        // Verifique se o documento existe antes de tentar atualizá-lo
        const unidadeSnap = await getDoc(unidadeDoc);

        if (unidadeSnap.exists()) {
          // O documento existe, podemos prosseguir com a atualização
          await updateDoc(unidadeDoc, {
            bispado: {
              bispo,
              conselheiro1,
              conselheiro2,
              secretarioFinanceiro,
              secretarioExecutivo,
            },
          });

          // Após salvar, exiba a mensagem de sucesso e navegue para a página anterior
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
            setIsEditMode(false);
          }, 3000);
        } else {
          // O documento não existe, crie-o primeiro
          await setDoc(unidadeDoc, {
            bispado: {
              bispo,
              conselheiro1,
              conselheiro2,
              secretarioFinanceiro,
              secretarioExecutivo,
            },
          });

          // Após criar, exiba a mensagem de sucesso e navegue para a página anterior
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
            setIsEditMode(false);
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Erro ao salvar no banco de dados:", error);
      // Lógica de tratamento de erro, se necessário
    }
  };

  const handleClose = () => {
    // Após salvar, navegue para a página anterior
    navigate(-1);
  };

  const handleEditClick = () => {
    // Ativa o modo de edição
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    // Desativa o modo de edição
    setIsEditMode(false);
  };

  return (
    <div className="profile-edit-container">
      <img src={iconProfile} alt="Profile" className="profile-image" />
      <span className="unit-info-name">Ala {nomeUnidade}</span>
      <span className="unit-info-number">{numeroUnidade}</span>
      <h3 className='titulo-perfil'>Bispado da Ala</h3>
      <label className="profile-edit-label">Bispo:</label>
      {isEditMode ? (
        <input className="profile-edit-input" value={bispo} onChange={(e) => setBispo(e.target.value)} />
      ) : (
        <span>{bispo || "Não informado"}</span>
      )}
      <label className="profile-edit-label">1º Conselheiro:</label>
      {isEditMode ? (
        <input className="profile-edit-input" value={conselheiro1} onChange={(e) => setConselheiro1(e.target.value)} />
      ) : (
        <span>{conselheiro1 || "Não informado"}</span>
      )}
      <label className="profile-edit-label">2º Conselheiro:</label>
      {isEditMode ? (
        <input className="profile-edit-input" value={conselheiro2} onChange={(e) => setConselheiro2(e.target.value)} />
      ) : (
        <span>{conselheiro2 || "Não informado"}</span>
      )}
      <label className="profile-edit-label">Secretário Financeiro:</label>
      {isEditMode ? (
        <input className="profile-edit-input" value={secretarioFinanceiro} onChange={(e) => setSecretarioFinanceiro(e.target.value)} />
      ) : (
        <span>{secretarioFinanceiro || "Não informado"}</span>
      )}
      <label className="profile-edit-label">Secretário Executivo:</label>
      {isEditMode ? (
        <input className="profile-edit-input" value={secretarioExecutivo} onChange={(e) => setSecretarioExecutivo(e.target.value)} />
      ) : (
        <span>{secretarioExecutivo || "Não informado"}</span>
      )}
      <>
        {showSuccessMessage && (
          <p style={{ color: 'green', marginTop: '5px', textAlign: 'center' }}>
            {`Dados salvos com sucesso!`}
          </p>
        )}
      </>
      <div className="buttons-container">
        {isEditMode && <button className="profile-edit-cancel-btn" onClick={handleCancelClick}>Cancelar</button>}
        {isEditMode && <button className="profile-edit-save-btn" onClick={handleSave}>Salvar</button>}
        <img
          className="profile-edit-close"
          src="./Fechar.png"
          alt="Fechar"
          onClick={handleClose}
        />
        {!isEditMode && <button className="profile-edit-btn" onClick={handleEditClick}>Editar</button>}
      </div>
    </div>
  );
};

export default ProfileEdit;
