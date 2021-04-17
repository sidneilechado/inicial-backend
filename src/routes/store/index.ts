import { Router } from 'express';
import {
	createStore,
	getStore,
} from './useCases';

export default function (): Router {
	const router = Router();

	router.post('/create', createStore);
	router.get('/:id', getStore);

	return router;
}
