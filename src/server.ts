import fastify from "fastify";
import cors from "@fastify/cors";
import { ClienteRoutes } from "./routes/cliente";
import { EstacionamentoRoutes } from "./routes/estacionamento";
import { EntradaSaidaRoutes } from "./routes/entradaSaida";
import { FuncionarioRoutes } from "./routes/funcionario";
import { CargoRoutes } from "./routes/cargo";
import { MensalidadeRoutes } from "./routes/mensalidade";

const app = fastify();

app.get("/", async () => {
	return { hello: "world" };
});

app.register(cors, {
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE"],
});

app.register(ClienteRoutes, { prefix: "/clientes" });
app.register(EstacionamentoRoutes, { prefix: "/estacionamentos" });
app.register(EntradaSaidaRoutes, { prefix: "/entradas-saidas" });
app.register(FuncionarioRoutes, { prefix: "/funcionarios" });
app.register(CargoRoutes, { prefix: "/cargos" });
app.register(MensalidadeRoutes, { prefix: "/mensalidades" });

app
	.listen({
		host: "0.0.0.0",
		port: process.env.PORT ? Number(process.env.PORT) : 3000,
	})
	.then(() => {
		console.log("Server is running");
	});
