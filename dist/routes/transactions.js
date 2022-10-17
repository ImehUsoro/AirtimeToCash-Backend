"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const auth_1 = require("../middleware/auth");
const router = express_1.Router();
router.post('/add-transaction', auth_1.auth, transactionController_1.createTransaction);
router.get('/getOneTransaction/:id', auth_1.auth, transactionController_1.getOneTransaction);
router.get('/getUserTransactions', auth_1.auth, transactionController_1.getUserTransactions);
router.get('/getTransactions', auth_1.auth, transactionController_1.getTransactions);
// Add query params pending=true to get ONLY successful transactions
router.patch('/cancelTransaction/:id', auth_1.auth, transactionController_1.cancelATransaction);
exports.default = router;
//# sourceMappingURL=transactions.js.map