const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');  // Adicionando o pacote cors
require('dotenv').config();


const { sequelize } = require('./models');

const usersRouter = require('./routes/users');
const produtosRouter = require('./routes/produtos');
const cartRouter = require('./routes/cart');
const paymentRouter = require('./routes/payment');
const FornecedoresRouter = require('./routes/Fornecedores');


const app = express();

// Configuração de CORS para permitir requisições de localhost:3000
const corsOptions = {
    origin: 'http://localhost:3000', // Permitir apenas requisições do frontend local
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Permitir métodos HTTP específicos
    allowedHeaders: ['Content-Type', 'Authorization']  // Permitir cabeçalhos específicos
};

// Adicionando o middleware CORS ao app
app.use(cors(corsOptions));

// Configuração de middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configura as rotas da API primeiro
app.use('/users', usersRouter);  // A rota que você vai testar
app.use('/produtos', produtosRouter);
app.use('/carrinho', cartRouter);
app.use('/payment', paymentRouter);
app.use('/Fornecedores', FornecedoresRouter);


// Rota para servir o frontend após as rotas de API
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// Rota para servir a página inicial (index.html) da pasta public
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'public', 'index.html'));
});

// Função para sincronizar as tabelas no banco de dados
async function checkAndCreateTables() {
    try {
        console.log('Sincronizando tabelas com o banco de dados...');
        await sequelize.sync({ force: false });
        console.log('Tabelas sincronizadas com sucesso.');
    } catch (err) {
        console.error('Erro ao sincronizar tabelas:', err);
    }
}

// Chama a função para sincronizar tabelas antes de iniciar o servidor
checkAndCreateTables()
    .then(() => {
        const port = process.env.PORT || 8080;
        app.listen(port, (err) => {
            if (err) {
                console.error(`Erro ao iniciar o servidor na porta ${port}:`, err);
            } else {
                console.log(`Servidor rodando na porta ${port}`);
            }
        });
    })
    .catch(err => {
        console.error('Erro ao verificar as tabelas antes de iniciar o servidor:', err);
    });

module.exports = app;
