// Login.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firebaseApp } from "../config/firebaseConfig";
import "./Login.css";

const Login = () => {
  const [numeroUnidade, setNumeroUnidade] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [exibirSenha, setExibirSenha] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedNumeroUnidade = localStorage.getItem("numeroUnidade");
    if (savedNumeroUnidade) {
      setNumeroUnidade(savedNumeroUnidade);
    }
  }, []);

  const toggleExibirSenha = () => {
    setExibirSenha(!exibirSenha);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!numeroUnidade || !senha) {
      setErrorMessage("Número da Unidade e Senha devem ser preenchidos.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    try {
      const firestore = getFirestore(firebaseApp);
      const q = query(
        collection(firestore, "alas"),
        where("user.numeroUnidade", "==", numeroUnidade)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setErrorMessage("Número da Unidade não cadastrado.");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
        return;
      }

      const userDoc = querySnapshot.docs[0].data();

      const auth = getAuth();
      await signInWithEmailAndPassword(auth, userDoc.user.email, senha);

      localStorage.setItem("nomeUnidade", userDoc.user.nomeUnidade);
      localStorage.setItem("numeroUnidade", numeroUnidade);

      navigate("/home");
    } catch (error) {
      console.error("Erro ao fazer login:", error);

      if (error.code === "auth/wrong-password") {
        setErrorMessage("Senha incorreta.");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        setErrorMessage(
          "Número da Unidade ou Senha inválido. Por favor, tente novamente"
        );
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
    }
  };

  return (
    <div className="login-container">
      <img
        className="img-logo"
        src={process.env.PUBLIC_URL + "/logo.png"}
        alt="Logo"
      />
      <form onSubmit={handleLogin}>
        <br />
        <label className="label-login">
          Número da Unidade
          <input
            className="input-login"
            type="text"
            name="unidade"
            value={numeroUnidade}
            onChange={(e) => setNumeroUnidade(e.target.value)}
          />
        </label>
        <label className="label-login">
          Senha
          <input
            className="input-login"
            type={exibirSenha ? "text" : "password"}
            name="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </label>
        <i onClick={toggleExibirSenha} className="icon-exibir-login">
          <img
            src={exibirSenha ? "/icon-exibir.png" : "/icon-ocultar.png"}
            alt="Exibir Senha"
          />
        </i>
        <Link className="esqueceuSenha" to="/esqueceu-senha">
          Esqueceu a senha?
        </Link>
        <br />
        {errorMessage && (
          <p style={{ color: "red", marginTop: "5px", textAlign: "center" }}>
            {errorMessage}
          </p>
        )}
        <button type="submit">Entrar</button>
      </form>
      <p>
        Novo no App?{" "}
        <Link className="telaLogin" to="/cadastro">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
};

export default Login;
