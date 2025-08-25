import { useEffect, useState } from "react";
import apiFetch from "../services/api";
import "../styles/FiltroBuscaChamados.css";

export default function FiltroBuscaChamados() {
    const [chamados, setChamados] = useState([]);
    const [setores, setSetores] = useState([]);
    const [prioridade, setPrioridade] = useState("");
    const [status, setStatus] = useState("");
    const [setor, setSetor] = useState("");
    const [termo, setTermo] = useState("");
    const [mensagem, setMensagem] = useState(""); // Estado para mensagens de erro ou sucesso

    useEffect(() => {
        buscarSetores();
    }, []);

    const buscarSetores = async () => {
        try {
            const data = await apiFetch("/chamados/setores");
            if (Array.isArray(data)) {
                setSetores(data);
            } else {
                throw new Error("Formato de resposta inválido para setores.");
            }
        } catch (error) {
            console.error("Erro ao buscar setores:", error.message);
            setMensagem(error.message);
            setSetores([]); // Limpa os setores em caso de erro
        }
    };

    const buscarChamados = async () => {
        setMensagem(""); // Limpa mensagens anteriores
        try {
            const params = new URLSearchParams();
            if (setor) params.append("setor", setor);
            if (prioridade) params.append("prioridade", prioridade);
            if (status) params.append("status", status);
            if (termo) params.append("termo", termo);

            const queryString = params.toString();
            const endpoint = `/chamados/filtro-busca${queryString ? `?${queryString}` : ''}`;

            const data = await apiFetch(endpoint);
            setChamados(data);
        } catch (error) {
            console.error("Erro ao buscar chamados:", error.message);
            setMensagem(error.message);
            setChamados([]); // Limpa os chamados em caso de erro
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