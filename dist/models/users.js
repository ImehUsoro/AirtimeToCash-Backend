"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInstance = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
const bank_1 = require("../models/bank");
const transactions_1 = require("./transactions");
const withdrawalHistory_1 = require("./withdrawalHistory");
class UserInstance extends sequelize_1.Model {
}
exports.UserInstance = UserInstance;
UserInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'First name is required',
            },
            notEmpty: {
                msg: 'First name cannot be empty',
            },
        },
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Last name is required',
            },
            notEmpty: {
                msg: 'Last name cannot be empty',
            },
        },
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Username is required',
            },
            notEmpty: {
                msg: 'Username cannot be empty',
            },
        },
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Email is required',
            },
            notEmpty: {
                msg: 'Email cannot be empty',
            },
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Password is required',
            },
            notEmpty: {
                msg: 'Password cannot be empty',
            },
        },
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Phone number is required',
            },
            notEmpty: {
                msg: 'Phone number cannot be empty',
            },
        },
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    walletBalance: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    otp: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    otpExpiration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    sequelize: database_config_1.default,
    modelName: 'User',
});
UserInstance.hasMany(bank_1.BankInstance, { foreignKey: 'userId', as: 'banks' });
bank_1.BankInstance.belongsTo(UserInstance, { foreignKey: 'userId', as: 'User' });
UserInstance.hasMany(transactions_1.TransactionInstance, { foreignKey: 'userId', as: 'transactions' });
transactions_1.TransactionInstance.belongsTo(UserInstance, { foreignKey: 'userId', as: 'User' });
UserInstance.hasMany(withdrawalHistory_1.WithdrawalHistoryInstance, { foreignKey: 'userId', as: 'withdrawalHistory' });
withdrawalHistory_1.WithdrawalHistoryInstance.belongsTo(UserInstance, { foreignKey: 'userId', as: 'User' });
//# sourceMappingURL=users.js.map