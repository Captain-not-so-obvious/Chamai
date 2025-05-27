import { useEffect, useState } from "react";

export default function RelatorioResolvidos() {
    const [chamados, setChamados] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://loaclhost:3000/chamados/resolvidos/historico", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        .then((res) => res.json())
        .then((data) => setChamados(data));
    }, []);

    return (
        <div className="relatorio-container">
            <h2 className="relatorio-titulo">Relatório de Chamados Resolvidos</h2>
            {chamados.map((chamado) => (
                <div key={chamado.id} className="chamado-card">
                    <h4 className="chamado-titulo">{chamado.titulo}</h4>
                    <p className="chamado-info">Aberto por: {chamado.usuario?.nome}</p>
                    <p className="chamado-status">Status: {chamado.status}</p>
                    <h5 className="historico-titulo">Histórico:</h5>
                    <ul className="historico-lista">
                        {chamado.historico.map((item, idx) => (
                            <li key={idx}>
                                {item.descricao} - {new Date(item.data).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}