import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export const CargoRoutes = async (server: FastifyInstance) => {
	server.get("/", async () => {
		return await prisma.cargo.findMany();
	});

	server.post("/", async (request, reply) => {
		const createCargoSchema = z.object({
			descricao: z.string(),
		});

		const { descricao } = createCargoSchema.parse(request.body);

		await prisma.cargo.create({
			data: {
				descricao,
			},
		});

		return reply.status(201).send();
	});

	server.get("/:id", async (request) => {
		const { id } = request.params as { id: string };

		return await prisma.cargo.findUnique({
			where: {
				id: Number(id),
			},
		});
	});

	server.put("/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
		const updateCargoSchema = z.object({
			descricao: z.string(),
		});

		const { descricao } = updateCargoSchema.parse(request.body);

		await prisma.cargo.update({
			where: {
				id: Number(id),
			},
			data: {
				descricao,
			},
		});

		return reply.status(204).send();
	});
};
