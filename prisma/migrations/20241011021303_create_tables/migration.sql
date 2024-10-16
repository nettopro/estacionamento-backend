-- CreateTable
CREATE TABLE "Funcionario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "estacionamentoId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estacionamento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "vagas" INTEGER NOT NULL,
    "valor_hora" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Estacionamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntradaSaida" (
    "id" SERIAL NOT NULL,
    "estacionamentoId" INTEGER NOT NULL,
    "data_entrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_saida" TIMESTAMP(3),
    "valor_pago" DOUBLE PRECISION,
    "pago" BOOLEAN NOT NULL,

    CONSTRAINT "EntradaSaida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpf_key" ON "Cliente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_telefone_key" ON "Cliente"("telefone");

-- AddForeignKey
ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_estacionamentoId_fkey" FOREIGN KEY ("estacionamentoId") REFERENCES "Estacionamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntradaSaida" ADD CONSTRAINT "EntradaSaida_estacionamentoId_fkey" FOREIGN KEY ("estacionamentoId") REFERENCES "Estacionamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
