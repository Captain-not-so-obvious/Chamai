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
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/chamados", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setChamados(data);
        } catch (error) {
            setMensagem("Erro ao carregar chamados.");
        } finally {
            setLoading(false);
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
        <div>
            <h2>Painel do Técnico</h2>
            {mensagem && <p>{mensagem}</p>}
            {chamados.length === 0 && !mensagem && <p>Carregando chamados...</p>}
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