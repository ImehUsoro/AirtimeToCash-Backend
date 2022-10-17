"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserWithdrawals = exports.getAllWithdrawals = exports.withdraw = void 0;
const uuid_1 = require("uuid");
const users_1 = require("../models/users");
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const withdrawalHistory_1 = require("../models/withdrawalHistory");
// import got from 'got';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
async function withdraw(req, res) {
    try {
        let id = uuid_1.v4();
        const userId = req.user;
        const validateBank = utils_1.withdrawSchema.validate(req.body, utils_1.options);
        if (validateBank.error) {
            return res.status(400).json({
                error: validateBank.error.details[0].message,
            });
        }
        const { email, amount, accountNumber, bankName, password, bankCode } = req.body;
        const user = (await users_1.UserInstance.findOne({
            where: { email: email },
        }));
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }
        const userPassword = user.password;
        const validUser = await bcryptjs_1.default.compare(password, userPassword);
        if (!validUser) {
            await withdrawalHistory_1.WithdrawalHistoryInstance.create({
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
            await withdrawalHistory_1.WithdrawalHistoryInstance.create({
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
        await withdrawalHistory_1.WithdrawalHistoryInstance.create({
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
    }
    catch (error) {
        // console.log(error);
        return res.status(500).json({
            error: 'Failed to withdraw',
            route: '/api/withdraw',
        });
    }
}
exports.withdraw = withdraw;
async function getAllWithdrawals(req, res) {
    try {
        const { success } = req.query;
        if (success === 'true') {
            const withdrawals = await withdrawalHistory_1.WithdrawalHistoryInstance.findAndCountAll({
                where: {
                    status: true,
                },
                include: [
                    {
                        model: users_1.UserInstance,
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
            const withdrawals = await withdrawalHistory_1.WithdrawalHistoryInstance.findAndCountAll({
                where: {
                    status: false,
                },
                include: [
                    {
                        model: users_1.UserInstance,
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
        const withdrawals = await withdrawalHistory_1.WithdrawalHistoryInstance.findAndCountAll({
            include: [
                {
                    model: users_1.UserInstance,
                    attributes: ['id', 'walletBalance', 'email', 'username', 'phoneNumber'],
                    as: 'User',
                },
            ],
        });
        return res.status(200).json({
            message: 'You have successfully retrieved all withdrawals',
            withdrawals,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: 'Failed to get withdrawals',
            route: '/getWithdrawals',
        });
    }
}
exports.getAllWithdrawals = getAllWithdrawals;
async function getUserWithdrawals(req, res) {
    try {
        const { success } = req.query;
        const userId = req.user;
        if (success === 'true') {
            const withdrawals = await withdrawalHistory_1.WithdrawalHistoryInstance.findAndCountAll({
                where: { userId, status: true },
                include: [
                    {
                        model: users_1.UserInstance,
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
            const withdrawals = await withdrawalHistory_1.WithdrawalHistoryInstance.findAndCountAll({
                where: { userId, status: false },
                include: [
                    {
                        model: users_1.UserInstance,
                        attributes: ['id', 'walletBalance', 'email', 'username', 'phoneNumber'],
                        as: 'User',
                    },
                ],
            });
            return res.status(200).json({
                withdrawals,
            });
        }
        const withdrawals = await withdrawalHistory_1.WithdrawalHistoryInstance.findAndCountAll({
            where: { userId: userId },
            include: [
                {
                    model: users_1.UserInstance,
                    attributes: ['id', 'walletBalance', 'email', 'username', 'phoneNumber'],
                    as: 'User',
                },
            ],
        });
        return res.status(200).json({
            message: 'You have successfully retrieved all withdrawals',
            withdrawals,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: 'Failed to get withdrawals',
            route: '/getUserWithdrawals',
        });
    }
}
exports.getUserWithdrawals = getUserWithdrawals;
//# sourceMappingURL=withdrawalsController.js.map