var express = require('express');
var router = express.Router();
const url = "https://zgr2l52z-3000.brs.devtunnels.ms/users/";

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  fetch(url, { method: 'GET' })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((users) => {
      let title = "Gestão de Usuários";
      let cols = ["ID", "Nome", "Senha", "Email", "Telefone", "Ações"];
      res.render('layout', { body: "pages/users", title, users, cols, error: "" });
    })
    .catch((error) => {
      console.log('Erro', error);
      res.render('layout', { body: "pages/users", title: "Gestão de Usuários", error });
    });

});

/* POST new user. */
router.post("/", (req, res) => {

  const { username, password, email, phone } = req.body;

  fetch(url + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email, phone })
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

});

/* UPDATE user. */
router.put("/:id", (req, res) => {

  const { id } = req.params;
  const { username, password, email, phone } = req.body;

  fetch(url + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email, phone })
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

});

/* DELETE user. */
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
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

});

/* GET user by ID. */
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
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      res.status(500).send(error);
    });

});

module.exports = router;
