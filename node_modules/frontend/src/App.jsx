import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import PainelTecnico from "./pages/PainelTecnico";
import NovoChamado from "./pages/NovoChamado";
import RotaPrivada from "./components/RotaPrivada";

function App() {
  return (
    <div className="page-container">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/novo-chamado" />} />
          <Route path="/novo-chamado" element={<NovoChamado />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/painel-tecnico"
            element={
              <RotaPrivada>
                <PainelTecnico />
              </RotaPrivada>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;