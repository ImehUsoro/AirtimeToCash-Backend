"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bankController_1 = require("../controllers/bankController");
const auth_1 = require("../middleware/auth");
const router = express_1.Router();
router.post('/add-bank', auth_1.auth, bankController_1.addBank);
router.delete('/delete-bank/:id', auth_1.auth, bankController_1.deleteBank);
exports.default = router;
//# sourceMappingURL=banks.js.map