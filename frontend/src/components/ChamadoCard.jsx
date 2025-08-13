import { useEffect, useState } from "react";
import HistoricoChamado from "./HistoricoChamado";
import { useAuth } from "../context/AuthContext";
import "../styles/ChamadoCard.css";

export default function ChamadoCard({ chamado, onAtribuir, onResolver, onAlterarPrioridade, onDirecionar }) {
    const [novaPrioridade, setNovaPrioridade] = useState(chamado.prioridade);
    const [mostrarHistorico, setMostrarHistorico] = useState(false);
    const [tecnicos, setTecnicos] = useState([]);
    const [tecnicoSelecionado, setTecnicoSelecionado] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.tipo === 'admin') {
            fetch("http://localhost:3000/usuarios/tecnicos", { credentials: "include" })
                .then(res => res.json())
                .then(data => setTecnicos(data))
                .catch(err => console.error("Erro ao buscar técnicos:", err));
        }
    }, [user]);

    const handleAlterarPrioridade = () => {
        if (novaPrioridade !== chamado.prioridade) {
            onAlterarPrioridade(chamado.id, novaPrioridade);
        }
    };
    
    const handleDirecionarChamado = () => {
        if (tecnicoSelecionado) {
            onDirecionar(chamado.id, tecnicoSelecionado);
        } else {
            alert("Por favor, selecione um técnico.");
        }
    };

    const isTecnico = user?.tipo === 'tecnico';
    const isAdmin = user?.tipo === 'admin';

    // Ações são permitidas apenas se o chamado não estiver resolvido
    const isChamadoAtivo = chamado.status !== "resolvido";

    return (
        <div className="card-animado chamado-card">
            <h4>{chamado.titulo}</h4>
            <p><strong>Descrição:</strong> {chamado.descricao}</p>
            <p><strong>Solicitante:</strong> {chamado.solicitante?.nome}</p>
            <p><strong>Setor:</strong> {chamado.solicitante?.setor}</p>
            {chamado.tecnico && (
                <p><strong>Técnico Responsável:</strong> {chamado.tecnico.nome}</p>
            )}
            {chamado.tecnicoDirecionado && (
                <p><strong>Direcionado a:</strong> {chamado.tecnicoDirecionado.nome}</p>
            )}
            <p><strong>Prioridade:</strong> {chamado.prioridade}</p>
            <p><strong>Status:</strong> {chamado.status}</p>
            <p><strong>Aberto em:</strong> {new Date(chamado.dataAbertura).toLocaleString()}</p>
            
            {isChamadoAtivo && (
                <div className="botoes">
                    {/* Botão de Atribuir: Admins e Técnicos podem usar. */}
                    {chamado.status === "aberto" && (isAdmin || isTecnico) && (
                        <button onClick={() => onAtribuir(chamado.id)}>Iniciar Chamado</button>
                    )}
                    {isTecnico && chamado.status === "aguardando_atribuicao" && chamado.tecnicoDirecionadoId === user.id && (
                        <button onClick={() => onAtribuir(chamado.id)}>Iniciar Chamado</button>
                    )}
                    
                    {/* Botão de Resolver: Admins e Técnicos podem usar. */}
                    {chamado.status === "em_atendimento" && (isAdmin || (isTecnico && chamado.tecnicoId === user.id)) && (
                        <button onClick={() => onResolver(chamado.id)}>Resolver Chamado</button>
                    )}
                    
                    {/* Ações Exclusivas para Admin */}
                    {isAdmin && (
                        <>
                            <div className="direcionar-chamado">
                                <select
                                    value={tecnicoSelecionado}
                                    onChange={(e) => setTecnicoSelecionado(e.target.value)}
                                >
                                    <option value="">Direcionar para...</option>
                                    {tecnicos.map(tecnico => (
                                        <option key={tecnico.id} value={tecnico.id}>{tecnico.nome}</option>
                                    ))}
                                </select>
                                <button onClick={handleDirecionarChamado}>Direcionar</button>
                            </div>

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
            
            {/* Adicionar e Visualizar Comentários: Apenas Técnicos e Admins */}
            {(isTecnico || isAdmin) && (
                <div className="historico-toggle">
                    <button
                        onClick={() => setMostrarHistorico(!mostrarHistorico)}
                        className="botao-ver-historico"
                    >
                        {mostrarHistorico ? "Fechar Histórico" : "Ver Histórico"}
                    </button>
                </div>
            )}

            {/* Apenas mostra o componente se houver permissão */}
            {(isTecnico || isAdmin) && mostrarHistorico && <HistoricoChamado chamadoId={chamado.id} />}
        </div>
    );
}