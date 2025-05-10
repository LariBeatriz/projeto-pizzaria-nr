var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./database/database.db')

/* Criação da tabela users */
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  email TEXT UNIQUE,
  phone TEXT UNIQUE)`, (err) => {
  if (err) {
    console.error('Error ao criar a tabela users:', err);
  } else {
    console.log('Tabela users criada com sucesso!');
  }
});

/* POST users. */
router.post('/register', (req, res) => {
  console.log(req.body)
  const { username, password, email, phone } = req.body;

  db.run(`INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)`, [username, password, email, phone], (err) => {
    if (err) {
      console.log('Error ao criar o usuário:', err);
      return res.status(500).send({ error: 'Erro ao criar o usuário' });
    } else {
      res.status(201).send({ message: 'Usuário criado com sucesso'});
    }
  });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.all(`SELECT * FROM users`, (err, users) => {
    if (err) {
      console.log('Error ao buscar usuários:', err);
      return res.status(500).send({ error: 'Erro ao buscar usuários' });
    } else {
      res.status(200).send(users);
    }
  });
});

/* GET user by ID */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error('Usuário não encontrado:', err);
      return res.status(500).json({ error: 'Usuário não encontrado' });
    } if (!row) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json(row);
  });
});

/* PUT user by ID */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { username, password, email, phone } = req.body;

  db.run(`UPDATE users SET username = ?, password = ?, email = ?, phone = ? WHERE id = ?`, [username, password, email, phone, id], function(err) {
    if (err) {
      console.error('Error ao atualizar o usuário:', err);
      return res.status(500).json({ error: 'Erro ao atualizar o usuário' });
    } if (!this.changes === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  });
});

/* PATCH partially update a user. */
router.patch('/:id', (req, res, next) => {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
  }

  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  db.run(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id], function(err) {
    if (err) {
      console.error('Error ao atualizar o usuário parcialmente:', err);
      return res.status(500).json({ error: 'Erro ao atualizar o usuário parcialmente' });
    } if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário atualizado parcialmente com sucesso' });
  });
});

/* DELETE a user. */
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  db.run(`DELETE FROM users WHERE id = ?`, [id], function(err) {
    if (err) {
      console.error('Error ao deletar o usuário:', err);
      return res.status(500).json({ error: 'Erro ao deletar o usuário' });
    } if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  });
});

module.exports = router;
