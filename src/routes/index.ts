import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import store from './store';
import product from './product';
import cart from './cart';
import user from './user';
import worker from './worker';
import swaggerDocument from './documentation/openapi.json';

export default function (): Router {
	const router = Router();


	router.use('/product', product());
	router.use('/user', user());
	router.use('/store', store());
	router.use('/worker', worker());
	router.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

	return router;
}
