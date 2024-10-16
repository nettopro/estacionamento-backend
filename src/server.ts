import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from "zod";

const app = fastify();

const prisma = new PrismaClient();

app.get("/", async () => {
	return { hello: "world" };
});

app.get("/estacionamentos", async () => {
	const estacionamentos = await prisma.estacionamento.findMany();
	return estacionamentos;
});

app.post("/estacionamentos", async (request, reply) => {
	const createEstacionamentoSchema = z.object({
		nome: z.string(),
		endereco: z.string(),
		telefone: z.string(),
		vagas: z.number(),
		valor_hora: z.number(),
	});

	const { nome, endereco, telefone, vagas, valor_hora } =
		createEstacionamentoSchema.parse(request.body);

	await prisma.estacionamento.create({
		data: {
			nome,
			endereco,
			telefone,
			vagas,
			valor_hora,
		},
	});

	return reply.status(201).send();
});

app
	.listen({
		host: "0.0.0.0",
		port: process.env.PORT ? Number(process.env.PORT) : 3000,
	})
	.then(() => {
		console.log("Server is running");
	});
