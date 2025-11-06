import { Router } from 'express';
import movieRoutes from './movieRoutes.js';

const router = Router();

// All API routes will be served under the /filmes prefix
router.use('/filmes', movieRoutes);

export default router;
