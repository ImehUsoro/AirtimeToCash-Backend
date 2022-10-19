import Joi from 'joi';
import jwt from 'jsonwebtoken';

export const createUserSchema = Joi.object()
  .keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().trim().lowercase().required(),
    avatar: Joi.string(),
    isVerified: Joi.boolean(),
    password: Joi.string()
      // .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required()
      .min(4),
    phoneNumber: Joi.string()
      .length(11)
      .pattern(/^[0-9]+$/)
      .required(),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))

      .required()

      .label('Confirm password')

      .messages({ 'any.only': '{{#label}} does not match' }),
  })
  .with('password', 'confirmPassword');

export const loginUserSchema = Joi.object().keys({
  userInfo: Joi.string().trim().lowercase().required(),
  password: Joi.string().required(),
});

export const changePasswordSchema = Joi.object()
  .keys({
    password: Joi.string().required(),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))

      .required()

      .label('Confirm password')

      .messages({ 'any.only': '{{#label}} does not match' }),
  })
  .with('password', 'confirmPassword');

export const generateToken = (user: Record<string, unknown>): unknown => {
  const passPhrase = process.env.JWT_SECRETE as string;
  return jwt.sign(user, passPhrase, { expiresIn: '7d' });
};

export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: '',
    },
  },
};

export const userUpdateSchema = Joi.object().keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().trim().lowercase(),
  phoneNumber: Joi.string(),
  avatar: Joi.string(),
  username: Joi.string().lowercase(),
});

export const addBankSchema = Joi.object().keys({
  bankName: Joi.string().required(),
  accountName: Joi.string().required().messages({
    'any.required': 'Please fill in an account name',
    'string.empty': 'Please fill in an account name',
  }),
  bankCode: Joi.string().required(),
  accountNumber: Joi.string()
    .length(10)
    .regex(/^[0-9]*$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid Account Number',
      'any.required': 'Please fill in an account number',
      'string.length': 'Account number must be 10 digits',
    }),
});

export const addTransactionSchema = Joi.object().keys({
  network: Joi.string().required(),
  phoneNumber: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
  amountToSell: Joi.number().required(),
  destinationPhoneNumber: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
});

export const withdrawSchema = Joi.object().keys({
  amount: Joi.number().required(),
  accountNumber: Joi.string().required(),
  bankName: Joi.string().required(),
  bankCode: Joi.string().required(),
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string().required(),
});

export const updateWalletSchema = Joi.object().keys({
  amountTransferred: Joi.number().required(),
  email: Joi.string().trim().lowercase().required(),
  transactionID: Joi.string().required(),
  otp: Joi.number().required(),
});
