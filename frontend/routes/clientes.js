var express = require('express');
var router = express.Router();
const url = "http://localhost:3000/clientes/";

/* GET clientes listing. */
router.get('/', function(req, res, next) {
  let title = "Gestão de Clientes";
  let cols = ["ID", "Nome", "Email", "Data de Nascimento", "Contato", "CEP", "Logradouro", "Complemento", "Bairro", "Estado", "Ações"];

  const token = req.session.token || "";
  
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
    .then((clientes) => {
      res.render('layout', { body: "pages/clientes", title, clientes, cols, error: "" });
    })
    .catch((error) => {
      console.log('Erro', error);
      //res.render('layout', { body: "pages/clientes", title, error, cols, clientes: [] });
      res.redirect('/login');
    });

});

/* POST new cliente. */
router.post("/", (req, res) => {

  const { nome, email, data_nascimento, contato, cep, logradouro, complemento, bairro, estado } = req.body;
  const token = req.session.token || "";

  fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ nome, email, data_nascimento, contato, cep, logradouro, complemento, bairro, estado })
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((cliente) => {
      res.send(cliente);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

});

/* UPDATE cliente. */
router.put("/:id", (req, res) => {

  const { id } = req.params;
  const { nome, email, data_nascimento, contato, cep, logradouro, complemento, bairro, estado } = req.body;

  fetch(url + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, data_nascimento, contato, cep, logradouro, complemento, bairro, estado })
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((cliente) => {
      res.send(cliente);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

});

/* DELETE cliente. */
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
    .then((cliente) => {
      res.send(cliente);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

});

/* GET cliente by ID. */
router.get("/:id", (req, res) => {

  const { id } = req.params;
  const token = req.session.token || "";

  fetch(url + id, {
    method: "GET",
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
    .then((cliente) => {
      res.send(cliente);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

});

module.exports = router;
