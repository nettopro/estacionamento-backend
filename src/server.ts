import fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import { ClienteRoutes } from "./routes/cliente";
import { EstacionamentoRoutes } from "./routes/estacionamento";
import { EntradaSaidaRoutes } from "./routes/entradaSaida";
import { FuncionarioRoutes } from "./routes/funcionario";
import { CargoRoutes } from "./routes/cargo";
import { CronJob } from "cron";

const app = fastify();
const prisma = new PrismaClient();

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

// Function to call the stored procedure
async function verificarTolerancia() {
  try {
    await prisma.$executeRaw`SELECT verificar_tolerancia();`;
    console.log("tolerancia verificada");
  } catch (error) {
    console.error("erro ao verificar tolerancia", error);
  }
}

async function calcularValorAPagar() {
  try {
    await prisma.$executeRaw`SELECT calcular_valor_a_pagar();`;
    console.log("valor calculado");
  } catch (error) {
    console.error("erro valor calculado", error);
  }
}

// Schedule the stored procedure to run every minute
const job = new CronJob("* * * * *", () => {
  verificarTolerancia();
  calcularValorAPagar();
});

job.start();

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
  })
  .then(() => {
    console.log("Server is running");
  });