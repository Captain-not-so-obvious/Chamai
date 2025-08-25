import { useState } from "react";
import apiFetch from "../services/api";
import "../styles/CadastroTecnico.css";

export default function CadastroAdmin() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("");

        if (senha !== confirmarSenha) {
            setMensagem("As senhas não são iguais.");
            return;
        }

        try {
            const data = await apiFetch("/usuarios/admin", {
                method: "POST",
                body: { nome, email, senha },
            });

            setMensagem(data.mensagem || "Administrador cadastrado com sucesso!");
            setNome("");
            setEmail("");
            setSenha("");
            setConfirmarSenha("");
        } catch (error) {
            console.error("Erro ao cadastrar administrador:", error);
            setMensagem(error.message || "Erro de conexão");
        }
    };

    return (
        <div className="cadastro-tecnico-container">
            <h2>Cadastro de Técnico Administrador</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nome do Técnico Administrador"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="E-mail do Técnico Administrador"
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
                <button>Cadastrar Técnico Administrador</button>
            </form>
            {mensagem && <p className="mensagem">{mensagem}</p>}
        </div>
    );
}