var express = require('express');
var router = express.Router();

const url = "https://zgr2l52z-3000.brs.devtunnels.ms/auth/login";

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('layout', { body: 'pages/login', title: 'Express', error: '' });
});

/* POST login */
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
      res.render('layout', { body: "pages/login", title: 'Express', error });
    });
});

/* ✅ GET logout */
router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.error('Erro ao destruir a sessão:', err);
      return res.status(500).send('Erro ao fazer logout');
    }
    res.redirect('/login');  // volta para a tela de login
  });
});

module.exports = router;
