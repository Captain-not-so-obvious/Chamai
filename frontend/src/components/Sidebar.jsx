import logo from "../assets/logo.png";
import { NavLink } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import "../styles/Sidebar.css";

export default function Sidebar() {
    const { user } = useAuth(); // Obtém o objeto de usuário

    if (!user) {
        return null;
    }


    return (
        <div className='sidebar'>
            <div className="sidebar-header">
                <img src={logo} alt="Logo Chamaí" className="sidebar-logo" />
                <h2 className="sidebar-title">Chamaí</h2>
            </div>
            <nav>
                <ul>
                    {user && (user.tipo === 'tecnico' || user.tipo === 'admin') && (
                    <li><NavLink to="/painel-tecnico">📋 Painel Técnico</NavLink></li>
                    )}

                    {user && user.tipo === 'admin' && (
                        <>
                    <li className='submenu-title'>📊 Relatórios</li>
                    <li><NavLink to="/relatorios/resolvidos">Chamados Resolvidos</NavLink></li>
                    <li><NavLink to="/relatorios/media-tecnico">Média de chamados por Técnicos</NavLink></li>
                    <li><NavLink to="/relatorios/abertos-por-usuario">Chamados Resolvidos por Usuário ou Setor</NavLink></li>
                    {/* <li><NavLink to="/relatorios/sla">Dashboard de SLA</NavLink></li> */}
                    {/* <li><NavLink to="/relatorios/exportar">Exportar Relatórios</NavLink></li> */}
                    <li><NavLink to="/relatorios/filtro-busca">Filtro e Busca</NavLink></li>
                    </>
                    )}

                    {user && user.tipo === 'admin' && (
                        <>
                    <li className='submenu-title'>👤 Cadastros</li>
                    <li><NavLink to="/cadastro-tecnico">Cadastro de Técnicos</NavLink></li>
                    {/* <li className='submenu-title'>🤖 Inteligência Artificial</li> */}
                    {/* <li><NavLink to="/ia/classificacao">Classificação Automática</NavLink></li> */}
                        </>
                    )}
                    <li><NavLink to="/">🏠 Home</NavLink></li>
                </ul>
            </nav>
        </div>
    );
}