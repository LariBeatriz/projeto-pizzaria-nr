/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Endpoints para gerenciar usuários
 */

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

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário criado com sucesso
 *       500:
 *         description: Erro ao criar o usuário
 */
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

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erro ao buscar usuários
 */
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

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obter um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar o usuário
 */
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

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualizar todos os dados de um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao atualizar o usuário
 */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { username, password, email, phone } = req.body;

  db.run(`UPDATE users SET username = ?, password = ?, email = ?, phone = ? WHERE id = ?`, [username, password, email, phone, id], function(err) {
    if (err) {
      console.error('Error ao atualizar o usuário:', err);
      return res.status(500).json({ error: 'Erro ao atualizar o usuário' });
    } if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  });
});

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Atualizar parcialmente um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: novo_usuario
 *               password:
 *                 type: string
 *                 example: nova_senha123
 *               email:
 *                 type: string
 *                 format: email
 *                 example: novo@email.com
 *               phone:
 *                 type: string
 *                 example: (11) 98765-4321
 *     responses:
 *       200:
 *         description: Usuário atualizado parcialmente com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário atualizado parcialmente com sucesso
 *       400:
 *         description: Nenhum campo fornecido para atualização
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao atualizar o usuário parcialmente
 */
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

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remover um usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao remover o usuário
 */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     UserInput:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *       properties:
 *         username:
 *           type: string
 *           description: Nome de usuário único
 *           example: usuario123
 *           minLength: 3
 *           maxLength: 20
 *         password:
 *           type: string
 *           description: Senha do usuário
 *           example: senhaSegura123
 *           minLength: 6
 *         email:
 *           type: string
 *           format: email
 *           description: E-mail do usuário (único)
 *           example: usuario@example.com
 *         phone:
 *           type: string
 *           description: Telefone do usuário (opcional)
 *           example: (11) 98765-4321
 * 
 *     User:
 *       allOf:
 *         - $ref: '#/components/schemas/UserInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: ID autoincrementado do usuário
 *               example: 1
 */

module.exports = router;