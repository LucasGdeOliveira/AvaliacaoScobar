// models/CartProdutos.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CartProdutos = sequelize.define('CartProdutos', {
        cartId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        produtoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,            
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false, // Nome do produto é obrigatório
        },
        quantidade: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        tableName: 'cartprodutos',
        timestamps: false,
    });

    // As associações já estão definidas nas tabelas Cart e Produtos

    return CartProdutos;
};
