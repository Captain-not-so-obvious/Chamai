import { useEffect, useState } from "react";
import ChamadoCard from "../components/ChamadoCard";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../services/api";
import "../styles/PainelTecnico.css";


export default function PainelAdmin() {
    const [chamados, setChamados] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [setorFiltro, setSetorFiltro] = useState('');
    const [prioridadeFiltro, setPrioridadeFiltro] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        // A lógica do admin sempre carrega todos os chamados na montagem
        carregarTodosChamados();
    }, []); // ⬅️ A requisição é feita apenas uma vez, na montagem do componente

    const carregarTodosChamados = async () => {
        setLoading(true);
        setMensagem("");

        try {
            const data = await apiFetch("/chamados?status_ne=resolvido");
            setChamados(data);
            if (data.length === 0) {
                setMensagem("Nenhum chamado ativo encontrado");
            }
        } catch (error) {
            setMensagem(error.message || "Erro ao carregar chamados");
            setChamados([]);
        } finally {
            setLoading(false);
        }
    };


    const buscarChamadosComFiltros = async () => {
        setLoading(true);
        setMensagem("");
        try {
            const params = new URLSearchParams();
            if (setorFiltro) params.append("setor", setorFiltro);
            if (prioridadeFiltro) params.append("prioridade", prioridadeFiltro);
            if (statusFiltro) params.append("status", statusFiltro);

            const endpoint = `/chamados/filtro-busca?${params.toString()}`;
            const data = await apiFetch(endpoint);
            setChamados(data);
            if (data.length === 0) {
                setMensagem("Nenhum chamado encontrado com os filtros aplicados.");
            }
        } catch (error) {
            setMensagem(error.message || "Erro ao buscar chamados com filtros");
            setChamados([]);
        } finally {
            setLoading(false);
        }
    };

    const direcionarChamado = async (chamadoId, tecnicoId) => {
        try {
            await apiFetch(`/chamados/${chamadoId}/direcionar`, {
                method: "PUT",
                body: { tecnicoId },
            });
            alert("Chamado direcionado com sucesso!");
            carregarTodosChamados();
        } catch (error) {
            setMensagem(error.message || "Erro ao direcionar chamado.");
        }
    };

    const resolverChamado = async (id) => {
        try {
            await apiFetch(`/chamados/${id}/resolver`, { method: "PUT" });
            carregarTodosChamados();
        } catch (error) {
            setMensagem(error.message || "Erro ao resolver chamado.");
        }
    };

    const alterarPrioridade = async (id, novaPrioridade) => {
        try {
            await apiFetch(`/chamados/${id}/prioridade`, {
                method: "PUT",
                body: { prioridade: novaPrioridade },
            });
            alert("Prioridade alterada com sucesso!");
            carregarTodosChamados();
        } catch (error) {
            alert(error.message || "Erro ao atualizar a prioridade");
        }
    };

    const adminAutoAtribuirChamado = async (chamadoId) => {
        setLoading(true);
        try {
            await apiFetch(`/chamados/${chamadoId}/admin-atribuir`, { method: "PUT" });
            alert("Chamado iniciado!");
            carregarTodosChamados();
        } catch (error) {
            setMensagem(error.message || "Erro ao iniciar chamado");
        } finally {
            setLoading(false);
        }
    };



    return (

        <div className="painel-container">

            <h2>Painel do Administrador</h2>

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
                    onResolver={resolverChamado}
                    onAlterarPrioridade={alterarPrioridade}
                    onDirecionar={direcionarChamado}
                    onAdminAutoAtribuir={adminAutoAtribuirChamado}
                    onTecnicoAceitar={() => {}}
                />
            ))}
        </div>
    );
}