import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';

interface WithdrawalHistoryAttributes {
  id: string;
  status: boolean;
  amount: number;
  accountNumber: string;
  bankName: string;
  userId: string;
}

export class WithdrawalHistoryInstance extends Model<WithdrawalHistoryAttributes> {}

WithdrawalHistoryInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    amount: {
      type: DataTypes.FLOAT,
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
      type: DataTypes.STRING,
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
    userId: {
      type: DataTypes.UUIDV4,
    },
  },
  {
    sequelize: db,
    modelName: 'Balance',
  },
);
