import { Request, Response, NextFunction } from 'express';
import AppError from '../../errors/AppError';
import { getRepository } from 'typeorm';
import Worker from '../../entity/Worker';

export async function createWorker(req: Request, res: Response, next: NextFunction): Promise<void> {
	const workerRepository = getRepository(Worker);

	try {
		const {
			name,
			cpf,
			cnpj,
			bankAccount,
			address,
		} = req.body;

		const doesWorkerExists = await workerRepository.findOne({
			where: {
				cpf
			}
		})

		console.log(doesWorkerExists)

		if(!!doesWorkerExists){
			throw new AppError('Worker already exists.')
		}

		const worker = workerRepository.create({
			name,
			cpf,
			cnpj,
			bankAccount,
			address,
		});

		await workerRepository.save(worker);

		res.status(200).json(worker);
	} catch (err) {
		next(err);
	}
}

export async function modifyWorker(req: Request, res: Response, next: NextFunction): Promise<void> {
	const workerRepository = getRepository(Worker);

	try {
		const {
			id,
			name,
			cpf,
			cnpj,
			bankAccount,
			address,
			isActive,
		} = req.body;

		const worker = await workerRepository.findOne({
			where: {
				id
			},
			relations: ['orders']
		});

		if(!worker){
			throw new AppError('Worker does not exists.')
		}

		worker.name = name;
		worker.cpf = cpf;
		worker.cnpj = cnpj;
		worker.bankAccount = bankAccount;
		worker.address = address;
		worker.isActive = isActive;
		worker.updatedAt = new Date();

		await workerRepository.save(worker);

		res.status(200).json(worker);
	} catch (err) {
		next(err);
	}
}

export async function retrieveWorker(req: Request, res: Response, next: NextFunction): Promise<void> {
	const workerRepository = getRepository(Worker);

	try {
		const { id } = req.params;

		const worker = await workerRepository.findOne({
			where: {
				id
			},
			relations: ['orders']
		});

		if(!worker){
			throw new AppError('Worker does not exists.')
		}

		res.status(200).json(worker);
	} catch (err) {
		next(err);
	}
}
