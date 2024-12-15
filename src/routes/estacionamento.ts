import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export const EstacionamentoRoutes = async (server: FastifyInstance) => {
	server.get("/", async () => {
		return await prisma.estacionamento.findMany();
	});

	server.post("/", async (request, reply) => {
		const createEstacionamentoSchema = z.object({
			nome: z.string(),
			endereco: z.string(),
			telefone: z.string(),
			vagas: z.number(),
			valor_hora: z.number(),
			valor_mensalidade: z.number(),
		});

		const { nome, endereco, telefone, vagas, valor_hora, valor_mensalidade } =
			createEstacionamentoSchema.parse(request.body);

		await prisma.estacionamento.create({
			data: {
				nome,
				endereco,
				telefone,
				vagas,
				valor_hora,
				valor_mensalidade,
			},
		});

		return reply.status(201).send();
	});

	server.get("/:id", async (request) => {
		const { id } = request.params as { id: string };

		return await prisma.estacionamento.findUnique({
			where: {
				id: Number(id),
			},
		});
	});

	server.put("/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		const updateEstacionamentoSchema = z.object({
			nome: z.string(),
			endereco: z.string(),
			telefone: z.string(),
			vagas: z.number(),
			valor_hora: z.number(),
			valor_mensalidade: z.number(),
		});

		const { nome, endereco, telefone, vagas, valor_hora, valor_mensalidade } =
			updateEstacionamentoSchema.parse(request.body);

		await prisma.estacionamento.update({
			where: {
				id: Number(id),
			},
			data: {
				nome,
				endereco,
				telefone,
				vagas,
				valor_hora,
				valor_mensalidade,
			},
		});

		return reply.status(204).send();
	});

	server.delete("/:id", async (request, reply) => {
		const { id } = request.params as { id: string };

		await prisma.estacionamento.update({
			where: {
				id: Number(id),
			},
			data: {
				ativo: false,
			},
		});

		return reply.status(204).send();
	});
};
