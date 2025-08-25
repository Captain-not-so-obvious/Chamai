import React, { createContext, useState, useContext, useEffect } from 'react';
import apiFetch from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // o  estado 'user' conterá as informações do usuário logado
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const data = await apiFetch('/auth/me');
            setUser(data.user);
        } catch (error) {
            console.error("Sessão não encontrada ou expirada.");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Função para fazer login e atualizar o contexto
    const login = (userData) => {
        setUser(userData);
    };

    // Função para fazer logout
    const logout = async () => {
        try {
            await apiFetch('/auth/logout', {
                method: 'POST',
            });
            setUser(null);
        } catch (error) {
            console.error("Erro ao fazer logout:", error.message);
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