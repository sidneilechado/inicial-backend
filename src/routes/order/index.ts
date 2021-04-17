import { Router } from 'express';
import {
	createOrder,
	modifyOrder,
	updateProductsOnOrder,
	removeItemFromOrder,
	retrieveOrder
} from './useCases';

export default function (): Router {
	const router = Router();

	router.post('/create', createOrder);
	router.put('/modify', modifyOrder);
	router.put('/update', updateProductsOnOrder);
	router.delete('/delete', removeItemFromOrder);
	router.get('/:id', retrieveOrder);

	return router;
}
