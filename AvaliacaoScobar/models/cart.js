const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('aberto', 'fechado', 'pago'),
            allowNull: false,
            defaultValue: 'aberto',
        },
    }, {
        tableName: 'cart',
        timestamps: false,
    });

    return Cart;
};
