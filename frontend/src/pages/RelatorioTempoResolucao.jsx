import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import apiFetch from "../services/api";
import "../styles/RelatorioTempoResolucao.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RelatorioTempoResolucao = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoId, setTecnicoId] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [relatorio, setRelatorio] = useState([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    // Busca a lista de técnicos para popular o filtro
    const buscarTecnicos = async () => {
      try {
        const data = await apiFetch("/usuarios?tipo=tecnico");
        setTecnicos(data);
      } catch (error) {
        console.error("Erro ao buscar técnicos:", error);
        setMensagem(error.message || "Não foi possível carregar a lista de técnicos.");
      }
    };
    buscarTecnicos();
  }, []);

  const buscarRelatorio = async () => {
    setMensagem("");
    try {
      // 2. Usamos URLSearchParams para construir a query de forma segura
      const params = new URLSearchParams();
      if (tecnicoId) params.append('tecnicoId', tecnicoId);
      if (dataInicio) params.append('dataInicio', dataInicio);
      if (dataFim) params.append('dataFim', dataFim);

      const endpoint = `/relatorios/tempo-resolucao?${params.toString()}`;
      
      const data = await apiFetch(endpoint);
      setRelatorio(Array.isArray(data) ? data : []);
      if (data.length === 0) {
        setMensagem("Nenhum dado encontrado para os filtros selecionados.");
      }
    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
      setMensagem(error.message || "Erro ao buscar relatório.");
      setRelatorio([]);
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Tempo Médio de Resolução", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Técnico", "Chamados Resolvidos", "Média de Resolução (horas)"]],
      body: relatorio.map((r) => [
        r.tecnico,
        r.chamadosResolvidos,
        r.mediaResolucaoHoras !== null ? Number(r.mediaResolucaoHoras).toFixed(2) : "-",
      ]),
      headStyles: { fillColor: [41, 128, 185] },
    });
    doc.save("relatorio_tempo_resolucao.pdf");
  };

  const exportarExcel = () => {
    const worksheetData = relatorio.map((r) => ({
      'Técnico': r.tecnico,
      'Chamados Resolvidos': r.chamadosResolvidos,
      'Média de Resolução (horas)': r.mediaResolucaoHoras !== null ? Number(r.mediaResolucaoHoras).toFixed(2) : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "relatorio_tempo_resolucao.xlsx");
  };

  const chartData = {
    labels: relatorio.map((r) => r.tecnico),
    datasets: [
      {
        label: "Média de Resolução (horas)",
        data: relatorio.map((r) => r.mediaResolucaoHoras),
        backgroundColor: "#3498db",
        borderRadius: 6,
      },
    ],
  };

  const ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Tempo Médio de Resolução por Técnico",
        color: "#2c3e50",
        font: { size: 18 },
      },
    },
    indexAxis: "y",
    scales: {
      x: {
        ticks: { color: "#2c3e50" },
        title: {
          display: true,
          text: "Horas",
          color: "#2c3e50",
        },
      },
      y: {
        ticks: { color: "#2c3e50" },
      },
    },
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
          <button className="btn exportar" onClick={exportarExcel}>Exportar Excel</button>
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

      {relatorio.length > 0 && (
        <div className="grafico">
          <Bar data={chartData} options={ChartOptions} />  
        </div>
      )}
    </div>
  );
};

export default RelatorioTempoResolucao;
