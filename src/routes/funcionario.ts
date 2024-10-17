import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export const FuncionarioRoutes = async (server: FastifyInstance) => {
	server.get("/", async () => {
		return await prisma.funcionario.findMany();
	});

	server.post("/", async (request, reply) => {
		const createFuncionarioSchema = z.object({
			nome: z.string(),
			senha: z.string(),
			estacionamento: z.number(),
		});

		const { nome, senha, estacionamento } = createFuncionarioSchema.parse(
			request.body
		);

		await prisma.funcionario.create({
			data: {
				nome,
				senha,
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
		});
	});

	server.put("/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		const updateFuncionarioSchema = z.object({
			nome: z.string(),
			senha: z.string(),
			estacionamento: z.number(),
		});

		const { nome, senha, estacionamento } = updateFuncionarioSchema.parse(
			request.body
		);

		await prisma.funcionario.update({
			where: {
				id: Number(id),
			},
			data: {
				nome,
				senha,
				estacionamento: {
					connect: {
						id: estacionamento,
					},
				},
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
		});

		if (!funcionario) {
			return reply.status(401).send();
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
		});
	});
};
