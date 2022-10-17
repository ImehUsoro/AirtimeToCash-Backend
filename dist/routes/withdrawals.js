"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const withdrawalsController_1 = require("../controllers/withdrawalsController");
const auth_1 = require("../middleware/auth");
const router = express_1.Router();
router.post('/withdraw', auth_1.auth, withdrawalsController_1.withdraw);
router.get('/getAllWithdrawals', auth_1.auth, withdrawalsController_1.getAllWithdrawals);
// Add query params success=true to get ONLY successful withdrawals and success=false to get ONLY failed withdrawal
router.get('/getUserWithdrawals', auth_1.auth, withdrawalsController_1.getUserWithdrawals);
// Add query params success=true to get ONLY successful withdrawals and success=false to get ONLY failed withdrawal
exports.default = router;
//# sourceMappingURL=withdrawals.js.map