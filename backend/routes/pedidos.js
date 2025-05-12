/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Endpoints para gerenciar pedidos
 */

var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');

// Conectando ao banco de dados
const db = new sqlite3.Database('./database/database.db');

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
    itensPedido TEXT, -- armazenamos como JSON string
    subtotalPorItem TEXT, -- armazenamos como JSON string
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pedido criado com sucesso
 *       500:
 *         description: Erro ao criar o pedido
 */
router.post('/', (req, res) => {
  console.log(req.body);
  const {
    dataHora,
    cliente,
    statusPedido,
    formaPagamento,
    totalPedido,
    observacoes,
    itensPedido,
    subtotalPorItem,
    tipoPedido,
    enderecoEntrega
  } = req.body;

  db.run(
    `INSERT INTO pedidos (
      dataHora, cliente, statusPedido, formaPagamento, totalPedido, observacoes,
      itensPedido, subtotalPorItem, tipoPedido, enderecoEntrega
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      dataHora,
      cliente,
      statusPedido,
      formaPagamento,
      totalPedido,
      observacoes,
      JSON.stringify(itensPedido),
      JSON.stringify(subtotalPorItem),
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
router.get('/', (req, res) => {
  db.all(`SELECT * FROM pedidos`, (err, pedidos) => {
    if (err) {
      console.error('Erro ao buscar pedidos:', err);
      return res.status(500).send({ error: 'Erro ao buscar pedidos' });
    } else {
      const pedidosFormatados = pedidos.map((pedido) => ({
        ...pedido,
        itensPedido: JSON.parse(pedido.itensPedido || '[]'),
        subtotalPorItem: JSON.parse(pedido.subtotalPorItem || '[]')
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
router.get('/:id', (req, res) => {
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
    row.subtotalPorItem = JSON.parse(row.subtotalPorItem || '[]');
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao atualizar o pedido
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    dataHora,
    cliente,
    statusPedido,
    formaPagamento,
    totalPedido,
    observacoes,
    itensPedido,
    subtotalPorItem,
    tipoPedido,
    enderecoEntrega
  } = req.body;

  db.run(
    `UPDATE pedidos SET
      dataHora = ?,
      cliente = ?,
      statusPedido = ?,
      formaPagamento = ?,
      totalPedido = ?,
      observacoes = ?,
      itensPedido = ?,
      subtotalPorItem = ?,
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
      JSON.stringify(subtotalPorItem),
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
 *             properties:
 *               dataHora:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-01-01T12:00:00Z"
 *               cliente:
 *                 type: string
 *                 example: "João Silva"
 *               statusPedido:
 *                 type: string
 *                 example: "Em andamento"
 *               formaPagamento:
 *                 type: string
 *                 example: "Cartão de Crédito"
 *               totalPedido:
 *                 type: number
 *                 format: float
 *                 example: 99.99
 *               observacoes:
 *                 type: string
 *                 example: "Entregar após as 18h"
 *               itensPedido:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produto:
 *                       type: string
 *                       example: "Camiseta"
 *                     quantidade:
 *                       type: integer
 *                       example: 2
 *                     precoUnitario:
 *                       type: number
 *                       format: float
 *                       example: 49.99
 *               subtotalPorItem:
 *                 type: array
 *                 items:
 *                   type: number
 *                   format: float
 *                   example: 99.98
 *               tipoPedido:
 *                 type: string
 *                 example: "Entrega"
 *               enderecoEntrega:
 *                 type: string
 *                 example: "Rua das Flores, 123"
 *     responses:
 *       200:
 *         description: Pedido atualizado parcialmente com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pedido atualizado parcialmente com sucesso
 *       400:
 *         description: Nenhum campo fornecido para atualização
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao atualizar o pedido parcialmente
 */
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  let values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
  }

  const updatedKeys = keys.map((key, index) => {
    if (key === 'itensPedido' || key === 'subtotalPorItem') {
      values[index] = JSON.stringify(values[index]);
    }
    return `${key} = ?`;
  }).join(', ');

  db.run(
    `UPDATE pedidos SET ${updatedKeys} WHERE id = ?`,
    [...values, id],
    function (err) {
      if (err) {
        console.error('Erro ao atualizar o pedido parcialmente:', err);
        return res.status(500).json({ error: 'Erro ao atualizar o pedido parcialmente' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }
      res.status(200).json({ message: 'Pedido atualizado parcialmente com sucesso' });
    }
  );
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pedido deletado com sucesso
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao deletar o pedido
 */
router.delete('/:id', (req, res) => {
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
 *           description: Data e hora do pedido (opcional, pode ser gerado no servidor)
 *           example: "2023-01-01T12:00:00Z"
 *         cliente:
 *           type: string
 *           description: Nome do cliente
 *           example: "João Silva"
 *         statusPedido:
 *           type: string
 *           description: Status atual do pedido
 *           example: "Em andamento"
 *           enum: ["Novo", "Em andamento", "Pronto", "Entregue", "Cancelado"]
 *         formaPagamento:
 *           type: string
 *           description: Forma de pagamento
 *           example: "Cartão de Crédito"
 *           enum: ["Dinheiro", "Cartão de Crédito", "Cartão de Débito", "PIX", "Transferência"]
 *         totalPedido:
 *           type: number
 *           format: float
 *           description: Valor total do pedido
 *           example: 99.99
 *         observacoes:
 *           type: string
 *           description: Observações adicionais sobre o pedido
 *           example: "Entregar após as 18h"
 *         itensPedido:
 *           type: array
 *           description: Lista de itens do pedido (armazenado como JSON)
 *           items:
 *             type: object
 *             properties:
 *               produto:
 *                 type: string
 *                 example: "Camiseta"
 *               quantidade:
 *                 type: integer
 *                 example: 2
 *               precoUnitario:
 *                 type: number
 *                 format: float
 *                 example: 49.99
 *         subtotalPorItem:
 *           type: array
 *           description: Subtotal por item (armazenado como JSON)
 *           items:
 *             type: number
 *             format: float
 *             example: 99.98
 *         tipoPedido:
 *           type: string
 *           description: Tipo do pedido
 *           example: "Entrega"
 *           enum: ["Retirada", "Entrega", "Mesa"]
 *         enderecoEntrega:
 *           type: string
 *           description: Endereço de entrega (se aplicável)
 *           example: "Rua das Flores, 123"
 * 
 *     Pedido:
 *       allOf:
 *         - $ref: '#/components/schemas/PedidoInput'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: ID autoincrementado do pedido
 *               example: 1
 */

module.exports = router;