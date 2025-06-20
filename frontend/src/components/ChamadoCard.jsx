import "../styles/ChamadoCard.css";
import "../styles/PainelTecnico.css";

export default function ChamadoCard({ chamado, onAtribuir, onResolver }) {
    return (
        <div className="card-animado chamado-card">
            <h4>{chamado.titulo}</h4>
            <p><strong>Descrição:</strong>{chamado.descricao}</p>
            <p><strong>Solicitante:</strong>{chamado.solicitante?.nome}</p>
            <p><strong>Setor:</strong>{chamado.solicitante?.setor}</p>
            <p><strong>Prioridade:</strong> {chamado.prioridade}</p>
            <p><strong>Status:</strong> {chamado.status}</p>
            <p><strong>Aberto em:</strong> {new Date(chamado.dataAbertura).toLocaleString()}</p>

            {chamado.status !== "resolvido" && (
                <div className="botoes">
                    {!chamado.tecnicoId && (
                        <button onClick={() => onAtribuir(chamado.id)}>Atribuir a mim</button>
                    )}
                    {chamado.tecnicoId && (
                        <button onClick={() => onResolver(chamado.id)}>Resolver</button>
                    )}
                </div>
            )}
        </div>
    );
}