"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.creditUserWallet = exports.sendVerificationOTP = exports.getAllUser = exports.getSingleUser = exports.updateUserRecord = exports.changePassword = exports.forgotPassword = exports.verifyUser = exports.loginUser = exports.createAdmin = exports.createUser = void 0;
const uuid_1 = require("uuid");
const users_1 = require("../models/users");
const bank_1 = require("../models/bank");
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const emailVerification_1 = require("../email/emailVerification");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendMail_1 = __importDefault(require("../email/sendMail"));
const transactions_1 = require("../models/transactions");
const utils_2 = require("../utils/utils");
const passPhrase = process.env.JWT_SECRETE;
const fromUser = process.env.FROM;
const subject = process.env.SUBJECT;
const subject2 = process.env.SUBJECT2;
async function createUser(req, res) {
    try {
        let newId = uuid_1.v4();
        const validationResult = utils_1.createUserSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                error: validationResult.error.details[0].message,
            });
        }
        const duplicateEmail = await users_1.UserInstance.findOne({
            where: { email: req.body.email },
        });
        if (duplicateEmail) {
            return res.status(409).json({
                error: 'email is already taken',
            });
        }
        const duplicatePhoneNumber = await users_1.UserInstance.findOne({
            where: {
                phoneNumber: req.body.phoneNumber,
            },
        });
        if (duplicatePhoneNumber) {
            return res.status(409).json({
                error: 'phone number already exists',
            });
        }
        const duplicateUsername = await users_1.UserInstance.findOne({
            where: {
                username: req.body.username,
            },
        });
        if (duplicateUsername) {
            return res.status(409).json({
                error: 'Username already taken',
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        const record = await users_1.UserInstance.create({
            id: newId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            avatar: 'https://cdn-icons-png.flaticon.com/512/1160/1160040.png?w=740& t=st=1663662557~exp=1663663157~hmac=534541c319dd6da1c7554d1fabb39370d4af64705b9a26bce48c6a08c2555fd8',
            email: req.body.email,
            password: passwordHash,
            phoneNumber: req.body.phoneNumber,
            isVerified: false,
            walletBalance: 0.0,
            role: 'user',
        });
        const token = jsonwebtoken_1.default.sign({ id: newId }, passPhrase, { expiresIn: '30mins' });
        const html = emailVerification_1.emailVerificationView(token);
        await sendMail_1.default.sendEmail(fromUser, req.body.email, subject, html);
        return res.status(201).json({
            message: 'User created successfully',
            record,
            token,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: 'error',
        });
        throw new Error(`${error}`);
    }
}
exports.createUser = createUser;
async function createAdmin(req, res) {
    try {
        let newId = uuid_1.v4();
        const validationResult = utils_1.createUserSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                error: validationResult.error.details[0].message,
            });
        }
        const duplicateEmail = await users_1.UserInstance.findOne({
            where: { email: req.body.email },
        });
        if (duplicateEmail) {
            return res.status(409).json({
                error: 'email is already taken',
            });
        }
        const duplicatePhoneNumber = await users_1.UserInstance.findOne({
            where: {
                phoneNumber: req.body.phoneNumber,
            },
        });
        if (duplicatePhoneNumber) {
            return res.status(409).json({
                error: 'phone number already exists',
            });
        }
        const duplicateUsername = await users_1.UserInstance.findOne({
            where: {
                username: req.body.username,
            },
        });
        if (duplicateUsername) {
            return res.status(409).json({
                error: 'Username already taken',
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        const record = await users_1.UserInstance.create({
            id: newId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            avatar: 'https://cdn-icons-png.flaticon.com/512/1160/1160040.png?w=740& t=st=1663662557~exp=1663663157~hmac=534541c319dd6da1c7554d1fabb39370d4af64705b9a26bce48c6a08c2555fd8',
            email: req.body.email,
            password: passwordHash,
            phoneNumber: req.body.phoneNumber,
            isVerified: true,
            walletBalance: 0.0,
            role: 'admin',
        });
        const token = jsonwebtoken_1.default.sign({ id: newId }, passPhrase, { expiresIn: '30mins' });
        const html = emailVerification_1.emailVerificationView(token);
        await sendMail_1.default.sendEmail(fromUser, req.body.email, subject, html);
        return res.status(201).json({
            message: 'Admin created successfully',
            record,
            token,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: 'error',
        });
        throw new Error(`${error}`);
    }
}
exports.createAdmin = createAdmin;
async function loginUser(req, res) {
    try {
        const { userInfo, password } = req.body;
        const validationResult = utils_1.loginUserSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({ error: validationResult.error.details[0].message });
        }
        let User = (await users_1.UserInstance.findOne({ where: { username: userInfo } }));
        if (!User) {
            User = (await users_1.UserInstance.findOne({ where: { email: userInfo } }));
        }
        if (!User) {
            return res.status(403).json({ error: 'User not found' });
        }
        if (!User.isVerified) {
            return res.status(403).json({ error: 'User not verified' });
        }
        const { id } = User;
        const token = utils_1.generateToken({ id });
        const validUser = await bcryptjs_1.default.compare(password, User.password);
        if (!validUser) {
            return res.status(401).json({ error: 'Password do not match' });
        }
        if (validUser) {
            return res.status(200).json({ message: 'Login successful', token, User });
        }
    }
    catch (error) {
        return res.status(500).json({
            error: 'failed to login user',
        });
        throw new Error(`${error}`);
    }
}
exports.loginUser = loginUser;
async function verifyUser(req, res) {
    try {
        const { token } = req.params;
        const verified = jsonwebtoken_1.default.verify(token, passPhrase);
        const { id } = verified;
        const record = await users_1.UserInstance.findOne({
            where: {
                id: id,
            },
        });
        await (record === null || record === void 0 ? void 0 : record.update({
            isVerified: true,
        }));
        return res.status(302).redirect(`${process.env.FRONTEND_URL}/user/login`);
    }
    catch (error) {
        return res.status(500).json({
            error: 'Internal Server Error',
        });
        throw new Error(`${error}`);
    }
}
exports.verifyUser = verifyUser;
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const user = (await users_1.UserInstance.findOne({
            where: {
                email: email,
            },
        }));
        if (!user) {
            return res.status(404).json({
                error: 'email not found',
            });
        }
        const { id } = user;
        const html = emailVerification_1.forgotPasswordVerification(id);
        await sendMail_1.default.sendEmail(fromUser, req.body.email, subject, html);
        return res.status(200).json({
            message: 'Check email for the verification link',
        });
    }
    catch (error) {
        return res.status(500).json({
            error,
        });
        throw new Error(`${error}`);
    }
}
exports.forgotPassword = forgotPassword;
async function changePassword(req, res) {
    try {
        const { id } = req.params;
        const validationResult = utils_1.changePasswordSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                error: validationResult.error.details[0].message,
            });
        }
        const user = await users_1.UserInstance.findOne({
            where: {
                id: id,
            },
        });
        if (!user) {
            return res.status(403).json({
                error: 'user does not exist',
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        await (user === null || user === void 0 ? void 0 : user.update({
            password: passwordHash,
        }));
        return res.status(200).json({
            message: 'Password Successfully Changed',
        });
    }
    catch (error) {
        return res.status(500).json({
            error: 'Internal server error',
        });
        throw new Error(`${error}`);
    }
}
exports.changePassword = changePassword;
async function updateUserRecord(req, res) {
    try {
        const { id } = req.params;
        const record = await users_1.UserInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(400).json({ error: 'Invalid ID, User not found' });
        }
        if (req.body.username) {
            const check = (await users_1.UserInstance.findOne({ where: { username: req.body.username } }));
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
        const validateUpdate = utils_1.userUpdateSchema.validate(updateRecord, utils_1.options);
        if (validateUpdate.error) {
            return res.status(400).json({ error: validateUpdate.error.details[0].message });
        }
        const updateUserRecord = await (record === null || record === void 0 ? void 0 : record.update(updateRecord));
        return res.status(200).json({
            message: 'Update Successful',
            record: updateUserRecord,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: 'Failed to update record',
            route: '/patch/:id',
        });
    }
}
exports.updateUserRecord = updateUserRecord;
async function getSingleUser(req, res) {
    try {
        const { id } = req.params;
        const user = await users_1.UserInstance.findOne({
            where: { id },
            include: [
                {
                    model: bank_1.BankInstance,
                    as: 'banks',
                },
                {
                    model: transactions_1.TransactionInstance,
                    as: 'transactions',
                },
            ],
        });
        return res.status(200).json({
            message: 'Successfully fetched single user',
            user,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: 'failed to fetch single user',
            route: '/user/:id',
        });
    }
}
exports.getSingleUser = getSingleUser;
async function getAllUser(req, res) {
    try {
        const users = await users_1.UserInstance.findAndCountAll({
            include: [
                {
                    model: bank_1.BankInstance,
                    as: 'banks',
                },
                {
                    model: transactions_1.TransactionInstance,
                    as: 'transactions',
                },
            ],
        });
        return res.status(200).json({
            message: 'Successfully fetched all users',
            users,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: 'failed to fetch single user',
            route: '/getAllUsers',
        });
    }
}
exports.getAllUser = getAllUser;
async function sendVerificationOTP(req, res) {
    try {
        const id = req.user;
        const user = (await users_1.UserInstance.findOne({
            where: {
                id: id,
            },
        }));
        if (!user) {
            return res.status(404).json({
                error: 'user not found',
            });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiration = Date.now() + 600000;
        const html = emailVerification_1.sendOTPNotification(otp);
        await sendMail_1.default.sendEmail(fromUser, user.email, subject2, html);
        await (user === null || user === void 0 ? void 0 : user.update({
            otp,
            otpExpiration,
        }));
        return res.status(200).json({
            message: 'OTP sent to your email',
        });
    }
    catch (error) {
        return res.status(500).json({
            error: 'Internal server error',
        });
        throw new Error(`${error}`);
    }
}
exports.sendVerificationOTP = sendVerificationOTP;
async function creditUserWallet(req, res) {
    try {
        const adminID = req.user;
        const { email, amountTransferred, transactionID, otp } = req.body;
        const validateWalletBalance = utils_2.updateWalletSchema.validate(req.body, utils_1.options);
        if (validateWalletBalance.error) {
            return res.status(400).json({
                error: validateWalletBalance.error.details[0].message,
            });
        }
        const admin = (await users_1.UserInstance.findOne({ where: { id: adminID } }));
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
        await (admin === null || admin === void 0 ? void 0 : admin.update({
            otp: null,
            otpExpiration: null,
        }));
        const record = (await users_1.UserInstance.findOne({ where: { email } }));
        if (!record) {
            return res.status(400).json({
                error: 'Invalid email',
            });
        }
        const transaction = (await transactions_1.TransactionInstance.findOne({
            where: {
                id: transactionID,
            },
        }));
        if (!transaction) {
            return res.status(400).json({
                error: 'Invalid Transaction',
            });
        }
        const updatedTransaction = await (transaction === null || transaction === void 0 ? void 0 : transaction.update({
            amountToSell: amountTransferred,
            amountToReceive: amountTransferred * 0.7,
            status: 'sent',
            editedBy: admin.username,
        }));
        const { walletBalance } = record;
        const newBalance = walletBalance + amountTransferred * 0.7;
        const fixedBalance = Number(newBalance.toFixed(2));
        const updatedWalletBalance = await (record === null || record === void 0 ? void 0 : record.update({
            walletBalance: fixedBalance,
        }));
        return res.status(200).json({
            // eslint-disable-next-line max-len
            message: `Successfully credited ${record.firstName} ${record.lastName} with N${(amountTransferred * 0.7).toFixed(2)}`,
            updatedWalletBalance,
            record,
            updatedTransaction,
        });
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.status(500).json({
            error: 'Failed to update',
            route: './updatewallet',
        });
    }
}
exports.creditUserWallet = creditUserWallet;
//# sourceMappingURL=userController.js.map