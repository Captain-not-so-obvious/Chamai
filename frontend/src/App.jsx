import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NovoChamado from "./pages/NovoChamado";

function App() {
  return (
    <div className="page-container">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/novo-chamado" />} />
          <Route path="/novo-chamado" element={<NovoChamado />} />
        </Routes>
      </Router>
    </div>
  );
}


export default App;