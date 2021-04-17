import { Router } from 'express';
import {
	createWorker,
	modifyWorker,
	retrieveWorker
} from './useCases';

export default function (): Router {
	const router = Router();

	router.get('/:id', retrieveWorker);
	router.post('/create', createWorker);
	router.put('/modify', modifyWorker);

	return router;
}
