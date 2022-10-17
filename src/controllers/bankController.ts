import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { BankInstance } from '../models/bank';
import { addBankSchema, options } from '../utils/utils';

export async function addBank(req: Request, res: Response): Promise<unknown> {
  try {
    let id = uuidv4();
    const userId = req.user;

    const validateBank = addBankSchema.validate(req.body, options);
    if (validateBank.error) {
      return res.status(400).json({
        error: validateBank.error.details[0].message,
      });
    }
    const duplicateAcctNumber = await BankInstance.findOne({
      where: { accountNumber: req.body.accountNumber },
    });
    if (duplicateAcctNumber) {
      return res.status(409).json({
        error: 'Account number already exists',
      });
    }

    const bank = await BankInstance.create({ id, ...req.body, userId });
    res.status(201).json({
      message: 'You have successfully added a bank account',
      bank,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      error: 'Failed to add account',
      route: '/add-bank',
    });
  }
}

export async function deleteBank(req: Request, res: Response): Promise<unknown> {
  try {
    const { id } = req.params;
    const record = await BankInstance.findOne({ where: { id } });

    if (!record) {
      return res.status(404).json({
        error: 'Bank not found',
      });
    }
    const deletedBank = await record.destroy();
    return res.status(200).json({
      message: 'Bank successfully deleted',
      deletedBank,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to delete bank',
      route: '/delete-bank/:id',
    });
  }
}
