import { Router } from 'express';
import { addBank, deleteBank } from '../controllers/bankController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/add-bank', auth, addBank);
router.delete('/delete-bank/:id', auth, deleteBank);

export default router;
