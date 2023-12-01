import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  collection,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "../config/firebaseConfig";
import "firebase/compat/auth";

import "./CadastroUnidade.css";


const CadastroUnidade = () => {
  const [nomeUnidade, setNomeUnidade] = useState("");
  const [numeroUnidade, setNumeroUnidade] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaDiferente, setSenhaDiferente] = useState(false);
  const [senhaValida, setSenhaValida] = useState(false);
  const [textHidden, setTextHidden] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [unidadeExistente, setUnidadeExistente] = useState(false);
  const [nomeUnidadeExistente, setNomeUnidadeExistente] = useState(false);
  const [emailExistente, setEmailExistente] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [exibirSenha, setExibirSenha] = useState(false);
  const [loadingCadastro, setLoadingCadastro] = useState(false);

  const firestore = getFirestore(firebaseApp);
  const navigate = useNavigate();

  useEffect(() => {
    if (showSuccessMessage) {
      const timeoutId = setTimeout(() => {
        setShowSuccessMessage(false);
        navigate("/");
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [showSuccessMessage, navigate]);

  const handleSalvar = async (event) => {
    event.preventDefault();

    setLoadingCadastro(true);

    try {
      const auth = getAuth();
      const user = await createUserWithEmailAndPassword(auth, email, senha);

      const unidadeDocPath = `alas/${user.user.uid}`;
      const unidadeDoc = doc(firestore, unidadeDocPath);

      await setDoc(unidadeDoc, {
        user: {
          email,
          nomeUnidade: nomeUnidade,
          numeroUnidade,
        },
      });

      localStorage.setItem("nomeUnidade", nomeUnidade);
      localStorage.setItem("numeroUnidade", numeroUnidade);
      localStorage.setItem("email", email);

      setShowSuccessMessage(true);

      setNomeUnidade("");
      setNumeroUnidade("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setSenhaDiferente(false);
    } catch (error) {
      setShowErrorMessage(true);
    } finally {
      setLoadingCadastro(false);

      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
    }
  };

  const handleNumeroUnidadeChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    setNumeroUnidade(value);
  };

  const isFormValid =
    nomeUnidade && numeroUnidade && email && senha && confirmarSenha;

  const checkSenha = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{10,}$/;
    setSenha(value);
    setSenhaValida(regex.test(value));
    setTextHidden(regex.test(value));
  };

  const toggleExibirSenha = () => {
    setExibirSenha(!exibirSenha);
  };

  const checkUnidadeExists = async () => {
    const q = query(
      collection(firestore, "alas"),
      where("numeroUnidade", "==", numeroUnidade)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const checkNomeUnidadeExists = async () => {
    const q = query(
      collection(firestore, "alas"),
      where("nomeUnidade", "==", nomeUnidade)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const checkEmailExists = async () => {
    const q = query(collection(firestore, "alas"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  return (
    <div className="container-cadastro">
      <img
        className="img-logo-cadastro"
        src={process.env.PUBLIC_URL + "/logo.png"}
        alt="Logo"
      />
      <form onSubmit={handleSalvar}>
        <label className="label-cadastro">
          Nome da Unidade
          <input
            className="input-cadastro"
            type="text"
            name="nomeUnidade"
            value={nomeUnidade}
            onChange={(e) => setNomeUnidade(e.target.value)}
          />
        </label>
        <label className="label-cadastro">
          Número da Unidade
          <input
            className="input-cadastro"
            type="text"
            name="numeroUnidade"
            value={numeroUnidade}
            onChange={handleNumeroUnidadeChange}
          />
        </label>
        <div className="input-group"></div>
        <label className="label-cadastro">
          E-mail
          <input
            className="input-cadastro"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <i onClick={toggleExibirSenha} className="icon-exibir">
          <img
            src={exibirSenha ? "/icon-exibir.png" : "/icon-ocultar.png"}
            alt="Exibir Senha"
          />
        </i>
        <div className="input-group">
          <div className="input-pair">
            <label className="label-cadastro-senha">
              Senha
              <input
                className="input-cadastro"
                type={exibirSenha ? "text" : "password"}
                name="senha"
                value={senha}
                onChange={(e) => checkSenha(e.target.value)}
              />
              {senha && !textHidden && (
                <p
                  style={{
                    color: senhaValida ? "green" : "red",
                    marginTop: "5px",
                  }}
                >
                  Mín. 10 caracteres
                  <br />
                  Números
                  <br />
                  Letra maiúscula
                  <br />
                  Letra minúscula
                  <br />
                  Caractere especial
                </p>
              )}
            </label>
          </div>
          <div className="input-pair">
            <label className="label-cadastro">
              Confirmar Senha
              <input
                className="input-cadastro"
                type={exibirSenha ? "text" : "password"}
                name="confirmarSenha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </label>
          </div>
        </div>
        {isFormValid && (
          <>
            {showSuccessMessage && (
              <p style={{ color: "green", marginTop: "5px" }}>
                {`O cadastro da Ala ${localStorage.getItem(
                  "nomeUnidade"
                )} foi realizado com sucesso!`}
              </p>
            )}
            {senhaDiferente && (
              <p style={{ color: "red", marginTop: "5px" }}>
                Senhas não coincidem
              </p>
            )}
            {unidadeExistente && (
              <p style={{ color: "red", marginTop: "5px" }}>
                Unidade já cadastrada
              </p>
            )}
            {nomeUnidadeExistente && (
              <p style={{ color: "red", marginTop: "5px" }}>
                Nome da Unidade já existe
              </p>
            )}
            {emailExistente && (
              <p style={{ color: "red", marginTop: "5px" }}>
                E-mail já cadastrado
              </p>
            )}
            {showErrorMessage && (
              <p style={{ color: "red", marginTop: "5px" }}>
                Por favor, preencha todos os campos obrigatórios
              </p>
            )}
            <br />
            <button type="submit" disabled={loadingCadastro}>
              {loadingCadastro ? "Cadastrando..." : "Salvar"}
            </button>
          </>
        )}
      </form>
      <p>
        Já possui um Cadastro?{" "}
        <Link className="telaLogin" to="/">
          Faça o Login
        </Link>
      </p>
    </div>
  );
};

export default CadastroUnidade;
