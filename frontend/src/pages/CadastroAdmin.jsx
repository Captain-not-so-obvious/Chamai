import { useState } from "react";
import "../styles/CadastroTecnico.css";

export default function CadastroAdmin() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (senha !== confirmarSenha) {
            setMensagem("As senhas não são iguais.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/usuarios/admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nome, email, senha }),
                credentials: "include",
            });

            if (!response.ok) {
                setMensagem("Administrador cadastrado com sucesso!");
                setNome("");
                setEmail("");
                setSenha("");
                setConfirmarSenha("");
            } else {
                const data = await response.json();
                setMensagem(data.mensagem || "Erro ao cadastrar técnico administrador.");
            }
        } catch (error) {
            console.error("Erro ao cadastrar técnico administrador:", error);
            setMensagem("Erro de conexão");
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