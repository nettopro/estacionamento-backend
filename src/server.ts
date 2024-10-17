import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from "zod";
import { ClienteRoutes } from "./routes/cliente";
import { EstacionamentoRoutes } from "./routes/estacionamento";
import { EntradaSaidaRoutes } from "./routes/entradaSaida";
import { FuncionarioRoutes } from "./routes/funcionario";

const app = fastify();

const prisma = new PrismaClient();

app.get("/", async () => {
	return { hello: "world" };
});

app.register(ClienteRoutes, { prefix: "/clientes" });
app.register(EstacionamentoRoutes, { prefix: "/estacionamentos" });
app.register(EntradaSaidaRoutes, { prefix: "/entradas-saidas" });
app.register(FuncionarioRoutes, { prefix: "/funcionarios" });

app
	.listen({
		host: "0.0.0.0",
		port: process.env.PORT ? Number(process.env.PORT) : 3000,
	})
	.then(() => {
		console.log("Server is running");
	});
