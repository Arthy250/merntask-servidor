//Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

//iniciar sesión
//Type: POST
// api/auth
router.post('/',
  authController.autenticarUsuario
);

router.get('/',
  auth,
  authController.usuarioAutenticado
)

module.exports = router;