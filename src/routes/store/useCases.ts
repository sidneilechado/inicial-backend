import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Store from '../../entity/Store';

export async function createStore(req: Request, res: Response, next: NextFunction): Promise<void> {
	const storeRepository = getRepository(Store);

	try {
		const {
			name,
		} = req.body;

		const user = storeRepository.create({
			name,
		});

		await storeRepository.save(user);

		res.status(200).json(user);
	} catch (err) {
		next(err);
	}
}

export async function getStore(req: Request, res: Response, next: NextFunction): Promise<void> {
	const storeRepository = getRepository(Store);

	try {
		const { id } = req.params;

		const store = await storeRepository.findOne({
			relations: ['products', 'coupons', 'orders'],
			where: {
				id,
			},
		});

		res.status(200).json(store);
	} catch (err) {
		next(err);
	}
}
