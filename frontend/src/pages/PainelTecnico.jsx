import { useEffect, useState } from "react";
import ChamadoCard from "../components/ChamadoCard";
import { useAuth } from "../context/AuthContext";
import "../styles/PainelTecnico.css";

export default function PainelTecnico() {
    const [chamados, setChamados] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.id) {
            carregarMeusChamados();
        } else if (!user) {
            setMensagem("Usuário não autenticado. Por favor, faça login.");
        }
    }, [user]);

    const carregarMeusChamados = async () => {
        setLoading(true);
        setMensagem("");

        try {
            const response = await fetch("http://localhost:4000/api/chamados/meus-chamados", {
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
                setMensagem("Nenhum chamado direcionado a você ou em atendimento.");
            }
        } catch (error) {
            console.error("Erro ao carregar chamados:", error);
            setMensagem("Erro de conexão ao carregar chamados.");
            setChamados([]);
        } finally {
            setLoading(false);
        }
    };

    const tecnicoAceitarChamadoHandler = async (chamadoId) => {
        setLoading(true);
    try {
        const response = await fetch(`http://localhost:4000/api/chamados/${chamadoId}/aceitar`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (response.ok) {
            alert("Chamado Iniciado!");
            carregarMeusChamados();
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
    

    const resolverChamado = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/api/chamados/${id}/resolver`, {
                method: "PUT",
                headers: {},
                credentials: "include",
            });

            if (response.ok) {
                await carregarMeusChamados();
            } else {
                const data = await response.json();
                setMensagem(data.message || "Erro ao resolver chamado.");
            }
        } catch (error) {
            console.error("Erro ao resolver chamado", error);
            setMensagem("Erro de conexão ao resolver chamado.");
        }
    };

    return (
        <div className="painel-container">
            <h2>Meus Chamados</h2>
            {mensagem && <p>{mensagem}</p>}
            {loading && <p>Carregando Chamados...</p>}
            {!loading && Array.isArray(chamados) && chamados.length > 0 && (
                chamados.map((chamado) => (
                    <ChamadoCard
                        key={chamado.id}
                        chamado={chamado}
                        onTecnicoAceitar={tecnicoAceitarChamadoHandler}
                        onAdminAutoAtribuir={() => {}}
                        onResolver={resolverChamado}
                    />
                ))
            )}

            {!loading && chamados.length === 0 && !mensagem && (
                <p>Nenhum chamado em aberto ou em atendimento.</p>
            )}
        </div>
    );
}