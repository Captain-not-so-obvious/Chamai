import { useEffect, useState } from "react";
import ChamadoCard from "../components/ChamadoCard";
import { useAuth } from "../context/AuthContext";
import "../styles/PainelTecnico.css";


export default function PainelAdmin() {
    const [chamados, setChamados] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [setorFiltro, setSetorFiltro] = useState('');
    const [prioridadeFiltro, setPrioridadeFiltro] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');
    const [loading, setLoading] = useState(false); // Corrigido

    const { user } = useAuth();

    useEffect(() => {
        // A lógica do admin sempre carrega todos os chamados na montagem
        carregarTodosChamados();
    }, []); // ⬅️ A requisição é feita apenas uma vez, na montagem do componente

    const carregarTodosChamados = async () => {
        setLoading(true);
        setMensagem("");

        try {
            const response = await fetch("http://localhost:3000/api/chamados?status_ne=resolvido", {
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Erro Desconhecido" }));
                setMensagem(errorData.message || "Erro ao carregar chamados.");
                setChamados([]);
                return;
            }

            const data = await response.json();
            setChamados(data);
            if (data.length === 0) {
                setMensagem("Nenhum chamado encontrado.");
            }
        } catch (error) {
            console.error("Erro ao carregar chamados:", error);
            setMensagem("Erro de conexão ao carregar chamados.");
            setChamados([]);
        } finally {
            setLoading(false);
        }
    };


    const buscarChamadosComFiltros = async () => {
        setLoading(true);

        try {
            const params = new URLSearchParams();

            if (setorFiltro) params.append("setor", setorFiltro);
            if (prioridadeFiltro) params.append("prioridade", prioridadeFiltro);
            if (statusFiltro) params.append("status", statusFiltro);
            
            const response = await fetch(`http://localhost:3000/api/chamados/filtro-busca?${params.toString()}`, {
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "Erro desconhecido" }));
                setMensagem(errorData.message || "Erro ao buscar chamados com filtros.");
                setChamados([]);
                return;
            }

            const data = await response.json();
            setChamados(data);
            if (data.length === 0) {
                setMensagem("Nenhum chamado encontrado com os filtros aplicados.");
            } else {
                setMensagem("");
            }
        } catch (error) {
            console.error("Erro ao buscar chamados com filtros:", error);
            setMensagem("Erro de conexão ao buscar chamados com filtros.");
            setChamados([]);
        } finally {
            setLoading(false);
        }
    };

    const direcionarChamado = async (chamadoId, tecnicoId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/chamados/${chamadoId}/direcionar`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tecnicoId }),
                credentials: "include",
            });

            if (response.ok) {
                alert("Chamado direcionado com sucesso!");
                carregarTodosChamados();
            } else {
                const data = await response.json();
                setMensagem(data.message || "Erro ao direcionar o chamado.");
            }
        } catch (error) {
            console.error("Erro ao direcionar o chamado:", error);
            setMensagem("Erro de conexão ao direcionar o chamado.");
        } finally {
            setLoading(false);
        }
    };


      const atribuirChamado = async (id) => {

    if (!user || !user.id) {

        setMensagem("Erro: ID do técnico não disponível para atribuição.");

        return;

    }

    const tecnicoId = user.id; // ⬅️ Pegando o ID do usuário logado do contexto



    try {

        const response = await fetch(`http://localhost:3000/api/chamados/${id}/atribuir`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

            },

            body: JSON.stringify({ tecnicoId }),

            credentials: "include",

        });



        if (response.ok) {

            await carregarTodosChamados(); // Recarrega os chamados após atribuição

        } else {

            const data = await response.json();

            setMensagem(data.message || "Erro ao atribuir chamado.");

        }

    } catch (error) {

        console.error("Erro ao atribuir chamado:", error);

        setMensagem("Erro de conexão ao atribuir chamado.");

    }

  };



    const resolverChamado = async (id) => {

    try {

        const response = await fetch(`http://localhost:3000/api/chamados/${id}/resolver`, {

            method: "PUT",

            headers: {

            },

            credentials: "include",

        });



        if (response.ok) {

            await carregarTodosChamados(); // Recarrega os chamados após resolver

        } else {

            const data = await response.json();

            setMensagem(data.message || "Erro ao resolver chamado.");

        }

    } catch (error) {

        console.error("Erro ao resolver chamado:", error);

        setMensagem("Erro de conexão ao resolver chamado.");

    }

  };



    const alterarPrioridade = async (id, novaPrioridade) => {



    try {

      const response = await fetch(

        `http://localhost:3000/api/chamados/${id}/prioridade`,

        {

          method: "PUT",

          headers: {

            "Content-Type": "application/json",

          },

          body: JSON.stringify({ prioridade: novaPrioridade }),

          credentials: "include",

        }

      );



      if (response.ok) {

        alert("Prioridade alterada!");

        await carregarTodosChamados(); // Recarrega os chamados

      } else {

        const data = await response.json();

        alert(data.message || "Erro ao atualizar a prioridade!");

      }

    } catch (error) {

      console.error("Erro ao alterar prioridade:", error);

    }

  };

const adminAutoAtribuirChamado = async (chamadoId) => {
    setLoading(true);
    try {
        const response = await fetch(`http://localhost:3000/api/chamados/${chamadoId}/admin-atribuir`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (response.ok) {
            alert("Chamado Iniciado!");
            carregarTodosChamados();
        } else {
            const data = await response.json();
            setMensagem(data.message || "Erro ao iniciar chamado");
        }
    } catch (error) {
        console.error("Erro ao iniciar o chamado:", error);
        setMensagem("Erro de conexão ao se atribuir ao chamado.");
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
                    onAtribuir={atribuirChamado}
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