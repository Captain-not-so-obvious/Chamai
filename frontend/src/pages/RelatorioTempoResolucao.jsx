import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const RelatorioTempoResolucao = () => {
    const [tecnicos, setTecnicos] = useState([]);
    const [tecnicoId, setTecnicoId] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [relatorio, setRelatorio] = useState([]);

    useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:3000/usuarios?tipo=tecnico", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
  console.log("Dados técnicos da API:", data);
  setTecnicos(data);
    })
    .catch((error) => {
      console.error("Erro ao buscar técnicos:", error);
    });
}, []);

    const buscarRelatorio = async () => {
    try {
        const params = new URLSearchParams({
            tecnicoId,
            dataInicio,
            dataFim
        });
        const response = await fetch(`http://localhost:3000/relatorios/tempo-resolucao?${params}`);
        const data = await response.json();
        setRelatorio(data);
    } catch (error) {
        console.error("Erro ao buscar relatório:", error);
    }
};

    const exportarPDF = () => {
        const doc = new jsPDF();
        doc.text("Relatório de Tempo Médio de Resolução", 14, 16);
        doc.autoTable({
            startY: 20,
            head: [["Tecnico", "Chamados Resolvidos", "Média de Resolução (horas)"]],
            body: relatorio.map(r => [r.tecnico, r.chamadosResolvidos, r.mediaResolucaoHoras]),
        });
        doc.save("relatorio_tempo_resolucao.pdf");
    };

    return (
        <div>
            <h2>Relatório de Tempo Médio de Resolução de Chamados</h2>
            <label>Técnico:</label>
            <select value={tecnicoId} onChange={(e) => setTecnicoId(e.target.value)}>
  <option value="">Todos</option>
  {tecnicos.map((tecnico) => (
    <option key={tecnico.id} value={tecnico.id}>
      {tecnico.nome}
    </option>
  ))}
</select>

            <label>Data Início:</label>
            <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            <label>Data Fim:</label>
            <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />

            <button onClick={buscarRelatorio}>Buscar</button>
            <button onClick={exportarPDF}>Exportar PDF</button>

            <table>
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