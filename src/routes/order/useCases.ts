import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Product from '../../entity/Product';
import Store from '../../entity/Store';
import Worker from '../../entity/Worker';
import Order, { orderStatus } from '../../entity/Order';
import AppError from '../../errors/AppError';

function checkIfOrderHasProduct(order: Order, productId: number): number {
	return order.products.findIndex((element) => element.productId === productId);
}

function stockChecker(qty: number, stock: number): boolean {
	return (qty > stock);
}

async function checkIfUserHasOrder(userId: number, storeId: number): Promise<Order> {
	const orderRepository = getRepository(Order);

	try {
		const order = await orderRepository.findOne({
			relations: ['user', 'store'],
			where: {
				user: {
					userId,
					store: {
						id: storeId,
					}
				},
				status: 'active',
			},
		});

		return order;
	} catch (err) {
		console.error(err);
	}
}

async function calculatePrice(order: Order): Promise<Order> {
	const productRepository = getRepository(Product);
	const orderRepository = getRepository(Order);

	try {
		order.totalPrice = 0;
		order.products.forEach(async (priceCalculator): Promise<void> => {
			const product = await productRepository.findOne({
				where:{
					id: priceCalculator.productId
				}
			});
			const productPrice = product.price;
			priceCalculator.subtotal = (
				priceCalculator.qty * productPrice
			);
			order.totalPrice += priceCalculator.subtotal;
		});

		await orderRepository.save(order);

		return order;
	} catch (err) {
		console.error(err);
	}
}

export async function createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
	const orderRepository = getRepository(Order);
	const workerRepository = getRepository(Worker);
	const storeRepository = getRepository(Store);

	try {
		const {
			workerId,
			storeId,
			deliveryDate,
			description,
		} = req.body;

		const worker = await workerRepository.findOne({
			where: {
				id: workerId
			}
		})

		const store = await storeRepository.findOne({
			where: {
				id: storeId
			}
		})

		const order = orderRepository.create({
			worker,
			deliveryDate,
			description,
			store
		});

		await orderRepository.save(order);

		res.status(200).json(order);
	} catch (err) {
		next(err);
	}
}

export async function updateProductsOnOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
	const orderRepository = getRepository(Order);
	const productRepository = getRepository(Product);

	try {
		const {
			orderId,
			productId,
			qty,
		} = req.body;

		let order = await orderRepository.findOne({
			relations: ['worker', 'store'],
			where: {
				id: orderId,
				status: 'active',
			},
		});

		const product = await productRepository.findOne({
			where: {
				id: productId,
			},
		});

		if (!order || !product) {
			throw new AppError('Invalid data.');
		}

		if(order.status !== orderStatus.active){
			throw new AppError('Order already has already been completed, delivered or canceled.');
		}

		const productIndex = checkIfOrderHasProduct(order, productId);
		if (productIndex >= 0) {
			if (stockChecker(qty, product.stockQuantity)) {
				throw new AppError('Stock insufficient.');
			}

			if (qty < 0) {
				throw new AppError('Invalid data.');
			}

			order.products[productIndex].qty = qty;
		} else {
			order.products.push({
				productId,
				qty,
				subtotal: (qty * product.price),
			});
		}

		order.updatedAt = new Date();

		order = await calculatePrice(order);

		res.status(200).json(order);
	} catch (err) {
		next(err);
	}
}

export async function removeItemFromOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
	const orderRepository = getRepository(Order);

	try {
		const {
			productId,
			orderId,
		} = req.body;

		let order = await orderRepository.findOne({
			relations: ['worker', 'store'],
			where: {
				id: orderId,
			},
		});

		if (!order) {
			throw new AppError('Order does not exists.');
		}

		if(order.status !== orderStatus.active){
			throw new AppError('Order already has already been completed, delivered or canceled.');
		}

		const productIndex = checkIfOrderHasProduct(order, productId);
		if (productIndex >= 0) {
			order.products.splice(productIndex, 1);
			order.updatedAt = new Date();
			order = await calculatePrice(order);
		} else {
			throw new AppError('Order does not have this product.');
		}


		res.status(200).json(order);
	} catch (err) {
		next(err);
	}
}

export async function retrieveOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
	const orderRepository = getRepository(Order);

	try {
		const { id } = req.params;

		const order = await orderRepository.findOne({
			relations: ['worker', 'store'],
			where: {
				id,
			},
		});

		if (!order) {
			throw new AppError('Order does not exists.');
		}

		res.status(200).json(order);
	} catch (err) {
		next(err);
	}
}

export async function clearOrderProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
	const orderRepository = getRepository(Order);

	try {
		const {
			orderId,
		} = req.body;

		let order = await orderRepository.findOne({
			relations: ['worker', 'store'],
			where: {
				id: orderId,
			},
		});

		if (!order) {
			throw new AppError('Order does not exists');
		}

		order.products.splice(0, order.products.length);

		order = await calculatePrice(order);

		res.status(200).json(order);
	} catch (err) {
		next(err);
	}
}

export async function modifyOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
	const orderRepository = getRepository(Order);

	try {
		const {
			orderId,
			status,
			description,
			deliveryDate,
		} = req.body;

		const order = await orderRepository.findOne({
			relations: ['store', 'worker'],
			where: {
				id: orderId,
			},
		});

		if (!order) {
			throw new AppError('Invalid data.');
		}

		order.deliveryDate = deliveryDate;
		order.description = description;
		order.status = orderStatus[status];
		order.updatedAt = new Date();

		await orderRepository.save(order);

		res.status(200).json(order);
	} catch (err) {
		next(err);
	}
}
