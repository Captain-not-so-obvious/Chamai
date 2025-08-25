import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import apiFetch from "../services/api";
import "../styles/global.css";

export default function FormularioChamado() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [prioridade, setPrioridade] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [setor, setSetor] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome || !email || !titulo || !descricao || !prioridade || !setor) {
            setMensagem("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const data = await apiFetch("/chamados", {
                method: "POST",
                body: {
                    solicitanteNome: nome,
                    solicitanteEmail: email,
                    titulo,
                    descricao,
                    prioridade,
                    setor,
                },
            });

            const idChamado = data.chamado.id;
            const dataAbertura = new Date(data.chamado.dataAbertura).toLocaleDateString("pt-BR");
            setMensagem(`Chamado #${idChamado} aberto com sucesso em ${dataAbertura}.`);

            // Limpa o formulário
            setNome("");
            setEmail("");
            setTitulo("");
            setDescricao("");
            setPrioridade("");
            setSetor("");
        } catch (error) {
            setMensagem(error.message || "Erro de conexão com o servidor.");
        }
    };

    return (
        <div className="form-container">
            <img src={logo} alt="Logo Chamaí" className="form-logo"/>
            <h2>Abrir Novo Chamado</h2>
            {mensagem && <p className="message">{mensagem}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Seu Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="seuemail@provedor.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Título do chamado"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />
                <textarea
                    placeholder="Descreva seu problema"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />
                <select
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value)}
                >
                    <option value="">Selecione a prioridade</option>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                </select>
                <select
                    value={setor}
                    onChange={(e) => setSetor(e.target.value)}
                    >
                    <option value="">Selecione o Setor</option>
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
                <button type="submit">Enviar Chamado</button>
            </form>
            <p className="login-link">
                <Link to="/login">Clique aqui para fazer login (apenas para técnicos)</Link>
            </p>
        </div>
    );
}