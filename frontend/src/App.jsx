import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NovoChamado from "./pages/NovoChamado";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/novo-chamado" element={<NovoChamado />} />
      </Routes>
    </Router>
  );
}

export default App;