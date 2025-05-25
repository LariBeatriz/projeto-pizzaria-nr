/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Endpoints para gerenciar clientes
 */

var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');
var verifyJWT = require('../auth/verify-token');

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

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - data_nascimento
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@example.com
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *               contato:
 *                 type: string
 *                 example: (11) 99999-9999
 *               cep:
 *                 type: string
 *                 example: 01001-000
 *               logradouro:
 *                 type: string
 *                 example: Rua das Flores
 *               complemento:
 *                 type: string
 *                 example: Apt 101
 *               bairro:
 *                 type: string
 *                 example: Centro
 *               estado:
 *                 type: string
 *                 example: SP
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cliente criado com sucesso
 *       500:
 *         description: Erro ao criar o cliente
 */
router.post('/', verifyJWT, (req, res) => {
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

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Retorna todos os clientes cadastrados
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *       500:
 *         description: Erro ao buscar clientes
 */
router.get('/', verifyJWT, (req, res) => {
  db.all(`SELECT * FROM clientes`, (err, clientes) => {
    if (err) {
      console.error('Erro ao buscar clientes:', err);
      return res.status(500).send({ error: 'Erro ao buscar clientes' });
    } else {
      res.status(200).send(clientes);
    }
  });
});

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Retorna um cliente específico pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Dados do cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro ao buscar cliente
 */
router.get('/:id', verifyJWT, (req, res) => {
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

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Atualiza todos os dados de um cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cliente atualizado com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro ao atualizar o cliente
 */
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

/**
 * @swagger
 * /clientes/{id}:
 *   patch:
 *     summary: Atualiza parcialmente os dados de um cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@example.com
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *               contato:
 *                 type: string
 *                 example: (11) 99999-9999
 *               cep:
 *                 type: string
 *                 example: 01001-000
 *               logradouro:
 *                 type: string
 *                 example: Rua das Flores
 *               complemento:
 *                 type: string
 *                 example: Apt 101
 *               bairro:
 *                 type: string
 *                 example: Centro
 *               estado:
 *                 type: string
 *                 example: SP
 *     responses:
 *       200:
 *         description: Cliente atualizado parcialmente com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cliente atualizado parcialmente com sucesso
 *       400:
 *         description: Nenhum campo fornecido para atualização
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro ao atualizar o cliente parcialmente
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

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Remove um cliente pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cliente deletado com sucesso
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro ao deletar o cliente
 */
router.delete('/:id', verifyJWT, (req, res) => {
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - data_nascimento
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autoincrementado do cliente
 *           example: 1
 *         nome:
 *           type: string
 *           description: Nome completo do cliente
 *           example: João Silva
 *         email:
 *           type: string
 *           format: email
 *           description: E-mail do cliente (único)
 *           example: joao@example.com
 *         data_nascimento:
 *           type: string
 *           format: date
 *           description: Data de nascimento do cliente
 *           example: 1990-01-01
 *         contato:
 *           type: string
 *           description: Telefone de contato
 *           example: (11) 99999-9999
 *         cep:
 *           type: string
 *           description: CEP do endereço
 *           example: 01001-000
 *         logradouro:
 *           type: string
 *           description: Nome da rua/avenida
 *           example: Rua das Flores
 *         complemento:
 *           type: string
 *           description: Complemento do endereço
 *           example: Apt 101
 *         bairro:
 *           type: string
 *           description: Bairro
 *           example: Centro
 *         estado:
 *           type: string
 *           description: Sigla do estado
 *           example: SP
 */

module.exports = router;