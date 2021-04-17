import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Product from '../../entity/Product';
import Store from '../../entity/Store';
import User from '../../entity/User';
import Order, { orderStatus } from '../../entity/Order';
import AppError from '../../errors/AppError';

// function checkIfOrderHasProduct(order: Order, productId: number): number {
// 	return order.products.findIndex((element) => element.productId === productId);
// }

// function stockChecker(qty: number, stock: number): boolean {
// 	return (qty > stock);
// }

// async function checkIfUserHasOrder(userId: number, storeId: number): Promise<Order> {
// 	const orderRepository = getRepository(Order);

// 	try {
// 		const order = await orderRepository.findOne({
// 			relations: ['user', 'store'],
// 			where: {
// 				user: {
// 					userId,
// 					store: {
// 						id: storeId,
// 					}
// 				},
// 				status: 'active',
// 			},
// 		});

// 		return order;
// 	} catch (err) {
// 		console.error(err);
// 	}
// }

// async function calculatePrice(order: Order): Promise<Order> {
// 	const productRepository = getRepository(Product);
// 	const orderRepository = getRepository(Order);

// 	try {
// 		order.totalPrice = 0;
// 		order.products.forEach(async (priceCalculator): Promise<void> => {
// 			const product = await productRepository.findOne({
// 				where:{
// 					id: priceCalculator.productId
// 				}
// 			});
// 			const productPrice = product.price;
// 			priceCalculator.subtotal = (
// 				priceCalculator.qty * (productPrice - productPrice * order.couponValue)
// 			);
// 			order.totalPrice += priceCalculator.subtotal;
// 		});

// 		await orderRepository.save(order);

// 		return order;
// 	} catch (err) {
// 		console.error(err);
// 	}
// }

// export async function createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
// 	const orderRepository = getRepository(Order);
// 	const storeRepository = getRepository(Store);
// 	const userRepository = getRepository(User);

// 	try {
// 		const {
// 			userId,
// 			storeId,
// 		} = req.body;

// 		const user = await userRepository.findOne({
// 			where: {
// 				id: userId,
// 			},
// 		});

// 		const store = await storeRepository.findOne({
// 			where: {
// 				id: storeId,
// 			},
// 		});

// 		if (!store || !user) {
// 			throw new AppError('Invalid data.');
// 		}

// 		let order = await checkIfUserHasOrder(userId, storeId);

// 		if (!order) {
// 			order = orderRepository.create({
// 				store,
// 			});

// 			await orderRepository.save(order);
// 		}

// 		res.status(200).json(order);
// 	} catch (err) {
// 		next(err);
// 	}
// }

// export async function updateProductsOnOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
// 	const orderRepository = getRepository(Order);
// 	const productRepository = getRepository(Product);

// 	try {
// 		const {
// 			orderId,
// 			productId,
// 			userId,
// 			storeId,
// 			qty,
// 		} = req.body;

// 		let order = await orderRepository.findOne({
// 			relations: ['user', 'store'],
// 			where: {
// 				id: orderId,
// 				user: {
// 					id: userId,
// 				},
// 				store: {
// 					id: storeId,
// 				},
// 				status: 'active',
// 			},
// 		});

// 		const product = await productRepository.findOne({
// 			where: {
// 				id: productId,
// 				store: {
// 					id: storeId,
// 				}
// 			},
// 		});

// 		if (!order || !product) {
// 			throw new AppError('Invalid data.');
// 		}

// 		if(order.status !== orderStatus.active){
// 			throw new AppError('Order already has already been completed or canceled.');
// 		}

// 		const productIndex = checkIfOrderHasProduct(order, productId);
// 		if (productIndex >= 0) {
// 			if (stockChecker(qty, product.stockQuantity)) {
// 				throw new AppError('Stock insufficient.');
// 			}

// 			if (qty < 0) {
// 				throw new AppError('Invalid data.');
// 			}

// 			order.products[productIndex].qty = qty;
// 		} else {
// 			order.products.push({
// 				productId,
// 				qty,
// 				subtotal: (qty * product.price),
// 				persistable: true,
// 			});
// 		}

// 		order = await calculatePrice(order);

// 		res.status(200).json(order);
// 	} catch (err) {
// 		next(err);
// 	}
// }

// export async function removeItemFromOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
// 	const orderRepository = getRepository(Order);

// 	try {
// 		const {
// 			userId,
// 			productId,
// 			orderId,
// 		} = req.body;

// 		let order = await orderRepository.findOne({
// 			relations: ['user', 'store'],
// 			where: {
// 				id: orderId,
// 			},
// 		});

// 		if (!order) {
// 			throw new AppError('Order does not exists.');
// 		}

// 		if(order.status !== orderStatus.active){
// 			throw new AppError('Order already has already been completed or canceled');
// 		}

// 		const productIndex = checkIfOrderHasProduct(order, productId);
// 		if (productIndex >= 0) {
// 			order.products.splice(productIndex, 1);
// 			order = await calculatePrice(order);
// 		} else {
// 			throw new AppError('Order does not have this product');
// 		}

// 		res.status(200).json(order);
// 	} catch (err) {
// 		next(err);
// 	}
// }

// export async function getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
// 	const orderRepository = getRepository(Order);

// 	try {
// 		const { id } = req.params;

// 		const order = await orderRepository.findOne({
// 			relations: ['user', 'store'],
// 			where: {
// 				id,
// 			},
// 		});

// 		if (!order) {
// 			throw new AppError('Order does not exists.');
// 		}

// 		res.status(200).json(order);
// 	} catch (err) {
// 		next(err);
// 	}
// }

// export async function clearOrderProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
// 	const orderRepository = getRepository(Order);

// 	try {
// 		const {
// 			userId,
// 			orderId,
// 		} = req.body;

// 		let order = await orderRepository.findOne({
// 			relations: ['user', 'store'],
// 			where: {
// 				id: orderId,
// 			},
// 		});

// 		if (!order) {
// 			throw new AppError('Order does not exists');
// 		}

// 		order.products.splice(0, order.products.length);

// 		order = await calculatePrice(order);

// 		res.status(200).json(order);
// 	} catch (err) {
// 		next(err);
// 	}
// }

// export async function persistOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
// 	const orderRepository = getRepository(Order);
// 	const productRepository = getRepository(Product);

// 	try {
// 		const {
// 			orderId,
// 			userId,
// 		} = req.body;

// 		const order = await orderRepository.findOne({
// 			relations: ['store', 'user'],
// 			where: {
// 				id: orderId,
// 				user: {
// 					id: userId,
// 				},
// 			},
// 		});

// 		if (!order) {
// 			throw new AppError('Invalid data.');
// 		}

// 		if(order.status !== orderStatus.active){
// 			throw new AppError('Order already has already been completed or canceled');
// 		}


// 		order.products.forEach(async (element) => {
// 			const product = await productRepository.findOne({
// 				where: {
// 					id: element.productId
// 				}
// 			})

// 			element.persistable = element.qty > product.stockQuantity ? false : true;
// 		})

// 		const hasFalsePersist = order.products.find((element) =>
// 			element.persistable === false
// 		);

// 		if(!!hasFalsePersist) {
// 			throw new AppError('Stock insufficient.')
// 		}

// 		order.products.forEach(async (element) => {
// 			const product = await productRepository.findOne({
// 				where: {
// 					id: element.productId
// 				}
// 			})

// 			product.stockQuantity = product.stockQuantity - element.qty;
// 			await productRepository.save(product);
// 		})

// 		order.status = orderStatus.completed;
// 		await orderRepository.save(order);

// 		res.status(200).json(order);
// 	} catch (err) {
// 		next(err);
// 	}
// }
