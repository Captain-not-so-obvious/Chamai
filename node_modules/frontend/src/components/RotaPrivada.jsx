import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RotaPrivada({ children, requiredTipo }) {
    const { user, loading } = useAuth();


    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace/>
    }

    const hasRequiredRole = Array.isArray(requiredTipo)
        ? requiredTipo.includes(user.tipo)
        : user.tipo === requiredTipo;

    // Se o usuário não tem o tipo necessário, redireciona para o painel técnico
    if (requiredTipo && !hasRequiredRole) {
        return <Navigate to="/painel-tecnico" replace />;
    }
;
    return children;
}