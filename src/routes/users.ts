import { Router } from 'express';
import {
  createUser,
  loginUser,
  updateUserRecord,
  verifyUser,
  forgotPassword,
  changePassword,
  getSingleUser,
  getAllUser,
  creditUserWallet,
  createAdmin,
  sendVerificationOTP,
  // verifyOTP,
} from '../controllers/userController';
import { auth } from '../middleware/auth';
const router = Router();

router.post('/login', loginUser);
router.post('/register', createUser);
router.get('/getAllUsers', getAllUser);
router.get('/verify/:token', verifyUser);
router.get('/single-user/:id',  getSingleUser);
router.post('/createAdmin', auth, createAdmin);
router.post('/forgotpassword', forgotPassword);
router.patch('/getOTP', auth, sendVerificationOTP);
router.patch('/update/:id', auth, updateUserRecord);
router.patch('/change-password/:id', changePassword);
router.patch('/creditWallet', auth, creditUserWallet);

export default router;
