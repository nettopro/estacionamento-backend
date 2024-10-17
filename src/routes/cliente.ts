import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export const ClienteRoutes = async (server: FastifyInstance) => {
	server.get("/", async () => {
		return await prisma.cliente.findMany();
	});

	server.post("/", async (request, reply) => {
		const createClienteSchema = z.object({
			nome: z.string(),
			cpf: z.string().length(11),
			telefone: z.string(),
		});

		const { nome, cpf, telefone } = createClienteSchema.parse(request.body);

		await prisma.cliente.create({
			data: {
				nome,
				cpf,
				telefone,
			},
		});

		return reply.status(201).send();
	});

	server.get("/:id", async (request) => {
		const { id } = request.params as { id: string };

		return await prisma.cliente.findUnique({
			where: {
				id: Number(id),
			},
		});
	});

	server.put("/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		const updateClienteSchema = z.object({
			nome: z.string(),
			cpf: z.string().length(11),
			telefone: z.string(),
		});

		const { nome, cpf, telefone } = updateClienteSchema.parse(request.body);

		await prisma.cliente.update({
			where: {
				id: Number(id),
			},
			data: {
				nome,
				cpf,
				telefone,
			},
		});

		return reply.status(204).send();
	});
};
