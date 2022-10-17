import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';

interface BankAttributes {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  userId: string;
  bankCode: string;
}

export class BankInstance extends Model<BankAttributes> {}

BankInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    accountName: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
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
      type: DataTypes.UUIDV4,
    },
  },
  {
    sequelize: db,
    modelName: 'Bank',
  },
);
