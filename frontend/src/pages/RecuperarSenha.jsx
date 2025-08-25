import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../services/api";
import "../styles/RecuperarSenha.css";

export default function RecuperarSenha() {
    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("");

        try {
            const data = await apiFetch("/auth/recuperar-senha", {
                method: "POST",
                body: { email },
            });

            setMensagem(data.message || "E-mail de recuperação enviado! Verifique sua caixa de entrada.");
        } catch (error) {
            console.error("Erro ao recuperar senha:", error);
            setMensagem(error.message || "Erro de conexão com o servidor.");
        }
    };

    return (
        <div className="recover-container">
            <form className="recover-form" onSubmit={handleSubmit}>
                <h2>Recuperar Senha</h2>
                {mensagem && <p className="recover-message">{mensagem}</p>}
                <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Enviar Link de Recuperação</button>
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