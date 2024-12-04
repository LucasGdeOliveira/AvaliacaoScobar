'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '/../config/config.json'))[env];
const db = {};

let sequelize;

// Inicializa o Sequelize com base nas configurações
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Lê os arquivos do diretório atual, exceto o próprio arquivo `index.js`
fs.readdirSync(__dirname)
  .filter(file => 
    file.indexOf('.') !== 0 && // Ignora arquivos ocultos
    file !== basename &&       // Ignora o próprio index.js
    file.slice(-3) === '.js' && // Seleciona apenas arquivos .js
    !file.endsWith('.test.js') // Ignora arquivos de testes
  )
  .forEach(file => {
    // Importa cada modelo
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Configura as associações, caso existam, entre os modelos
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Inicializa e configura associações entre os modelos
const Cart = require('./cart')(sequelize, Sequelize.DataTypes);
const Produtos = require('./produtos')(sequelize, Sequelize.DataTypes);
const CartProdutos = require('./cartprodutos')(sequelize, Sequelize.DataTypes);

// Estabelece as associações
Cart.belongsToMany(Produtos, {
  through: CartProdutos,
  foreignKey: 'cartId',
  otherKey: 'produtoId',
  as: 'produtos',  // Alias para acessar os produtos
});

Produtos.belongsToMany(Cart, {
  through: CartProdutos,
  foreignKey: 'produtoId',
  otherKey: 'cartId',
  as: 'carrinhos',  // Alias para acessar os carrinhos
});

// Adiciona os modelos ao objeto `db`
db.Cart = Cart;
db.Produtos = Produtos;
db.CartProdutos = CartProdutos;

// Exporta o objeto `db` contendo os modelos e a instância do Sequelize
db.sequelize = sequelize;

module.exports = db;
