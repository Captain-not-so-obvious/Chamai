import { useState } from "react";
import "../styles/ChamadoCard.css";
import "../styles/PainelTecnico.css";

export default function ChamadoCard({ chamado, onAtribuir, onResolver, onAlterarPrioridade }) {
    const [novaPrioridade, setNovaPrioridade] = useState(chamado.prioridade);

    const handleAlterarPrioridade = () => {
        if (novaPrioridade !== chamado.prioridade) {
            onAlterarPrioridade(chamado.id, novaPrioridade);
        }
    };

    return (
        <div className="card-animado chamado-card">
            <h4>{chamado.titulo}</h4>
            <p><strong>Descrição:</strong> {chamado.descricao}</p>
            <p><strong>Solicitante:</strong> {chamado.solicitante?.nome}</p>
            <p><strong>Setor:</strong> {chamado.solicitante?.setor}</p>
            {chamado.tecnico && (
                <p><strong>Técnico Responsável:</strong>{chamado.tecnico.nome}</p>
            )}
            <p><strong>Prioridade:</strong> {chamado.prioridade}</p>
            <p><strong>Status:</strong> {chamado.status}</p>
            <p><strong>Aberto em:</strong> {new Date(chamado.dataAbertura).toLocaleString()}</p>

            {chamado.status !== "resolvido" && (
                <div className="botoes">
                    {!chamado.tecnicoId && (
                        <button onClick={() => onAtribuir(chamado.id)}>Atribuir a mim</button>
                    )}

                    {chamado.tecnicoId && (
                        <>
                            <button onClick={() => onResolver(chamado.id)}>Resolver</button>

                            {/* Se quiser, pode fazer só o técnico atribuído poder alterar */}
                            <div className="alterar-prioridade">
                                <select
                                    value={novaPrioridade}
                                    onChange={(e) => setNovaPrioridade(e.target.value)}
                                >
                                    <option value="baixa">Baixa</option>
                                    <option value="media">Média</option>
                                    <option value="alta">Alta</option>
                                    <option value="critica">Crítica</option>
                                </select>
                                <button onClick={handleAlterarPrioridade}>Alterar Prioridade</button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
