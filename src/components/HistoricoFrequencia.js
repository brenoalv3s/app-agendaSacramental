import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./HistoricoFrequencia.css";

const HistoricoFrequencia = () => {
  const navigate = useNavigate();
  const [ultimaFrequencia, setUltimaFrequencia] = useState(null);

  useEffect(() => {
    const fetchUltimaFrequencia = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const firestore = getFirestore();
          const docPath = `alas/${user.uid}`;

          const docRef = doc(firestore, docPath);

          const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const frequenciaArray = data.frequencia || [];

              // Verifica se há pelo menos um elemento no array antes de acessar o último
              if (frequenciaArray.length > 0) {
                setUltimaFrequencia(frequenciaArray[frequenciaArray.length - 1]);
              } else {
                setUltimaFrequencia(null);
              }
            } else {
              setUltimaFrequencia(null);
            }
          });

          // Cleanup function to unsubscribe when component unmounts
          return () => unsubscribe();
        } else {
          setUltimaFrequencia(null);
        }
      } catch (error) {
        console.error("Erro ao buscar última frequência do Firestore:", error);
      }
    };

    fetchUltimaFrequencia();
  }, []); // A dependência vazia garante que a busca é feita apenas uma vez no carregamento do componente

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const handleNavigateToFrequencia = () => {
    navigate("/frequencia");
  };

  return (
    <div className="historico-frequencia" onClick={handleNavigateToFrequencia}>
      {ultimaFrequencia ? (
        <div>
          <h3>Última Frequência Registrada</h3>
          <h1>{ultimaFrequencia.quantidade}</h1>
          <p>
            {ultimaFrequencia.data
              ? new Date(ultimaFrequencia.data.seconds * 1000).toLocaleDateString(undefined, options)
              : null
            }
          </p>
          {/* Adicione mais informações da frequência conforme necessário */}
        </div>
      ) : (
        <p className="nenhuma-frequencia">
          Nenhuma frequência registrada.
        </p>
      )}
    </div>
  );
};

export default HistoricoFrequencia;
