import { useEffect, useState } from "react";
import "../styles/FiltroBuscaChamados.css";

export default function FiltroBuscaChamados() {
    const [chamados, setChamados] = useState([]);
    const [setores, setSetores] = useState([]);
    const [prioridade, setPrioridade] = useState("");
    const [status, setStatus] = useState("");
    const [setor, setSetor] = useState("");
    const [termo, setTermo] = useState("");

    useEffect(() => {
        buscarSetores();
    }, []);

    const buscarSetores = async () => {
    try {
        const res = await fetch("http://localhost:3000/api/chamados/setores", {
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error(`Erro na API: ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            throw new Error("Formato de resposta inválido. Esperado um array.");
        }

        setSetores(data);
    } catch (error) {
        console.error("Erro ao buscar setores:", error);
        setSetores([]);  // Pra garantir que o map não quebre
    }
};

    const buscarChamados = async () => {
        try {
            let url = "http://localhost:3000/api/chamados/filtro-busca";
            const params = [];

            if (setor) params.push(`setor=${encodeURIComponent(setor)}`);
            if (prioridade) params.push(`prioridade=${encodeURIComponent(prioridade)}`);
            if (status) params.push(`status=${encodeURIComponent(status)}`);
            if (termo) params.push(`termo=${encodeURIComponent(termo)}`);

            if (params.length > 0) {
                url += `?${params.join("&")}`;
            }

            const res = await fetch(url, {
                credentials: "include",
            });

            const data = await res.json();
            setChamados(data);
        } catch (error) {
            console.error("Erro ao buscar chamados:", error);
        }
    };

    return (
        <div className="filtro-container">
            <h2>Filtro e busca Chamados</h2>
            <div className="filtros">
                <select value={setor} onChange={(e) => setSetor(e.target.value)}>
                    <option value="">Todos os Setores</option>
                    {setores.map((s, index) => (
                        <option key={index} value={s}>{s}</option>
                    ))}
                </select>

                <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
                    <option value="">Todas as Prioridades</option>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                </select>

                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Todos os Status</option>
                    <option value="aberto">Aberto</option>
                    <option value="em_atendimento">Em Andamento</option>
                    <option value="resolvido">Resolvido</option>
                </select>

                <input
                    type="text"
                    placeholder="Buscar por Título ou Descrição"
                    value={termo}
                    onChange={(e) => setTermo(e.target.value)}
                />

                <button onClick={buscarChamados}>Buscar</button>
            </div>

            {chamados.length === 0 ? (
                <p>Nenhum Chamado Encontrado com os Filtros Atuais</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Setor</th>
                            <th>Prioridade</th>
                            <th>Status</th>
                            <th>Data Abertura</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chamados.map((chamado) => (
                            <tr key={chamado.id}>
                                <td>{chamado.id}</td>
                                <td>{chamado.titulo}</td>
                                <td>{chamado.setor}</td>
                                <td>{chamado.prioridade}</td>
                                <td>{chamado.status}</td>
                                <td>{new Date(chamado.dataAbertura).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}