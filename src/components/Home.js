import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firebaseApp } from "../config/firebaseConfig";
import Navbar from "./Navbar";
import Acessados from "./MaisAcessados";
import Menu from "./Menu";
import HisFreq from "./HistoricoFrequencia";
import LoadingScreen from "./LoadingScreen";
import "./Home.css";
import capa from '../image/capa.png'

const Home = () => {
  const [nomeUnidade, setNomeUnidade] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingOpacity, setLoadingOpacity] = useState(1);

  const fetchNomeUnidade = async (numeroUnidade) => {
    try {
      const firestore = getFirestore(firebaseApp);
      const q = query(
        collection(firestore, "alas"),
        where("user.numeroUnidade", "==", numeroUnidade)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const nomeUnidadeFromDB =
          querySnapshot.docs[0].data().user.nomeUnidade;
        setNomeUnidade(nomeUnidadeFromDB);
      }
    } catch (error) {
      console.error("Erro ao buscar nome da unidade:", error);
    } finally {
      // Ajuste para diminuir a opacidade gradualmente ao invés de esconder imediatamente
      setLoadingOpacity(0);
      setTimeout(() => {
        setLoading(false);
      }, 700); // Tempo para a transição de opacidade
    }
  };

  useEffect(() => {
    const storedNumeroUnidade = localStorage.getItem("numeroUnidade");

    if (storedNumeroUnidade) {
      fetchNomeUnidade(storedNumeroUnidade);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <LoadingScreen opacity={loadingOpacity} />;
  }

  return (
    <div>
      <Navbar nomeUnidade={nomeUnidade} />
      <img src={capa} alt="header" className="header" />
      <h1 className="home-title">
        Bem-vindo à agenda da <br /> Ala {nomeUnidade || "Não encontrado"}!
      </h1>
      <Acessados />
      <HisFreq />
      <Menu />
    </div>
  );
};

export default Home;
