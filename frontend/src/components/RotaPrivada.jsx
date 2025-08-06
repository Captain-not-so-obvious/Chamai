import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RotaPrivada({ children, requiredTipo }) {
    const { user, loading } = useAuth();

    console.log("RotaPrivada - Estado:", { user, loading, requiredTipo });

    if (loading) {
        console.log("RotaPrivada - Acesso bloqueado: loading é true");
        return <div>Carregando...</div>;
    }

    if (!user) {
        console.log("RotaPrivada - Acesso bloqueado: user é null");
        return <Navigate to="/login" replace/>
    }

    const hasRequiredRole = Array.isArray(requiredTipo)
        ? requiredTipo.includes(user.tipo)
        : user.tipo === requiredTipo;

    // Se o usuário não tem o tipo necessário, redireciona para o painel técnico
    if (requiredTipo && !hasRequiredRole) {
        console.log("RotaPrivada - Acesso bloqueado: papel não corresponde");
        return <Navigate to="/painel-tecnico" replace />;
    }

    console.log("RotaPrivada - Acesso permitido");
    return children;
}