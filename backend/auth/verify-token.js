var jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).send({ error: 'Token não encontrado' });
    } else {
        jwt.verify(token, 'c9466fb2ab01e267aba80cc84a526cfdd6fa0420293a8770a30bc95d25a30194', (err, user) => {
            if (err) {
                return res.status(403).send({ error: 'Token inválido' });
            } else {
                req.user = user;
                next();
            }
        });
    }  
}

module.exports = authenticateToken;