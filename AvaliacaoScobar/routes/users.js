// routes/users.js

var express = require('express');
var router = express.Router();
// Importar dependências para o funcionamento da classe User
const db = require('../models'); // Carregando o banco de dados

// Importar as classes service e controller da user
const UserService = require('../services/userService');
const UserController = require('../controllers/userController');
const { checkAuthentication } = require('../middlewares/authMiddleware');  // Importa o middleware de autenticação


// Construir os objetos a partir das classes
const userService = new UserService(db.User);
const userController = new UserController(userService);

// Rota de login
router.post('/login', async (req, res) => {
  userController.login(req, res);
});
// No seu backend (por exemplo, usando Express.js)
// Rota para criar um novo usuário
router.post('/novouser', async (req, res) => {
  userController.createUser(req, res);  // Chama o método do controlador para criação de usuário
});

// Rota para pegar todos os usuários
router.get('/allusers', checkAuthentication, async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    if (Array.isArray(users)) {
      res.status(200).json(users);  // Enviar os usuários em formato JSON
    } else {
      res.status(500).json({ message: 'Erro: O serviço não retornou um array de usuários.' });
    }
  } catch (error) {
    console.error('Erro na rota /users/allusers:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários.', error: error.message });
  }
});

// Rota para retornar um usuário pelo id (ajuste aqui)
router.get('/getUserById/:id', checkAuthentication,async (req, res) => { // Alterado para receber o ID na URL
  userController.findUserById(req, res);
});

module.exports = router;