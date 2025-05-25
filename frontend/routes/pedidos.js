var express = require('express');
var router = express.Router();
const url = "http://localhost:3000/pedidos/";

// Helper para formatar dataHora
function formatDateTime(input) {
  if (!input) return null;
  return new Date(input).toISOString().slice(0, 19).replace('T', ' ');
}

/* GET pedidos listing. */
router.get('/', async function(req, res) {
  let title = "Gestão de Pedidos";
  let cols = [
    "ID", 
    "Data e Hora",
    "Nome do Cliente",
    "Status do Pedido",
    "Forma de Pagamento",
    "Total do Pedido",
    "Observações",
    "Itens do Pedido",
    "Tipo do Pedido",
    "Endereço de Entrega",
    "Ações"
  ];

  const token = req.session.token || "";

  try {
    const response = await fetch(url, { 
      method: 'GET',
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw await response.json();
    }

    const pedidos = await response.json();
    res.render('layout', { body: "pages/pedidos", title, pedidos, cols, error: "", token });

  } catch (error) {
    console.error('Erro:', error);
    res.redirect('/login');
  }
});

/* POST new pedido. */
router.post("/", async (req, res) => {
  const token = req.session.token || "";

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

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ dataHora, cliente, statusPedido, formaPagamento, totalPedido, observacoes, itensPedido, tipoPedido, enderecoEntrega })
    });

    if (!response.ok) {
      throw await response.json();
    }

    const pedido = await response.json();
    res.send(pedido);

  } catch (error) {
    res.status(500).send(error);
  }
});

/* UPDATE pedido. */
router.put("/:id", async (req, res) => {
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

  try {
    const response = await fetch(url + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataHora, cliente, statusPedido, formaPagamento, totalPedido, observacoes, itensPedido, tipoPedido, enderecoEntrega })
    });

    if (!response.ok) {
      throw await response.json();
    }

    const pedido = await response.json();
    res.send(pedido);

  } catch (error) {
    res.status(500).send(error);
  }
});

/* DELETE pedido. */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.session.token || "";

  try {
    const response = await fetch(url + id, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw await response.json();
    }

    const pedido = await response.json();
    res.send(pedido);

  } catch (error) {
    res.status(500).send(error);
  }
});

/* GET pedido by ID. */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.session.token || "";

  try {
    const response = await fetch(url + id, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw await response.json();
    }

    const pedido = await response.json();
    res.send(pedido);

  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
