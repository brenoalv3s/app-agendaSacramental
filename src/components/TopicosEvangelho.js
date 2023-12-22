import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import TemasIcon from "../image/icon-temas.png";
import FecharIcon from "../image/fechar.png";
import ReloadIcon from "../image/reload.png"
import OpenAI from "openai";
import "./TopicosEvangelho.css"

const Temas = () => {
    const navigate = useNavigate();
    const [nomeUnidade, setNomeUnidade] = useState("");
    const [numeroUnidade, setNumeroUnidade] = useState("");
    const [tema, setTema] = useState("");
    const [respostaChatGPT, setRespostaChatGPT] = useState([]);
    const [exibirResultado, setExibirResultado] = useState(false);
    const [exibirLoading, setExibirLoading] = useState(false);
    const [temaSelecionado, setTemaSelecionado] = useState(null);
    const [exibirCamposPesquisa, setExibirCamposPesquisa] = useState(true);
  
    useEffect(() => {
      const storedNomeUnidade = localStorage.getItem("nomeUnidade");
      const storedNumeroUnidade = localStorage.getItem("numeroUnidade");
  
      if (storedNomeUnidade && storedNumeroUnidade) {
        setNomeUnidade(storedNomeUnidade);
        setNumeroUnidade(storedNumeroUnidade);
      }
    }, []);
  
    const handlePesquisar = async () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
      setExibirLoading(true);
  
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `Crie 3 temas de A Igreja de Jesus Cristo dos Santos dos Últimos dias sobre ${tema} 
              Retorne o resultado da seguinte maneira: 
              Tema sugerido: Crie temas sobre o assunto sem númeração
              Escrituras relacionadas: livro - Cap:Vers 
              Domínio doutrinário: escreva como aplicar a doutrina ${tema} a situações reais da vida `,
            },
          ],
          model: "gpt-3.5-turbo",
        });
  
        const respostaFormatada = completion.choices[0].message.content.split("\n\n");
        
        setRespostaChatGPT(respostaFormatada);
        setExibirResultado(true);
        setExibirCamposPesquisa(false);
      } catch (error) {
        console.error("Erro ao chamar a API do ChatGPT:", error.message || error);
      } finally {
        setExibirLoading(false);
      }
    };
  
    const handleFecharResultado = () => {
      setExibirResultado(false);
      setTema("");
      setExibirCamposPesquisa(true);
    };
  
    const handleConjuntoClicado = (conjunto, index) => {
      localStorage.setItem("conjuntoSelecionado", conjunto.replace("Tema sugerido: ", ""));
      setTemaSelecionado(conjunto);
      setTimeout(() => {
          navigate("/discursantes");
        }, 2000);
    };
  
    return (
      <div>
        <div className="sacramento-container">
          <img src={TemasIcon} alt="temas" className="sacramento-image" />
          <span className="sacramento-info-name">Ala {nomeUnidade}</span>
          <span className="sacramento-info-number">{numeroUnidade}</span>
  
          {exibirCamposPesquisa && (
            <>
              <h3 className="titulo-frequencia">Pesquisar Tópicos</h3>
              <br />
              <div>
                <label className="frequencia-label" htmlFor="tema">
                  Tópico:
                </label>
                <input
                  type="text"
                  id="tema"
                  className="frequencia-input"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                />
              </div>
              {exibirLoading && <h4 className="titulo-frequencia">Pesquisando tópico...</h4>}
              <div className="buttons-container">
                <button className="frequencia-btn" onClick={handlePesquisar}>
                  Pesquisar
                </button>
              </div>
              <br />
            </>
          )}
  
          {exibirResultado && (
            <div>
              <img
                className="profile-edit-close"
                src={FecharIcon}
                alt="Fechar"
                onClick={handleFecharResultado}
              />
              <h3 className="titulo-frequencia">Resultados sobre {tema}:</h3>
              {exibirLoading && <h4 className="titulo-frequencia">Buscando novos resultados...</h4>}
              <br />
              <div>
                {respostaChatGPT.map((conjunto, index) => (
                  <p
                    key={index}
                    className="paragrafo-topicos"
                    onClick={() => handleConjuntoClicado(conjunto, index)}
                    style={{
                      color: temaSelecionado === conjunto ? "#007D85" : "#000000",
                      fontWeight: temaSelecionado === conjunto ? "bold" : "normal",
                    }}
                  >
                    {conjunto.split("\n").map((linha, i) => (
                      <React.Fragment key={i}>
                        {linha}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                ))} 
                <br />
                <img
                className="reload"
                src={ReloadIcon}
                alt="recarregar"
                onClick={handlePesquisar}
               /> 
              </div>
            </div>
          )}
        </div>
        <Menu />
      </div>
    );
  };
  
  export default Temas;
