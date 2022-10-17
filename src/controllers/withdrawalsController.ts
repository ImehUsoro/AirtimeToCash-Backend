import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UserInstance } from '../models/users';
import { options, withdrawSchema } from '../utils/utils';
import bcrypt from 'bcryptjs';
import { WithdrawalHistoryInstance } from '../models/withdrawalHistory';
// import got from 'got';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

export async function withdraw(req: Request, res: Response): Promise<unknown> {
  try {
    let id = uuidv4();
    const userId = req.user as string;
    const validateBank = withdrawSchema.validate(req.body, options);
    if (validateBank.error) {
      return res.status(400).json({
        error: validateBank.error.details[0].message,
      });
    }
    const { email, amount, accountNumber, bankName, password, bankCode } = req.body;

    const user = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as { [key: string]: any };

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    const userPassword = user.password as string;
    const validUser = await bcrypt.compare(password, userPassword);

    if (!validUser) {
      await WithdrawalHistoryInstance.create({
        id,
        userId,
        amount,
        accountNumber,
        bankName,
        status: false,
        // message: 'Invalid Password',
      });
      return res.status(403).json({ error: 'Password do not match' });
    }

    const balance = user.walletBalance;

    if (balance < amount) {
      await WithdrawalHistoryInstance.create({
        id,
        userId,
        amount,
        accountNumber,
        bankName,
        status: false,
        // message: 'Insufficient Balance',
      });
      return res.status(400).json({
        error: 'Insufficient funds',
      });
    }

    // Flutterwave Incorporation
    const details = {
      account_bank: bankCode,
      account_number: accountNumber,
      amount: amount,
      narration: 'Airtime to Cash Payment',
      currency: 'NGN',
      //reference: generateTransactionReference(),
      callback_url: 'https://webhook.site/b3e505b0-fe02-430e-a538-22bbbce8ce0d',
      debit_currency: 'NGN',
    };

    // eslint-disable-next-line no-console
    flw.Transfer.initiate(details).then(console.log).catch(console.log);

    const newBalance = Number((+balance - amount).toFixed(2));

    await user.update({
      walletBalance: newBalance,
    });

    await WithdrawalHistoryInstance.create({
      id,
      userId,
      amount,
      accountNumber,
      bankName,
      status: true,
      // message: 'Successful',
    });

    return res.status(200).json({
      message: 'Withdrawal successful',
      newBalance,
      user,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      error: 'Failed to withdraw',
      route: '/api/withdraw',
    });
  }
}

export async function getAllWithdrawals(req: Request, res: Response): Promise<unknown> {
  try {
    const { success } = req.query;

    if (success === 'true') {
      const withdrawals = await WithdrawalHistoryInstance.findAndCountAll({
        where: {
          status: true,
        },
        include: [
          {
            model: UserInstance,
            attributes: ['id', 'walletBalance', 'email', 'username', 'phoneNumber'],
            as: 'User',
          },
        ],
      });
      return res.status(200).json({
        message: 'You have retrieved all successful withdrawals',
        withdrawals,
      });
    }

    if (success === 'false') {
      const withdrawals = await WithdrawalHistoryInstance.findAndCountAll({
        where: {
          status: false,
        },
        include: [
          {
            model: UserInstance,
            attributes: ['id', 'walletBalance', 'email', 'username', 'phoneNumber'],
            as: 'User',
          },
        ],
      });
      return res.status(200).json({
        message: 'You have retrieved failed all withdrawals',
        withdrawals,
      });
    }

    const withdrawals = await WithdrawalHistoryInstance.findAndCountAll({
      include: [
        {
          model: UserInstance,
          attributes: ['id', 'walletBalance', 'email', 'username', 'phoneNumber'],
          as: 'User',
        },
      ],
    });
    return res.status(200).json({
      message: 'You have successfully retrieved all withdrawals',
      withdrawals,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to get withdrawals',
      route: '/getWithdrawals',
    });
  }
}

export async function getUserWithdrawals(req: Request, res: Response): Promise<unknown> {
  try {
    const { success } = req.query;
    const userId = req.user as string;

    if (success === 'true') {
      const withdrawals = await WithdrawalHistoryInstance.findAndCountAll({
        where: { userId, status: true },
        include: [
          {
            model: UserInstance,
            attributes: ['id', 'walletBalance', 'email', 'username', 'phoneNumber'],
            as: 'User',
          },
        ],
      });
      return res.status(200).json({
        withdrawals,
      });
    }

    if (success === 'false') {
      const withdrawals = await WithdrawalHistoryInstance.findAndCountAll({
        where: { userId, status: false },
        include: [
          {
            model: UserInstance,
            attributes: ['id', 'walletBalance', 'email', 'username', 'phoneNumber'],
            as: 'User',
          },
        ],
      });
      return res.status(200).json({
        withdrawals,
      });
    }

    const withdrawals = await WithdrawalHistoryInstance.findAndCountAll({
      where: { userId: userId },
      include: [
        {
          model: UserInstance,
          attributes: ['id', 'walletBalance', 'email', 'username', 'phoneNumber'],
          as: 'User',
        },
      ],
    });
    return res.status(200).json({
      message: 'You have successfully retrieved all withdrawals',
      withdrawals,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to get withdrawals',
      route: '/getUserWithdrawals',
    });
  }
}
