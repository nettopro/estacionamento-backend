import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

export const EntradaSaidaRoutes = async (server: FastifyInstance) => {
	server.get("/", async () => {
		return await prisma.entradaSaida.findMany();
	});

	server.post("/", async (request, reply) => {
		const createEntradaSaidaSchema = z.object({
			placa: z.string(),
			estacionamento: z.number(),
		});

		const { placa, estacionamento } = createEntradaSaidaSchema.parse(
			request.body
		);

		const existingEntradaSaida = await prisma.entradaSaida.findFirst({
			where: {
				placa: placa,
				data_saida: null,
			},
		});

		if (existingEntradaSaida) {
			return reply.status(400).send("Veículo já está estacionado");
		}

		await prisma.entradaSaida.create({
			data: {
				placa,
				estacionamento: {
					connect: {
						id: estacionamento,
					},
				},
			},
		});

		return reply.status(201).send();
	});

	server.get("/estacionamento/:id", async (request, reply) => {
		const { id } = request.params as { id: string };

		const entradasSaidas = await prisma.entradaSaida.findMany({
			where: {
				estacionamento: {
					id: parseInt(id),
				},
			},
		});

		return entradasSaidas;
	});

	server.get("/placa/:placa", async (request, reply) => {
		const { placa } = request.params as { placa: string };

		const entradaSaida = await prisma.entradaSaida.findFirst({
			where: {
				placa: placa,
			},
			include: {
				estacionamento: true,
			},
		});

		if (!entradaSaida) {
			return reply.status(404).send("Veículo não encontrado");
		}

		const { estacionamento, data_entrada } = entradaSaida;
		const { valor_hora } = estacionamento;

		const valor_a_pagar = calculaPagamento(data_entrada, valor_hora);

		return {
			horarios: {
				entrada: data_entrada,
			},
			valor_a_pagar,
			estacionamento,
		};
	});

	server.put("/placa/:placa/pagamento", async (request, reply) => {
		const { placa } = request.params as { placa: string };

		const entradaSaida = await prisma.entradaSaida.findFirst({
			where: {
				placa: placa,
				data_saida: null,
				pago: false,
			},
			include: {
				estacionamento: true,
			},
		});

		if (!entradaSaida) {
			return reply.status(404).send("Veículo não encontrado");
		}

		const { estacionamento, data_entrada } = entradaSaida;
		const { valor_hora } = estacionamento;

		const valor_a_pagar = calculaPagamento(data_entrada, valor_hora);

		await prisma.entradaSaida.update({
			where: {
				id: entradaSaida.id,
			},
			data: {
				valor_pago: valor_a_pagar,
				pago: true,
			},
		});

		return {
			horarios: {
				entrada: data_entrada,
			},
			valor_pago: valor_a_pagar,
			estacionamento,
		};
	});

	server.put("/placa/:placa/saida", async (request, reply) => {
		const { placa } = request.params as { placa: string };

		const entradaSaida = await prisma.entradaSaida.findFirst({
			where: {
				placa: placa,
				data_saida: null,
				pago: true,
			},
			include: {
				estacionamento: true,
			},
		});

		if (!entradaSaida) {
			return reply.status(404).send("Veículo ou pagamento não encontrado");
		}

		await prisma.entradaSaida.update({
			where: {
				id: entradaSaida.id,
			},
			data: {
				data_saida: new Date(),
			},
		});

		return reply.status(204).send();
	});
};

const calculaPagamento = (data_entrada: Date, valor_hora: number) => {
	const now = new Date();
	const diffInHours = Math.ceil(
		(now.getTime() - data_entrada.getTime()) / (1000 * 60 * 60)
	);
	const valor_a_pagar = valor_hora * diffInHours;

	return valor_a_pagar;
};