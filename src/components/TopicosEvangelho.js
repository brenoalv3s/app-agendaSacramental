import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import TemasIcon from "../image/icon-temas.png";
import "./Oradores.css";
import "./TopicosEvangelho.css"
import OpenAI from "openai";

const Temas = () => {
    const navigate = useNavigate();
    const [nomeUnidade, setNomeUnidade] = useState("");
    const [numeroUnidade, setNumeroUnidade] = useState("");
    const [tema, setTema] = useState("");
    const [respostaChatGPT, setRespostaChatGPT] = useState("");
    const [exibirResultado, setExibirResultado] = useState(false);
    const [exibirLoading, setExibirLoading] = useState(false);
    const [temaSelecionado, setTemaSelecionado] = useState(null);
    const [exibirCamposPesquisa, setExibirCamposPesquisa] = useState(true); // Adicionado estado para controlar a exibição dos campos de pesquisa
  
    useEffect(() => {
      const storedNomeUnidade = localStorage.getItem("nomeUnidade");
      const storedNumeroUnidade = localStorage.getItem("numeroUnidade");
  
      if (storedNomeUnidade && storedNumeroUnidade) {
        setNomeUnidade(storedNomeUnidade);
        setNumeroUnidade(storedNumeroUnidade);
      }
    }, []);
  
    const handlePesquisar = async () => {
      setExibirLoading(true);
      setExibirCamposPesquisa(false); // Oculta os campos de pesquisa ao iniciar a pesquisa
  
      const apiKey = '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';
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "user", content: `Crie uma lista de temas de A Igreja de Jesus Cristo dos Santos dos Últimos dias sobre ${tema}
            Retorne o resultdo da seguinte maneira:
            Tema sugerido: Crie temas sobre o assunto
            Referência das Escrituras: (livro - Cap:Vers)
            Outras fontes: nome do orador - Conferência Geral de mês de ano` },
          ],
          model: "gpt-3.5-turbo",
        });
  
        const respostaFormatada = completion.choices[0].message.content.replace(/\n/g, '<br />');
  
        setRespostaChatGPT(respostaFormatada);
        setExibirResultado(true);
      } catch (error) {
        console.error('Erro ao chamar a API do ChatGPT:', error.message || error);
      } finally {
        setExibirLoading(false);
      }
    };
  
    const handleFecharResultado = () => {
      setExibirResultado(false);
      setTema("");
      setExibirCamposPesquisa(true);
    };
  
    const handleParagrafoClicado = (paragrafo) => {
      const paragrafoSemNumero = paragrafo.replace(/^\d+\.\s*|\d+\)\s*|Tema sugerido:|' '|/g, '');
  
      setTemaSelecionado(paragrafoSemNumero);
      localStorage.setItem("temaSelecionado", paragrafoSemNumero);
  
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
              <div className="buttons-container">
                <button
                  className="frequencia-btn"
                  onClick={handlePesquisar}
                >
                  Pesquisar
                </button>
              </div>
              <br />
            </>
          )}
  
          {exibirLoading && <h4 className="titulo-frequencia">Pesquisando tópico...</h4>}
          {exibirResultado && (
            <div>
              <img
                className="profile-edit-close"
                src="./Fechar.png"
                alt="Fechar"
                onClick={handleFecharResultado}
              />
              <h3 className="titulo-frequencia">Resultados sobre {tema}:</h3>
              <br />
              <div>
                {respostaChatGPT.split('<br />').map((paragrafo, index) => (
                  <p
                    key={index}
                    className="paragrafo-topicos"
                    onClick={() => handleParagrafoClicado(paragrafo)}
                    style={{ color: temaSelecionado === paragrafo ? "#007D85" : "#000000" }}
                  >
                    {paragrafo}
                    <br />
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
        <Menu />
      </div>
    );
  };
  
  export default Temas;
