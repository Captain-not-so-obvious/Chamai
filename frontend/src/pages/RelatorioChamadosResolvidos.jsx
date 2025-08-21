import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import "../styles/RelatorioChamadosResolvidos.css";

export default function RelatorioResolvidos() {
    const [chamados, setChamados] = useState([]);
    const [tecnicoId, setTecnicoId] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [tecnicos, setTecnicos] = useState([]);
    const [mensagemErro, setMensagemErro] = useState("");

    // Buscar todos os técnicos
    const buscarTecnicos = () => {
        setMensagemErro(""); // Limpa mensagens de erro anteriores
        fetch("http://localhost:3000/api/usuarios/tecnicos", {
            credentials: "include",
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(errorData => {
                        throw new Error(errorData.message || "Erro ao buscar técnicos.");
                    });
                }
                return res.json();
            })
            .then(data => setTecnicos(data))
            .catch(err => {
                console.error("Erro ao buscar técnicos:", err);
                setMensagemErro(err.message || "Erro ao carregar lista de técnicos.");
                setTecnicos([]); // Garante que 'tecnicos' seja um array vazio em caso de erro
            });
    };

    const buscarChamados = () => {
        setMensagemErro(""); // Limpa mensagens de erro anteriores

        if (dataInicio && dataFim && new Date(dataInicio) > new Date(dataFim)) {
            setMensagemErro("A data de início não pode ser maior que a data final.");
            return;
        }

        const queryParams = new URLSearchParams();
        if (tecnicoId) queryParams.append("tecnicoId", tecnicoId);
        if (dataInicio && dataFim) {
            queryParams.append("dataInicio", dataInicio);
            queryParams.append("dataFim", dataFim);
        }

        fetch(`http://localhost:3000/api/relatorios/resolvidos/historico?${queryParams.toString()}`, {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) {
                    return res.json().then(errorData => {
                        throw new Error(errorData.message || "Erro ao buscar chamados.");
                    });
                }
                return res.json();
            })
            .then((data) => {
                // Garante que 'data' é um array antes de setar o estado
                setChamados(Array.isArray(data) ? data : []);
                if (!Array.isArray(data) || data.length === 0) {
                    setMensagemErro("Nenhum chamado encontrado com os filtros selecionados ou acesso negado.");
                }
            })
            .catch((err) => {
                console.error("Erro ao buscar chamados:", err);
                setMensagemErro(err.message || "Erro ao carregar chamados resolvidos.");
                setChamados([]); // Garante que 'chamados' seja um array vazio em caso de erro
            });
    };

    useEffect(() => {
        buscarTecnicos();
    }, []);

    const exportarExcel = () => {
        if (!Array.isArray(chamados) || chamados.length === 0) {
            alert("Não há dados para exportar para Excel.");
            return;
        }
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
        if (!Array.isArray(chamados) || chamados.length === 0) {
            alert("Não há dados para exportar para PDF.");
            return;
        }
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

            {mensagemErro && <p className="mensagem-erro">{mensagemErro}</p>} {/* Exibe a mensagem de erro */}

            {Array.isArray(chamados) && chamados.length === 0 ? (
                !mensagemErro && <p className="mensagem-vazia">Nenhum Chamado Encontrado com os Filtros Atuais</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Chamados</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chamados.map((chamado) => (
                            <div key={chamado.id} className="chamado-card">
                                <h4 className="chamado-titulo">{chamado.titulo}</h4>
                                <p className="chamado-status">Status: {chamado.status}</p>
                                <h5 className="historico-titulo">Histórico:</h5>
                                <ul className="historico-lista">
                                    {Array.isArray(chamado.historico) && chamado.historico.map((item, idx) => (
                                        <li key={idx}>
                                            {item.descricao} - {new Date(item.dataEvento).toLocaleString()} - Autor: {item.Usuario?.nome || "Desconhecido"}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}