var express = require('express');
var router = express.Router();

const url = "http://localhost:3000/auth/login";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout', {body:'pages/login', title: 'Express', error:''});
});

router.post('/', (req, res) => {
  const { username, password } = req.body;
  console.log('aqui chega ', username, password);

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((data) => {
      console.log('veio', data);
      req.session.token = data.token;
      res.redirect('/clientes');
    })
    .catch((error) => {
      console.log('Erro', error);
      res.render('layout', { body: "pages/login", title: 'Express', error});
    });
});

module.exports = router;
