const express = require('express');
const router = express.Router();
const ProdutosService = require('../services/produtosService');
const ProdutosController = require('../controllers/produtosController');
const db = require('../models');
const { checkAuthentication } = require('../middlewares/authMiddleware');  // Importa o middleware de autenticação

// Instancia os serviços e controladores
const produtosService = new ProdutosService(db.Produtos);
const produtosController = new ProdutosController(produtosService);

// Rota para criar produto - Somente usuários autenticados podem criar produtos
router.post('/', checkAuthentication, (req, res) => {
    return produtosController.createProduto(req, res);
});

// Rota para listar todos os produtos - Pode ser pública ou protegida, dependendo da sua lógica
router.get('/', checkAuthentication, (req, res) => {
    return produtosController.listProdutos(req, res);
});

// Rota para atualizar produto - Somente usuários autenticados podem atualizar
router.put('/:id', checkAuthentication, (req, res) => {
    return produtosController.updateProduto(req, res);
});

// Rota para deletar produto - Somente usuários autenticados podem deletar
router.delete('/:id', checkAuthentication, (req, res) => {
    return produtosController.deleteProduto(req, res);
});

module.exports = router;