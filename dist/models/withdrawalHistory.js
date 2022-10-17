"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalHistoryInstance = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
class WithdrawalHistoryInstance extends sequelize_1.Model {
}
exports.WithdrawalHistoryInstance = WithdrawalHistoryInstance;
WithdrawalHistoryInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Amount is required',
            },
            notEmpty: {
                msg: 'Amount field cannot be empty',
            },
        },
    },
    accountNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Account number is required',
            },
            notEmpty: {
                msg: 'Account number field cannot be empty',
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
    userId: {
        type: sequelize_1.DataTypes.UUIDV4,
    },
}, {
    sequelize: database_config_1.default,
    modelName: 'Balance',
});
//# sourceMappingURL=withdrawalHistory.js.map