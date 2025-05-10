var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');

// Conectando com o banco de dados
const db = new sqlite3.Database('./database/database.db');

// Criação da tabela produtos
db.run(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    descricao TEXT,
    categoria TEXT,
    preco REAL,
    tamanho TEXT
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela produtos:', err);
  } else {
    console.log('Tabela produtos criada com sucesso!');
  }
});

/* POST /produtos - Criar um novo produto */
router.post('/', (req, res) => {
  console.log(req.body);
  const { nome, descricao, categoria, preco, tamanho } = req.body;

  // Inserir no banco de dados
  db.run(
    `INSERT INTO produtos (nome, descricao, categoria, preco, tamanho) VALUES (?, ?, ?, ?, ?)`,
    [nome, descricao, categoria, preco, tamanho],
    (err) => {
      if (err) {
        console.error('Erro ao criar o produto:', err);
        return res.status(500).send({ error: 'Erro ao criar o produto' });
      } else {
        res.status(201).send({ message: 'Produto criado com sucesso' });
      }
    }
  );
});

/* GET /produtos - Listar todos os produtos */
router.get('/', (req, res) => {
  db.all(`SELECT * FROM produtos`, (err, produtos) => {
    if (err) {
      console.error('Erro ao buscar produtos:', err);
      return res.status(500).send({ error: 'Erro ao buscar produtos' });
    } else {
      res.status(200).send(produtos);
    }
  });
});

/* GET /produtos/:id - Buscar um produto pelo ID */
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM produtos WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error('Erro ao buscar o produto:', err);
      return res.status(500).json({ error: 'Erro ao buscar o produto' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.status(200).json(row);
  });
});

/* PUT /produtos/:id - Atualizar todos os dados de um produto */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nome, descricao, categoria, preco, tamanho } = req.body;

  db.run(
    `UPDATE produtos SET nome = ?, descricao = ?, categoria = ?, preco = ?, tamanho = ? WHERE id = ?`,
    [nome, descricao, categoria, preco, tamanho, id],
    function (err) {
      if (err) {
        console.error('Erro ao atualizar o produto:', err);
        return res.status(500).json({ error: 'Erro ao atualizar o produto' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      res.status(200).json({ message: 'Produto atualizado com sucesso' });
    }
  );
});

/* PATCH /produtos/:id - Atualização parcial */
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
  }

  // Criar a parte dinâmica da query
  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  db.run(
    `UPDATE produtos SET ${setClause} WHERE id = ?`,
    [...values, id],
    function (err) {
      if (err) {
        console.error('Erro ao atualizar o produto parcialmente:', err);
        return res.status(500).json({ error: 'Erro ao atualizar o produto parcialmente' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      res.status(200).json({ message: 'Produto atualizado parcialmente com sucesso' });
    }
  );
});

/* DELETE /produtos/:id - Deletar um produto */
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM produtos WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error('Erro ao deletar o produto:', err);
      return res.status(500).json({ error: 'Erro ao deletar o produto' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.status(200).json({ message: 'Produto deletado com sucesso' });
  });
});

module.exports = router;
