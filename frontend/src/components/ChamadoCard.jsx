import { useEffect, useState } from "react";
import HistoricoChamado from "./HistoricoChamado";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../services/api";
import "../styles/ChamadoCard.css";

export default function ChamadoCard({ 
    chamado, 
    onResolver, 
    onAlterarPrioridade, 
    onDirecionar,
    onAdminAutoAtribuir,
    onTecnicoAceitar 
}) {
    const [novaPrioridade, setNovaPrioridade] = useState(chamado.prioridade);
    const [mostrarHistorico, setMostrarHistorico] = useState(false);
    const [tecnicos, setTecnicos] = useState([]);
    const [tecnicoSelecionado, setTecnicoSelecionado] = useState('');
    const { user } = useAuth();

        useEffect(() => {
        // Lógica para buscar técnicos
        const buscarTecnicos = async () => {
            try {
                const data = await apiFetch("/usuarios/tecnicos");
                setTecnicos(data);
            } catch (error) {
                console.error("Erro ao buscar técnicos:", error.message);
            }
        };

        if (user && user.tipo === 'admin') {
            buscarTecnicos();
        }
    }, [user]);

    // Handlers para os botões
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
                    
                    {/* --- AÇÕES EXCLUSIVAS DO ADMIN --- */}
                    {isAdmin && (
                        <>
                            {/* REGRA A1: Admin pode se autoatribuir se o chamado estiver aberto ou aguardando */}
                            {(chamado.status === 'aberto' || chamado.status === 'aguardando_atribuicao') && (
                                <button onClick={() => onAdminAutoAtribuir(chamado.id)}>Iniciar Chamado</button>
                            )}

                            {chamado.status === 'aberto' && (
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
                                        <select value={novaPrioridade} onChange={(e) => setNovaPrioridade(e.target.value)}>
                                            <option value="baixa">Baixa</option>
                                            <option value="media">Média</option>
                                            <option value="alta">Alta</option>
                                            <option value="critica">Crítica</option>
                                        </select>
                                        <button onClick={handleAlterarPrioridade}>Alterar</button>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* --- AÇÕES EXCLUSIVAS DO TÉCNICO --- */}
                    {isTecnico && (
                        <>
                            {chamado.status === 'aguardando_atribuicao' && chamado.tecnicoDirecionadoId === user.id && (
                                <button onClick={() => onTecnicoAceitar(chamado.id)}>Iniciar Chamado</button>
                            )}
                        </>
                    )}
                    
                    {/* Aparece para a pessoa que está com o chamado atribuído (seja admin ou técnico) */}
                    {chamado.status === 'em_atendimento' && chamado.tecnicoId === user.id && (
                        <button onClick={() => onResolver(chamado.id)}>Resolver Chamado</button>
                    )}
                </div>
            )}
            
            {/* Seção de Histórico */}
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
            {(isTecnico || isAdmin) && mostrarHistorico && <HistoricoChamado chamadoId={chamado.id} />}
        </div>
    );
}