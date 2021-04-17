import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import User, { roles } from '../../entity/User';

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
	const userRepository = getRepository(User);

	try {
		const { login, password, name, role } = req.body;

		const stringfiedRole = role as String;

		const roleToBeSet = stringfiedRole.valueOf() === roles.admin ? roles.admin : roles.regular;

		const user = userRepository.create({
			login,
			password,
			role: roleToBeSet
		});

		await userRepository.save(user);

		res.status(200).json(user);
	} catch (err) {
		next(err);
	}
}

export async function listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
	const userRepository = getRepository(User);

	try {
		const users = await userRepository.find();

		res.status(200).json(users);
	} catch (err) {
		next(err);
	}
}
