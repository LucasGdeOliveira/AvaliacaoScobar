const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Produtos = sequelize.define('Produtos', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false, // Nome do produto é obrigatório
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true, // Descrição é opcional
        },
        preco: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false, // Preço é obrigatório
            validate: {
                isDecimal: true, // Garante que o preço seja decimal
                min: 0, // Preço não pode ser negativo
            },
        },
        estoque: {
            type: DataTypes.INTEGER,
            allowNull: false, // Estoque é obrigatório
            validate: {
                min: 0, // Estoque não pode ser negativo
            },
        },
    }, 
    {
        tableName: 'produtos',
        timestamps: false, // Não adiciona createdAt e updatedAt automaticamente
    });
    
    return Produtos;
};
