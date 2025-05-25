var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');
var jwt = require('jsonwebtoken');
var bycrypt = require('bcrypt');

const db = new sqlite3.Database('./database/database.db')

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', username, (err, row) => {
    if (!row) {
      console.log("Usuário não encontrado", err);
      return res.status(404).send({ error: 'Usuário não encontrado' });
    } else {
      bycrypt.compare(password, row.password, (err, result) => {
        if (err) {
          console.log("Erro ao comparar as senhas", err);
          return res.status(500).send({ error: 'Erro ao comparar as senhas' });
        } else if (!result) {
          return res.status(401).send({ error: 'Senha incorreta' });
        } else {
          const token = jwt.sign({ id: row.id }, 'c9466fb2ab01e267aba80cc84a526cfdd6fa0420293a8770a30bc95d25a30194', { expiresIn: '15m' });
          return res.status(200).send({ message: 'Login com sucesso', token });
        }
      });
    }
  });
});

module.exports = router;