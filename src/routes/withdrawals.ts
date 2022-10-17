import { Router } from 'express';
import { getAllWithdrawals, getUserWithdrawals, withdraw } from '../controllers/withdrawalsController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/withdraw', auth, withdraw);
router.get('/getAllWithdrawals', auth, getAllWithdrawals);
// Add query params success=true to get ONLY successful withdrawals and success=false to get ONLY failed withdrawal
router.get('/getUserWithdrawals', auth, getUserWithdrawals);
// Add query params success=true to get ONLY successful withdrawals and success=false to get ONLY failed withdrawal

export default router;
