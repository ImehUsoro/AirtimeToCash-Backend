"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionInstance = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
class TransactionInstance extends sequelize_1.Model {
}
exports.TransactionInstance = TransactionInstance;
TransactionInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    network: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Network is required',
            },
            notEmpty: {
                msg: 'Network field cannot be empty',
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
    amountToSell: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Amount to sell is required',
            },
            notEmpty: {
                msg: 'Amount to sell field cannot be empty',
            },
        },
    },
    amountToReceive: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Amount to receive is required',
            },
            notEmpty: {
                msg: 'Amount to receive field cannot be empty',
            },
        },
    },
    destinationPhoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Destination Phone number is required',
            },
            notEmpty: {
                msg: 'Destination Phone number cannot be empty',
            },
        },
    },
    userId: {
        type: sequelize_1.DataTypes.UUIDV4,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'pending',
    },
    editedBy: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: database_config_1.default,
    modelName: 'Transaction',
});
//# sourceMappingURL=transactions.js.map