/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Endpoints para gerenciar pedidos
 */

var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');
var verifyJWT = require('../auth/verify-token');

// Conectando ao banco de dados
const db = new sqlite3.Database('./database/database.db');

// Função para formatar data e hora
function formatDateTime(input) {
  if (!input) return null;
  return new Date(input).toISOString().slice(0, 19).replace('T', ' ');
}

// Criação da tabela pedidos
db.run(`
  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dataHora TEXT,
    cliente TEXT,
    statusPedido TEXT,
    formaPagamento TEXT,
    totalPedido REAL,
    observacoes TEXT,
    itensPedido TEXT,
    tipoPedido TEXT,
    enderecoEntrega TEXT
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela pedidos:', err);
  } else {
    console.log('Tabela pedidos criada com sucesso!');
  }
});

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoInput'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       500:
 *         description: Erro ao criar o pedido
 */
router.post('/', verifyJWT, (req, res) => {
  const {
    dataHora: rawDataHora,
    cliente,
    statusPedido,
    formaPagamento,
    totalPedido,
    observacoes,
    itensPedido,
    tipoPedido,
    enderecoEntrega
  } = req.body;

  const dataHora = formatDateTime(rawDataHora);

  db.run(
    `INSERT INTO pedidos (
      dataHora, cliente, statusPedido, formaPagamento, totalPedido, observacoes,
      itensPedido, tipoPedido, enderecoEntrega
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      dataHora,
      cliente,
      statusPedido,
      formaPagamento,
      totalPedido,
      observacoes,
      JSON.stringify(itensPedido),
      tipoPedido,
      enderecoEntrega
    ],
    (err) => {
      if (err) {
        console.error('Erro ao criar o pedido:', err);
        return res.status(500).send({ error: 'Erro ao criar o pedido' });
      } else {
        res.status(201).send({ message: 'Pedido criado com sucesso' });
      }
    }
  );
});

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       500:
 *         description: Erro ao buscar pedidos
 */
router.get('/', verifyJWT, (req, res) => {
  db.all(`SELECT * FROM pedidos`, (err, pedidos) => {
    if (err) {
      console.error('Erro ao buscar pedidos:', err);
      return res.status(500).send({ error: 'Erro ao buscar pedidos' });
    } else {
      const pedidosFormatados = pedidos.map((pedido) => ({
        ...pedido,
        itensPedido: JSON.parse(pedido.itensPedido || '[]'),
      }));
      res.status(200).send(pedidosFormatados);
    }
  });
});

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Obtém um pedido pelo ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Dados do pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao buscar o pedido
 */
router.get('/:id', verifyJWT, (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM pedidos WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error('Erro ao buscar o pedido:', err);
      return res.status(500).json({ error: 'Erro ao buscar o pedido' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    row.itensPedido = JSON.parse(row.itensPedido || '[]');
    res.status(200).json(row);
  });
});

/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     summary: Atualiza todos os dados de um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoInput'
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao atualizar o pedido
 */
router.put('/:id', verifyJWT, (req, res) => {
  const { id } = req.params;
  const {
    dataHora: rawDataHora,
    cliente,
    statusPedido,
    formaPagamento,
    totalPedido,
    observacoes,
    itensPedido,
    tipoPedido,
    enderecoEntrega
  } = req.body;

  const dataHora = formatDateTime(rawDataHora);

  db.run(
    `UPDATE pedidos SET
      dataHora = ?,
      cliente = ?,
      statusPedido = ?,
      formaPagamento = ?,
      totalPedido = ?,
      observacoes = ?,
      itensPedido = ?,
      tipoPedido = ?,
      enderecoEntrega = ?
    WHERE id = ?`,
    [
      dataHora,
      cliente,
      statusPedido,
      formaPagamento,
      totalPedido,
      observacoes,
      JSON.stringify(itensPedido),
      tipoPedido,
      enderecoEntrega,
      id
    ],
    function (err) {
      if (err) {
        console.error('Erro ao atualizar o pedido:', err);
        return res.status(500).json({ error: 'Erro ao atualizar o pedido' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      res.status(200).json({ message: 'Pedido atualizado com sucesso' });
    }
  );
});

/**
 * @swagger
 * /pedidos/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               statusPedido: "Em preparo"
 *               formaPagamento: "PIX"
 *               totalPedido: 150.00
 *     responses:
 *       200:
 *         description: Pedido atualizado parcialmente com sucesso
 *       400:
 *         description: Nenhum campo fornecido para atualização
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao atualizar o pedido parcialmente
 */
router.patch('/:id', verifyJWT, (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  if (fields.dataHora) {
    fields.dataHora = formatDateTime(fields.dataHora);
  }

  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
  }

  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  db.run(`UPDATE pedidos SET ${setClause} WHERE id = ?`, [...values, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar o pedido parcialmente:', err);
      return res.status(500).json({ error: 'Erro ao atualizar o pedido parcialmente' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.status(200).json({ message: 'Pedido atualizado parcialmente com sucesso' });
  });
});

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Remove um pedido pelo ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao deletar o pedido
 */
router.delete('/:id', verifyJWT, (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM pedidos WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error('Erro ao deletar o pedido:', err);
      return res.status(500).json({ error: 'Erro ao deletar o pedido' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.status(200).json({ message: 'Pedido deletado com sucesso' });
  });
});

/**
 * @swagger
 * components:
 *   schemas:
 *     PedidoInput:
 *       type: object
 *       required:
 *         - cliente
 *         - statusPedido
 *         - formaPagamento
 *         - totalPedido
 *         - itensPedido
 *       properties:
 *         dataHora:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T12:00:00"
 *         cliente:
 *           type: string
 *           example: "João Silva"
 *         statusPedido:
 *           type: string
 *           example: "Em preparo"
 *         formaPagamento:
 *           type: string
 *           example: "Cartão de Crédito"
 *         totalPedido:
 *           type: number
 *           example: 99.99
 *         observacoes:
 *           type: string
 *           example: "Sem cebola"
 *         itensPedido:
 *           type: array
 *           items:
 *             type: string
 *         tipoPedido:
 *           type: string
 *           example: "Entrega"
 *         enderecoEntrega:
 *           type: string
 *           example: "Rua das Flores, 123"
 *     Pedido:
 *       allOf:
 *         - $ref: '#/components/schemas/PedidoInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 */

module.exports = router;
