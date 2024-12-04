const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Transaction = sequelize.define('Transaction', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        valortotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        metodopayment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pendente', 'concluído', 'cancelado'),
            allowNull: false,
            defaultValue: 'pendente',
        },
    }, {
        tableName: 'transactions',
        timestamps: false, // Desativa o `createdAt` e `updatedAt`
    });

    return Transaction;
};
