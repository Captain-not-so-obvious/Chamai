import React, { useState } from "react";
import axios from "axios";

function FormularioChamado({ usuarioId }) {
    const [formData, setFormData] = useState({
        titulo: "",
        descricao: "",
        prioridade: "baixa",
    });

    const [mensagem, setMensagem] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:3000/chamados", {
                ...formData,
                usuarioId,
            });

            setMensagem("Chamado enviado com sucesso!");
            setFormData({ titulo: "", descricao: "", prioridade: "baixa" });
        } catch (error) {
            console.error("Erro ao enviar chamado:", error);
            setMensagem("Erro ao enviar chamado.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm">
            <h2 className="mb-3">Abrir Chamado</h2>
            <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                type="text"
                className="form-control"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required />
            </div>

            <div className="mb-3">
                <label className="form-label">Descrição</label>
                <textarea
                className="form-control"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="4"
                required></textarea>
            </div>

            <div className="mb-3">
                <label className="form-label">Prioridade</label>
                <select
                className="form-select"
                name="prioridade"
                value={formData.prioridade}
                onChange={handleChange}
                >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                </select>
            </div>

            <button type="submit" className="btn btn-primary">
                Enviar Chamado
            </button>

            {mensagem && <div className="mt-3 alert alert-info">{mensagem}</div>}
        </form>
    );
}

export default FormularioChamado;