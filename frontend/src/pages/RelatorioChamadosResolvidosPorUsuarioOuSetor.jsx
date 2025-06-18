import jsPDF from "jspdf";
import autotable, { autoTable } from "jspdf-autotable";
import { useEffect, useState } from "react";
import "../styles/RelatorioResolvidosPorUsuarioOuSetor.css";

export default function RelatorioResolvidosPorUsuarioOuSetor() {
    const [chamados, setChamados] = useState([]);
    const [usuarioId, setUsuarioId] = useState("");
    const [setor, setSetor] = useState("");
    const [usuarios, setUsuarios] = useState([]);
    const [setores, setSetores] = useState([]);
    const [filtrado, setFiltrado] = useState(false); // Novo estado

    const token = localStorage.getItem("token");

    const buscarUsuarios = async () => {
        try {
            const res = await fetch("http://localhost:3000/usuarios", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
    };

    const buscarSetores = async () => {
    try {
        const res = await fetch("http://localhost:3000/chamados/setores", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        setSetores(data); // Agora pega direto os setores dos chamados
    } catch (error) {
        console.error("Erro ao buscar setores dos chamados:", error);
    }
};

    const buscarChamados = async () => {
        try {
            setFiltrado(true); // Marca como filtrado ao clicar no botão

            let url = "http://localhost:3000/chamados/status/resolvido";
            const queryParams = [];
            if (usuarioId) queryParams.push(`usuarioId=${usuarioId}`);
            if (setor) queryParams.push(`setor=${encodeURIComponent(setor)}`);
            if (queryParams.length > 0) {
                url += `?${queryParams.join("&")}`;
            }

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Erro na requisição");

            const data = await response.json();
            setChamados(data);
        } catch (error) {
            console.error("Erro ao buscar chamados resolvidos:", error);
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
            new Date(chamado.dataAbertura).toLocaleString(),
            new Date(chamado.dataFechamento).toLocaleString(),
        ]);

        autoTable(doc, {
            startY: 25,
            head: [["ID", "Titulo", "Descrição", "Setor", "Solicitante", "Abertura", "Fechamento"]],
            body: rows,
            styles: { fontSize: 8 },
        });

        doc.save("relatorio_chamados_resolvidos_por_usuario_ou_setor.pdf");
    };

    useEffect(() => {
        buscarUsuarios();
        buscarSetores();
    }, []);

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
