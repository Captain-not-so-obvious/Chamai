import { useEffect, useState } from "react";
import ChamadoCard from "../components/ChamadoCard";
import { jwtDecode } from "jwt-decode";
import "../styles/PainelTecnico.css";

export default function PainelTecnico() {
    const [chamados, setChamados] = useState([]);
    const [tecnicoId, setTecnicoId] = useState(null);
    const [mensagem, setMensagem] = useState("");
    const [setorFiltro, setSetorFiltro] = useState('');
    const [prioridadeFiltro, setPrioridadeFiltro] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');
    const [loading, setloading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMensagem("Usuário não autenticado.");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setTecnicoId(decoded.id);
            carregarChamados(token);
        } catch (err) {
            setMensagem("Token inválido.");
        }
    }, []);

    const carregarChamados = async (tokenParam) => {
    setloading(true);
    const token = tokenParam || localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:3000/chamados/status/aberto", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        setChamados(data);
    } catch (error) {
        console.error("Erro ao carregar chamados:", error);
        setMensagem("Erro ao carregar chamados.");
    } finally {
        setloading(false);
    }
};

    const buscarChamadosComFiltros = async (tokenParam) => {
        setloading(true);
        const token = tokenParam || localStorage.getItem("token");

        try {
            const params = new URLSearchParams();

            if (setorFiltro) params.append("setor", setorFiltro);
            if (prioridadeFiltro) params.append("prioridade", prioridadeFiltro);
            if (statusFiltro) params.append("status", statusFiltro);
            else params.append("status", "aberto");

            const response = await fetch(`http://localhost:3000/chamados/filtro-busca?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();
            setChamados(data);
        } catch (error) {
            console.error("Erro ao buscar chamados com filtros:", error);
            setMensagem("Erro ao buscar chamados com filtros.");
        } finally {
            setloading(false);
        }
    };

    const atribuirChamado = async (id) => {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:3000/chamados/${id}/atribuir`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ tecnicoId }),
        });
        await carregarChamados(token);
    };

    const resolverChamado = async (id) => {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:3000/chamados/${id}/resolver`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        await carregarChamados(token);
    };

    const alterarPrioridade = async (id, novaPrioridade) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:3000/chamados/${id}/prioridade`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ prioridade: novaPrioridade }),
            });

            if (response.ok) {
                alert("Prioridade alterada!");
                await carregarChamados(token);
            } else {
                alert("Erro ao atualizar a prioridade!");
            }
        } catch (error) {
            console.error("Erro ao alterar prioridade:", error);
        }
    };

    return (
        <div className="painel-container">
            <h2>Chamados em Aberto</h2>
            <div className="filtros-container">
                <select value={setorFiltro} onChange={(e) => setSetorFiltro(e.target.value)}>
                    <option value="">Todos os Setores</option>
                    <option value="Administrativo">Administrativo</option>
                    {/* <option value="Elétrica">Elétrica</option> */}
                    {/* <option value="Hidráulica">Hidráulica</option> */}
                    <option value="Laboratório">Laboratório</option>
                    <option value="Logística">Logística</option>
                    <option value="Manutenção">Manutenção</option>
                    {/* <option value="Obras">Obras</option>
                    <option value="Pintura">Pintura</option> */}
                    <option value="Portaria">Portaria</option>
                    {/* <option value="Envase 01">Envase 01</option>
                    <option value="Envase 02">Envase 02</option>
                    <option value="Envase Selafort">Envase Selafort</option> */}
                    <option value="Produção">Produção</option>
                    {/* <option value="Plataforma 01">Plataforma 01</option>
                    <option value="Plataforma 02">Plataforma 02</option>
                    <option value="Plataforma Selafort">Plataforma Selafort</option> */}
                    <option value="Planejamento">Planejamento</option>
                    <option value="Segurança">Segurança</option>
                    {/* <option value="Solda">Solda</option> */}
                    <option value="Qualidade">Qualidade</option>
                </select>
                <select value={prioridadeFiltro} onChange={(e) => setPrioridadeFiltro(e.target.value)}>
                    <option value="">Todas as Prioridades</option>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                </select>
                <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
                    <option value="">Todos os Status</option>
                    <option value="aberto">Aberto</option>
                    <option value="em_atendimento">Em Andamento</option>
                    <option value="resolvido">Resolvido</option>
                </select>
                <button onClick={() => buscarChamadosComFiltros()}>Filtrar</button>
            </div>
            {mensagem && <p>{mensagem}</p>}
            {loading && <p>Carregando chamados...</p>}
            {chamados.map((chamado) => (
                <ChamadoCard
                    key={chamado.id}
                    chamado={chamado}
                    onAtribuir={atribuirChamado}
                    onResolver={resolverChamado}
                    onAlterarPrioridade={alterarPrioridade}
                />
            ))}
        </div>
    );
}