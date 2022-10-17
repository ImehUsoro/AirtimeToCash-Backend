import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UserInstance } from '../models/users';
import { addTransactionSchema, options } from '../utils/utils';
import { TransactionInstance } from '../models/transactions';
import { transactionNotification } from '../email/emailVerification';
import Mailer from '../email/sendMail';

const fromUser = process.env.GMAIL_USER as string;
const subject = process.env.SUBJECT2 as string;

export async function createTransaction(req: Request, res: Response): Promise<unknown> {
  try {
    let id = uuidv4();
    const userId = req.user;

    const validateTransaction = addTransactionSchema.validate(req.body, options);

    if (validateTransaction.error) {
      return res.status(400).json({
        error: validateTransaction.error.details[0].message,
      });
    }

    const amountToReceive = Number(((req.body.amountToSell * 70) / 100).toFixed(2));

    const transaction = await TransactionInstance.create({
      id,
      ...req.body,
      amountToReceive,
      userId,
      status: 'pending',
    });

    const html = transactionNotification();
    await Mailer.sendAdminEmail(fromUser, fromUser, subject, html);
    res.status(201).json({
       message: 'You have successfully made a transaction. Admin has been notified',
      transaction,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to add account',
      route: '/add-transaction',
    });
  }
}

export async function getTransactions(req: Request, res: Response): Promise<unknown> {
  try {
    const { pending } = req.query;

    if (pending === 'true') {
      const pendingRecords = await TransactionInstance.findAndCountAll({
        where: { status: 'pending' },
        include: [
          {
            model: UserInstance,
            attributes: ['id', 'walletBalance', 'email', 'username', 'phoneNumber'],
            as: 'User',
          },
        ],
      });

      return res.status(200).json({
        message: 'You have successfully retrieved all transactions',
        count: pendingRecords.count,
        record: pendingRecords.rows,
      });
    }

    const record = await TransactionInstance.findAndCountAll({
      include: [
        {
          model: UserInstance,
          attributes: ['id', 'walletBalance', 'email', 'username', 'phoneNumber'],
          as: 'User',
        },
      ],
    });

    return res.status(200).json({
      message: 'You have successfully retrieved all transactions',
      count: record.count,
      record: record.rows,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to get transactions',
      route: '/getTransactions',
    });
  }
}

export async function getOneTransaction(req: Request, res: Response): Promise<unknown> {
  try {
    const { id } = req.params;

    const record = await TransactionInstance.findOne({
      where: { id },
      include: [
        {
          model: UserInstance,
          attributes: ['id', 'walletBalance', 'email', 'username', 'phoneNumber'],
          as: 'User',
        },
      ],
    });

    if (!record) {
      return res.status(404).json({
        error: 'Transaction not found',
      });
    }

    return res.status(200).json({
      message: 'You have successfully retrieved a transaction',
      record,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to get one transaction',
      route: '/getOneTransaction',
    });
  }
}

export async function getUserTransactions(req: Request, res: Response): Promise<unknown> {
  try {
    const { pending } = req.query;
    const userId = req.user;

    if (pending === 'true') {
      const pendingRecords = await TransactionInstance.findAndCountAll({
        where: { status: 'pending', userId },
        include: [
          {
            model: UserInstance,
            attributes: ['id', 'walletBalance', 'email', 'username', 'phoneNumber'],
            as: 'User',
          },
        ],
      });

      return res.status(200).json({
        message: 'You have successfully retrieved all transactions',
        count: pendingRecords.count,
        record: pendingRecords.rows,
      });
    }

    const record = await TransactionInstance.findAndCountAll({
      where: { userId },
      include: [
        {
          model: UserInstance,
          attributes: ['id', 'walletBalance', 'email', 'username', 'phoneNumber'],
          as: 'User',
        },
      ],
    });

    return res.status(200).json({
      message: 'You have successfully retrieved all transactions',
      count: record.count,
      record: record.rows,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to get transactions',
      route: '/getUserTransactions',
    });
  }
}

export async function cancelATransaction(req: Request, res: Response): Promise<unknown> {
  try {
    const { id } = req.params;
    const adminID = req.user;

    const admin = (await UserInstance.findOne({ where: { id: adminID } })) as unknown as {
      [key: string]: any;
    };

    if (!admin) {
      return res.status(400).json({
        error: 'Admin not found',
      });
    }

    const record = (await TransactionInstance.findOne({
      where: { id },
    })) as unknown as { [key: string]: any };

    if (!record) {
      return res.status(404).json({
        error: 'Transaction not found',
      });
    }

    await record.update({ status: 'cancelled', editedBy: admin.username });

    return res.status(200).json({
      message: 'You have successfully cancelled a transaction',
      record,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to cancel a transaction',
      route: '/cancelTransaction/:id',
    });
  }
}
