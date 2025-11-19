const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ error: "Token necessário" });

    jwt.verify(token, "segredo", (err, decoded) => {
        if (err) return res.status(403).json({ error: "Token inválido" });

        req.user = decoded;
        next();
    });
};
