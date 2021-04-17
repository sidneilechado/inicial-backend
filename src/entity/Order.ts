import {
	Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import Worker from './Worker';
import Store from './Store';

export interface OrderableItem {
	productId: number;
	qty: number;
	subtotal: number;
}

export enum orderStatus {
	active = 'active',
	completed = 'completed',
	canceled = 'canceled'
}

@Entity()
export default class Order {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		default: 0,
	})
	totalPrice: number;

	@Column({
		type: 'jsonb',
		array: false,
		default: () => "'[]'",
		nullable: false,
	})
	products: Array<OrderableItem>;

	@Column({
		default: 0,
		type: 'float',
	})
	couponValue: number;

	@Column({
		type: 'enum',
		enum: orderStatus,
		default: orderStatus.active,
	})
	status: orderStatus;

	@Column({
		type: 'text'
	})
	description: string;

	// Date control

	@Column()
	deliveryDate: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	// Relations

	@ManyToOne((type) => Store, (store) => store.orders)
	store: Store;

	@ManyToOne((type) => Worker, (worker) => worker.orders)
	worker: Worker;
}
