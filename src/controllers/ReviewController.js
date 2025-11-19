const db = require("../config/db");

module.exports = {
    add: (req, res) => {
        const { movie_id, classificacao, critica } = req.body;

        db.query(
            "INSERT INTO reviews (user_id, movie_id, data, classificacao, critica) VALUES (?,?,NOW(),?,?)",
            [req.user.id, movie_id, classificacao, critica],
            (err) => {
                if (err) return res.status(500).json(err);
                res.json({ message: "Review adicionada" });
            }
        );
    },

    vote: (req, res) => {
        db.query(
            "UPDATE reviews SET votos_util = votos_util + 1 WHERE id = ?",
            [req.params.id],
            (err) => {
                if (err) return res.status(500).json(err);
                res.json({ message: "Voto registado" });
            }
        );
    }
};
