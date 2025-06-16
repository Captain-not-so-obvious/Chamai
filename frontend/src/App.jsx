import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import PainelTecnico from "./pages/PainelTecnico";
import NovoChamado from "./pages/NovoChamado";
import RelatorioResolvidos from "./pages/RelatorioChamadosResolvidos";
import RelatorioTempoResolucao from "./pages/RelatorioTempoResolucao";
import RelatorioResolvidosPorUsuarioOuSetor from "../src/pages/RelatorioChamadosResolvidosPorUsuarioOuSetor";
import RotaPrivada from "./components/RotaPrivada";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/novo-chamado" element={<NovoChamado />} />

        {/* Redireciona a raiz para novo-chamado */}
        <Route path="/" element={<Navigate to="/novo-chamado" />} />

        {/* Rotas privadas protegidas com Layout e Sidebar */}
        <Route 
          element={
            <RotaPrivada>
              <Layout />
            </RotaPrivada>
          }
        >
          <Route path="/painel-tecnico" element={<PainelTecnico />} />
          <Route path="/relatorios/resolvidos" element={<RelatorioResolvidos />} />
          <Route path="/relatorios/media-tecnico" element={<RelatorioTempoResolucao />} />
          <Route path="/relatorios/abertos-por-usuario" element={<RelatorioResolvidosPorUsuarioOuSetor />} />
          {/* Adicione outras rotas privadas aqui */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;