const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
    register: (req, res) => {
        const { nome, email, password } = req.body;

        const hash = bcrypt.hashSync(password, 10);

        db.query(
            "INSERT INTO users (nome, email, password) VALUES (?,?,?)",
            [nome, email, hash],
            (err) => {
                if (err) return res.status(400).json(err);
                res.json({ message: "Utilizador registado" });
            }
        );
    },

    login: (req, res) => {
        const { email, password } = req.body;

        db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
            if (rows.length == 0) return res.status(404).json({ error: "User não encontrado" });

            const user = rows[0];

            if (!bcrypt.compareSync(password, user.password))
                return res.status(401).json({ error: "Password incorreta" });

            const token = jwt.sign({ id: user.id }, "segredo", { expiresIn: "24h" });

            res.json({ token });
        });
    }
}
