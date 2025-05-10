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

/* POST /pedidos - Criar um novo pedido */
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
      JSON.stringify(itensPedido), // Convertendo array/obj para JSON string
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

/* GET /pedidos - Listar todos os pedidos */
router.get('/', (req, res) => {
  db.all(`SELECT * FROM pedidos`, (err, pedidos) => {
    if (err) {
      console.error('Erro ao buscar pedidos:', err);
      return res.status(500).send({ error: 'Erro ao buscar pedidos' });
    } else {
      // Parse JSON dos campos de itens para facilitar
      const pedidosFormatados = pedidos.map((pedido) => ({
        ...pedido,
        itensPedido: JSON.parse(pedido.itensPedido || '[]'),
        subtotalPorItem: JSON.parse(pedido.subtotalPorItem || '[]')
      }));
      res.status(200).send(pedidosFormatados);
    }
  });
});

/* GET /pedidos/:id - Buscar pedido por ID */
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
    // Parse JSON dos campos de itens
    row.itensPedido = JSON.parse(row.itensPedido || '[]');
    row.subtotalPorItem = JSON.parse(row.subtotalPorItem || '[]');
    res.status(200).json(row);
  });
});

/* PUT /pedidos/:id - Atualizar todos os dados de um pedido */
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

/* PATCH /pedidos/:id - Atualização parcial */
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  let values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo fornecido para atualização' });
  }

  // Tratar itensPedido e subtotalPorItem se vierem para garantir que sejam JSON string
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

/* DELETE /pedidos/:id - Deletar um pedido */
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

module.exports = router;
