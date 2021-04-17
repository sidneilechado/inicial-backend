import { Router } from 'express';
import {
	createProduct,
	modifyProduct
} from './useCases';

export default function (): Router {
	const router = Router();

	router.post('/create', createProduct);
	router.put('/modify', modifyProduct);

	return router;
}
