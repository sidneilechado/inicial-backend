import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	UpdateDateColumn,
	CreateDateColumn
} from 'typeorm';

import Order from './Order';

export interface Address {
	street: string;
	number: number;
	city: string;
	district: string;
	complement: string;
	obs: string;
}

export interface BankAccount {
	account: string;
	agency: string;
	bank: string;
	cpf: string;
	owner: string;
}

@Entity()
export default class Worker {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	cpf: string;

	@Column()
	cnpj: string;

	@Column({
		type: 'jsonb',
	})
	bankAccount: BankAccount;

	@Column({
		type: 'jsonb',
	})
	address: Address;

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

	@OneToMany((type) => Order, (order) => order.worker)
	orders: Order[];
}
