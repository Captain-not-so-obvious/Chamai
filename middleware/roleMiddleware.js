const isAdmin = (req, res, next) => {
    if (req.usuario && req.usuario.tipo === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar esta função.' });
    }
};

const isTecnicoOrAdmin = (req, res, next) => {
    if (req.usuario && (req.usuario.tipo === 'tecnico' || req.usuario.tipo === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado. Apenas técnicos e administradores podem acessar esta função.' });
    }
};

module.exports = { isAdmin, isTecnicoOrAdmin };