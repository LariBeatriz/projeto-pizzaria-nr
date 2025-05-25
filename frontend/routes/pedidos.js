var express = require('express');
var router = express.Router();
const url = "http://localhost:3000/pedidos/";

/* GET pedidos listing. */
router.get('/', function(req, res, next) {
  let title = "Gestão de Pedidos";
  let cols = ["ID", 
                  "Data e Hora",
                  "Nome do Cliente",
                  "Status do Pedido",
                  "Forma de Pagamento",
                  "Total do Pedido",
                  "Observações",
                  "Itens do Pedido",
                  "Tipo do Pedido",
                  "Endereço de Entrega",
                  "Ações"];
  
  const token = req.session.token || "";
  res.render('layout', { body: "pages/pedidos", title, pedidos: [], cols, error: "", token });

  fetch(url, { 
    method: 'GET',
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((pedidos) => {
      res.render('layout', { body: "pages/pedidos", title, pedidos, cols, error: "" });
    })
    .catch((error) => {
      console.log('Erro', error);
      //res.render('layout', { body: "pages/pedidos", title, error, cols, pedidos: [] });
      res.redirect('/login');
    });

});

/* POST new pedido. */
router.post("/", (req, res) => {

  const { dataHora, cliente, statusPedido, formaPagamento, totalPedido, observacoes, itensPedido, tipoPedido, enderecoEntrega } = req.body;
  const token = req.session.token || "";

  fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ dataHora, cliente, statusPedido, formaPagamento, totalPedido, observacoes, itensPedido, tipoPedido, enderecoEntrega })
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((pedido) => {
      res.send(pedido);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

});

/* UPDATE pedido. */
router.put("/:id", (req, res) => {

  const { id } = req.params;
  const { dataHora, cliente, statusPedido, formaPagamento, totalPedido, observacoes, itensPedido, tipoPedido, enderecoEntrega } = req.body;

  fetch(url + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataHora, cliente, statusPedido, formaPagamento, totalPedido, observacoes, itensPedido, tipoPedido, enderecoEntrega })
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((pedido) => {
      res.send(pedido);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

});

/* DELETE pedido. */
router.delete("/:id", (req, res) => {

  const { id } = req.params;
  const token = req.session.token || "";

  fetch(url + id, {
    method: "DELETE",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((pedido) => {
      res.send(pedido);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

});

/* GET pedido by ID. */
router.get("/:id", (req, res) => {

  const { id } = req.params;
  const token = req.session.token || "";

  fetch(url + id, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((pedido) => {
      res.send(pedido);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

});

module.exports = router;
