import { Router } from 'express';
import asyncWrap from 'express-async-handler';

const router = Router();

router.get('/health', (_, res) => res.status(200).json({ health: 'OK' }));

export default router;
