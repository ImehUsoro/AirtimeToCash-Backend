import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UserInstance } from '../models/users';
import { BankInstance } from '../models/bank';
import {
  createUserSchema,
  options,
  generateToken,
  loginUserSchema,
  changePasswordSchema,
  userUpdateSchema,
} from '../utils/utils';
import bcrypt from 'bcryptjs';
import { emailVerificationView, forgotPasswordVerification, sendOTPNotification } from '../email/emailVerification';
import jwt from 'jsonwebtoken';
import Mailer from '../email/sendMail';
import { TransactionInstance } from '../models/transactions';

import { updateWalletSchema } from '../utils/utils';

const passPhrase = process.env.JWT_SECRETE as string;
const fromUser = process.env.FROM as string;
const subject = process.env.SUBJECT as string;
const subject2 = process.env.SUBJECT2 as string;

export async function createUser(req: Request, res: Response): Promise<unknown> {
  try {
    let newId = uuidv4();
    const validationResult = createUserSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.details[0].message,
      });
    }

    const duplicateEmail = await UserInstance.findOne({
      where: { email: req.body.email },
    });
    if (duplicateEmail) {
      return res.status(409).json({
        error: 'email is already taken',
      });
    }

    const duplicatePhoneNumber = await UserInstance.findOne({
      where: {
        phoneNumber: req.body.phoneNumber,
      },
    });

    if (duplicatePhoneNumber) {
      return res.status(409).json({
        error: 'phone number already exists',
      });
    }

    const duplicateUsername = await UserInstance.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (duplicateUsername) {
      return res.status(409).json({
        error: 'Username already taken',
      });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 8);

    const record = await UserInstance.create({
      id: newId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      avatar:
        'https://cdn-icons-png.flaticon.com/512/1160/1160040.png?w=740& t=st=1663662557~exp=1663663157~hmac=534541c319dd6da1c7554d1fabb39370d4af64705b9a26bce48c6a08c2555fd8',
      email: req.body.email,
      password: passwordHash,
      phoneNumber: req.body.phoneNumber,
      isVerified: false,
      walletBalance: 0.0,
      role: 'user',
    });

    const token = jwt.sign({ id: newId }, passPhrase, { expiresIn: '30mins' });
    const html = emailVerificationView(token);
    await Mailer.sendEmail(fromUser, req.body.email, subject, html);

    return res.status(201).json({
      message: 'User created successfully',
      record,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'error',
    });
    throw new Error(`${error}`);
  }
}

export async function createAdmin(req: Request, res: Response): Promise<unknown> {
  try {
    let newId = uuidv4();
    const validationResult = createUserSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.details[0].message,
      });
    }

    const duplicateEmail = await UserInstance.findOne({
      where: { email: req.body.email },
    });
    if (duplicateEmail) {
      return res.status(409).json({
        error: 'email is already taken',
      });
    }

    const duplicatePhoneNumber = await UserInstance.findOne({
      where: {
        phoneNumber: req.body.phoneNumber,
      },
    });

    if (duplicatePhoneNumber) {
      return res.status(409).json({
        error: 'phone number already exists',
      });
    }

    const duplicateUsername = await UserInstance.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (duplicateUsername) {
      return res.status(409).json({
        error: 'Username already taken',
      });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 8);

    const record = await UserInstance.create({
      id: newId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      avatar:
        'https://cdn-icons-png.flaticon.com/512/1160/1160040.png?w=740& t=st=1663662557~exp=1663663157~hmac=534541c319dd6da1c7554d1fabb39370d4af64705b9a26bce48c6a08c2555fd8',
      email: req.body.email,
      password: passwordHash,
      phoneNumber: req.body.phoneNumber,
      isVerified: true,
      walletBalance: 0.0,
      role: 'admin',
    });

    const token = jwt.sign({ id: newId }, passPhrase, { expiresIn: '30mins' });
    const html = emailVerificationView(token);
    await Mailer.sendEmail(fromUser, req.body.email, subject, html);

    return res.status(201).json({
      message: 'Admin created successfully',
      record,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'error',
    });
    throw new Error(`${error}`);
  }
}

export async function loginUser(req: Request, res: Response): Promise<unknown> {
  try {
    const { userInfo, password } = req.body;

    const validationResult = loginUserSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }
    let User = (await UserInstance.findOne({ where: { username: userInfo } })) as unknown as { [key: string]: string };

    if (!User) {
      User = (await UserInstance.findOne({ where: { email: userInfo } })) as unknown as { [key: string]: string };
    }

    if (!User) {
      return res.status(403).json({ error: 'User not found' });
    }

    if (!User.isVerified) {
      return res.status(403).json({ error: 'User not verified' });
    }

    const { id } = User;

    const token = generateToken({ id });

    const validUser = await bcrypt.compare(password, User.password);
    if (!validUser) {
      return res.status(401).json({ error: 'Password do not match' });
    }
    if (validUser) {
      return res.status(200).json({ message: 'Login successful', token, User });
    }
  } catch (error) {
    return res.status(500).json({
      error: 'failed to login user',
    });
    throw new Error(`${error}`);
  }
}

export async function verifyUser(req: Request, res: Response): Promise<unknown> {
  try {
    const { token } = req.params;

    const verified = jwt.verify(token, passPhrase);

    const { id } = verified as { [key: string]: string };

    const record = await UserInstance.findOne({
      where: {
        id: id,
      },
    });

    await record?.update({
      isVerified: true,
    });

    return res.status(302).redirect(`${process.env.FRONTEND_URL}/user/login`);
  } catch (error) {
    return res.status(500).json({
      error: 'Internal Server Error',
    });
    throw new Error(`${error}`);
  }
}

export async function forgotPassword(req: Request, res: Response): Promise<unknown> {
  try {
    const { email } = req.body;
    const user = (await UserInstance.findOne({
      where: {
        email: email,
      },
    })) as unknown as { [key: string]: string };

    if (!user) {
      return res.status(404).json({
        error: 'email not found',
      });
    }
    const { id } = user;
    const html = forgotPasswordVerification(id);
    await Mailer.sendEmail(fromUser, req.body.email, subject, html);

    return res.status(200).json({
      message: 'Check email for the verification link',
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
    throw new Error(`${error}`);
  }
}

export async function changePassword(req: Request, res: Response): Promise<unknown> {
  try {
    const { id } = req.params;

    const validationResult = changePasswordSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.details[0].message,
      });
    }

    const user = await UserInstance.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      return res.status(403).json({
        error: 'user does not exist',
      });
    }
    const passwordHash = await bcrypt.hash(req.body.password, 8);

    await user?.update({
      password: passwordHash,
    });
    return res.status(200).json({
      message: 'Password Successfully Changed',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
    });
    throw new Error(`${error}`);
  }
}

export async function updateUserRecord(req: Request, res: Response): Promise<unknown> {
  try {
    const { id } = req.params;
    const record = await UserInstance.findOne({ where: { id } });

    if (!record) {
      return res.status(400).json({ error: 'Invalid ID, User not found' });
    }
    if (req.body.username) {
      const check = (await UserInstance.findOne({ where: { username: req.body.username } })) as unknown as {
        [key: string]: string;
      };

      if (check && check.id !== id) {
        return res.status(403).json({ error: 'Username already taken' });
      }
    }

    const updateRecord = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      avatar: req.body.avatar,
      username: req.body.username,
    };

    const validateUpdate = userUpdateSchema.validate(updateRecord, options);

    if (validateUpdate.error) {
      return res.status(400).json({ error: validateUpdate.error.details[0].message });
    }

    const updateUserRecord = await record?.update(updateRecord);

    return res.status(200).json({
      message: 'Update Successful',
      record: updateUserRecord,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to update record',
      route: '/patch/:id',
    });
  }
}

export async function getSingleUser(req: Request, res: Response): Promise<unknown> {
  try {
    const { id } = req.params;

    const user = await UserInstance.findOne({
      where: { id },
      include: [
        {
          model: BankInstance,
          as: 'banks',
        },
        {
          model: TransactionInstance,
          as: 'transactions',
        },
      ],
    });
    return res.status(200).json({
      message: 'Successfully fetched single user',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'failed to fetch single user',
      route: '/user/:id',
    });
  }
}

export async function getAllUser(req: Request, res: Response): Promise<unknown> {
  try {
    const users = await UserInstance.findAndCountAll({
      include: [
        {
          model: BankInstance,
          as: 'banks',
        },
        {
          model: TransactionInstance,
          as: 'transactions',
        },
      ],
    });
    return res.status(200).json({
      message: 'Successfully fetched all users',
      users,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'failed to fetch single user',
      route: '/getAllUsers',
    });
  }
}

export async function sendVerificationOTP(req: Request, res: Response): Promise<unknown> {
  try {
    const id = req.user;

    const user = (await UserInstance.findOne({
      where: {
        id: id,
      },
    })) as unknown as {
      [key: string]: any;
    };

    if (!user) {
      return res.status(404).json({
        error: 'user not found',
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiration = Date.now() + 600000;

    const html = sendOTPNotification(otp);
    await Mailer.sendEmail(fromUser, user.email, subject2, html);

    await user?.update({
      otp,
      otpExpiration,
    });

    return res.status(200).json({
      message: 'OTP sent to your email',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
    });
    throw new Error(`${error}`);
  }
}

export async function creditUserWallet(req: Request, res: Response): Promise<unknown> {
  try {
    const adminID = req.user;
    const { email, amountTransferred, transactionID, otp } = req.body;

    const validateWalletBalance = updateWalletSchema.validate(req.body, options);

    if (validateWalletBalance.error) {
      return res.status(400).json({
        error: validateWalletBalance.error.details[0].message,
      });
    }

    const admin = (await UserInstance.findOne({ where: { id: adminID } })) as unknown as {
      [key: string]: any;
    };

    if (!admin) {
      return res.status(404).json({
        error: 'Admin not found',
      });
    }

    if (admin.otp !== req.body.otp) {
      return res.status(400).json({
        error: 'Invalid OTP',
      });
    }

    if (admin.otpExpiration < Date.now()) {
      return res.status(400).json({
        error: 'OTP expired',
      });
    }

    await admin?.update({
      otp: null,
      otpExpiration: null,
    });

    const record = (await UserInstance.findOne({ where: { email } })) as unknown as {
      [key: string]: any;
    };

    if (!record) {
      return res.status(400).json({
        error: 'Invalid email',
      });
    }

    const transaction = (await TransactionInstance.findOne({
      where: {
        id: transactionID,
      },
    })) as unknown as {
      [key: string]: any;
    };

    if (!transaction) {
      return res.status(400).json({
        error: 'Invalid Transaction',
      });
    }

    const updatedTransaction = await transaction?.update({
      amountToSell: amountTransferred,
      amountToReceive: amountTransferred * 0.7,
      status: 'sent',
      editedBy: admin.username,
    });

    const { walletBalance } = record;

    const newBalance = walletBalance + amountTransferred * 0.7;
    const fixedBalance = Number(newBalance.toFixed(2));
    const updatedWalletBalance = await record?.update({
      walletBalance: fixedBalance,
    });

    return res.status(200).json({
      // eslint-disable-next-line max-len
      message: `Successfully credited ${record.firstName} ${record.lastName} with N${(amountTransferred * 0.7).toFixed(
        2,
      )}`,
      updatedWalletBalance,
      record,
      updatedTransaction,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.status(500).json({
      error: 'Failed to update',
      route: './updatewallet',
    });
  }
}
