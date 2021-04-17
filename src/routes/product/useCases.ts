import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Product from '../../entity/Product';
import Store from '../../entity/Store';
import AppError from '../../errors/AppError';

// export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
// 	const productRepository = getRepository(Product);
// 	const storeRepository = getRepository(Store);

// 	try {
// 		const {
// 			name,
// 			price,
// 			stockQuantity,
// 			storeId,
// 		} = req.body;

// 		const store = await storeRepository.findOne({
// 			where: {
// 				id: storeId,
// 			},
// 		});

// 		if (!store) {
// 			throw new AppError('Store not found.');
// 		}

// 		const product = productRepository.create({
// 			name,
// 			price,
// 			stockQuantity,
// 			store,
// 		});

// 		await productRepository.save(product);

// 		res.status(200).json(product);
// 	} catch (err) {
// 		next(err);
// 	}
// }

// export async function updateStock(req: Request, res: Response, next: NextFunction): Promise<void> {
// 	const productRepository = getRepository(Product);
// 	const storeRepository = getRepository(Store);

// 	try {
// 		const {
// 			productId,
// 			storeId,
// 			stockQuantity,
// 			price,
// 			name,
// 		} = req.body;

// 		const store = await storeRepository.findOne({
// 			where: {
// 				id: storeId,
// 			},
// 		});

// 		if (!store) {
// 			throw new AppError('Store not found.');
// 		}

// 		const product = await productRepository.findOne({
// 			where:{
// 				id: productId,
// 				store: {
// 					id: storeId,
// 				}
// 			}
// 		});

// 		if (!product || stockQuantity < 0) {
// 			throw new AppError('Invalid data.');
// 		}

// 		product.stockQuantity = stockQuantity;
// 		product.price = price;
// 		product.name = name;

// 		await productRepository.save(product);
// 		await storeRepository.save(store);

// 		res.status(200).json(product);
// 	} catch (err) {
// 		next(err);
// 	}
// }
