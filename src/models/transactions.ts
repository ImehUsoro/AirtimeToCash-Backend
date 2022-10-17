import { DataTypes, Model } from 'sequelize';
import db from '../config/database.config';

interface TransactionAttributes {
  id: string;
  network: string;
  phoneNumber: string;
  amountToSell: number;
  amountToReceive: number;
  destinationPhoneNumber: string;
  userId: string;
  status: string;
  editedBy: string;
}

export class TransactionInstance extends Model<TransactionAttributes> {}

TransactionInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    network: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
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
      type: DataTypes.FLOAT,
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
      type: DataTypes.FLOAT,
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
      type: DataTypes.STRING,
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
      type: DataTypes.UUIDV4,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
    editedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: 'Transaction',
  },
);
