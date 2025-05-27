import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();

    const handlesubmit = async (e) => {
        e.preventDefault();
        setMensagem("");

        try {
            const response = await fetch("http://localhost:3000/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                setMensagem("Login realizado com sucesso!");

                // Redireciona para o painel do técnico
                navigate("/painel-tecnico");
            } else {
                setMensagem(data.message || "Erro ao fazer login");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handlesubmit}>
                <h2>Login do Técnico</h2>
                {mensagem && <p className="login-message">{mensagem}</p>}
                <input
                    type="email"
                    placeholder="email@provedor.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}