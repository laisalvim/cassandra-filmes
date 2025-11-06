import { Router } from 'express';
import { getAllMovies, createMovie } from '../controllers/movieController.js';
import { getRatingsForMovie, addRatingToMovie } from '../controllers/ratingController.js';

const router = Router();

router.get('/', getAllMovies);
router.post('/', createMovie);

router.get('/:id_filme/avaliacoes', getRatingsForMovie);
router.post('/:id_filme/avaliacoes', addRatingToMovie);

export default router;
