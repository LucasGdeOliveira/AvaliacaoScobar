const jwt = require('jsonwebtoken'); // Para gerar tokens JWT
const bcrypt = require('bcryptjs');  // Para comparar senhas criptografadas
const { User, Cart } = require('../models'); // Certifique-se de que os modelos estão corretamente importados

require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const secret = process.env.JWT_SECRET;  // Obtém a chave secreta do arquivo .env

console.log('JWT_SECRET:', process.env.JWT_SECRET); // Verifique o valor da chave secreta


// Verificação extra para garantir que a chave secreta está carregada
if (!secret) {
    console.error("Erro: A variável JWT_SECRET não está definida no arquivo .env.");
    process.exit(1); // Encerra a aplicação caso a chave secreta não esteja configurada
}

class UserService {
    constructor() {
        this.User = User;
        this.Cart = Cart;
    }

    // Método para criar um carrinho de compras para o usuário
    async getCartByUserId(userId) {
        try {
            const cart = await this.Cart.findOne({ where: { userId, status: 'aberto' } });
            return cart;
        } catch (error) {
            console.error("Erro ao buscar carrinho do usuário:", error);
            throw error;
        }
    }

    // Método para criar um novo carrinho para o usuário
    async createCartForUser(userId) {
        try {
            const cart = await this.Cart.create({ 
                userId, 
                status: 'aberto', 
                items: [] // Inicializa o carrinho com um array vazio
            });
            return cart;
        } catch (error) {
            console.error("Erro ao criar carrinho para usuário:", error);
            throw error;
        }
    }

    // Função de criação de usuário (com senha criptografada)
    async create(email, name, password) {
        try {
            // Validação de dados (você pode adicionar mais validações aqui)
            if (!email || !name || !password) {
                throw new Error('Todos os campos são obrigatórios.');
            }

            // Criptografa a senha
            const hashedPassword = await bcrypt.hash(password, 10);

            // Cria o usuário no banco de dados
            const newUser = await this.User.create({
                email,
                name,
                password: hashedPassword,
            });

            // Remove a senha do objeto retornado para não ser exposta
            newUser.password = undefined;
            return newUser;
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            throw error;
        }
    }

    // Método para obter todos os usuários
    async getAllUsers() {
        try {
            const users = await this.User.findAll({
                attributes: ['id', 'name', 'email'], // Apenas os campos id, name, email
            });
            return users;
        } catch (error) {
            console.error('Erro no serviço getAllUsers:', error);
            throw error;
        }
    }

    // Método para pegar um usuário pelo ID
    async getUserById(id) {
        return await this.User.findOne({ where: { id } });
    }

    // Método de login
    async login(email, password) {
        try {
            // Verifica se o usuário existe no banco
            const user = await this.User.findOne({ where: { email } });
            if (!user) throw new Error('Usuário não encontrado.');

            // Verifica se a senha fornecida é válida
            const passwordValid = await bcrypt.compare(password, user.password);
            if (!passwordValid) throw new Error('Senha inválida.');

            // Gera o token JWT
            const token = jwt.sign(
                { id: user.id, email: user.email },
                secret, // Chave secreta no arquivo .env
                { expiresIn: '1h' } // Expiração de 1 hora
            );

            // Retorna o usuário e o token JWT
            return { user, token };
        } catch (error) {
            console.error("Erro ao realizar login:", error);
            throw error;  // Lança o erro para ser tratado na camada superior (Controller)
        }
    }
}

module.exports = UserService;
