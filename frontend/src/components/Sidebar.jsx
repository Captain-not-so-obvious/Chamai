import { Navlink } from 'react-router-dom';
import "../styles/Sidebar.css";

export default function Sidebar() {
    return (
        <div className='sidebar'>
            <h2 className='sidebar-title'>Chamaí</h2>
            <nav>
                <ul>
                    <li><NavLink to="/painel-tecnico">📋 Painel Técnico</NavLink></li>
                    <li className='submenu-title'>📊 Relatórios</li>
                    <li><Navlink to="/relatorios/resolvidos">Chamados Resolvidos</Navlink></li>
                    <li><Navlink to="/relatorios/media-tecnico">Média de chamados por Técnicos</Navlink></li>
                    <li><Navlink to="/relatorios/abertos-por-usuario">Chamados Abertos por Usuário</Navlink></li>
                    <li><Navlink to="/relatorios/sla">Dashboard de SLA</Navlink></li>
                    <li><Navlink to="/relatorios/exportar">Exportar Relatórios</Navlink></li>
                    <li><Navlink to="/relatorios/filtro-busca">Filtro e Busca</Navlink></li>
                    <li className='submenu-title'>🤖 Inteligência Artificial</li>
                    <li><Navlink to="/ia/classificacao">Classificação Automática</Navlink></li>
                    <li><Navlink to="/">🏠 Home</Navlink></li>
                </ul>
            </nav>
        </div>
    );
}