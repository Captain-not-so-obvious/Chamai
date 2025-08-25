import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { useEffect, useState } from "react";
import apiFetch from "../services/api";
import "../styles/RelatorioResolvidosPorUsuarioOuSetor.css";

export default function RelatorioResolvidosPorUsuarioOuSetor() {
    const [chamados, setChamados] = useState([]);
    const [usuarioId, setUsuarioId] = useState("");
    const [setor, setSetor] = useState("");
    const [usuarios, setUsuarios] = useState([]);
    const [setores, setSetores] = useState([]);
    const [filtrado, setFiltrado] = useState(false);
    const [mensagem, setMensagem] = useState("");


    useEffect(() => {
        const carregarFiltros = async () => {
            try {
                // Carrega usuários e setores em paralelo para mais eficiência
                const [dataUsuarios, dataSetores] = await Promise.all([
                    apiFetch("/usuarios"),
                    apiFetch("/chamados/setores")
                ]);
                setUsuarios(dataUsuarios);
                setSetores(dataSetores);
            } catch (error) {
                setMensagem(error.message || "Erro ao carregar dados para os filtros.");
            }
        };
        carregarFiltros();
    }, []);

    const buscarChamados = async () => {
        setMensagem("");
        setFiltrado(true);
        try {
            // 2. Montamos os parâmetros de busca de forma mais limpa
            const params = new URLSearchParams();
            if (usuarioId) params.append('usuarioId', usuarioId);
            if (setor) params.append('setor', setor);
            
            const queryString = params.toString();
            // O endpoint já busca apenas os resolvidos, os filtros são adicionais
            const endpoint = `/chamados/status/resolvido${queryString ? `?${queryString}` : ''}`;
            
            const data = await apiFetch(endpoint);
            setChamados(data);

        } catch (error) {
            setMensagem(error.message || "Erro ao buscar chamados resolvidos.");
            setChamados([]); // Garante que a tabela seja limpa em caso de erro
        }
    };

    const exportarPDF = () => {
        const doc = new jsPDF();
        doc.text("Relatório de Chamados Resolvidos por Usuário ou Setor", 14, 15);

        const rows = chamados.map((chamado) => [
            chamado.id,
            chamado.titulo,
            chamado.descricao,
            chamado.setor,
            chamado.solicitante?.nome || "Desconhecido",
            new Date(chamado.dataAbertura).toLocaleString('pt-BR'),
            new Date(chamado.dataFechamento).toLocaleString('pt-BR'),
        ]);

        autoTable(doc, {
            startY: 25,
            head: [["ID", "Título", "Descrição", "Setor", "Solicitante", "Abertura", "Fechamento"]],
            body: rows,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] }, // Adiciona uma cor ao cabeçalho
        });

        doc.save("relatorio_chamados_resolvidos.pdf");
    };

    return (
        <div className="relatorio-container">
            <h2>Chamados Resolvidos por Usuário ou Setor</h2>

            <div className="filtros">
                <h3>Filtro por Usuário:</h3>
                <select value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
                    <option value="">Todos os Usuários</option>
                    {usuarios.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.nome}
                        </option>
                    ))}
                </select>

                <h3>Filtro por setor:</h3>
                <select value={setor} onChange={(e) => setSetor(e.target.value)}>
                    <option value="">Todos os Setores</option>
                    {setores.map((s, index) => (
                        <option key={index} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                <button onClick={buscarChamados}>Filtrar</button>
            </div>

            {filtrado && chamados.length > 0 && (
                <div className="botoes-exportar">
                    <button onClick={exportarPDF} className="botao-exportar">Exportar PDF</button>
                </div>
            )}

            {!filtrado ? (
                <p className="mensagem-inicial">Selecione os filtros e clique em "Filtrar" para visualizar os chamados resolvidos.</p>
            ) : chamados.length === 0 ? (
                <p className="mensagem-inicial">Nenhum chamado encontrado com os filtros selecionados.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Descrição</th>
                            <th>Setor</th>
                            <th>Solicitante</th>
                            <th>Data de Abertura</th>
                            <th>Data de Fechamento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chamados.map((chamado) => (
                            <tr key={chamado.id}>
                                <td>{chamado.id}</td>
                                <td>{chamado.titulo}</td>
                                <td>{chamado.descricao}</td>
                                <td>{chamado.setor}</td>
                                <td>{chamado.solicitante?.nome}</td>
                                <td>{new Date(chamado.dataAbertura).toLocaleString()}</td>
                                <td>{new Date(chamado.dataFechamento).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
