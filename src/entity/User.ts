import {
	Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';

export enum roles {
	super = 'super',
	admin = 'admin',
	regular = 'regular'
}

@Entity()
export default class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	login: string;

	@Column()
	password: string;

	@Column({
		type: 'enum',
		enum: roles,
		default: roles.regular,
	})
	role: roles;
}
