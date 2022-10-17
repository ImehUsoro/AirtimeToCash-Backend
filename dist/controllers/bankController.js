"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBank = exports.addBank = void 0;
const uuid_1 = require("uuid");
const bank_1 = require("../models/bank");
const utils_1 = require("../utils/utils");
async function addBank(req, res) {
    try {
        let id = uuid_1.v4();
        const userId = req.user;
        const validateBank = utils_1.addBankSchema.validate(req.body, utils_1.options);
        if (validateBank.error) {
            return res.status(400).json({
                error: validateBank.error.details[0].message,
            });
        }
        const duplicateAcctNumber = await bank_1.BankInstance.findOne({
            where: { accountNumber: req.body.accountNumber },
        });
        if (duplicateAcctNumber) {
            return res.status(409).json({
                error: 'Account number already exists',
            });
        }
        const bank = await bank_1.BankInstance.create({ id, ...req.body, userId });
        res.status(201).json({
            message: 'You have successfully added a bank account',
            bank,
        });
    }
    catch (error) {
        // console.log(error);
        return res.status(500).json({
            error: 'Failed to add account',
            route: '/add-bank',
        });
    }
}
exports.addBank = addBank;
async function deleteBank(req, res) {
    try {
        const { id } = req.params;
        const record = await bank_1.BankInstance.findOne({ where: { id } });
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
    }
    catch (error) {
        return res.status(500).json({
            error: 'Failed to delete bank',
            route: '/delete-bank/:id',
        });
    }
}
exports.deleteBank = deleteBank;
//# sourceMappingURL=bankController.js.map