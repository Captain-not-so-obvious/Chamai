import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../styles/RelatorioTempoResolucao.css";

const RelatorioTempoResolucao = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoId, setTecnicoId] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [relatorio, setRelatorio] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/usuarios?tipo=tecnico", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setTecnicos)
      .catch((err) => console.error("Erro ao buscar técnicos:", err));
  }, []);

  const buscarRelatorio = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ tecnicoId, dataInicio, dataFim });
      const response = await fetch(`http://localhost:3000/relatorios/tempo-resolucao?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.msg || "Erro ao buscar relatório.");
        return;
      }

      const data = await response.json();
      setRelatorio(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
      alert("Erro ao buscar relatório.");
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Tempo Médio de Resolução", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["Técnico", "Chamados Resolvidos", "Média de Resolução (horas)"]],
      body: relatorio.map((r) => [r.tecnico, r.chamadosResolvidos, r.mediaResolucaoHoras]),
    });
    doc.save("relatorio_tempo_resolucao.pdf");
  };

  return (
    <div className="relatorio-container">
      <h2 className="titulo">Relatório de Tempo Médio de Resolução de Chamados</h2>

      <div className="filtros">
        <div className="campo">
          <label>Técnico:</label>
          <select value={tecnicoId} onChange={(e) => setTecnicoId(e.target.value)}>
            <option value="">Todos</option>
            {tecnicos.map((tecnico) => (
              <option key={tecnico.id} value={tecnico.id}>
                {tecnico.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label>Data Início:</label>
          <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        </div>

        <div className="campo">
          <label>Data Fim:</label>
          <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        </div>

        <div className="botoes">
          <button className="btn buscar" onClick={buscarRelatorio}>Buscar</button>
          <button className="btn exportar" onClick={exportarPDF}>Exportar PDF</button>
        </div>
      </div>

      <table className="tabela-relatorio">
        <thead>
          <tr>
            <th>Técnico</th>
            <th>Chamados Resolvidos</th>
            <th>Média de Resolução (horas)</th>
          </tr>
        </thead>
        <tbody>
          {relatorio.map((linha, index) => (
            <tr key={index}>
              <td>{linha.tecnico}</td>
              <td>{linha.chamadosResolvidos}</td>
              <td>{linha.mediaResolucaoHoras}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RelatorioTempoResolucao;
