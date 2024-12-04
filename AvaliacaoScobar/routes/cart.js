const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const { checkAuthentication } = require('../middlewares/authMiddleware');  // Importa o middleware de autenticação

// Adicionar produto ao carrinho (protegido por autenticação)
router.post('/add', checkAuthentication, (req, res) => CartController.addProduct(req, res));

router.delete('/remove/:productId', checkAuthentication, CartController.removeProduct); // Chama a função removeProduct
// Visualizar carrinho (protegido por autenticação)
router.get('/', checkAuthentication, (req, res) => CartController.viewCart(req, res));

module.exports = router;
