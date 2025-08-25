import { useEffect, useState } from "react";
import apiFetch from "../services/api";
import "../styles/HistoricoChamado.css"

export default function HistoricoChamado({ chamadoId }) {
    const [historico, setHistorico] = useState([]);
    const [novoComentario, setNovoComentario] = useState("");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        carregarHistorico();
    }, [chamadoId]);

    const carregarHistorico = async () => {
        setCarregando(true);
        try {
            const data = await apiFetch(`/historico/${chamadoId}`);
            setHistorico(data);
            setMensagem("");
        } catch (error) {
            setMensagem(err.message || "Erro ao buscar histórico.");
        } finally {
            setcarregando(false);
        }
    };

    const adicionarComentario = async () => {
        if (!novoComentario.trim()) {
            setMensagem("O comentário não pode estar vazio.");
            return;
        }

        try {
            await apiFetch(`/historico/${chamadoId}`, {
                method: "POST",
                body: { descricao: novoComentario },
            });

            setNovoComentario(""); // Limpa o campo de texto
            await carregarHistorico(); // Recarrega o histórico
        } catch (err) {
            setMensagem(err.message || "Erro ao adicionar comentário.");
        }
    };

    return (
        <div className="historico-container">
            <h5>Histórico do Chamado</h5>
            {mensagem && <p>{mensagem}</p>}
            <ul>
                {historico.map((h) => (
                    <li key={h.id}>
                        <strong>{h.Usuario?.nome || "Autor desconhecido"}:</strong> {h.descricao}
                        <br />
                        <small>
                            {new Date(h.dataEvento || h.createdAt).toLocaleString('pt-BR')}
                        </small>
                    </li>
                ))}
            </ul>

            <textarea
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                placeholder="Adicionar Comentário..."
            />
            <button onClick={adicionarComentario}>Enviar</button>
        </div>
    );
}
