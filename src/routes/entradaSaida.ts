import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { get } from "http";
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

		const estacionamentoExiste = await prisma.estacionamento.findUnique({
			where: {
				id: estacionamento,
			},
		});

		if (!estacionamentoExiste) {
			return reply.status(400).send("Estacionamento inválido");
		}

		const existingEntradaSaida = await prisma.entradaSaida.findFirst({
			where: {
				placa: placa,
				data_saida: null,
			},
		});

		if (existingEntradaSaida) {
			return reply.status(400).send("Veículo já está estacionado");
		}

		const numeroVeiculosEstacionados = await prisma.entradaSaida.count({
			where: {
				estacionamento: {
					id: estacionamento,
				},
				data_saida: null,
			},
		});

		const estacionamentoLotado =
			numeroVeiculosEstacionados >= estacionamentoExiste.vagas;

		if (estacionamentoLotado) {
			return reply.status(400).send("Estacionamento lotado");
		}

		const mensalista = await prisma.mensalidade.findFirst({
			where: {
				placa,
			},
			orderBy: {
				data_pagamento: "desc",
			},
		});

		const mensalidadeAtiva =
			(mensalista &&
				new Date().getTime() - new Date(mensalista.data_pagamento).getTime() <
					30 * 24 * 60 * 60 * 1000) ||
			false;

		await prisma.entradaSaida.create({
			data: {
				placa,
				estacionamento: {
					connect: {
						id: estacionamento,
					},
				},
				pago: mensalidadeAtiva,
			},
		});

		return reply.status(201).send();
	});
	
	server.get("/estacionamento/:id", async (request, reply) => {
		const { id } = request.params as { id: string };

		const estacionamento = await prisma.estacionamento.findUnique({
			where: {
				id: parseInt(id),
			},
		});

		if (!estacionamento) {
			return reply.status(404).send("Estacionamento não encontrado");
		}

		const entradasSaidas = await prisma.entradaSaida.findMany({
			where: {
				estacionamento: {
					id: parseInt(id),
				},
			},
			include: {
				estacionamento: true,
			},
		});

		return entradasSaidas;
	});

	server.get("/placa/:placa", async (request, reply) => {
		const { placa } = request.params as { placa: string };

		const entradasSaidas = await prisma.entradaSaida.findMany({
			where: {
				placa: placa,
			},
			include: {
				estacionamento: true,
			},
			orderBy: {
				data_entrada: "desc",
			},
		});

		if (entradasSaidas.length === 0) {
			return reply.status(404).send("Veículo não encontrado");
		}

		return entradasSaidas;
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

		await prisma.entradaSaida.update({
			where: {
				id: entradaSaida.id,
			},
			data: {
				data_pagamento: new Date(),
				pago: true,
			},
		});

		return {
			horarios: {
				entrada: data_entrada,
			},
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

	server.get("/placa/:placa/listar", async (request, reply) => {
		const { placa } = request.params as { placa: string };

		const entradasSaidas = await prisma.entradaSaida.findMany({
			where: {
				placa: placa,
			},
			include: {
				estacionamento: true,
			},
		});

		return entradasSaidas;
	});
};
