/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Endpoints para gerenciar produtos
 */

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

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoInput'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto criado com sucesso
 *       500:
 *         description: Erro ao criar o produto
 */
router.post('/', (req, res) => {
  console.log(req.body);
  const { nome, descricao, categoria, preco, tamanho } = req.body;

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

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *       500:
 *         description: Erro ao buscar produtos
 */
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

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Obtém um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Dados do produto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao buscar o produto
 */
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

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualiza todos os dados de um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoInput'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao atualizar o produto
 */
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

/**
 * @swagger
 * /produtos/{id}:
 *   patch:
 *     summary: Atualiza parcialmente os dados de um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Camiseta Premium
 *               descricao:
 *                 type: string
 *                 example: Camiseta de algodão 100%
 *               categoria:
 *                 type: string
 *                 example: Vestuário
 *               preco:
 *                 type: number
 *                 format: float
 *                 example: 99.90
 *               tamanho:
 *                 type: string
 *                 example: G
 *     responses:
 *       200:
 *         description: Produto atualizado parcialmente com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto atualizado parcialmente com sucesso
 *       400:
 *         description: Nenhum campo fornecido para atualização
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao atualizar o produto parcialmente
 */
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
  }

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

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Remove um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto deletado com sucesso
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao deletar o produto
 */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     ProdutoInput:
 *       type: object
 *       required:
 *         - nome
 *         - preco
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do produto
 *           example: Camiseta
 *         descricao:
 *           type: string
 *           description: Descrição detalhada do produto
 *           example: Camiseta de algodão 100% puro
 *         categoria:
 *           type: string
 *           description: Categoria do produto
 *           example: Vestuário
 *         preco:
 *           type: number
 *           format: float
 *           description: Preço do produto
 *           example: 49.90
 *         tamanho:
 *           type: string
 *           description: Tamanho do produto (se aplicável)
 *           example: M
 * 
 *     Produto:
 *       allOf:
 *         - $ref: '#/components/schemas/ProdutoInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: ID autoincrementado do produto
 *               example: 1
 */

module.exports = router;