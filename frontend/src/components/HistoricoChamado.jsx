import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "../styles/HistoricoChamado.css"

export default function HistoricoChamado({ chamadoId }) {
    const [historico, setHistorico] = useState([]);
    const [novoComentario, setNovoComentario] = useState("");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        carregarHistorico();
    }, [chamadoId]);

    const carregarHistorico = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:3000/historico/${chamadoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setHistorico(data);
            } else {
                setMensagem(data.message || "Nenhum histórico encontrado");
            }
        } catch (err) {
            setMensagem("Erro ao buscar histórico.");
        }
    };

    const adicionarComentario = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:3000/historico/${chamadoId}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ descricao: novoComentario }),
            });

            if (res.ok) {
                setNovoComentario("");
                await carregarHistorico();
            } else {
                const erro = await res.json();
                setMensagem(erro.message || "Erro ao adicionar comentário.");
            }
        } catch (err) {
            setMensagem("Erro ao adicionar comentário.");
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
                            {new Date(h.dataEvento || h.createdAt).toLocaleString()}
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
