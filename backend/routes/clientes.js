var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');

// Conectando ao banco de dados SQLite
const db = new sqlite3.Database('./database/database.db');

/* Criação da tabela clientes */
db.run(`CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  data_nascimento TEXT NOT NULL,
  contato TEXT,
  cep TEXT,
  logradouro TEXT,
  complemento TEXT,
  bairro TEXT,
  estado TEXT
)`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela clientes:', err);
  } else {
    console.log('Tabela clientes criada com sucesso!');
  }
});

/* POST clientes - Cadastrar um novo cliente */
router.post('/', (req, res) => {
  console.log(req.body);
  const { nome, email, data_nascimento, contato, cep, logradouro, complemento, bairro, estado } = req.body;

  db.run(`INSERT INTO clientes (nome, email, data_nascimento, contato, cep, logradouro, complemento, bairro, estado)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nome, email, data_nascimento, contato, cep, logradouro, complemento, bairro, estado],
    (err) => {
      if (err) {
        console.error('Erro ao criar o cliente:', err);
        return res.status(500).send({ error: 'Erro ao criar o cliente' });
      } else {
        res.status(201).send({ message: 'Cliente criado com sucesso' });
      }
    });
});

/* GET clientes - Listar todos os clientes */
router.get('/', (req, res) => {
  db.all(`SELECT * FROM clientes`, (err, clientes) => {
    if (err) {
      console.error('Erro ao buscar clientes:', err);
      return res.status(500).send({ error: 'Erro ao buscar clientes' });
    } else {
      res.status(200).send(clientes);
    }
  });
});

/* GET cliente por ID */
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM clientes WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error('Erro ao buscar cliente:', err);
      return res.status(500).json({ error: 'Erro ao buscar cliente' });
    } if (!row) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.status(200).json(row);
  });
});

/* PUT cliente por ID - Atualizar todos os dados */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, data_nascimento, contato, cep, logradouro, complemento, bairro, estado } = req.body;

  db.run(`UPDATE clientes SET nome = ?, email = ?, data_nascimento = ?, contato = ?, cep = ?, logradouro = ?, complemento = ?, bairro = ?, estado = ? WHERE id = ?`,
    [nome, email, data_nascimento, contato, cep, logradouro, complemento, bairro, estado, id],
    function(err) {
      if (err) {
        console.error('Erro ao atualizar o cliente:', err);
        return res.status(500).json({ error: 'Erro ao atualizar o cliente' });
      } if (this.changes === 0) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      res.status(200).json({ message: 'Cliente atualizado com sucesso' });
    });
});

/* PATCH cliente - Atualização parcial */
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
  }

  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  db.run(`UPDATE clientes SET ${setClause} WHERE id = ?`, [...values, id], function(err) {
    if (err) {
      console.error('Erro ao atualizar o cliente parcialmente:', err);
      return res.status(500).json({ error: 'Erro ao atualizar o cliente parcialmente' });
    } if (this.changes === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.status(200).json({ message: 'Cliente atualizado parcialmente com sucesso' });
  });
});

/* DELETE cliente */
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM clientes WHERE id = ?`, [id], function(err) {
    if (err) {
      console.error('Erro ao deletar o cliente:', err);
      return res.status(500).json({ error: 'Erro ao deletar o cliente' });
    } if (this.changes === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.status(200).json({ message: 'Cliente deletado com sucesso' });
  });
});

module.exports = router;
