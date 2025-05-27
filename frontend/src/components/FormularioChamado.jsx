import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";

export default function FormularioChamado() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [prioridade, setPrioridade] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome || !email || !titulo || !descricao || !prioridade) {
            setMensagem("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/chamados", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    solicitanteNome: nome,
                    solicitanteEmail: email,
                    titulo,
                    descricao,
                    prioridade,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem("Chamado enviado com sucesso!");
                setNome("");
                setEmail("");
                setTitulo("");
                setDescricao("");
                setPrioridade("");
            } else {
                setMensagem(data.message || "Erro ao enviar chamado.");
            }
        } catch (error) {
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    return (
        <div className="form-container">
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
                <button type="submit">Enviar Chamado</button>
            </form>
            <p className="login-link">
                <Link to="/login">Clique aqui para fazer login (apenas para técnicos)</Link>
            </p>
        </div>
    );
}