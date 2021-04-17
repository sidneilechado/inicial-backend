import { Router } from 'express';
import {
	createUser,
	listUsers,
} from './useCases';

export default function (): Router {
	const router = Router();

	router.post('/create', createUser);
	router.get('/list', listUsers);

	return router;
}
