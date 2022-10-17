"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.Router();
router.post('/register', userController_1.createUser);
router.post('/login', userController_1.loginUser);
router.patch('/update/:id', auth_1.auth, userController_1.updateUserRecord);
router.get('/verify/:token', userController_1.verifyUser);
router.post('/forgotpassword', userController_1.forgotPassword);
router.patch('/change-password/:id', userController_1.changePassword);
exports.default = router;
//# sourceMappingURL=users.js.map