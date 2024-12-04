// ./controllers/userController.js

class UserController {
  constructor(UserService) {
      this.userService = UserService;
  }

  // Função para criar um usuário
  async createUser(req, res) {
      const { email, name, password } = req.body;  // Pega os dados do corpo da requisição

      if (!email || !name || !password) {
          return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
      }

      try {
          // Chama o serviço para criar o usuário
          const user = await this.userService.create(email, name, password);
          res.status(201).json({ 
              id: user.id, 
              message: 'Usuário criado com sucesso!',
              user: {
                  id: user.id,
                  name: user.name,
                  email: user.email
              }
          });
      } catch (error) {
          console.error("Erro ao criar usuário:", error);
          res.status(500).json({ error: error.message });
      }
  }

  // Função para listar todos os usuários
  async findAllUsers(req, res) {
      try {
          const users = await this.userService.getAllUsers(); // Deve retornar um array
          res.status(200).json(users); // Resposta com os usuários
      } catch (error) {
          console.error('Erro ao buscar usuários:', error);
          res.status(500).json({ message: 'Erro ao buscar usuários.', error: error.message });
      }
  }

  // Função para encontrar um usuário pelo ID
  async findUserById(req, res) {
      const { id } = req.params; // Pega o ID da URL

      try {
          // Usando o serviço para buscar o usuário
          const user = await this.userService.getUserById(id);

          if (!user) {
              return res.status(404).json({ message: 'Usuário não encontrado' });
          }

          res.status(200).json(user);
      } catch (error) {
          console.error('Erro ao buscar usuário:', error);
          res.status(500).json({ message: 'Erro ao buscar o usuário.', error: error.message });
      }
  }

  // Função de login
  async login(req, res) {
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).json({ message: 'Por favor, forneça o email e a senha.' });
      }

      try {
          // Chama o serviço de login
          const { user, token } = await this.userService.login(email, password);

          // Responde com o token e informações do usuário
          res.status(200).json({
              user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
              },
              token,
          });
      } catch (error) {
          console.error("Erro ao logar usuário:", error);
          res.status(401).json({ error: error.message });
      }
  }
}

module.exports = UserController;
