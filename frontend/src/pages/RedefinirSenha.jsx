import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/RedefinirSenha.css";

export default function RedefinirSenha() {
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [token, setToken] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenURL = queryParams.get("token");
        if (!tokenURL) {
            setMensagem("Token Inválido ou expirado");
        } else {
            setToken(tokenURL);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("");

        if (novaSenha !== confirmarSenha) {
            setMensagem("As senhas não coincidem.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/auth/redefinir-senha", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, novaSenha }),
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem("Senha redefinida com sucesso! Redirecionando para o login...");
                setTimeout(() => navigate("/login"), 3000);
            } else {
                setMensagem(data.message || "Erro ao redefinir senha.");
            }
        } catch (error) {
                console.error("Erro ao redefinir senha:", error);
                setMensagem("Erro de conexão com o servidor.");
        }
    };

    return (
        <div className="redefine-container">
            <form className="redefine-form" onSubmit={handleSubmit}>
                <h2>Redefinir Senha</h2>
                {mensagem && <p className="redefine-message">{mensagem}</p>}

                <input
                    type="password"
                    placeholder="Nova Senha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirmar Nova Senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                />
                <button type="submit">Redefinir Senha</button>
                <button
                    type="button"
                    className="voltar-button"
                    onClick={() => navigate("/login")}
                >
                    Voltar ao Login
                </button>
            </form>
        </div>
    );
}