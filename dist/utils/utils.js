"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWalletSchema = exports.withdrawSchema = exports.addTransactionSchema = exports.addBankSchema = exports.userUpdateSchema = exports.options = exports.generateToken = exports.changePasswordSchema = exports.loginUserSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.createUserSchema = joi_1.default.object()
    .keys({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    username: joi_1.default.string().required(),
    email: joi_1.default.string().trim().lowercase().required(),
    avatar: joi_1.default.string(),
    isVerified: joi_1.default.boolean(),
    password: joi_1.default.string()
        // .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required()
        .min(4),
    phoneNumber: joi_1.default.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required(),
    confirmPassword: joi_1.default.any()
        .equal(joi_1.default.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' }),
})
    .with('password', 'confirmPassword');
exports.loginUserSchema = joi_1.default.object().keys({
    userInfo: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string().required(),
});
exports.changePasswordSchema = joi_1.default.object()
    .keys({
    password: joi_1.default.string().required(),
    confirmPassword: joi_1.default.any()
        .equal(joi_1.default.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' }),
})
    .with('password', 'confirmPassword');
const generateToken = (user) => {
    const passPhrase = process.env.JWT_SECRETE;
    return jsonwebtoken_1.default.sign(user, passPhrase, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: '',
        },
    },
};
exports.userUpdateSchema = joi_1.default.object().keys({
    firstName: joi_1.default.string(),
    lastName: joi_1.default.string(),
    email: joi_1.default.string().trim().lowercase(),
    phoneNumber: joi_1.default.string(),
    avatar: joi_1.default.string(),
    username: joi_1.default.string().lowercase(),
});
exports.addBankSchema = joi_1.default.object().keys({
    bankName: joi_1.default.string().required(),
    accountName: joi_1.default.string().required().messages({
        'any.required': 'Please fill in an account name',
        'string.empty': 'Please fill in an account name',
    }),
    bankCode: joi_1.default.string().required(),
    accountNumber: joi_1.default.string()
        .length(10)
        .regex(/^[0-9]*$/)
        .required()
        .messages({
        'string.pattern.base': 'Invalid Account Number',
        'any.required': 'Please fill in an account number',
        'string.length': 'Account number must be 10 digits',
    }),
});
exports.addTransactionSchema = joi_1.default.object().keys({
    network: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required(),
    amountToSell: joi_1.default.number().required(),
    destinationPhoneNumber: joi_1.default.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required(),
});
exports.withdrawSchema = joi_1.default.object().keys({
    amount: joi_1.default.number().required(),
    accountNumber: joi_1.default.string().required(),
    bankName: joi_1.default.string().required(),
    bankCode: joi_1.default.string().required(),
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string().required(),
});
exports.updateWalletSchema = joi_1.default.object().keys({
    amountTransferred: joi_1.default.number().required(),
    email: joi_1.default.string().trim().lowercase().required(),
    transactionID: joi_1.default.string().required(),
    otp: joi_1.default.number().required(),
});
//# sourceMappingURL=utils.js.map