import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import PainelTecnico from "./pages/PainelTecnico";
import PainelAdmin from "./pages/PainelAdmin";
import NovoChamado from "./pages/NovoChamado";
import RelatorioResolvidos from "./pages/RelatorioChamadosResolvidos";
import RelatorioTempoResolucao from "./pages/RelatorioTempoResolucao";
import RelatorioResolvidosPorUsuarioOuSetor from "../src/pages/RelatorioChamadosResolvidosPorUsuarioOuSetor";
import FiltroBuscaChamados from "./pages/FiltroBuscaChamados";
import CadastroTecnico from "./pages/CadastroTecnico";
import RotaPrivada from "./components/RotaPrivada";
import { AuthProvider, useAuth } from "./context/AuthContext";
import CadastroAdmin from "./pages/CadastroAdmin";

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Carregando...</div>
  if (user && user.tipo === 'admin') return <Navigate to="/painel-admin" replace />;
  if (user && user.tipo === 'tecnico') return <Navigate to="/painel-tecnico" replace />;
  return <Navigate to='/login' replace />;
};

// NOVO: Componente para Rotas Protegidas e com Layout
const RotasComLayout = ({ requiredTipo }) => {
  return (
    <RotaPrivada requiredTipo={requiredTipo}>
      <Layout>
        <Outlet />
      </Layout>
    </RotaPrivada>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/novo-chamado" element={<NovoChamado />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
          <Route path="/" element={<Navigate to="/novo-chamado" />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* ⬅️ NOVO: Estrutura de Rotas Aninhadas */}
          {/* Rotas para técnicos e admins */}
          <Route element={<RotasComLayout requiredTipo='tecnico' />}>
            <Route path="/painel-tecnico" element={<PainelTecnico />} />
          </Route>
          
          {/* Rotas exclusivas para admins */}
          <Route element={<RotasComLayout requiredTipo="admin" />}>
            <Route path="/painel-admin" element={<PainelAdmin />} />
            <Route path="/relatorios/resolvidos" element={<RelatorioResolvidos />} />
            <Route path="/relatorios/media-tecnico" element={<RelatorioTempoResolucao />} />
            <Route path="/relatorios/abertos-por-usuario" element={<RelatorioResolvidosPorUsuarioOuSetor />} />
            <Route path="/relatorios/filtro-busca" element={<FiltroBuscaChamados />} />
            <Route path="/cadastro-tecnico" element={<CadastroTecnico />} />
            <Route path="/cadastro-admin" element={<CadastroAdmin />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;