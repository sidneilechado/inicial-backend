import {
	Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import Store from './Store';

@Entity()
export default class Product {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({
		type: "float"
	})
	price: number;

	@Column({
		type: 'text'
	})
	description: string;

	@Column({
		default: 0,
	})
	stockQuantity: number;

	@Column({
		default: true
	})
	isActive: boolean;

	// Date controls

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	// Relations

	@ManyToOne((type) => Store, (store) => store.products)
	store: Store;
}
