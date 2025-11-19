const db = require("../config/db");

module.exports = {
    getAll: (req, res) => {
        db.query("SELECT * FROM movies", (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        });
    },

    getById: (req, res) => {
        db.query("SELECT * FROM movies WHERE id = ?", [req.params.id], (err, rows) => {
            if (rows.length == 0) return res.status(404).json({ error: "Não encontrado" });
            res.json(rows[0]);
        });
    },

    create: (req, res) => {
        const { nome, sinopse, duracao, ano } = req.body;
        db.query(
            "INSERT INTO movies(nome, sinopse, duracao, ano) VALUES(?,?,?,?)",
            [nome, sinopse, duracao, ano],
            (err) => {
                if (err) return res.status(500).json(err);
                res.json({ message: "Filme criado" });
            }
        );
    }
};
