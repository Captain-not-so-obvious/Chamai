import { useEffect, useState } from "react";
import ChamadoCard from "../components/ChamadoCard";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../services/api";
import "../styles/PainelTecnico.css";

export default function PainelTecnico() {
    const [chamados, setChamados] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

 const carregarMeusChamados = useCallback(async () => {
        setLoading(true);
        setMensagem("");
        try {
            // 2. Usamos o apiFetch para carregar os chamados do técnico
            const data = await apiFetch("/chamados/meus-chamados");
            setChamados(data);
            if (data.length === 0) {
                setMensagem("Nenhum chamado direcionado a você ou em atendimento.");
            }
        } catch (error) {
            setMensagem(error.message || "Erro ao carregar seus chamados.");
            setChamados([]);
        } finally {
            setLoading(false);
        }
    }, []); // A função só será recriada se 'user' mudar

    useEffect(() => {
        if (user && user.id) {
            carregarMeusChamados();
        } else if (!user) {
            setMensagem("Usuário não autenticado. Por favor, faça login.");
        }
    }, [user, carregarMeusChamados]);

    const tecnicoAceitarChamadoHandler = async (chamadoId) => {
        setLoading(true);
        try {
            await apiFetch(`/chamados/${chamadoId}/aceitar`, {method: "PUT"});
            alert("Chamado iniciado!");
            carregarMeusChamados(); // Recarrega os chamados após aceitar
        } catch (error) {
            setMensagem(error.message || "Erro ao iniciar o chamado.");
        } finally {
            setLoading(false);
        }
    };
    

    const resolverChamado = async (id) => {
        try {
            await apiFetch(`/chamados/${id}/resolver`, {method: "PUT"});
            carregarMeusChamados(); // Recarrega os chamados após resolver
        } catch (error) {
            setMensagem(error.message || "Erro ao resolver o chamado.");
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