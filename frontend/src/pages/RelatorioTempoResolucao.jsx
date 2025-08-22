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
import "../styles/RelatorioTempoResolucao.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RelatorioTempoResolucao = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoId, setTecnicoId] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [relatorio, setRelatorio] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/usuarios?tipo=tecnico", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setTecnicos)
      .catch((err) => console.error("Erro ao buscar técnicos:", err));
  }, []);

  const buscarRelatorio = async () => {
    try {
      const params = new URLSearchParams({ tecnicoId, dataInicio, dataFim });
      const response = await fetch(`http://localhost:4000/api/relatorios/tempo-resolucao?${params}`, {
        credentials: "include",
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
  autoTable(doc, {
    startY: 20,
    head: [["Técnico", "Chamados Resolvidos", "Média de Resolução (horas)"]],
    body: relatorio.map((r) => [
      r.tecnico,
      r.chamadosResolvidos,
      r.mediaResolucaoHoras !== null
        ? Number(r.mediaResolucaoHoras).toFixed(2)
        : "-",
    ]),
  });
  doc.save("relatorio_tempo_resolucao.pdf");
};

const exportarExcel = () => {
  const worksheetData = relatorio.map((r) => ({
    Técnico: r.tecnico,
    "Chamados Resolvidos": r.chamadosResolvidos,
    "Média de Resolução (horas)": r.mediaResolucaoHoras !== null
    ? Number(r.mediaResolucaoHoras).toFixed(2)
    : "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {type: "application/octet-stream"});
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
