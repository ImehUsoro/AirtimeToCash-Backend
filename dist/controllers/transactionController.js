"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelATransaction = exports.getUserTransactions = exports.getOneTransaction = exports.getTransactions = exports.createTransaction = void 0;
const uuid_1 = require("uuid");
const users_1 = require("../models/users");
const utils_1 = require("../utils/utils");
const transactions_1 = require("../models/transactions");
const emailVerification_1 = require("../email/emailVerification");
const sendMail_1 = __importDefault(require("../email/sendMail"));
const fromUser = process.env.GMAIL_USER;
const subject = process.env.SUBJECT2;
async function createTransaction(req, res) {
    try {
        let id = uuid_1.v4();
        const userId = req.user;
        const validateTransaction = utils_1.addTransactionSchema.validate(req.body, utils_1.options);
        if (validateTransaction.error) {
            return res.status(400).json({
                error: validateTransaction.error.details[0].message,
            });
        }
        const amountToReceive = Number(((req.body.amountToSell * 70) / 100).toFixed(2));
        const transaction = await transactions_1.TransactionInstance.create({
            id,
            ...req.body,
            amountToReceive,
            userId,
            status: 'pending',
        });
        const html = emailVerification_1.transactionNotification();
        await sendMail_1.default.sendAdminEmail(fromUser, fromUser, subject, html);
        res.status(201).json({
            message: 'You have successfully made a transaction. Admin has been notified',
            transaction,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: 'Failed to add account',
            route: '/add-transaction',
        });
    }
}
exports.createTransaction = createTransaction;
async function getTransactions(req, res) {
    try {
        const { pending } = req.query;
        if (pending === 'true') {
            const pendingRecords = await transactions_1.TransactionInstance.findAndCountAll({
                where: { status: 'pending' },
                include: [
                    {
                        model: users_1.UserInstance,
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
        const record = await transactions_1.TransactionInstance.findAndCountAll({
            include: [
                {
                    model: users_1.UserInstance,
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
    }
    catch (error) {
        return res.status(500).json({
            error: 'Failed to get transactions',
            route: '/getTransactions',
        });
    }
}
exports.getTransactions = getTransactions;
async function getOneTransaction(req, res) {
    try {
        const { id } = req.params;
        const record = await transactions_1.TransactionInstance.findOne({
            where: { id },
            include: [
                {
                    model: users_1.UserInstance,
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
    }
    catch (error) {
        return res.status(500).json({
            error: 'Failed to get one transaction',
            route: '/getOneTransaction',
        });
    }
}
exports.getOneTransaction = getOneTransaction;
async function getUserTransactions(req, res) {
    try {
        const { pending } = req.query;
        const userId = req.user;
        if (pending === 'true') {
            const pendingRecords = await transactions_1.TransactionInstance.findAndCountAll({
                where: { status: 'pending', userId },
                include: [
                    {
                        model: users_1.UserInstance,
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
        const record = await transactions_1.TransactionInstance.findAndCountAll({
            where: { userId },
            include: [
                {
                    model: users_1.UserInstance,
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
    }
    catch (error) {
        return res.status(500).json({
            error: 'Failed to get transactions',
            route: '/getUserTransactions',
        });
    }
}
exports.getUserTransactions = getUserTransactions;
async function cancelATransaction(req, res) {
    try {
        const { id } = req.params;
        const adminID = req.user;
        const admin = (await users_1.UserInstance.findOne({ where: { id: adminID } }));
        if (!admin) {
            return res.status(400).json({
                error: 'Admin not found',
            });
        }
        const record = (await transactions_1.TransactionInstance.findOne({
            where: { id },
        }));
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
    }
    catch (error) {
        return res.status(500).json({
            error: 'Failed to cancel a transaction',
            route: '/cancelTransaction/:id',
        });
    }
}
exports.cancelATransaction = cancelATransaction;
//# sourceMappingURL=transactionController.js.map