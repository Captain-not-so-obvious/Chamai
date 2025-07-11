import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import "../styles/RelatorioChamadosResolvidos.css";

export default function RelatorioResolvidos() {
    const [chamados, setChamados] = useState([]);
    const [tecnicoId, setTecnicoId] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [tecnicos, setTecnicos] = useState([]);

    // Buscar todos os técnicos
    const buscarTecnicos = () => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:3000/usuarios/tecnicos", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setTecnicos(data))
            .catch(err => console.error("Erro ao buscar técnicos:", err));
    };

    const buscarChamados = () => {
        const token = localStorage.getItem("token");

        if (dataInicio && dataFim && new Date(dataInicio) > new Date(dataFim)) {
            alert("A data de início não pode ser maior que a data final.");
            return;
        }

        const queryParams = new URLSearchParams();
        if (tecnicoId) queryParams.append("tecnicoId", tecnicoId);
        if (dataInicio && dataFim) {
            queryParams.append("dataInicio", dataInicio);
            queryParams.append("dataFim", dataFim);
        }

        fetch(`http://localhost:3000/relatorios/resolvidos/historico?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        .then((res) => res.json())
        .then((data) => {
            setChamados(data);
        })
        .catch((err) => console.error("Erro ao buscar chamados:", err));
    };

    useEffect(() => {
        buscarTecnicos();
    }, []);

    const exportarExcel = () => {
        const dados = chamados.map((chamado) => ({
            Título: chamado.titulo,
            Status: chamado.status,
            Técnico: chamado.tecnico?.nome || "Não Atribuído",
            Solicitante: chamado.solicitante?.nome || "Desconhecido",
            Fechamento: chamado.dataFechamento
                ? new Date(chamado.dataFechamento).toLocaleString()
                : "",
            Histórico: chamado.historico
                .map((h) => `${h.descricao} (${new Date(h.dataEvento).toLocaleString()}) - ${h.Usuario?.nome || "Desconhecido"}`)
                .join(" | "),
        }));

        const worksheet = XLSX.utils.json_to_sheet(dados);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Chamados Resolvidos");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "relatorio_chamados_resolvidos.xlsx");
    };

    const exportarPDF = () => {
        const doc = new jsPDF();
        doc.text("Relatório de Chamados Resolvidos", 14, 15);

        const rows = chamados.map((chamado) => [
            chamado.titulo,
            chamado.status,
            chamado.tecnico?.nome || "Não atribuído",
            chamado.solicitante?.nome || "Desconhecido",
            chamado.dataFechamento
                ? new Date(chamado.dataFechamento).toLocaleString()
                : "",
        ]);

        autoTable(doc, {
            startY: 25,
            head: [["Título", "Status", "Técnico", "Solicitante", "Fechamento"]],
            body: rows,
        });

        doc.save("relatorio_chamados_resolvidos.pdf");
    };

    return (
        <div className="relatorio-container">
            <h2 className="relatorio-titulo">Relatório de Chamados Resolvidos</h2>

            <div className="filtro-container">
                <select
                    value={tecnicoId}
                    onChange={(e) => setTecnicoId(e.target.value)}
                    className="input-filtro"
                >
                    <option value="">Filtrar por técnico</option>
                    {tecnicos.map((tecnico) => (
                        <option key={tecnico.id} value={tecnico.id}>
                            {tecnico.nome}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="input-filtro"
                />
                <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="input-filtro"
                />
                <button onClick={buscarChamados} className="botao-filtro">Filtrar</button>
            </div>

            <div className="botoes-exportar">
                <button onClick={exportarPDF} className="botao-exportar">Exportar PDF</button>
                <button onClick={exportarExcel} className="botao-exportar">Exportar Excel</button>
            </div>

            {chamados.map((chamado) => (
                <div key={chamado.id} className="chamado-card">
                    <h4 className="chamado-titulo">{chamado.titulo}</h4>
                    <p className="chamado-status">Status: {chamado.status}</p>
                    <h5 className="historico-titulo">Histórico:</h5>
                    <ul className="historico-lista">
                        {chamado.historico.map((item, idx) => (
                            <li key={idx}>
                                {item.descricao} - {new Date(item.dataEvento).toLocaleString()} - Autor: {item.Usuario?.nome || "Desconhecido"}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            {chamados.length === 0 && (
                <p className="mensagem-vazia">Nenhum Chamado Encontrado</p>
            )}
        </div>
    );
}
