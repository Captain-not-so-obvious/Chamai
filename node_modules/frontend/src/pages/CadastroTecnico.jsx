import { useState } from "react";
import "../styles/CadastroTecnico.css";

export default function CadastroTecnico() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (senha !== confirmarSenha) {
            setMensagem("As senhas não são iguais. Por favor, verifique.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/usuarios/tecnicos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ nome, email, senha })
            });

            if (response.ok) {
                setMensagem("Técnico cadastrado com sucesso!");
                setNome("");
                setEmail("");
                setSenha("");
                setConfirmarSenha("");
            } else {
                const data = await response.json();
                setMensagem(data.mensagem || "Erro ao cadastrar técnico.");
            }
        } catch (error) {
            console.error("Erro ao cadastrar técnico:", error);
            setMensagem("Erro de conexão.");
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