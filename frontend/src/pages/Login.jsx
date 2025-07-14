import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
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
                navigate("/painel-tecnico");
            } else {
                setMensagem(data.message || "Usuário ou senha inválidos.");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            setMensagem("Erro de conexão com o servidor.");
        }
    };

    const handleRecuperarSenha = () => {
        navigate("/recuperar-senha");
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Login do Técnico</h2>

                {mensagem && <p className="login-message">{mensagem}</p>}

                <input
                    type="email"
                    placeholder="email@provedor.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                    required
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="login-input"
                    required
                />

                <button type="submit" className="login-button">Entrar</button>

                <p className="login-link">
                <a href="/recuperar-senha">Esqueci minha senha</a>
                </p>
            </form>
        </div>
    );
}
