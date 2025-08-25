import { useState } from "react";
import apiFetch from "../services/api";
import "../styles/CadastroTecnico.css";

export default function CadastroTecnico() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("");

        if (senha !== confirmarSenha) {
            setMensagem("As senhas não são iguais. Por favor, verifique.");
            return;
        }

        try {
            const data = await apiFetch("/usuarios/tecnicos", {
                method: "POST",
                body: { nome, email, senha },
            });

            setMensagem(data.mensagem || "Técnico cadastrado com sucesso!");
            setNome("");
            setEmail("");
            setSenha("");
            setConfirmarSenha("");
        } catch (error) {
            console.error("Erro ao cadastrar técnico:", error);
            setMensagem(error.message || "Erro de conexão");
        }
    };

    return (
        <div className="cadastro-tecnico-container">
            <h2>Cadastro de Técnico</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nome do Técnico"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email do Técnico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirmar Senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                />
                <button type="submit">Cadastrar Técnico</button>
            </form>
            {mensagem && <p className="mensagem">{mensagem}</p>}
        </div>
    );
}