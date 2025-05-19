var express = require('express');
var router = express.Router();
const url = "http://localhost:3000/produtos/";

/* GET produtos listing. */
router.get('/', function(req, res, next) {
  
  fetch(url, { method: 'GET' })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((produtos) => {
      let title = "Gestão de Produtos";
      let cols = ["ID", "Nome", "Descrição", "Categoria", "Preço", "Tamanho", "Ações"];
      res.render('layout', { body: "pages/produtos", title, produtos, cols, error: "" });
    })
    .catch((error) => {
      console.log('Erro', error);
      res.render('layout', { body: "pages/produtos", title, error });
    });

});

/* POST new produto. */
router.post("/", (req, res) => {

  const { nome, descricao, categoria, preco, tamanho } = req.body;

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, descricao, categoria, preco, tamanho })
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((produto) => {
      res.send(produto);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

});

/* UPDATE produto. */
router.put("/:id", (req, res) => {

  const { id } = req.params;
  const { nome, descricao, categoria, preco, tamanho } = req.body;

  fetch(url + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, descricao, categoria, preco, tamanho })
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((produto) => {
      res.send(produto);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

});

/* DELETE produto. */
router.delete("/:id", (req, res) => {

  const { id } = req.params;

  fetch(url + id, {
    method: "DELETE"
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((produto) => {
      res.send(produto);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

});

/* GET produto by ID. */
router.get("/:id", (req, res) => {

  const { id } = req.params;

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
    .then((produto) => {
      res.send(produto);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

});

module.exports = router;
