"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankInstance = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
class BankInstance extends sequelize_1.Model {
}
exports.BankInstance = BankInstance;
BankInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    accountName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Account name is required',
            },
            notEmpty: {
                msg: 'Account name field cannot be empty',
            },
        },
    },
    bankName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Bank name is required',
            },
            notEmpty: {
                msg: 'Bank name field cannot be empty',
            },
        },
    },
    bankCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Bank code is required',
            },
            notEmpty: {
                msg: 'Bank code field cannot be empty',
            },
        },
    },
    accountNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'Account number is required',
            },
            notEmpty: {
                msg: 'Account number field cannot be empty',
            },
        },
    },
    userId: {
        type: sequelize_1.DataTypes.UUIDV4,
    },
}, {
    sequelize: database_config_1.default,
    modelName: 'Bank',
});
//# sourceMappingURL=bank.js.map