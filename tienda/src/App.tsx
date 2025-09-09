import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PaginaPrincipal from "./pages/Pagina-Principal";
import Admin from "./pages/Admin";
import Crear from "./pages/Crear";
import Recuperar from "./pages/Recuperar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/crear" element={<Crear />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/principal" element={<PaginaPrincipal />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;