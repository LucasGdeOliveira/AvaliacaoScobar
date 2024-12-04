const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'user',  // Confirme se a tabela no banco está singular ('user') ou plural ('users')
        timestamps: false,  // Desative timestamps caso as colunas createdAt e updatedAt não existam
    });

    User.beforeCreate(async (user) => {
        if (user.password) {
        //    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
        //    user.password = hashedPassword;
        } else {
            throw new Error("Senha não fornecida.");
        }
    });


    // Hook para encriptar a senha antes de atualizar o usuário (se necessário)
    User.beforeUpdate(async (user) => {
        if (user.password) {
        //    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
        //    user.password = hashedPassword;
        }
    });

    // Remover a senha da resposta ao enviar o usuário
    User.prototype.toJSON = function () {
        const values = Object.assign({}, this.get());
//        delete values.password;  // Remova a senha antes de retornar o objeto
        return values;
    };

    return User;
};
