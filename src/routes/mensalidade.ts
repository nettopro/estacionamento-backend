import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export const MensalidadeRoutes = async (server: FastifyInstance) => {
	server.get("/", async () => {
		return await prisma.mensalidade.findMany();
	});

	server.get("/placa/:placa", async (request) => {
		const { placa } = request.params as { placa: string };

		return await prisma.mensalidade.findFirst({
			where: {
				placa,
			},
			include: {
				estacionamento: true,
			},
			orderBy: {
				data_pagamento: "desc",
			},
		});
	});

	server.get("/estacionamento/:id", async (request) => {
		const { id } = request.params as { id: string };

		return await prisma.mensalidade.findMany({
			where: {
				estacionamento: {
					id: parseInt(id),
				},
			},
			orderBy: {
				data_pagamento: "desc",
			},
		});
	});

	server.post("/", async (request, reply) => {
		const createMensalidadeSchema = z.object({
			placa: z.string(),
			estacionamento: z.number(),
		});

		const { placa, estacionamento } = createMensalidadeSchema.parse(
			request.body
		);

		const ultimaMensalidade = await prisma.mensalidade.findFirst({
			where: {
				placa,
			},
			orderBy: {
				data_pagamento: "desc",
			},
		});

		if (
			ultimaMensalidade &&
			new Date().getTime() -
				new Date(ultimaMensalidade.data_pagamento).getTime() <
				30 * 24 * 60 * 60 * 1000
		) {
			return reply.status(400).send("Mensalidade já paga");
		}

		const estacionamentoExiste = await prisma.estacionamento.findUnique({
			where: {
				id: estacionamento,
			},
		});

		if (!estacionamentoExiste) {
			return reply.status(400).send("Estacionamento inválido");
		}

		if (!estacionamentoExiste.valor_mensalidade) {
			return reply.status(400).send("Estacionamento não possui mensalidade");
		}

		await prisma.mensalidade.create({
			data: {
				placa,
				valor_pago: estacionamentoExiste.valor_mensalidade,
				estacionamento: {
					connect: {
						id: estacionamento,
					},
				},
			},
		});

		return reply.status(201).send();
	});
};
