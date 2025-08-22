import React, { createContext, useState, useContext, useEffect, Children } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // o  estado 'user' conterá as informações do usuário logado
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/auth/me", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Erro ao verificar status de autenticação:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // No carregamento inicial, tenta verificar se o usuário já está autenticado
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Função para fazer login e atualizar o contexto
    const login = (userData) => {
        setUser(userData);
    };

    // Função para fazer logout
    const logout = async () => {
        try {
            await fetch("http://localhost:4000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            setUser(null); // Limpa o estado do usuário
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);