import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export const FuncionarioRoutes = async (server: FastifyInstance) => {
	server.get("/", async () => {
		return await prisma.funcionario.findMany({
			select: {
				id: true,
				nome: true,
				senha: true,
				cargo: true,
				estacionamento: true,
			},
		});
	});

	server.post("/", async (request, reply) => {
		const createFuncionarioSchema = z.object({
			nome: z.string(),
			senha: z.string(),
			cargo: z.number(),
			estacionamento: z.number(),
		});

		const { nome, senha, cargo, estacionamento } =
			createFuncionarioSchema.parse(request.body);

		const cargoExiste = await prisma.cargo.findUnique({
			where: {
				id: cargo,
			},
		});

		if (!cargoExiste) {
			return reply.status(400).send("Cargo inválido");
		}

		const estacionamentoExiste = await prisma.estacionamento.findUnique({
			where: {
				id: estacionamento,
			},
		});

		if (!estacionamentoExiste) {
			return reply.status(400).send("Estacionamento inválido");
		}

		await prisma.funcionario.create({
			data: {
				nome,
				senha,
				cargo: {
					connect: {
						id: cargo,
					},
				},
				estacionamento: {
					connect: {
						id: estacionamento,
					},
				},
			},
		});

		return reply.status(201).send();
	});

	server.get("/:id", async (request) => {
		const { id } = request.params as { id: string };

		return await prisma.funcionario.findUnique({
			where: {
				id: Number(id),
			},
			include: {
				cargo: true,
				estacionamento: true,
			},
		});
	});

	server.put("/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		const updateFuncionarioSchema = z.object({
			nome: z.string(),
			senha: z.string(),
			cargo: z.number(),
			estacionamento: z.number(),
			ativo: z.boolean(),
		});

		const { nome, senha, cargo, estacionamento, ativo } =
			updateFuncionarioSchema.parse(request.body);

		const cargoExiste = await prisma.cargo.findUnique({
			where: {
				id: cargo,
			},
		});

		if (!cargoExiste) {
			return reply.status(400).send("Cargo inválido");
		}

		const estacionamentoExiste = await prisma.estacionamento.findUnique({
			where: {
				id: estacionamento,
			},
		});

		if (!estacionamentoExiste) {
			return reply.status(400).send("Estacionamento inválido");
		}

		await prisma.funcionario.update({
			where: {
				id: Number(id),
			},
			data: {
				nome,
				senha,
				cargo: {
					connect: {
						id: cargo,
					},
				},
				estacionamento: {
					connect: {
						id: estacionamento,
					},
				},
				ativo,
			},
		});

		return reply.status(204).send();
	});

	server.delete("/:id", async (request, reply) => {
		const { id } = request.params as { id: string };

		await prisma.funcionario.update({
			where: {
				id: Number(id),
			},
			data: {
				ativo: false,
			},
		});

		return reply.status(204).send();
	});

	server.post("/login", async (request, reply) => {
		const loginFuncionarioSchema = z.object({
			nome: z.string(),
			senha: z.string(),
		});

		const { nome, senha } = loginFuncionarioSchema.parse(request.body);

		const funcionario = await prisma.funcionario.findFirst({
			where: {
				nome,
				senha,
			},
			include: {
				cargo: true,
				estacionamento: true,
			},
		});

		if (!funcionario) {
			return reply.status(401).send("Credenciais inválidas");
		}

		return funcionario;
	});

	server.get("/estacionamento/:id", async (request) => {
		const { id } = request.params as { id: string };

		return await prisma.funcionario.findMany({
			where: {
				estacionamento: {
					id: Number(id),
				},
			},
			include: {
				cargo: true,
				estacionamento: true,
			},
		});
	});
};
