import { useEffect, useState } from "react";
import ChamadoCard from "../components/ChamadoCard";
import { jwtDecode } from "jwt-decode";

export default function PainelTecnico() {
    const [chamados, setChamados] = useState([]);
    const [tecnicoId, setTecnicoId] = useState(null);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMensagem("Usuário não autenticado.");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setTecnicoId(decoded.id);
            carregarChamados(token);
        } catch (err) {
            setMensagem("Token inválido.");
        }
    }, []);

    const [loading, setloading] = useState(false);

    const carregarChamados = async (token) => {
        setloading(true);
        try {
            const response = await fetch("http://localhost:3000/chamados/status/aberto", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setChamados(data);
        } catch (error) {
            setMensagem("Erro ao carregar chamados.");
        } finally {
            setloading(false);
        }
    };

    const atribuirChamado = async (id) => {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:3000/chamados/${id}/atribuir`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ tecnicoId }),
        });
        await carregarChamados(token);
    };

    const resolverChamado = async (id) => {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:3000/chamados/${id}/resolver`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        await carregarChamados(token);
    };

    return (
        <div className="painel-container">
            <h2>Chamados em Aberto</h2>
            {mensagem && <p>{mensagem}</p>}
            {loading && <p>Carregando chamados...</p>}
            {chamados.map((chamado) => (
                <ChamadoCard
                    key={chamado.id}
                    chamado={chamado}
                    onAtribuir={atribuirChamado}
                    onResolver={resolverChamado}
                />
            ))}
        </div>
    );
}